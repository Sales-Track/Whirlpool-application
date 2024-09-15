import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image,ActivityIndicator,Dimensions } from "react-native";
import { Select, Box, Center, NativeBaseProvider, Modal, Button } from "native-base";
import axios from 'axios';
import port from '../port';
import Toast from 'react-native-simple-toast';
import Header from './header';
import Footer from './footer';
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

function CreationRapportSO() {
    console.disableYellowBox = true; // Pour masquer tous les avertissements jaunes

    const route = useRoute();
    const { ani } = route.params;

    const [load,setLoad]=useState(true)
    const [city,setCity]= React.useState("");

    const [categ, setCateg] = useState("");
    const [categories, setCategories] = useState([]);
    const [references, setReferences] = useState([]);
    const [article, setArticle]=useState([]);
    const [couleurs,setCouleurs]=useState([]);
    const [capacites,setCapacites]=useState([]);
const [isLoading, setIsLoading] = useState(true);

    const [sales, setSales] = useState({});

    const [couleur, setCouleur]=useState("")
    const [capacite,setCapacite]=useState("")

    const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
    const [modalVisibleSup, setModalVisibleSup] = useState(false);

    const [selectedReferenceId, setSelectedReferenceId] = useState(null);
    const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');


    


    const handleCityChange = (newCity) => {
        setCity(newCity);
      };
      const fetchallArticle = async (id) => {
        try {
            const response = await axios.get(port + "/api/articles/articles");
            const articles = response.data;
            
            const couleurs = articles
                .filter(article => article.Reference_idReference === id && article.coloeur)
                .map(article => article.coloeur);
    
            const capacites = articles
                .filter(article => article.Reference_idReference === id && article.capacite)
                .map(article => article.capacite);
    
            setArticle(articles);
            setCouleurs(couleurs);
            setCapacites(capacites);
    
            console.log(couleurs, capacites);
        } catch (error) {
            console.error('Error fetching Article:', error);
        }
    };

    const fetchAllCateg = async () => {
        try {
            const response = await axios.get(`${port}/api/categories/categorie`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const fetchRefByCatg = async (id) => {
        if (!id) return;
        try {
            const response = await axios.get(`${port}/api/reference/referencebycateg/${id}`);
            setReferences(response.data);
            const initialSales = response.data.reduce((acc, ref) => {
                acc[ref.idReference] = { name: ref.Referencename, sales: 0, idarticles: null };
                return acc;
            }, {});
            setSales(initialSales);
            setIsLoading(false)
            await fetchExistingSales(response.data, initialSales);
        } catch (error) {
            console.error('Error fetching references:', error);
        }
    };

    const fetchExistingSales = async (references, initialSales) => {
        try {
            const selloutResponse = await axios.get(`${port}/api/sellout/sellouts`);
            const refselResponse = await axios.get(`${port}/api/refsel/ReferenceSel`);
            const todayDate = new Date().toISOString().split('T')[0];

            const existingSales = selloutResponse.data.filter(sellout => sellout.PDV_idPDV === ani.PDV_idPDV && sellout.dateCr.split('T')[0] === todayDate);
            const salesMap = references.reduce((acc, ref) => {
                const refSellouts = refselResponse.data.filter(refsel => refsel.Reference_idReference === ref.idReference);
                const totalSales = refSellouts.reduce((sum, refsel) => {
                    const sellout = existingSales.find(sellout => sellout.idSellout === refsel.Sellout_idSellout);
                    return sellout ? sum + sellout.nbrV : sum;
                }, 0);
                acc[ref.idReference] = { ...initialSales[ref.idReference], sales: totalSales, idarticles: null };
                return acc;
            }, { ...initialSales });

            setSales(salesMap);
        } catch (error) {
            console.error('Error fetching existing sales:', error);
        }
    };

    useEffect(() => {
        fetchAllCateg();
        fetchallArticle(selectedReferenceId)
    }, [load]);

    useEffect(() => {
        const fetchReferencesForCategory = async () => {
            const categoryId = await findId(categories, categ, 'Categoryname', 'idCategory');
            fetchRefByCatg(categoryId);
        };
        if (categ) {
            fetchReferencesForCategory();
        }
    }, [categ, categories]);

    const handleReferenceClick = async (refId) => {
        setSelectedReferenceId(refId);
        setModalVisibleAdd(true);
        setLoad(!load)
    };
    const handleReferenceSupClick = async (refId) => {
        setSelectedReferenceId(refId);
        setModalVisibleSup(true);
        setLoad(!load)
    };

    const confirmIncrement = async () => {
        try {
            if (!couleur || !capacite) {
                Toast.show("Remplir tous les champs, s'il vous plaît.", Toast.LONG);
                return;
            }
    
            // Convertir capacite en entier
            const capaciteInt = parseInt(capacite, 10);
            if (isNaN(capaciteInt)) {
                Toast.show("La capacité doit être un nombre valide.", Toast.LONG);
                return;
            }
    
            if (selectedReferenceId !== null) {
                const response = await axios.post(`${port}/api/articles/arcticlebyCC/${selectedReferenceId}`, {
                    couleur: couleur,
                    capacite: capaciteInt // Envoyer la capacité en tant qu'entier
                });
    
                const articleId = response.data.idArticle;
                const existingSales = sales[selectedReferenceId]?.articles?.[articleId]?.sales || 0;
                const updatedSales = existingSales + 1;
    
                await handleSelloutCreationorUpdate(selectedReferenceId, updatedSales, articleId, "add");
    
                setSales(prevSales => ({
                    ...prevSales,
                    [selectedReferenceId]: {
                        ...prevSales[selectedReferenceId],
                        articles: {
                            ...prevSales[selectedReferenceId]?.articles,
                            [articleId]: {
                                ...prevSales[selectedReferenceId]?.articles?.[articleId],
                                sales: updatedSales,
                                couleur: couleur,
                                capacite: capaciteInt // Assurez-vous que la capacité est également mise à jour comme un entier
                            }
                        }
                    }
                }));
    
                Toast.show("Ajout avec succès!", Toast.SHORT);
                setModalVisibleAdd(false); // Cacher le modal après validation
                setCouleur("");
                setCapacite("");
            }
        } catch (error) {
            console.error('Error updating sales:', error);
            Toast.show("Une erreur s'est produite lors de la mise à jour des ventes.", Toast.LONG);
        }
    };
    

    const confirmDecrement = async () => {
        try {
            if (!couleur || !capacite) {
                Toast.show("remplire tout les champs svp.", Toast.LONG);
                return;
            }
            if (selectedReferenceId !== null) {
                const response = await axios.post(`${port}/api/articles/arcticlebyCC/${selectedReferenceId}`, {
                    couleur: couleur,
                    capacite: capacite
                });
                const articleId = response.data.idArticle;
                const existingSales = sales[selectedReferenceId]?.articles?.[articleId]?.sales || 0;
                const updatedSales = existingSales - 1; // Décrémenter au lieu d'incrémenter
    
                await handleSelloutCreationorUpdate(selectedReferenceId, updatedSales, articleId,"sup");
    
                setSales(prevSales => ({
                    ...prevSales,
                    [selectedReferenceId]: {
                        ...prevSales[selectedReferenceId],
                        articles: {
                            ...prevSales[selectedReferenceId]?.articles,
                            [articleId]: {
                                ...prevSales[selectedReferenceId]?.articles?.[articleId],
                                sales: updatedSales, // Mettre à jour les ventes décrémentées
                                couleur: couleur,
                                capacite: capacite
                            }
                        }
                    }
                }));
                Toast.show("Correction avec succès!", Toast.SHORT);
                setModalVisibleSup(false); // Cacher le modal après validation
                setCouleur("");
                setCapacite("");
            }
        } catch (error) {
            console.error('Error updating sales:', error);
        }
    };

    const findId = (data, name, dataname, idname) => {
        return new Promise((resolve, reject) => {
            const element = data.find(el => el[dataname] === name);
            if (element) {
                resolve(element[idname]);
            } else {
                reject(`No element found with ${dataname} = ${name}`);
            }
        });
    };

    const handleSelloutCreationorUpdate = async (idref, updatedSales, idart, option) => {
        try {
            const allrefsel = await axios.get(`${port}/api/refsel/ReferenceSel`);
            const todayDate = new Date().toISOString().split('T')[0];
    
            // Recherche de l'enregistrement refsel existant pour la référence et l'article
            const existingRefSel = allrefsel.data.find(el => el.Reference_idReference === idref && el.Article_idArticle === idart && el.createdAt.split('T')[0] === todayDate);
    
            let updatedSellout = {}; // Déclaration de la variable en dehors des conditions
    
            if (existingRefSel) {
                // Si un refsel existe, mettre à jour le sellout correspondant
                const selloutResponse = await axios.get(`${port}/api/sellout/sellouts/${existingRefSel.Sellout_idSellout}`);
                if (option === "add") {
                    updatedSellout = {
                        ...selloutResponse.data,
                        nbrV: selloutResponse.data.nbrV + 1 // Incrementer nbrV
                    };
                } else {
                    updatedSellout = {
                        ...selloutResponse.data,
                        nbrV: selloutResponse.data.nbrV - 1 // Décrémenter nbrV
                    };
                }
                await axios.put(`${port}/api/sellout/sellouts/${existingRefSel.Sellout_idSellout}`, updatedSellout);
            } else {
                // Sinon, créer un nouveau sellout
                const selloutData = { dateCr: todayDate, nbrV: updatedSales, PDV_idPDV: ani.PDV_idPDV };
                const selloutcreate = await axios.post(`${port}/api/sellout/sellouts`, selloutData);
                const selloutId = selloutcreate.data.idSellout;
    
                // Créer un nouvel enregistrement refsel associant la référence et le sellout
                await axios.post(`${port}/api/refsel/creatRefSel`, {
                    Reference_idReference: idref,
                    Sellout_idSellout: selloutId,
                    Article_idArticle: idart
                });
            }
            setLoad(!load);
        } catch (error) {
            console.error('Error creating or updating sellout:', error);
        }
    };
    
    const Example = ({ text }) => {
        if(text==="Categories"){
            return (
                <Center>
                    <Box maxW="400" mt={"85%"}>
                        <Select
                            selectedValue={categ}
                            minWidth="280"
                            accessibilityLabel={text}
                            placeholder={text}
                            onValueChange={(itemValue) => setCateg(itemValue)}
                        >
                            {categories.map(el => (
                                <Select.Item label={el.Categoryname} value={el.Categoryname} key={el.idCategory} />
                            ))}
                        </Select>
                    </Box>
                </Center>
            );
        }
        else if(text==="Couleur"){
            return (
                <Center>
                    <Box maxW="400" mt={3}>
                        <Select
                            selectedValue={couleur}
                            minWidth="280"
                            accessibilityLabel={text}
                            placeholder={text}
                            onValueChange={(itemValue) => setCouleur(itemValue)}
                        >
                            {couleurs.map(el => {
                                if(el){
                                    return(<Select.Item label={el} value={el} />)
                                }  
                            })}
                        </Select>
                    </Box>
                </Center>
            );
        }
    
    };

    const Table = () => {
        return (
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>References</Text>
                    <Text style={styles.headerCell}>Ventes</Text>
                    <Text style={styles.headerCell}>Corriger</Text>
                </View>
                <ScrollView>
                {isLoading ? (
  <ActivityIndicator size="large" color="#FDC100" style={{ marginTop: 20 }} />
) : (

                    references.map((item, index) => (
                        <View style={styles.row} key={index}>
                            <TouchableOpacity style={styles.cell1} onPress={() => handleReferenceClick(item.idReference)}>
                                <Text style={styles.textcell1}>{item.Referencename}</Text>
                            </TouchableOpacity>
                            <View style={styles.cell}>
                                <Text style={styles.textcell}>{sales[item.idReference] ? sales[item.idReference].sales : 0}</Text>
                            </View>
                            <TouchableOpacity style={styles.cell1} onPress={() => handleReferenceSupClick(item.idReference)}>
                                <Text style={styles.textcell1}>Corriger</Text>
                            </TouchableOpacity>
                        </View>
                    )))}
                </ScrollView>
            </View>
        );
    };
    return (
        <NativeBaseProvider>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
            <View style={{marginBottom:"15%"}}></View>
            <Header onCityChange={handleCityChange} />
            <View style={styles.container}>
                <Example text={'Categories'} />
                <View style={{marginTop:'80%'}}>
                <Table />
                </View>

                {/* Modal for Confirmation */}
                <Modal isOpen={modalVisibleAdd} onClose={() => setModalVisibleAdd(false)}>
                    <Modal.Content>
                        <Modal.CloseButton />
                        <Modal.Header>Add Sale</Modal.Header>
                        <Modal.Body>
                            <Text>Color:</Text>
                            <Select selectedValue={couleur} onValueChange={setCouleur}>
                                {couleurs.map((color) => (
                                    <Select.Item key={color} label={color} value={color} />
                                ))}
                            </Select>
                            <Text>Capacity:</Text>
                            <Select selectedValue={capacite.toString()} onValueChange={(value) => setCapacite(parseInt(value, 10))}>
    {capacites.map((capacity) => (
        <Select.Item key={capacity} label={capacity.toString()} value={capacity.toString()} />
    ))}
</Select>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme="blue" onPress={confirmIncrement}>Confirm</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={modalVisibleSup} onClose={() => setModalVisibleSup(false)}>
                    <Modal.Content>
                        <Modal.CloseButton />
                        <Modal.Header>Correct Sale</Modal.Header>
                        <Modal.Body>
                            <Text>Color:</Text>
                            <Select selectedValue={couleur} onValueChange={setCouleur}>
                                {couleurs.map((color) => (
                                    <Select.Item key={color} label={color} value={color} />
                                ))}
                            </Select>
                            <Text>Capacity:</Text>
                            <Select selectedValue={capacite} onValueChange={setCapacite}>
                                {capacites.map((capacity) => (
                                    <Select.Item key={capacity} label={capacity} value={capacity} />
                                ))}
                            </Select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme="red" onPress={confirmDecrement}>Confirm</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </View>
            <Footer ani={ani} />
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 80,
        marginTop: -950
    },
    tableContainer: {
        // marginTop: -350,
        flex:1,
        width: '100%',
        marginBottom:'20%'
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerCell: {
        textAlign: 'center',
        paddingVertical: 10,
        fontWeight: 'bold',
        margin: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        width: '30%',
        borderRadius: 5
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: '#D0D3D4',
        borderRadius: 5,
        padding: 8,
        margin: 2
    },
    image12: {
        width: width * 0.3, // 30% of screen width
        height: height * 0.2, // 20% of screen height
        position: "absolute",
        top: 0,
        left: width * 0.01, // 3% of screen width
      },
    cell1: {
        flex: 1,
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#FDC100',
        margin: 2
    },
    textcell1: {
        color: 'white',
        padding: 5,
        textAlign: 'center',
        fontSize: 16
    },
    textcell: {
        padding: 5,
        textAlign: 'center',
        fontSize: 16
    },
    btns: {
        backgroundColor: '#FDC100',
        padding: 10,
        borderRadius: 5,
        width: 150,
        marginTop: "5%",
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        textAlign: "center"
    },
});

export default CreationRapportSO;