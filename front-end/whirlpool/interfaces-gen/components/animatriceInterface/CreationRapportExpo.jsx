import * as React from "react";
import {FlatList,Alert,Dimensions,ScrollView,View,StyleSheet,Image,Text,TouchableOpacity,Modal } from "react-native";
import { CheckIcon,Input,CloseIcon,HStack,IconButton, Divider,Heading, Button, Select, Box, Center, NativeBaseProvider,Stack, Icon,Skeleton, VStack,} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Header from './header'
import Footer from './footer'
import axios from 'axios';
import { useNavigation,useRoute } from '@react-navigation/native';
import PopupRapport from './PopupRapportAn';

const leftimage = require('../../../assets/icons8-right-50.png'); 
const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')
const { width, height } = Dimensions.get('window');
function CreationRapportExpo(){
  console.disableYellowBox = true; // Pour masquer tous les avertissements jaunes

  const navigation = useNavigation();
  const route = useRoute();
    const { ani } = route.params;

    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState("");
    const [rapportName, setRapportName] = React.useState("hello");
    const [pdv, setPdv] = React.useState("");
    const [link, setLink] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);

    const handleRowItemPress = (report) => {
      setPopupType(report.popupType);
      setRapportName(report.text);
      setLink(report.link);
      setShowPopup(true);
    };

    function RowItem({ text,settruc2}) {
        if(settruc2==""){
            return (
              <TouchableOpacity onPress={() => navigation.navigate('CreationNRapport',{ ani })} >
                    <View style={styles.row}>
                  <Text style={styles.text}>{text}</Text>
                    <Image
                      resizeMode="contain"
                      source={leftimage}
                      style={styles.leftimage}
                    />
                </View>
                  </TouchableOpacity>
              );
        }
        if(settruc2=="1"){
          return (
            <TouchableOpacity onPress={() => {
              handleRowItemPress({ text: "Rapport Exposition", popupType: "expo", link: "RapportExpoAn" })}}>
                  <View style={styles.row}>
                    <Text style={styles.text}>{text}</Text>
                  <Image
                    resizeMode="contain"
                    source={leftimage}
                    style={styles.leftimage}
                  />
              </View>
                </TouchableOpacity>
            );
      }
        }
return(
    <NativeBaseProvider>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
 <View style={styles.view1}>
          <View style={styles.view2}>
            <Image
              resizeMode="contain"
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/12f4aba34bd6fde10767af48f78f20f36401e32be5ece9adacbb2971412c1df1?apiKey=354f2f8c1f9f40aca64d3ce2e19fda26&",
              }}
              style={styles.image1}
            />
         <ScrollView>
         <RowItem text="Créer un nouveau rapport" settruc2="" />
         <RowItem text="Travailler sur la base d'un anncien rapport" settruc2={"1"} />

         
          </ScrollView>
          </View>
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <PopupRapport
          popupType={popupType}
          onClose={() => setShowPopup(false)}
          setPdv={setPdv}
          pdv={pdv}
          rapportName={rapportName}
          link={link}
          ani={ani}
        />
      </Modal>
        <Footer ani={ani} />
        </NativeBaseProvider>


)
}


const styles = StyleSheet.create({
  alert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textprop: {
    fontSize: width * 0.045, // Relative font size
    fontWeight: "600",
  },
  image12: {
    width: width * 0.3, // Relative width
    height: height * 0.12, // Relative height
    position: "absolute",
    top: 0,
    left: width * 0.04, // Relative left position
  },
  btns: {
    backgroundColor: '#FDC100',
    padding: 10,
    borderRadius: 5,
    width: width * 0.4, // Relative width
    marginTop: '5%',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: width * 0.04, // Relative font size
    textAlign: "center",
  },
  inputs: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  view1: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: width * 0.1, // Relative padding
    paddingHorizontal: width * 0.09, // Relative horizontal padding
    paddingBottom: 80,
  },
  view2: {
    flex: 1,
    alignItems: 'center',
  },
  image1: {
    width: width * 0.06, // Relative width
    height: width * 0.06, // Relative height
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: width * 0.04, // Relative font size
    fontWeight: '500',
    marginRight: width * 0.12, // Relative margin right
  },
  leftimage: {
    width: width * 0.08, // Relative width
    height: width * 0.08, // Relative height
  },
});



export default CreationRapportExpo;