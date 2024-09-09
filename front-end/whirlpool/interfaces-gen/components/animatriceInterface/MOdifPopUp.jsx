import * as React from "react";
import { View, StyleSheet,Alert, Text, TouchableOpacity } from "react-native";
import { NativeBaseProvider, Center, Stack, Select, CheckIcon, Input, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import port from "../port";
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';

function Modifpopup({ onClose, popupData ,ani}) {
  const navigation = useNavigation();
  const [modif, setModif] = React.useState('');
  const [reff, setReff] = React.useState(popupData[0].referenceName || '');
  const [prix, setPrix] = React.useState(popupData[0].prix ? String(popupData[0].prix) : '');
  const [dataChanged, setDataChanged] = React.useState(false);
  
  const [references, setReferences] = React.useState([]);
  const [marques, setMarques] = React.useState([]);

  const Fetchallref = async () => {
    try {
      const response = await axios.get(port + "/api/reference/references");
      setReferences(response.data);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  }

  const Fetchallmarq = async () => {
    try {
      const response = await axios.get(port + "/api/marques/marques");
      setMarques(response.data);
    } catch (error) {
      console.error('Error fetching marques:', error);
    }
  }

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

  React.useEffect(() => {
    Fetchallref();
    Fetchallmarq();
  }, []);

  return (
    <NativeBaseProvider>
      <View style={styles.view1}>
        <Center><View style={styles.view2}><Text style={{ fontWeight: 500 }}>Modifier Cette Ligne</Text></View></Center>
        <View style={styles.allinputs}>
          <Stack space={4} w="100%" alignItems="center" mt="5%">
            <Select
              selectedValue={reff}
              minWidth="260"
              accessibilityLabel="Choisissez une référence"
              placeholder="Choisissez une référence"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={itemValue => setReff(itemValue)}
            >
              {references.map((ref) => (
                <Select.Item key={ref.id} label={ref.Referencename} value={ref.Referencename} />
              ))}
            </Select>
          </Stack>

          <View style={styles.inputs}>
            {/* <Stack space={4} w="42%" alignItems="center" mt="5%" ml="10">
              <Select
                selectedValue={marque}
                minWidth="150"
                accessibilityLabel="Choisissez une marque"
                placeholder="Choisissez une marque"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={itemValue => setMarque(itemValue)}
              >
                {marques.map((marq) => (
                  <Select.Item key={marq.id} label={marq.marquename} value={marq.marquename} />
                ))}
              </Select>
            </Stack> */}

            <Stack space={4} w="100%" alignItems="center" mt="5%" mr="7%">
              <Input
                w={{
                  base: "75%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon as={<MaterialIcons name="attach-money" />} size={5} ml="2" color="muted.400" />
                }
                placeholder="Prix"
                value={prix}
                onChangeText={setPrix}
              />
            </Stack>
          </View>
        </View>
        <Center>
          <View style={styles.btnsh}>
            <TouchableOpacity onPress={() => { AddExpo(popupData[0].idref,popupData[0].prix);
             }} style={styles.btnmod}>
              <Text style={styles.btnTextmod}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => { onclose()
           }} style={styles.btnsup}>
            <Text style={styles.btnTextcans}>Annuler</Text>
          </TouchableOpacity>
        </Center>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 0,
    justifyContent: 'center',
    padding: 5,
    width: '80%',
    height: '50%',
    margin: '10%',
    marginTop: '40%',
    borderRadius: 15,
    borderWidth: 0.2,
    backgroundColor: "white",
  },
  view2: {
    padding: 20,
  },
  inputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btnmod: {
    borderWidth: 1,
    borderColor: "#FDC100",
    width: 100,
    height: 42,
    alignItems: 'center',
    padding: 9,
    marginRight: 3,
    borderRadius: 5,
  },
  btnTextmod: {
    color: "#FDC100",
  },
  btncans: {
    borderWidth: 1,
    borderColor: "#D0D3D4",
    width: 100,
    height: 42,
    alignItems: 'center',
    padding: 9,
    borderRadius: 5,
  },
  btnTextcans: {
    color: '#D0D3D4',
  },
  btnsh: {
    flexDirection: "row",
    marginTop: 25,
  },
  btnsup: {
    borderWidth: 1,
    borderColor: "#D0D3D4",
    width: 100,
    height: 42,
    alignItems: 'center',
    padding: 9,
    marginTop: 15,
    borderRadius: 5,
  }
});

export default Modifpopup;
