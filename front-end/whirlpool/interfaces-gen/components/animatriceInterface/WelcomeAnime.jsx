import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, ActivityIndicator,Dimensions } from "react-native";
import { Switch, HStack, NativeBaseProvider } from "native-base";
import Header from './header';
import Footer from './footer';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import port from '../port';

const image01 = require('../../../assets/image1+.png');
const image02 = require('../../../assets/image2.png');
const image03 = require('../../../assets/image3.png');
const image04 = require('../../../assets/image4.png');
const image05 = require('../../../assets/fleche.png');
const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');
// const { width, height } = Dimensions.get('window');
function WelcomeAnime() {
  const route = useRoute();
  const { ani } = route.params;
  const navigation = useNavigation();
  const [load, setLoad] = React.useState(true);

  // Ajout d'un état pour le chargement
  const [loading, setLoading] = React.useState(false);

  const [historique, setHistorique] = React.useState([]);
  const [lastpres, setLastpres] = React.useState(null);
  const [allpres, setAllpres] = React.useState([]);
  const [alluser, setAllusers] = React.useState([]);

  const [checkOn, setCheckOn] = React.useState('');
  const [checkOff, setCheckOff] = React.useState('');

  const [status, setStatus] = React.useState(null);

  const [city, setCity] = React.useState("");

  const [iduser, setIdUser] = React.useState(ani.idusers);
  const [idpdv, setIdpdv] = React.useState(ani.PDV_idPDV);

  const onligne = {
    datePr: formatDateWithoutTime(new Date()),
    checkin: new Date().toLocaleTimeString(),
    checkout: null,
    position: city,
    status: true,
    Users_idusers: iduser,
    PDV_idPDV: idpdv
  };

  const offligne = {
    datePr: formatDateWithoutTime(new Date()),
    timecheckout: new Date().toLocaleTimeString(),
    status: false,
  };

  function formatDateWithoutTime(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  }

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  const hundlehistorique = (zone, message) => {
    setLoad(!load);
    logHistory(message);
    setHistorique((prevHistorique) => [...prevHistorique, zone]);
  };

  const Allpresence = async () => {
    try {
      const response = await axios.get(`${port}/api/presences/presences`);
      setAllpres(response.data);
    } catch (error) {
      console.error('Error handling getallpresence:', error);
    }
  };

  const Allusers = async () => {
    try {
      const response = await axios.get(`${port}/api/users/animateur`);
      setAllusers(response.data);
    } catch (error) {
      console.error('Error handling getallAnnime:', error);
    }
  };

  const logHistory = async (message) => {
    try {
      await axios.post(`${port}/api/logs/logs`, {
        messageAc: message,
        dateAc: formatDateWithoutTime(new Date()),
        TimeAc: new Date().toLocaleTimeString(),
        Presence_idPresence: lastpres,
      });
    } catch (error) {
      console.error('Error handling Log:', error);
    }
  };

  const getlastidpresence = async (userIdd, pdvIdd) => {
    try {
      console.log("Fetching latest presence for user ID:", userIdd, "and PDV ID:", pdvIdd);
      const response = await axios.post(`${port}/api/presences/presence/latest`, {
        userId: userIdd,
        pdvId: pdvIdd,
      });
      if (response && response.data && response.data.idPresence) {
        console.log("Received presence data:", response.data);
        setLastpres(response.data.idPresence);
        setStatus(response.data.status);
      } else {
        console.log("No presence data found for user, setting status to offline");
        setLastpres(response.data.idPresence);
        setStatus(false); // User is offline when no presence data is found
      }
    } catch (error) {
      console.error('Error handling lastpres:', error);
      setLastpres(null);
      setStatus(false); // Set status to offline in case of error
    }
  };

  const presence = async () => {
    try {
      if (status) {
        const response = await axios.post(`${port}/api/presences/presences`, onligne);
        setLastpres(response.data.idPresence);
      } else {
        if (lastpres) {
          await axios.put(`${port}/api/presences/presences/checkout/${lastpres}`, offligne);
        } else {
          console.error('Latest presence ID is invalid');
        }
      }
    } catch (error) {
      console.error('Error handling presence:', error);
    }
  };

  const Example = () => {
    const handleToggle = async () => {
      try {
        if (!status) {
          const response = await axios.post(`${port}/api/presences/presences`, onligne);
          setLastpres(response.data.idPresence);
        } else {
          if (lastpres) {
            await axios.put(`${port}/api/presences/presences/checkout/${lastpres}`, offligne);
          } else {
            console.error('Latest presence ID is invalid');
          }
        }
        setStatus(!status); // Met à jour le statut après la requête
      } catch (error) {
        console.error('Error handling presence:', error);
      }
    };

    return (
      <HStack alignItems="center" space={4} ml={9}>
        <Text style={{ color: status ? "#FDC100" : "#D0D3D4", fontSize: 18 }}>
          {status ? "En ligne" : "Hors ligne"}
        </Text>
        <Switch
          size="sm"
          isChecked={status}
          onTrackColor="#FDC100"
          offTrackColor="#D0D3D4"
          onToggle={handleToggle} // Appelle la fonction handleToggle lors du changement
        />
      </HStack>
    );
  };

  React.useEffect(() => {
    getlastidpresence(ani.idusers, ani.PDV_idPDV);
    Allpresence();
    Allusers();
  }, [load]);

  // Fonction pour gérer le chargement pendant la navigation
  const handleNavigation = async (routeName) => {
    setLoading(true); // Activer le chargement

    // Attendre un court instant pour simuler le chargement
    setTimeout(() => {
      navigation.navigate(routeName, { ani });
      setLoading(false); // Désactiver le chargement une fois la navigation terminée
    }, 1000); // Temps simulé de chargement, ajustez selon vos besoins
  };

  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
      <ScrollView style={{ marginTop: "15%" }}>
        <Header onCityChange={handleCityChange} />
        <Example />
        <View style={styles.view1}>
          <View style={styles.view2}>
            <View style={styles.view3}>
              <Text style={styles.textEmoji}>Bonjour 👋,</Text>
            </View>
            <View style={styles.view4}>
              <Text style={styles.textAdmin}>{ani.name} {ani.lastname}</Text>
            </View>
          </View>
          <View style={styles.view10}>
            <TouchableOpacity disabled={!status} onPress={() => { hundlehistorique({ name: "Mes Rapports Sell-Out", link: 'CreationRapportSO', image: image03 },"Création Rapport Sell-out"); handleNavigation('CreationRapportSO'); }}>
              <View style={styles.view11}>
                <View style={styles.view12}>
                  <Text style={styles.textCreation}>Mes Rapports Sell-out</Text>
                </View>
                <Image resizeMode="contain" source={image03} style={styles.image3} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={!status} onPress={() => { hundlehistorique({ name: 'Mes Rapports Exposition', link: 'CreationRapportExpo', image: image03 },"Consultation Rapport Expo"); handleNavigation('CreationRapportExpo'); }}>
              <View style={styles.view13}>
                <View style={styles.view12}>
                  <Text style={styles.textCreation}>Mes Rapports Exposition</Text>
                </View>
                <Image resizeMode="contain" source={image03} style={styles.image03} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom:'15%'}}>
          <TouchableOpacity disabled={!status} onPress={() => { hundlehistorique({ name: "Mes Objectif", link: 'CMyObjectif', image: image03 },"Mes Objectif"); handleNavigation('MyObjectif'); }}>
              <View style={styles.view11}>
                <View style={styles.view12}>
                  <Text style={styles.textCreation01}>Mes Objectif</Text>
                </View>
                <Image resizeMode="contain" source={image01} style={styles.image001} />
              </View>
            </TouchableOpacity>
            </View>
          <View style={styles.view14}>
            <Text style={styles.textRecentActivities}></Text>
          </View>
          {/* {historique.map((item, index) => (
            <TouchableOpacity key={index} disabled={!status} onPress={() => handleNavigation(item.link)}>
              <View style={styles.view15}>
                <View style={styles.view16}>
                  <Image resizeMode="contain" source={item.image} style={styles.image4} />
                  <View style={styles.view17}>
                    <Text style={styles.textCreation1}>{item.name}</Text>
                  </View>
                </View>
                <Image resizeMode="contain" source={image05} style={styles.image5} />
              </View>
            </TouchableOpacity>
          ))} */}
        </View>
      </ScrollView>
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.loadingLogo} />
          <ActivityIndicator size="large" color="#FFCC30" />
        </View>
      )}
      <Footer ani={ani} />
    </NativeBaseProvider>
  );
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Ajout de flex pour occuper tout l'espace
  },
  view1: {
    marginTop: height * 0.1, // Relative marginTop
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: width * 0.06, // Relative paddingHorizontal
  },
  loadingLogo: {
    width: width * 0.3, // Relative width
    height: height * 0.12, // Relative height
  },
  view2: {
    alignItems: "stretch",
    marginBottom: height * 0.02, // Relative marginBottom
    flexDirection: "row",
  },
  view3: {
    marginBottom: height * 0.006, // Relative marginBottom
  },
  textEmoji: {
    fontSize: width * 0.04, // Relative font size
    color: "#FFCE38",
  },
  view4: {},
  textAdmin: {
    fontSize: width * 0.035, // Relative font size
    color: "#263238",
  },
  view5: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02, // Relative marginBottom
    height: height * 0.2, // Relative height
    margin: width * 0.012, // Relative margin
  },
  view6: {
    borderRadius: 10,
    shadowColor: "#4F4F4F",
    shadowOffset: { width: -0.5, height: 2 },
    shadowOpacity: 0.16,
    backgroundColor: "#FFF",
    padding: width * 0.04, // Relative padding
    flex: 1,
    marginRight: width * 0.02, // Relative marginRight
    width: width * 0.45, // Relative width
  },
  view7: {
    marginBottom: height * 0.01, // Relative marginBottom
  },
  textCreation: {
    fontSize: width * 0.04, // Relative font size
    color: "black",
    fontWeight:'600'

  },
  textCreation01: {
    fontSize: width * 0.04, // Relative font size
    color: "black",
    marginLeft:'15%',
    fontWeight:'600'
  },
  textCreation1: {
    fontSize: width * 0.04, // Relative font size
    color: "white",
  },
  image1: {
    width: width * 0.24, // Relative width
    height: height * 0.12, // Relative height
    position: "absolute",
    top: height * 0.1, // Relative top position
    left: width * -0.04, // Relative left position
  },
  image12: {
    width: width * 0.3, // 30% of screen width
    height: height * 0.2, // 20% of screen height
    position: "absolute",
    top: 0,
    left: width * 0.01, // 3% of screen width
  },
  view8: {
    borderRadius: 10,
    shadowColor: "#4F4F4F",
    shadowOffset: { width: -0.5, height: 2 },
    shadowOpacity: 0.16,
    backgroundColor: "#FFF",
    padding: width * 0.04, // Relative padding
    flex: 1,
    marginLeft: width * 0.02, // Relative marginLeft
    width: width * 0.45, // Relative width
  },
  view9: {
    marginBottom: height * 0.01, // Relative marginBottom
  },
  image2: {
    width: width * 0.2, // Relative width
    height: height * 0.1, // Relative height
    position: "absolute",
    top: height * 0.1, // Relative top position
    right: width * -0.04, // Relative right position
  },
  view10: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02, // Relative marginBottom
    height: height * 0.2, // Relative height
    margin: width * 0.005, // Relative margin
  },
  view11: {
    borderRadius: 10,
    shadowColor: "#4F4F4F",
    shadowOffset: { width: -0.5, height: 2 },
    shadowOpacity: 0.16,
    backgroundColor: "#FFF",
    padding: width * 0.04, // Relative padding
    flex: 1,
    marginRight: width * 0.02, // Relative marginRight
    width: width * 0.45, // Relative width
  },
  view12: {
    marginBottom: height * 0.01, // Relative marginBottom
  },
  image3: {
    width: width * 0.18, // Relative width
    height: height * 0.1, // Relative height
    position: "absolute",
    top: height * 0.12, // Relative top position
    left: width * -0.01, // Relative left position
  },
  image001: {
    width: width * 0.3, // Relative width
    height: height * 0.1, // Relative height
    position: "absolute",
    top: height * 0.12, // Relative top position
    left: width * 0.08, // Relative left position
  },
  image03: {
    width: width * 0.23, // Relative width
    height: height * 0.12, // Relative height
    position: "absolute",
    top: height * 0.1, // Relative top position
    right: width * -0.05, // Relative right position
  },
  view13: {
    borderRadius: 10,
    shadowColor: "#4F4F4F",
    shadowOffset: { width: -0.5, height: 2 },
    shadowOpacity: 0.16,
    backgroundColor: "#FFF",
    padding: width * 0.04, // Relative padding
    flex: 1,
    marginLeft: width * 0.02, // Relative marginLeft
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.45, // Relative width
  },
  view14: {
    marginTop: height * 0.05, // Relative marginTop
    alignSelf: "stretch",
    marginBottom: height * 0.02, // Relative marginBottom
  },
  textRecentActivities: {
    fontSize: width * 0.035, // Relative font size
    color: "#263238",
    fontWeight: "700",
  },
  view15: {
    borderRadius: 10,
    backgroundColor: "#FFCC30",
    alignSelf: "stretch",
    padding: width * 0.05, // Relative padding
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.9, // Relative width
    marginTop: height * 0.01, // Relative marginTop
    marginBottom: height * 0.03, // Relative marginBottom
  },
  view16: {
    flexDirection: "row",
    alignItems: "center",
  },
  image4: {
    backgroundColor: "#FFF",
    borderRadius: 32,
    width: width * 0.16, // Relative width
    height: height * 0.08, // Relative height
  },
  view17: {
    marginLeft: width * 0.02, // Relative marginLeft
  },
  image5: {
    width: width * 0.075, // Relative width
    height: height * 0.04, // Relative height
  },
  loadingIndicator: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Ajout de flex pour occuper tout l'espace
  },
  loadingText: {
    marginTop: height * 0.01, // Relative marginTop
    fontSize: width * 0.045, // Relative font size
    color: "#263238",
  },
});

export default WelcomeAnime;
