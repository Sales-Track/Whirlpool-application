import * as React from "react";
import {FlatList,Alert,ScrollView,View,StyleSheet,Image,Text,TouchableOpacity,Modal,Dimensions } from "react-native";
import { CheckIcon,Input,CloseIcon,HStack,IconButton, Divider,Heading, Button, Select, Box, Center, NativeBaseProvider,Stack, Icon,Skeleton, VStack,} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Header from './header'
import Footer from './footer'
import axios from 'axios';
import { useNavigation,useRoute } from '@react-navigation/native';
import PopupRapport from './PopupRapportAn';
const { width, height } = Dimensions.get('window');

const leftimage = require('../../../assets/icons8-right-50.png'); 
const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')
// const { width, height } = Dimensions.get('window');
function CreationRapportExpo(){
  console.disableYellowBox = true; // Pour masquer tous les avertissements jaunes

  const navigation = useNavigation();
  const route = useRoute();
    const { ani } = route.params;

    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState("");
    const [rapportName, setRapportName] = React.useState("hello");
    const [pdv, setPdv] = React.useState(ani.PDV_idPDV);
    const [link, setLink] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
console.log(ani);

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
    textprop:{
        fontSize: 18,
        fontWeight:"600"
    },
    image12: {
      width: width * 0.33, // 33% of screen width
      height: height * 0.2, // 15% of screen height
      position: 'absolute',
      top: 10,
      left: 15,
    },
    btns: {
      backgroundColor: '#FDC100', // Background color of the button
      padding: 10,
      borderRadius: 5,
      width:150,
      marginTop:"5%",
      
    },
    btnText: {
      color: 'white', // Text color
      fontSize: 16,
      textAlign:"center"
    },
    inputs:{
      marginTop:'5%',
      marginBottom:'5%',
    },
    view1: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: width * 0.1, // 10% of screen width
      paddingHorizontal: width * 0.08, // 8% of screen width
      paddingBottom: height * 0.1, // 10% of screen height
      marginTop:height*0.08,
    },
    view2: {
      flex: 1,
      alignItems: 'center',
    },
    image1: {
      width: 24,
      height: 24, // Added height for aspect ratio
      marginBottom: 20, // Give some space below the image
    },
    row: {
      flexDirection: 'row', // Layout children in a row
      justifyContent: 'space-between', // Align children to the start and end of the container
      width: '90%', // Make the row take the full width
      alignItems: 'center', // Align items vertically
      marginTop: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      marginRight: 50, // Space between text and arrow
    },
    leftimage: {
      width: 30,
      height: 30,
    },
        })
export default CreationRapportExpo;