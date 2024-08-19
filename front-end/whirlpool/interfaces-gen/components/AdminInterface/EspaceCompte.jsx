import * as React from "react";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, Modal } from "react-native";
import { NativeBaseProvider } from "native-base";
import {useRoute ,useNavigation} from '@react-navigation/native';

import Footer from './footer';


const leftimage = require('../../../assets/left-icon.png');
const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')
function EspaceCompte() {
    const navigation = useNavigation();
    const route = useRoute();
    const { adm } = route.params;
    const [popupType, setPopupType] = React.useState("");
    const [rapportName, setRapportName] = React.useState("hello");
    const [link, setLink] = React.useState("");

    const reports = [
        { text: "Creation d'Un Nouveau Compte", popupType: "expo" ,link:"CreationCompte"},
        { text: "Listes Des Comptes ", popupType: "priceMap",link:"ListesDesComptes"},
    ];
    const handleRowItemPress = (report) => {
        setPopupType(report.popupType);
        setRapportName(report.text);
        setLink(report.link);
        navigation.navigate(report.link,{ adm })
    };
    return(
        <NativeBaseProvider>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
            <View  style={styles.view1}>
            <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 20 }}>Espace Comptes</Text>
            <ScrollView>
                        {reports.map((report) => (
                            <View key={report.popupType} style={styles.row}>
                                <Text style={styles.text}>{report.text}</Text>
                                <TouchableOpacity onPress={() => handleRowItemPress(report)}>
                                    <Image
                                        resizeMode="contain"
                                        source={leftimage}
                                        style={styles.leftimage}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
            </View>
            <Footer adm ={adm}/>
        </NativeBaseProvider>
    )
}
const styles = StyleSheet.create({
    view1: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 39,
        paddingHorizontal: 35,
        paddingBottom: 80,
    },
    image12: {
        width: 125,
        height: 95,
        position: "absolute",
        top: 0,
        left: 15,
      },
      row: {
        flexDirection: 'row', // Layout children in a row
        justifyContent: 'space-between', // Align children to the start and end of the container
        width: '100%', // Make the row take the full width
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
export default EspaceCompte;
