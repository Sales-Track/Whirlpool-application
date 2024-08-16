import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NativeBaseProvider, Modal } from "native-base";
import Header from './header';
import Footer from './footer';
import Modifpopup from '../AdminInterface/ModifRapExpo';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

function RapportExpodet() {
  const navigation = useNavigation();
  const route = useRoute();
  const { references, ani, expo, category, idcateg } = route.params;
  const [showpopup, setShowpop] = useState(false);
  const [popupData, setPopupData] = useState({});
  const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

  // Function to handle the "Modifier" button click
  const handleModifierClick = (ref) => {
    setPopupData(ref);  // Set the popup data with the reference details
    setShowpop(true);    // Show the popup
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
                <View style={styles.cell}><Text>Action</Text></View>
              </View>

              {references.map((ref, index) => (
                <View style={styles.row} key={index}>
                  <View style={styles.cell1}><Text>{ref.brand}</Text></View>
                  <View style={styles.cell1}><Text>{ref.name}</Text></View>
                  <View style={styles.cell1}><Text>{ref.price}</Text></View>
                  <TouchableOpacity onPress={() => handleModifierClick(ref)}>
                    <View style={styles.cell2}><Text style={styles.textcell2}>Modifier</Text></View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Modal for Modifpopup */}
      <Modal isOpen={showpopup} onClose={() => setShowpop(false)}>
        <Modifpopup {...popupData} onClose={() => setShowpop(false)} />
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
