import * as React from "react";
import { View, Text,Image,Dimensions, StyleSheet,TouchableOpacity } from "react-native";
import { Checkbox, Center, NativeBaseProvider } from "native-base";


const { width, height } = Dimensions.get('window');
function PopupCheckBox() {
    const [groupValues, setGroupValues] = React.useState([]);
    const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')

  const Example = () => {
    return (
      <Checkbox.Group onChange={setGroupValues} value={groupValues} accessibilityLabel="choose numbers">
        <Checkbox value="one" my={2}>
          Nouvelle Marque
        </Checkbox>
        <Checkbox value="two" my={2}>
          Nouvelle Categorie
        </Checkbox>
        <Checkbox value="three" my={2}>
          Nouvelle Référence
        </Checkbox>
        <Checkbox value="four" my={2}>
          Nouvelle Couleur
        </Checkbox>
      </Checkbox.Group>
    );
  };

  return (
    <NativeBaseProvider>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
      <View style={styles.container}>
        <Text style={styles.title}>Check Box</Text>
        <Center flex={1} px="3">
          <Example />
        </Center>
        <Center mt={0}>
                <TouchableOpacity onPress={() =>{}} style={styles.btns}>
                <Text style={styles.btnText}>Verifier</Text>
                </TouchableOpacity>
                </Center>
      </View>
    </NativeBaseProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05, // Relative padding
    margin: '20%',
    marginTop: '55%',
    width: '60%',
    minHeight: height * 0.25, // Relative min height
    maxHeight: height * 0.56, // Relative max height
    borderWidth: 1,
    borderRadius: 15,
  },
  image12: {
    width: width * 0.31, // Relative width
    height: height * 0.12, // Relative height
    position: "absolute",
    top: 0,
    left: width * 0.04, // Relative left position
  },
  title: {
    fontSize: width * 0.05, // Relative font size
    fontWeight: "bold",
    marginBottom: 0,
  },
  btns: {
    backgroundColor: 'white',
    padding: width * 0.025, // Relative padding
    borderRadius: 5,
    width: width * 0.4, // Relative width
    marginTop: '0%',
    marginBottom: '10%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDC100',
  },
  btnText: {
    color: '#FDC100',
    fontSize: width * 0.04, // Relative font size
    textAlign: "center",
  },
});



export default PopupCheckBox;
