import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator,Dimensions  } from "react-native";
import { NativeBaseProvider, Center } from "native-base";
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import port from '../port';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
const { width, height } = Dimensions.get('window');

function RapportExpo() {
  const route = useRoute();
  const { adm,month, pdv } = route.params;
  const navigation = useNavigation();

  const [load, setLoad] = useState(false);
  const [categ, setCateg] = useState([]);
  const [references, setReferences] = useState([]);
  const [marques, setMarques] = useState([]);
  const [expo, setExpo] = useState([]);
  const [pdvs, setPdvs] = useState({});
  const [anim, setAnim] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idWhirlpool, setIdwhirlpool] = useState(null);
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
    console.log(IdWhirlpool? IdWhirlpool.idMarque : null);
    setIdwhirlpool(IdWhirlpool? IdWhirlpool.idMarque : null)
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
  const getTotalwhirlpool = (expositions) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const whirlpoolRefs = references.filter(ref => ref.Marque_idMarque === idWhirlpool);
    
    const uniqueReferences = new Set(expositions
      .filter(exposition => 
        whirlpoolRefs.some(ref => ref.idReference === exposition.Reference_idReference) &&
        exposition.createdAt.slice(5, 7) === formattedMonth
      ).map(exposition => exposition.Reference_idReference)
    );
  
    return uniqueReferences.size;
  };
  const handleCategoryPress = (category, idCategory) => {
    // Get references for the selected category
    const refsInCategory = references.filter(ref => ref.Category_idCategory === idCategory);

    // Get the exposition data for the selected category
    const expoInCategory = expo.filter(expoItem =>
      refsInCategory.some(ref => ref.idReference === expoItem.Reference_idReference) &&
      expoItem.createdAt.slice(5, 7) === month.toString().padStart(2, '0')
    );
  
    // Prepare data to pass, but only include references present in expoInCategory
    const referencesDetails = expoInCategory.map(expoItem => {
      const ref = refsInCategory.find(ref => ref.idReference === expoItem.Reference_idReference);
      return {
        name: ref?.Referencename || 'Unknown Reference', // Assuming `name` is the reference name
        brand: marques.find(brand => brand.idMarque === ref?.Marque_idMarque)?.marquename || 'Unknown Brand',
        price: expoItem.prix || 'N/A' // Assuming `price` is in expo
      };
    });
  
    // Navigate with detailed data
    navigation.navigate('ManagerExpoDet', {
      references: referencesDetails,
      adm,
      expo,
      category: category,
      idcateg: idCategory
    });
  
    // Store category data
    storeData('category', category);
  };
  const exportToExcel = async () => {
    setLoading(true); // Commencez le chargement
    try {
        const data = [
            ["Marques", "Référence", "Prix"],
            ...expo.map(article => {
                const reference = references.find(ref => ref.idReference === article.Reference_idReference);
                const marque = marques.find(brand => brand.idMarque === reference?.Marque_idMarque);
                return [
                    marque?.marquename || '',
                    reference?.Referencename || '',
                    article.prix || 'N/A'
                ];
            })
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
        setLoading(false); // Fin du chargement
    }
};

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData();
      findIdWhirlpool(); // Appel de la fonction après que les données ont été récupérées
    };
  
    fetchAllData();
  }, []); // Le tableau de dépendances est vide, donc cet effet s'exécute uniquement lors du montage initial
  
  useEffect(() => {
    if (marques.length > 0) {
      findIdWhirlpool();
    }
  }, [marques]);
  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
      <View style={styles.view1}>
        <Header />
        
          <ScrollView style={{ marginTop: -20 }}>
            <View>
              <View>
                <Text style={styles.textexpo}>Date : {month}</Text>
                <Text style={styles.textexpo}>Zone : {pdvs.location}</Text>
                <Text style={styles.textexpo}>Magasin : {pdv}</Text>
                <Text style={styles.textexpo}>Animatrice : {anim.length > 0 ? anim[0].name : "Loading..."}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.container2}>
                {/* Première colonne */}
                <View style={styles.column}>
                  <View style={styles.cell}><Text>Famille de produit</Text></View >
                  {categ.map(el => (
                    <View style={styles.cell1} key={el.idCategory}>
                      <Text>{el.Categoryname}</Text>
                    </View>
                  ))}
                  <View style={styles.cell}><Text>Total</Text></View>
                </View>
                {/* Deuxième colonne */}
                <View style={styles.column}>
                  <View style={styles.cell}><Text>Expo globale</Text></View>
                  {categ.map(el => (
                  <TouchableOpacity key={el.idCategory} onPress={() => handleCategoryPress(el.Categoryname, el.idCategory)}>
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
                <View style={styles.cell}><Text>{getTotalwhirlpool(expo)}</Text></View>
                </View>
                {/* Quatrième colonne */}
                <View style={styles.column}>
                  <View style={styles.cell}><Text>Taux D'exposition</Text></View>
                  {categ.map(el => (
                  <View style={styles.cell1} key={el.idCategory}>
                    <Text>{CountTaux(getTotalReferences(expo, el.idCategory), getWhirlpool(expo, el.idCategory))}%</Text>
                  </View>
                ))}
                <View style={styles.cell}><Text>{CountTaux(getTotalexpo(expo),getTotalwhirlpool(expo))}%</Text></View>
                </View>
              </View>
                </ScrollView>
              <Center>
                <TouchableOpacity onPress={exportToExcel} style={styles.btns}>
                  <Text style={styles.btnText}>Exporter</Text>
                </TouchableOpacity>
              </Center>
            </View>
          </ScrollView>
        
      </View>
      <Footer adm={adm} />
    </NativeBaseProvider>
  );
  
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05, // 5% of screen width
  },
  image12: {
    width: width * 0.3, // 30% of screen width
    height: height * 0.2, // 20% of screen height
    position: "absolute",
    top: 0,
    left: width * 0.03, // 3% of screen width
  },
  textexpo: {
    fontSize: width * 0.04, // 4% of screen width
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
    padding: width * 0.02, // 2% of screen width
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#D0D3D4',
    maxWidth: width * 0.25, // 25% of screen width
    minWidth: width * 0.25, // 25% of screen width
    maxHeight: height * 0.07, // 7% of screen height
    minHeight: height * 0.07, // 7% of screen height
  },
  cell1: {
    flex: 1,
    padding: width * 0.02, // 2% of screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D3D4',
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'black',
    maxWidth: width * 0.25, // 25% of screen width
    minWidth: width * 0.25, // 25% of screen width
    maxHeight: height * 0.07, // 7% of screen height
    minHeight: height * 0.07, // 7% of screen height
  },
  cell2: {
    flex: 1,
    padding: width * 0.02, // 2% of screen width
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    backgroundColor: '#FDC100',
    borderColor: 'black',
    maxWidth: width * 0.25, // 25% of screen width
    minWidth: width * 0.25, // 25% of screen width
    maxHeight: height * 0.07, // 7% of screen height
    minHeight: height * 0.07, // 7% of screen height
  },
  textcell2: {
    color: 'white',
  },
  btns: {
    backgroundColor: '#FDC100',
    padding: width * 0.03, // 3% of screen width
    borderRadius: width * 0.02, // 2% of screen width
    width: width * 0.4, // 40% of screen width
    marginTop: height * 0.02, // 2% of screen height
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: width * 0.04, // 4% of screen width
    textAlign: "center",
  },
});

export default RapportExpo;