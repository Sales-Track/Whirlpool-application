import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView,Alert, TouchableOpacity } from "react-native";
import { NativeBaseProvider, Modal } from "native-base";
import Header from './header';
import Footer from './footer';
import Modifpopup from './MOdifPopUp';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import port from '../port';
function RapportExpodet() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ani, expo, category, idcateg ,tableData} = route.params;
  const [showpopup, setShowpop] = useState(false);
  const [popupData, setPopupData] = useState({});
  const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

  // Function to handle the "Modifier" button click
  const handleModifierClick = (ref) => {
    setPopupData(ref);  // Set the popup data with the reference details
    setShowpop(true);    // Show the popup
  };
  const AddExpo = async (idRef, prix) => {
    try {
      await axios.post(port + "/api/expositions/expositions", {
        Reference_idReference: idRef,
        prix: prix,
        PDV_idPDV: ani.PDV_idPDV,
        dateCr: formatDateWithoutTime(new Date())
      });
      Alert.alert('Succès', 'Exposition ajoutée avec succès');
    } catch (error) {
      console.error('Error adding expo:', error);
      Alert.alert('Erreur', "Échec de l'ajout de l'exposition");
    }
  }
  function formatDateWithoutTime(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  }

  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
      <View style={styles.view1}>
        <Header />
        <ScrollView style={{ marginTop: -150 }}>
          <View>
            <View>
              <Text style={styles.textexpo}>{category}</Text>
            </View>
            <View style={styles.container}>
              <View style={styles.row}>
             
                <View style={styles.cell}><Text>Référence</Text></View>
                <View style={styles.cell}><Text>Prix</Text></View>
                <View style={styles.cell}><Text>Action</Text></View>
              </View>

              {tableData.map((ref, index) => (
                <View style={styles.row} key={index}>
                  <View style={styles.cell1}><Text>{ref.referenceName}</Text></View>
                  <View style={styles.cell1}><Text>{ref.prix}</Text></View>
                 
                  <TouchableOpacity onPress={() => handleModifierClick(ref)}>
                    <View style={styles.cell2}><Text style={styles.textcell2}>Modifier</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {AddExpo(ref.idref,ref.prix)}}>
                    <View style={styles.cell2}><Text style={styles.textcell2}>ajouter</Text></View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Modal for Modifpopup */}
      <Modal isOpen={showpopup} onClose={() => setShowpop(false)}>
        <Modifpopup popupData={tableData}
        ani={ani}

        onClose={() => setShowpop(false)} />
      </Modal>
      
      <Footer ani={ani} />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  textexpo: {
    fontSize: 15,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  cell1: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D3D4',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  image12: {
    width: 125,
    height: 95,
    position: "absolute",
    top: 0,
    left: 15,
  },
  cell2: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDC100',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  textcell2: {
    color: 'white',
  },
});

export default RapportExpodet;