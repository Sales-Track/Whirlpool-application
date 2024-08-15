import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NativeBaseProvider, Center } from "native-base";
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import port from '../port';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RapportExpo() {
  const route = useRoute();
  const { ani, month, pdv } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [categ, setCateg] = useState([]);
  const [references, setReferences] = useState([]);
  const [marques, setMarques] = useState([]);
  const [expo, setExpo] = useState([]);
  const [pdvs, setPdvs] = useState({});
  const [anim, setAnim] = useState([]);
  const [idWhirlpool, setIdWhirlpool] = useState(null);
  const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      const [expos, categories, refs, brands, pdvData] = await Promise.all([
        axios.get(port + "/api/expositions/expositions"),
        axios.get(port + "/api/categories/categorie"),
        axios.get(port + "/api/reference/references"),
        axios.get(port + "/api/marques/marques"),
        axios.get(`${port}/api/pdvs/getId/${pdv}`)
      ]);

      setExpo(expos.data);
      setCateg(categories.data);
      setReferences(refs.data);
      setMarques(brands.data);
      setPdvs(pdvData.data);

      if (pdvData.data.idPDV) {
        const animators = await axios.get(`${port}/api/user/user/${pdvData.data.idPDV}`);
        setAnim(animators.data);
      }

      setLoading(false); // Stop loading once all data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const findIdWhirlpool = () => {
    const IdWhirlpool = marques.find(el =>(el.marquename === 'whirlpool')) 
    console.log(IdWhirlpool.idMarque);
    setIdWhirlpool(IdWhirlpool.idMarque)
  };

  const CountTaux = (total, partie) => {
    const taux = (partie / total) * 100;
    return isNaN(taux) ? 0 : taux.toFixed(2);
  };

  const getTotalReferences = (expositions, idcateg) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const refbycateg = references.filter(ref => ref.Category_idCategory === idcateg);

    const referencesInPDV = expositions.filter(exposition =>
      refbycateg.some(ref => ref.idReference === exposition.Reference_idReference) &&
      exposition.createdAt.slice(5, 7) === formattedMonth
    );

    const uniqueReferences = new Set(referencesInPDV.map(exposition => exposition.Reference_idReference));

    return uniqueReferences.size;
  };

  const getWhirlpool = (expositions, idcateg) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const refbycateg = references.filter(ref => ref.Category_idCategory === idcateg &&
      ref.Marque_idMarque === idWhirlpool
    );

    const referencesInPDV = expositions.filter(exposition =>
      refbycateg.some(ref => ref.idReference === exposition.Reference_idReference) &&
      exposition.createdAt.slice(5, 7) === formattedMonth
    );

    const uniqueReferences = new Set(referencesInPDV.map(exposition => exposition.Reference_idReference));

    return uniqueReferences.size;
  };

  const getTotalexpo = (expositions) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const uniqueReferences = new Set(expositions.filter(exposition =>
      exposition.createdAt.slice(5, 7) === formattedMonth
    ).map(exposition => exposition.Reference_idReference));

    return uniqueReferences.size;
  };

  useEffect(() => {
    fetchData();
    findIdWhirlpool()
  }, []);

  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />

      <View style={styles.view1}>
        <Header />
        <ScrollView style={{ marginTop: -50 }}>
          <View>
            <View>
              <Text style={styles.textexpo}>Date :{month}</Text>
              <Text style={styles.textexpo}>Zone :{pdvs.location}</Text>
              <Text style={styles.textexpo}>Magasin :{pdv}</Text>
              <Text style={styles.textexpo}>Animatrice : {anim.length > 0 ? anim[0].name : "Loading..."}</Text>
            </View>
            <View style={styles.container2}>
              {/* Première colonne */}
              <View style={styles.column}>
                <View style={styles.cell}><Text>Famille de produit</Text></View>
                {categ.map(el => (
                  <View style={styles.cell1} key={el.idCategory}>
                    <Text>{el.Categoryname}</Text>
                  </View>
                ))}
                <View style={styles.cell}><Text>Total</Text></View>
              </View>

              {/* Deuxième colonne */}
              <View style={styles.column}>
                <View style={styles.cell}><Text>Expo Globale</Text></View>
                {categ.map(el => (
                  <TouchableOpacity key={el.idCategory} onPress={() => {
                    navigation.navigate('RapportExpoDetAn', { ani }); storeData('category', el.Categoryname); }}>
                    <View style={styles.cell2}>
                      <Text style={styles.textcell2}>{getTotalReferences(expo, el.idCategory)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <View style={styles.cell}><Text>{getTotalexpo(expo)}</Text></View>
              </View>

              {/* Troisième colonne */}
              <View style={styles.column}>
                <View style={styles.cell}><Text>Expo Whirlpool</Text></View>
                {categ.map(el => (
                  <View style={styles.cell1} key={el.idCategory}>
                    <Text>{getWhirlpool(expo, el.idCategory)}</Text>
                  </View>
                ))}
                <View style={styles.cell}><Text>{0}</Text></View>
              </View>

              {/* Quatrième colonne */}
              <View style={styles.column}>
                <View style={styles.cell}><Text>Taux D'exposition</Text></View>
                {categ.map(el => (
                  <View style={styles.cell1} key={el.idCategory}>
                    <Text>{CountTaux(getTotalReferences(expo, el.idCategory), getWhirlpool(expo, el.idCategory))}%</Text>
                  </View>
                ))}
                <View style={styles.cell}><Text>{0}%</Text></View>
              </View>
            </View>
            <Center>
              {/* <TouchableOpacity onPress={exportToExcel} style={styles.btns}>
                <Text style={styles.btnText}>Exporter</Text>
              </TouchableOpacity> */}
            </Center>
          </View>
        </ScrollView>
      </View>

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
  image12: {
    width: 125,
    height: 95,
    position: "absolute",
    top: 0,
    left: 15,
  },
  textexpo: {
    fontSize: 15,
    fontWeight: '500',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#D0D3D4',
    maxWidth: 95,
    minWidth: 95,
    maxHeight: 55,
    minHeight: 55
  },
  cell1: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D3D4',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#D0D3D4',
    maxWidth: 95,
    minWidth: 95,
    maxHeight: 50,
    minHeight: 50
  },
  cell2: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDC100',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#D0D3D4',
    maxWidth: 95,
    minWidth: 95,
    maxHeight: 50,
    minHeight: 50
  },
  textcell2: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  btns: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default RapportExpo;
