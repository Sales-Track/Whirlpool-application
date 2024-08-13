import React, { useEffect, useState } from "react";
import { StyleSheet, Image, TextInput, Button, FlatList, ScrollView, View, Text } from "react-native";
import { CheckIcon, Select, Box, Center, NativeBaseProvider, VStack, Heading, HStack, Input } from "native-base";
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import { useRoute } from '@react-navigation/native';
import port from '../port';

const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

function CreationNRapport() {
  console.disableYellowBox = true; // To hide all yellow warnings

  const route = useRoute();
  const { ani } = route.params;
  const [marques, setMarques] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [references, setReferences] = useState([]);
  const [serMarq, setSerMarq] = useState(null);
  const [serCateg, setSerCateg] = useState(null);
  const [selecMarq, setSelecMarq] = useState(null);
  const [selecCateg, setSelecCateg] = useState(null);
  const [serRef, setSerRef] = useState("");
  const [prices, setPrices] = useState({});
  const [newRefName, setNewRefName] = useState("");
  const [newRefPrice, setNewRefPrice] = useState("");


  //////////////////////FUNCTIONS//////////////////////////////////
  const Fetchallmarq = async () => {
    try {
      const response = await axios.get(port + "/api/marques/marques")
      setMarques(response.data || []); 
    } catch (error) {
      console.error('Error fetching :', error)
    }
  }
  
  const Fetchallcateg = async () => {
    try {
      const response = await axios.get(port + "/api/categories/categorie")
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching :', error)
    }
  }

  const FetchrefbyCM = async (idC, idM) => {
    try {
      const response = await axios.post(port + "/api/reference/refCM", {
        Marque_idMarque: idM,
        Category_idCategory: idC
      });
      setReferences(response.data || []);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  }
  
  const handlePriceChange = (refId, price) => {
    setPrices({
      ...prices,
      [refId]: price
    });
  };

  const addNewReference = () => {
    const newReference = {
      idReference: references.length + 1, // Assign a new ID for the reference
      Referencename: newRefName,
    };
    setReferences([...references, newReference]);
    handlePriceChange(newReference.idReference, newRefPrice);
    setNewRefName("");
    setNewRefPrice("");
  };

  useEffect(() => {
    Fetchallmarq();
    Fetchallcateg();
  }, []);

  useEffect(() => {
    if (serMarq && serCateg) {
      FetchrefbyCM(serCateg, serMarq);
    }
  }, [serMarq, serCateg]);

  /////////////////////////////////////////////////////////////////
  const Exampleinput = () => {
    return (
      <Box alignItems="center">
        <Input
          mx="3"
          placeholder="prix"
          w="30%"
          value={prices[serRef] || ""}
          onChangeText={(value) => handlePriceChange(serRef, value)}
          style={styles.priceInput}
        />
      </Box>
    );
  };
  
  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.logo} />
      <Header />
      <View style={{marginTop:100}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Center flex={1} px="3">
          <VStack space={4} w="90%" maxW="400px" px={4} py={2}>
            <Heading fontSize="lg" color="teal.600" mb={4}>Créer un Nouveau Rapport d'Exposition</Heading>
            
            <Box mb={4}>
              <Select
                selectedValue={serMarq}
                minWidth="100%"
                accessibilityLabel="Choisir la Marque"
                placeholder="Choisir la Marque"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setSerMarq(itemValue)}
              >
                {Array.isArray(marques) && marques.map(el => (
                  <Select.Item key={el.idMarque} label={el.marquename} value={el.idMarque} />
                ))}
              </Select>
            </Box>
            
            <Box mb={4}>
              <Select
                selectedValue={serCateg}
                minWidth="100%"
                accessibilityLabel="Choisir la Catégorie"
                placeholder="Choisir la Catégorie"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setSerCateg(itemValue)}
              >
                {Array.isArray(categories) && categories.map(el => (
                  <Select.Item key={el.idCategory} label={el.Categoryname} value={el.idCategory} />
                ))}
              </Select>
            </Box>
            
            {serMarq && serCateg && (
  <ScrollView style={{ maxHeight: 200 }}>
    <View>
      {references.map((ref) => (
        <View key={ref.idReference} style={styles.referenceContainer}>
          <Text style={styles.referenceText}>{ref.Referencename}</Text>
          <TextInput
            placeholder="Prix"
            value={prices[ref.idReference] || ""}
            onChangeText={(value) => handlePriceChange(ref.idReference, value)}
            style={styles.priceInput}
          />
          <Button title="Ajouter" onPress={() => { /* Add relevant action here */ }} />
        </View>
      ))}
    </View>
  </ScrollView>
)}


            {/* Section to add new reference */}
            <VStack space={4}>
              <Heading fontSize="md" color="teal.600">Ajouter une Nouvelle Référence</Heading>
              <Box mb={0}>
              <Select
                selectedValue={selecMarq}
                minWidth="100%"
                accessibilityLabel="Choisir la Marque"
                placeholder="Choisir la Marque"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setSelecMarq(itemValue)}
              >
                {Array.isArray(marques) && marques.map(el => (
                  <Select.Item key={el.idMarque} label={el.marquename} value={el.idMarque} />
                ))}
              </Select>
            </Box>
            
            <Box mb={0}>
              <Select
                selectedValue={selecCateg}
                minWidth="100%"
                accessibilityLabel="Choisir la Catégorie"
                placeholder="Choisir la Catégorie"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => setSelecCateg(itemValue)}
              >
                {Array.isArray(categories) && categories.map(el => (
                  <Select.Item key={el.idCategory} label={el.Categoryname} value={el.idCategory} />
                ))}
              </Select>
            </Box>
              <Input
                placeholder="Nom de la Référence"
                value={newRefName}
                onChangeText={setNewRefName}
                style={styles.input}
              />
              <Input
                placeholder="Prix"
                value={newRefPrice}
                onChangeText={setNewRefPrice}
                keyboardType="numeric"
                style={styles.input}
              />
              
              <Button title="Ajouter la Référence" onPress={addNewReference} />
            </VStack>
          </VStack>
        </Center>
      </ScrollView>
      </View>
      <Footer ani={ani} />
    </NativeBaseProvider>
  )
};

const styles = StyleSheet.create({
  logo: {
    width: 125,
    height: 95,
    position: "absolute",
    top: 10,
    left: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  referenceContainer: {
    flexDirection: 'row', // Ensure horizontal arrangement
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  referenceText: {
    fontSize: 16,
    flex: 1, // Takes up remaining space
  },
  priceInput: {
    width: 80, // Fixed width for input
    height: 30,
    fontSize: 14,
    marginLeft: 10,
    borderWidth: 1, // Add a border to the input field
    borderColor: 'gray',
    paddingHorizontal: 5,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  flatListContainer: {
    paddingBottom: 20,
  }
});

export default CreationNRapport;
