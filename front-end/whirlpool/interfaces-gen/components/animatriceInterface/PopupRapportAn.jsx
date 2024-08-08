import React from "react";
import { Modal, StyleSheet,Dimensions, Text, TouchableOpacity } from "react-native";
import { CheckIcon, Center, NativeBaseProvider, Box, Select, View, Icon } from "native-base";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";  // Importing the icons from @expo/vector-icons
import port from '../port';
import { useRoute } from '@react-navigation/native';



const { width, height } = Dimensions.get('window');
function PopupRapport({ popupType, onClose, setPdv, setDate, date, pdv, rapportName, link }) {
    const navigation = useNavigation();
    const route = useRoute();
    const { ani } = route.params;
    const [month, setMonth] = React.useState("");
    const [nomspdv, setNomspdv] = React.useState([]);
    const [warningVisible, setWarningVisible] = React.useState(false);

    const fetchPdvsname = async () => {
        try {
            const response = await axios.get(`${port}/api/pdvs/pdvs`);
            const pdvNames = response.data.map(pdv => pdv.pdvname);
            setNomspdv(pdvNames);
        } catch (error) {
            console.error('Error fetching PDVs:', error);
        }
    };

    React.useEffect(() => {
        fetchPdvsname();
    }, []);

    const Example = ({ text, setOption, option }) => (
        <Center>
            <Box maxW="400" mt={5}>
                <Select
                    selectedValue={option}
                    minWidth="100%"
                    accessibilityLabel="Choisir le point de vente"
                    placeholder={text}
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                    }}
                    InputLeftElement={
                        <Icon as={<MaterialIcons name="store" />} size={5} ml="2" color="muted.400" />
                    } 
                    mt={1}
                    onValueChange={(itemValue) => setOption(itemValue)}
                >
                    {nomspdv.map((el, index) => (
                        <Select.Item key={index} label={el} value={el} />
                    ))}
                </Select>
            </Box>
        </Center>
    );

    const ExampleMonth = ({ text, setOption, option }) => (
        <Center>
            <Box maxW="400" mt={5}>
                <Select
                    selectedValue={option}
                    minWidth="100%"
                    accessibilityLabel="Choisir le mois"
                    placeholder={text}
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                    }}
                    InputLeftElement={
                        <Icon as={<MaterialIcons name="event" />} size={5} ml="2" color="muted.400" />
                    } 
                    mt={1}
                    onValueChange={(itemValue) => setOption(itemValue)}
                >
                    <Select.Item label="Janvier" value="1" />
                    <Select.Item label="Février" value="2" />
                    <Select.Item label="Mars" value="3" />
                    <Select.Item label="Avril" value="4" />
                    <Select.Item label="Mai" value="5" />
                    <Select.Item label="Juin" value="6" />
                    <Select.Item label="Juillet" value="7" />
                    <Select.Item label="Août" value="8" />
                    <Select.Item label="Septembre" value="9" />
                    <Select.Item label="Octobre" value="10" />
                    <Select.Item label="Novembre" value="11" />
                    <Select.Item label="Décembre" value="12" />
                </Select>
            </Box>
        </Center>
    );

    const handleVerifyPress = () => {
        if (month === "" || pdv === "") {
            setWarningVisible(true);
        } else {
            navigation.navigate(link, { month, pdv, ani });
        }
    };

    return (
        <NativeBaseProvider>
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={onClose}
            >
                <Center style={styles.center}>
                    <Box style={styles.modal}>
                        <Text style={styles.title}>{rapportName}</Text>
                        <ExampleMonth text={'Mois :'} setOption={setMonth} option={month} />
                        <Example text={'Point De Vente'} setOption={setPdv} option={pdv} />
                        <Center mt={10}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={handleVerifyPress}
                                    style={styles.btns}
                                >
                                    <Text style={styles.btnText}>Vérifier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.btns}
                                >
                                    <Text style={styles.btnText}>Fermer</Text>
                                </TouchableOpacity>
                            </View>
                        </Center>
                    </Box>
                </Center>
            </Modal>

            {/* Warning Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={warningVisible}
                onRequestClose={() => setWarningVisible(false)}
            >
                <Center style={styles.center}>
                    <Box style={styles.warningModal}>
                        <Text style={styles.warningTitle}>Avertissement</Text>
                        <Text style={styles.warningText}>Veuillez remplir tous les champs.</Text>
                        <TouchableOpacity
                            onPress={() => setWarningVisible(false)}
                            style={styles.btns}
                        >
                            <Text style={styles.btnText}>Fermer</Text>
                        </TouchableOpacity>
                    </Box>
                </Center>
            </Modal>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent pour overlay derrière le modal
    },
    modal: {
      backgroundColor: 'white',
      padding: width * 0.05, // Relative padding
      borderRadius: 15,
      width: "80%",
      height: "40%",
      borderWidth: 1,
      borderColor: '#FDC100',
    },
    title: {
      fontSize: width * 0.045, // Relative font size
      fontWeight: '600',
      marginBottom: height * 0.03, // Relative marginBottom
      textAlign: 'center',
    },
    warningModal: {
      backgroundColor: 'white',
      padding: width * 0.05, // Relative padding
      borderRadius: 15,
      width: "80%",
      height: "20%",
      borderWidth: 1,
      borderColor: '#FDC100',
      alignItems: 'center',
    },
    warningTitle: {
      fontSize: width * 0.045, // Relative font size
      fontWeight: '600',
      marginBottom: height * 0.01, // Relative marginBottom
      textAlign: 'center',
    },
    warningText: {
      fontSize: width * 0.04, // Relative font size
      marginBottom: height * 0.02, // Relative marginBottom
      textAlign: 'center',
    },
    btns: {
      backgroundColor: 'white', // Couleur de fond du bouton
      padding: height * 0.012, // Relative padding
      borderRadius: 5,
      width: width * 0.23, // Relative width
      height: height * 0.06, // Relative height
      marginTop: "0%",
      marginBottom: height * 0.02, // Relative marginBottom
      marginLeft: width * 0.02, // Relative marginLeft
      marginRight: width * 0.02, // Relative marginRight
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#FDC100',
    },
    btnText: {
      color: '#FDC100', // Couleur du texte
      fontSize: width * 0.04, // Relative font size
      textAlign: "center",
    },
  });

export default PopupRapport;
