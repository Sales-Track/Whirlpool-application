import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Platform } from "react-native";
import Footer from './footer';
import { useNavigation, useRoute } from '@react-navigation/native';

const image01 = require('../../../assets/image1+.png');
const image02 = require('../../../assets/image2.png');
const image03 = require('../../../assets/image3.png');
const image04 = require('../../../assets/image4.png');
const image05 = require('../../../assets/fleche.png');
const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

const { width, height } = Dimensions.get('window');

function WelcomeAdmin() {
  const navigation = useNavigation();
  const route = useRoute();
  const { adm } = route.params;
  const [historique, setHistorique] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const hundlehistorique = (zone) => {
    setLoading(true);

    setTimeout(() => {
      setHistorique((prevHistorique) => [...prevHistorique, zone]);
      setLoading(false);
      navigation.navigate(zone.link, { adm });
    }, 1000);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.logo} />

        <View style={styles.header}>
          <Text style={styles.textEmoji}>Hi 👋,</Text>
          <Text style={styles.textAdmin}>{adm.name}</Text>
        </View>

        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={() => hundlehistorique({ name: 'Espace Compte', link: 'EspaceCompte', image: image01 })}
            style={styles.gridItem}
          >
            <Text style={styles.textCreation}>Espace Compte</Text>
            <Image resizeMode="contain" source={image01} style={styles.image1} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => hundlehistorique({ name: 'Création de point de vente', link: 'Creationpdv', image: image02 })}
            style={styles.gridItem}
          >
            <Text style={styles.textCreation}>Création de point de vente</Text>
            <Image resizeMode="contain" source={image02} style={styles.image2} />
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={() => hundlehistorique({ name: "Création d'articles", link: 'CreationArt', image: image04 })}
            style={styles.gridItem}
          >
            <Text style={styles.textCreation}>Création d'articles</Text>
            <Image resizeMode="contain" source={image04} style={styles.image3} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => hundlehistorique({ name: 'Consultation des rapports', link: 'ConsultRapports', image: image03 })}
            style={styles.gridItem}
          >
            <Text style={styles.textCreation}>Consultation des rapports</Text>
            <Image resizeMode="contain" source={image03} style={styles.image03} />
          </TouchableOpacity>
        </View>

        <Text style={styles.textRecentActivities}></Text>
        {/* {historique.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate(item.link, { adm })} style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Image resizeMode="contain" source={item.image} style={styles.image4} />
              <Text style={styles.textCreation1}>{item.name}</Text>
            </View>
            <Image resizeMode="contain" source={image05} style={styles.image5} />
          </TouchableOpacity>
        ))} */}
      </ScrollView>

      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingIndicator]}>
          <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.loadingLogo} />
          <ActivityIndicator size="large" color="#FFCC30" />
        </View>
      )}

      <Footer adm={adm} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    width: width * 0.4,
    height: height * 0.1,
    marginTop: 20,
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  textEmoji: {
    fontSize: 16,
    color: "#FFCE38",
  },
  textAdmin: {
    fontSize: 14,
    color: "#263238",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "100%",
  },
  gridItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#FFF",
    padding: 16,
    shadowColor: "#4F4F4F",
    shadowOffset: { width: -0.5, height: 2 },
    shadowOpacity: 0.16,
    alignItems: "center",
  },
  textCreation: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  image1: {
    width: 95,
    height: 95,
  },
  image2: {
    width: 78,
    height: 78,
  },
  image3: {
    width: 68,
    height: 68,
  },
  image03: {
    width: 88,
    height: 88,
  },
  textRecentActivities: {
    fontSize: 14,
    color: "#263238",
    fontWeight: "700",
    alignSelf: "flex-start",
    marginVertical: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFCC30",
    borderRadius: 10,
    padding: 20,
    marginVertical: 5,
    width: "100%",
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image4: {
    backgroundColor: "#FFF",
    borderRadius: 32,
    width: 64,
    height: 64,
  },
  textCreation1: {
    fontSize: 16,
    color: "white",
    marginLeft: 9,
  },
  image5: {
    width: 30,
    height: 30,
  },
  loadingIndicator: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    width: 125,
    height: 95,
  },
});

export default WelcomeAdmin;
