import React, { useState, useEffect } from "react";
import { View, StyleSheet,Dimensions, Text, TouchableOpacity, ScrollView, Image,ActivityIndicator } from "react-native";
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
    const [capacitee,setCapacitee]=useState(null)

    const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
    const [modalVisibleSup, setModalVisibleSup] = useState(false);
    const [art,setArt]=useState({})

    const [selectedReferenceId, setSelectedReferenceId] = useState(null);
    const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');



    const handleCityChange = (newCity) => {
        setCity(newCity);
      };
    const  fetchallArticle=async (id)=>{
        try{
            const response = await axios.get(port+"/api/articles/articles")
            const articles = response.data;
            console.log("idd",id);
            const couleurs = articles.map(article =>{
                if(article.Reference_idReference===id){
                    return article.coloeur
                }
            });
            const art = articles.map(article =>{
                if(article.Reference_idReference===id){
                    return article
                }
            });
            const capacites = articles.map(article =>{
                if(article.Reference_idReference===id){
                    return article.capacite
                }
            });

            setArticle(response.data);
            setCouleurs(couleurs)
            setCapacites(capacites)
            
            console.log(couleurs,capacites);
        }
        catch (error) {
            console.error('Error fetching Article:', error);
        }
    }

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
            // if (!couleur || !capacitee) {
            //     Toast.show("remplire tou les champ svp.", Toast.LONG);
            //     return;
            // }
            
            if (selectedReferenceId !== null) {
                const response = await axios.post(`${port}/api/articles/arcticlebyCC/${selectedReferenceId}`, {
                    couleur: couleurs,
                    capacite: capacites,
                });
                console.log('aaa',couleur);
                
                const articleId = response.data.idArticle;
                const existingSales = sales[selectedReferenceId]?.articles?.[articleId]?.sales || 0;
                const updatedSales = existingSales + 1;

                await handleSelloutCreationorUpdate(selectedReferenceId, updatedSales, articleId,"add");

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
                                capacite: capacitee
                            }
                        }
                    }
                }));
                Toast.show("Ajout avec succès!", Toast.SHORT);
                setModalVisibleAdd(false); // Cacher le modal après validation
                setCouleur("");
                setCapacitee("");
            }
        } catch (error) {
            console.error('Error updating sales:', error);
        }
    };

    const confirmDecrement = async () => {
        try {
            // if (!couleur || !capacitee) {
            //     Toast.show("remplire tout les champs svp.", Toast.LONG);
            //     return;
            // }
            if (selectedReferenceId !== null) {
                const response = await axios.post(`${port}/api/articles/arcticlebyCC/${selectedReferenceId}`, {
                    couleur: couleurs,
                    capacite: capacites,
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
                                capacite: capacitee
                            }
                        }
                    }
                }));
                Toast.show("Correction avec succès!", Toast.SHORT);
                setModalVisibleSup(false); // Cacher le modal après validation
                setCouleur("");
                setCapacitee("");
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
        else if(text==="Capacite"){
            return (
                <Center>
                    <Box maxW="400" mt={3}>
                        <Select
                            selectedValue={capacitee}
                            minWidth="280"
                            accessibilityLabel={text}
                            placeholder={text}
                            onValueChange={(itemValue) => setCapacitee(itemValue)}
                        >
                            {capacites.map(el =>{
                                if(el){
                                    return(<Select.Item label={el} value={el} />)
                                }
                            })}
                        </Select>
                    </Box>
                </Center>
            );
        }
        return null
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
            <Header onCityChange={handleCityChange} />
            <View style={styles.container}>
                <Example text={'Categories'} />
                <View style={{marginTop:'80%'}}>
                <Table />
                </View>

                {/* Modal for Confirmation */}
                <Modal isOpen={modalVisibleAdd} onClose={() => setModalVisibleAdd(false)}>
                    <Modal.Content>
                        <Modal.Header>Confirmation</Modal.Header>
                        <Modal.Body>
                            <View style={{margin:5}}>
                                <Text>Confirmer la vente de ce produit ?
                                </Text>
                            </View>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button onPress={() => setModalVisibleAdd(false)}>Annuler</Button>
                                <Button colorScheme="teal" onPress={confirmIncrement}>Valider</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                
                {/* Modal for Delite */}
                <Modal isOpen={modalVisibleSup} onClose={() => setModalVisibleSup(false)}>
                    <Modal.Content>
                        <Modal.Header>Confirmation</Modal.Header>
                        <Modal.Body>
                            <View style={{margin:10}}>
                                <Text>Souhaitez-vous appliquer cette correction ?</Text>
                                
                            </View>
                           
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button onPress={() => setModalVisibleSup(false)}>Annuler</Button>
                                <Button colorScheme="teal" onPress={confirmDecrement}>Valider</Button>
                            </Button.Group>
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
      paddingHorizontal: width * 0.05, // Relative padding
      paddingBottom: height * 0.1, // Relative padding
      marginTop: -height * 1.2, // Relative marginTop
    },
    tableContainer: {
<<<<<<< debug
      marginTop: -height * 0.5, // Relative marginTop
      width: '100%',
=======
        // marginTop: -350,
        flex:1,
        width: '100%',
        marginBottom:'20%'
>>>>>>> main
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerCell: {
      textAlign: 'center',
      paddingVertical: height * 0.012, // Relative padding
      fontWeight: 'bold',
      margin: width * 0.012, // Relative margin
      padding: width * 0.025, // Relative padding
      backgroundColor: '#f0f0f0',
      width: '30%',
      borderRadius: 5,
    },
    row: {
      flexDirection: 'row',
      paddingVertical: height * 0.01, // Relative padding
    },
    cell: {
      flex: 1,
      textAlign: 'center',
      backgroundColor: '#D0D3D4',
      borderRadius: 5,
      padding: width * 0.02, // Relative padding
      margin: width * 0.005, // Relative margin
    },
    image12: {
      width: width * 0.31, // Relative width
      height: height * 0.12, // Relative height
      position: "absolute",
      top: 0,
      left: width * 0.04, // Relative left position
    },
    cell1: {
      flex: 1,
      borderRadius: 5,
      padding: width * 0.02, // Relative padding
      backgroundColor: '#FDC100',
      margin: width * 0.005, // Relative margin
    },
    textcell1: {
      color: 'white',
      padding: height * 0.006, // Relative padding
      textAlign: 'center',
      fontSize: width * 0.04, // Relative font size
    },
    textcell: {
      padding: height * 0.006, // Relative padding
      textAlign: 'center',
      fontSize: width * 0.04, // Relative font size
    },
    btns: {
      backgroundColor: '#FDC100',
      padding: width * 0.025, // Relative padding
      borderRadius: 5,
      width: width * 0.4, // Relative width
      marginTop: '5%',
    },
    btnText: {
      color: 'white',
      fontSize: width * 0.04, // Relative font size
      textAlign: "center",
    },
  });

export default CreationRapportSO;