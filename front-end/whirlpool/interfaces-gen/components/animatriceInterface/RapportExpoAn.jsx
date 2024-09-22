import React, { useEffect, useState } from "react";
import { View, Text,Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { NativeBaseProvider } from "native-base";
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './header';
import Footer from './footer';
import port from '../port';


const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');
function RapportExpo() {
  const route = useRoute();
  const { month, pdv, ani,nomspdv } = route.params;
  const navigation = useNavigation();

  const [expo, setExpo] = useState([]);
  const [references, setReferences] = useState([]);
  const [pdvs, setPdvs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expos, refs, pdvss] = await Promise.all([
          axios.get(port + "/api/expositions/expositions"),
          axios.get(port + "/api/reference/references"),
          axios.get(`${port}/api/pdvs/getId/${pdv}`)
        ]);

        setExpo(expos.data);
        setReferences(refs.data);
        setPdvs(pdvss.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getExpositionsByMonthAndPDV = (expositions) => {
    const formattedMonth = month.toString().padStart(2, '0');
    return expositions.filter(exposition =>
      exposition.createdAt.slice(5, 7) === formattedMonth && exposition.PDV_idPDV === pdvs.idPDV
    );
  };

  

  const navigateToNewPage = () => {
    const filteredExpositions = getExpositionsByMonthAndPDV(expo); // Filtrer les expositions affichées dans le tableau
  
    // Préparer les données à afficher
    const displayedData = filteredExpositions.map(exposition => {
      const reference = references.find(ref => ref.idReference === exposition.Reference_idReference);
  
      return {
        referenceName: reference?.Referencename || 'N/A', // Nom de la référence
        prix: exposition.prix || 'N/A', // Prix de l'exposition
        Marque_idMarque: reference?.Marque_idMarque || 'N/A', // Identifiant de la marque
        Category_idCategory: reference?.Category_idCategory || 'N/A', // Identifiant de la catégorie
        idref: reference ?.idReference || 'N/A'
      };
    });
  
    // Naviguer vers la nouvelle page avec les données filtrées
    navigation.navigate('RapportExpoDetAn', {
      tableData: displayedData, 
      ani// Passer les données du tableau avec la référence, le prix, la marque et la catégorie
    });
  };
  
  
  

  return (
    <NativeBaseProvider>
       <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12}/>
      <View style={styles.view1}>
        <Header />
        <ScrollView style={{ marginTop: -250 }}>  
            <View>
                <Text style={styles.textexpo}>Date : {month}</Text>
                {/* <Text style={styles.textexpo}>Zone : {pdvs.location}</Text> */}
                <Text style={styles.textexpo}>Magasin : {nomspdv}</Text>
                <Text style={styles.textexpo}>Animatrice : {ani ? ani.name : "Loading..."}</Text>
              </View>
          
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Référence</Text>
              <Text style={styles.headerText}>Prix</Text>
              
            </View>

            {/* Rows */}
            {getExpositionsByMonthAndPDV(expo).map((exposition, index) => {
              const reference = references.find(ref => ref.idReference === exposition.Reference_idReference);
              return (
                <TouchableOpacity key={index} >
                  <View style={styles.row}>
                    <Text style={styles.cell}>{reference?.Referencename || 'N/A'}</Text>
                    <Text style={styles.cell}>{exposition.prix || 'N/A'}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Button to navigate to another page (below the table) */}
        <TouchableOpacity style={styles.button} onPress={navigateToNewPage}>
  <Text style={styles.buttonText}>Utiliser</Text>
</TouchableOpacity>


      </View>
        <Footer ani={ani}  />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop:'15%'
  },
  container: {
    flexDirection: 'column',
    marginTop:"10%"
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image12: {
    width: 125,
    height: 95,
    position: "absolute",
    top: 55,
    left: 15,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RapportExpo;