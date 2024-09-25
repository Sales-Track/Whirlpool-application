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
    const [idWhirlpool,setIdWirlpool]=useState(null)

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

    const getMarques = async () => {
        try {
          const response = await axios.get(`${port}/api/marques/marques`);
      
          // Check if response data exists and is an array
          if (response.data && Array.isArray(response.data)) {
            const idwh = response.data.find(e =>
              e.marquename && e.marquename.trim().toUpperCase() === "WHIRLPOOL"
            );
      
            // Set only idMarque if a match is found
            if (idwh) {
              setIdWirlpool(idwh.idMarque); // Set only the idMarque
            } else {
              console.warn("No matching marque found for 'WHIRLPOOL'");
            }
          } else {
            console.error("Invalid response data format:", response.data);
          }
        } catch (e) {
          console.error("Error getting Marque:", e);
        }
      };
      
      

    const fetchRefByCatg = async (id) => {
        if (!id) return;
        try {
            const response = await axios.get(`${port}/api/reference/referencebycateg/${id}`);
            refwh=response.data.filter(e=>e.Marque_idMarque==idWhirlpool)
            console.log(refwh,"heyy");
            
            setReferences(refwh);
            const initialSales = refwh.reduce((acc, ref) => {
                acc[ref.idReference] = { name: ref.Referencename, sales: 0, idarticles: null };
                return acc;
            }, {});
            setSales(initialSales);
            setIsLoading(false)
            await fetchExistingSales(refwh, initialSales);
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
        getMarques()
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
            console.log(selectedReferenceId,"work");
            
            if (selectedReferenceId !== null) {
                // Envoyer la requête sans vérifier la couleur et la capacité
                const response = await axios.get(`${port}/api/articles/articlesbyref/${selectedReferenceId}`);
    
                const articleId = response.data.idArticle;
                const existingSales = sales[selectedReferenceId]?.articles?.[articleId]?.sales || 0;
                const updatedSales = existingSales + 1;
    
                // Mise à jour des ventes via votre fonction
                await handleSelloutCreationorUpdate(selectedReferenceId, updatedSales, articleId, "add");
    
                // Mettre à jour les ventes dans l'état
                setSales(prevSales => ({
                    ...prevSales,
                    [selectedReferenceId]: {
                        ...prevSales[selectedReferenceId],
                        articles: {
                            ...prevSales[selectedReferenceId]?.articles,
                            [articleId]: {
                                ...prevSales[selectedReferenceId]?.articles?.[articleId],
                                sales: updatedSales,
                                couleur: couleur || prevSales[selectedReferenceId]?.articles?.[articleId]?.couleur || "", // Gérer la couleur facultative
                                capacite: capacite || prevSales[selectedReferenceId]?.articles?.[articleId]?.capacite || "" // Gérer la capacité facultative
                            }
                        }
                    }
                }));
    
                Toast.show("Ajout avec succès!", Toast.SHORT);
                setModalVisibleAdd(false); // Cacher le modal après validation
                setCouleur(""); // Réinitialiser les champs
                setCapacite("");
            }
        } catch (error) {
            console.error('Error updating sales:', error);
            Toast.show("Une erreur s'est produite lors de la mise à jour des ventes.", Toast.LONG);
        }
    };
    
    

    const confirmDecrement = async () => {
        try {
            
            if (selectedReferenceId !== null) {
                // Envoyer la requête sans couleur et capacité
                const response = await axios.get(`${port}/api/articles/articlesbyref/${selectedReferenceId}`);
    
                const articleId = response.data.idArticle;
                const existingSales = sales[selectedReferenceId]?.articles?.[articleId]?.sales || 0;
                const updatedSales = existingSales - 1; // Décrémenter les ventes
    
                // Mise à jour des ventes via votre fonction
                await handleSelloutCreationorUpdate(selectedReferenceId, updatedSales, articleId, "sup");
    
                // Mise à jour de l'état avec les nouvelles ventes
                setSales(prevSales => ({
                    ...prevSales,
                    [selectedReferenceId]: {
                        ...prevSales[selectedReferenceId],
                        articles: {
                            ...prevSales[selectedReferenceId]?.articles,
                            [articleId]: {
                                ...prevSales[selectedReferenceId]?.articles?.[articleId],
                                sales: updatedSales, // Mettre à jour les ventes décrémentées
                                couleur: couleur || prevSales[selectedReferenceId]?.articles?.[articleId]?.couleur || "", // Gérer la couleur s'il existe déjà
                                capacite: capacite || prevSales[selectedReferenceId]?.articles?.[articleId]?.capacite || "" // Gérer la capacité s'il existe déjà
                            }
                        }
                    }
                }));
    
                Toast.show("Correction avec succès!", Toast.SHORT);
                setModalVisibleSup(false); // Cacher le modal après validation
                setCouleur(""); // Réinitialiser les champs
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
                    <Box maxW="400" >
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
                    <Text style={styles.headerCell}>Références</Text>
                </View>
                <ScrollView>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#FDC100" style={{ marginTop: 20 }} />
                    ) : (
                        references.map((item, index) => (
                            <View style={styles.row} key={index}>
                                <View style={styles.referenceContainer}>
                                    {/* Référence affichée en dessous */}
                                    <Text style={styles.referenceText}>{item.Referencename}</Text>
                                    {/* Section + Nbr de ventes - */}
                                    <View style={styles.counterContainer}>
                                        <TouchableOpacity onPress={() => handleReferenceClick(item.idReference)}>
                                            <Text style={styles.counterButton}>+</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.salesText}>
                                            {sales[item.idReference] ? sales[item.idReference].sales : 0}
                                        </Text>
                                        <TouchableOpacity onPress={() => handleReferenceSupClick(item.idReference)}>
                                            <Text style={styles.counterButton}>-</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
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
                <View style={{marginTop:'20%'}}>
                <Table />
                </View>

                {/* Modal for Confirmation */}
               {/* Modal pour ajouter une vente */}
<Modal isOpen={modalVisibleAdd} onClose={() => setModalVisibleAdd(false)}>
    <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Confirmer l'ajout</Modal.Header>
        <Modal.Body>
            <Text>Voulez-vous vraiment ajouter une vente pour cette référence ?</Text>
        </Modal.Body>
        <Modal.Footer>
            <Button colorScheme="yellow" onPress={confirmIncrement}>Confirmer</Button>
        </Modal.Footer>
    </Modal.Content>
</Modal>

{/* Modal pour corriger une vente */}
<Modal isOpen={modalVisibleSup} onClose={() => setModalVisibleSup(false)}>
    <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Confirmer la correction</Modal.Header>
        <Modal.Body>
            <Text>Voulez-vous vraiment corriger cette vente pour cette référence ?</Text>
        </Modal.Body>
        <Modal.Footer>
            <Button colorScheme="red" onPress={confirmDecrement}>Confirmer</Button>
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
        marginTop: -300
    },
    tableContainer: {
        padding: 10,
 
    },
    tableHeader: {
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    row: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    referenceContainer: {
        alignItems: 'center',
    },
    referenceText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5, // Espace entre le nom et les boutons
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // Largeur adaptée pour contenir les éléments
    },
    counterButton: {
        fontSize: 24,
        paddingHorizontal: 20,
        color: 'white',
        backgroundColor:'#FDC100',
        borderRadius:20
    },
    salesText: {
        fontSize: 20,
        fontWeight: 'bold',
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