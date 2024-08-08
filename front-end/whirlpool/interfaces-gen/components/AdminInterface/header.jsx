import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView,Dimensions  } from "react-native";
import { NativeBaseProvider } from "native-base";
import * as Location from "expo-location";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

const wp = (percentage) => {
  return width * (percentage / 100);
};

const hp = (percentage) => {
  return height * (percentage / 100);
};
function Header() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 3600000); // 3600000 ms = 1 hour

    // Get the initial location when the component mounts
    getCurrentLocation();

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    console.log(location);
    setLocation(location);
    await storeLocation(location); // Store location in AsyncStorage
    
    // Appel à l'API de géocodage OpenStreetMap pour obtenir le nom de la ville
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;
    axios.get(url)
      .then((response) => {
        if (response.data.address) {
          setCity(response.data.address.city); // Assurez-vous que le chemin vers la ville est correct
        }
      })
      .catch((error) => {
        console.error("Error fetching city:", error);
      });
  };

  const storeLocation = async (location) => {
    try {
      const locationString = JSON.stringify(location);
      await AsyncStorage.setItem('@location', locationString);
    } catch (e) {
      console.error("Error saving location:", e);
    }
  };

  const getStoredLocation = async () => {
    try {
      const locationString = await AsyncStorage.getItem('@location');
      if (locationString !== null) {
        return JSON.parse(locationString);
      }
    } catch (e) {
      console.error("Error fetching stored location:", e);
    }
    return null;
  };

  return (
    <NativeBaseProvider>
      <View style={styles.view1}>
        <View style={styles.container}>
          <View style={styles.cityContainer}>
            <Text>{city}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.texthead}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 0, // Utilisez 1 pour que la vue occupe l'espace disponible
    justifyContent: 'center',
    padding: wp(1), // Utilisation du pourcentage pour le padding
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
  },
  cityContainer: {
    alignSelf: 'flex-end', // Pour placer la localisation à droite
    paddingHorizontal: wp(2), // Exemple de padding horizontal en pourcentage
  },
  texthead: {
    fontSize: wp(4), // Utilisation du pourcentage pour la taille de police
    fontWeight: '700',
  },
});
export default Header;
