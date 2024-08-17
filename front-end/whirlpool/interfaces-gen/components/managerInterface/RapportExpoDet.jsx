import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,Dimensions  } from "react-native";
import { NativeBaseProvider, Modal } from "native-base";
import Header from './header';
import Footer from './footer';
// import Modifpopup from './ModifRapExpo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import port from "../port";
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const wp = (percentage) => {
  return width * (percentage / 100);
};

const hp = (percentage) => {
  return height * (percentage / 100);
};
function RapportExpodet() {
  const navigation = useNavigation();
  const route = useRoute();
  const { references, adm, expo, category, idcateg } = route.params;

  const [showpopup, setShowpop] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [dataChanged, setDataChanged] = useState(false);
  const [exportLoading, setExportLoading] = useState(true); // Ajouter un état de chargement pour l'exportation
  const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

 // Function to handle the "Modifier" button click
//  const handleModifierClick = (ref) => {
//   setPopupData(ref);  // Set the popup data with the reference details
//   setShowpop(true);    // Show the popup
// };
const exportToExcel = async () => {
  setExportLoading(true); // Commencez le chargement
  try {
    const data = [
      ["Marques", "Référence", "Prix"], // Headers
      ...references.map(ref => [ref.brand, ref.name, ref.price]) // Mapping the references to get the data
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapport Expo");

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const uri = FileSystem.cacheDirectory + 'rapport_expo.xlsx';
    await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  } finally {
    setExportLoading(false); // Fin du chargement
  }
};
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
                <View style={styles.cell}><Text>Marques</Text></View>
                <View style={styles.cell}><Text>Référence</Text></View>
                <View style={styles.cell}><Text>Prix</Text></View>
                {/* <View style={styles.cell}><Text>Action</Text></View> */}
              </View>
             
                {references.map((ref, index) => (
                  <View style={styles.row} key={index}>
                  <View style={styles.cell1}><Text>{ref.brand}</Text></View>
                  <View style={styles.cell1}><Text>{ref.name}</Text></View>
                  <View style={styles.cell1}><Text>{ref.price}</Text></View>
                  {/* <TouchableOpacity onPress={() => handleModifierClick(ref)}>
                    <View style={styles.cell2}><Text style={styles.textcell2}>Modifier</Text></View>
                  </TouchableOpacity> */}
                </View>
                ))}
              
            </View>
          </View>
        </ScrollView>
          <TouchableOpacity onPress={()=>exportToExcel()} style={styles.btns}>
            <Text style={styles.btnText}>Exporter</Text>
          </TouchableOpacity>
       
    
      </View>
      <Modal isOpen={showpopup} onClose={() => setShowpop(false)}>
        {/* <Modifpopup {...popupData} onClose={() => setShowpop(false)}  /> */}
      </Modal>
      <Footer adm={adm} />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    padding: wp(5),
  },
  textexpo: {
    fontSize: wp(4),
    fontWeight: '500',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
    marginTop: hp(1),
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  cell: {
    flex: 1,
    padding: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  cell1: {
    flex: 1,
    padding: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D3D4',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  image12: {
    width: wp(30),
    height: hp(20),
    position: "absolute",
    top: 0,
    left: wp(5),
  },
  cell2: {
    flex: 1,
    padding: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDC100',
    borderWidth: 0.5,
    borderColor: '#D0D3D4',
  },
  textcell2: {
    color: 'white',
  },
  btns: {
    backgroundColor: '#FDC100',
    padding: wp(4),
    borderRadius: 5,
    width: wp(40),
    marginTop: hp(2),
    alignItems: 'center',
    alignSelf: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: wp(4),
    textAlign: "center",
  },
});


export default RapportExpodet;
