import * as React from "react";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { NativeBaseProvider } from "native-base";
import { useRoute, useNavigation } from '@react-navigation/native';
import Footer from './footer';

const leftimage = require('../../../assets/left-icon.png');
const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

function EspaceCompte() {
    const navigation = useNavigation();
    const route = useRoute();
    const { adm } = route.params;
    const [popupType, setPopupType] = React.useState("");
    const [rapportName, setRapportName] = React.useState("hello");
    const [link, setLink] = React.useState("");

    const reports = [
        { text: "Creation d'Un Nouveau Compte", popupType: "expo", link: "CreationCompte" },
        { text: "Listes Des Comptes ", popupType: "priceMap", link: "ListesDesComptes" },
    ];

    const handleRowItemPress = (report) => {
        setPopupType(report.popupType);
        setRapportName(report.text);
        setLink(report.link);
        navigation.navigate(report.link, { adm });
    };

    return (
        <NativeBaseProvider>
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
            <View style={styles.view1}>
                <Text style={styles.title}>Espace Comptes</Text>
                <ScrollView>
                    {reports.map((report) => (
                        <View key={report.popupType}>
                            <TouchableOpacity style={{flexDirection:"row",justifyContent: 'space-between',}} onPress={() => handleRowItemPress(report)}>
                            <Text style={styles.text}>{report.text}</Text>
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
            <Footer adm={adm} />
        </NativeBaseProvider>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    view1: {
        marginTop:"10%",
        marginRight:"4%",
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: width * 0.1, // Responsive padding based on screen width
        paddingHorizontal: width * 0.08,
        paddingBottom: height * 0.1,
    },
    image12: {
        width: width * 0.3, // Responsive width and height
        height: height * 0.12,
        position: "absolute",
        top: 0,
        left: 15,
    },
    title: {
        fontSize: width * 0.05, // Responsive font size
        fontWeight: '700',
        marginTop: height * 0.03,
    },
    row: {
        flexDirection: 'row', // Layout children in a row
        justifyContent: 'space-between', // Align children to the start and end of the container
        width: '100%', // Make the row take the full width
        alignItems: 'center', // Align items vertically
        marginTop: height * 0.02,
    },
    text: {
        fontSize: width * 0.04, // Responsive font size
        fontWeight: '500',
        marginRight: width * 0.1, // Space between text and arrow
        marginTop:height*0.03
    },
    leftimage: {
        width: width * 0.08, // Responsive width and height for the icon
        height: width * 0.08,
        marginTop:height*0.03

    },
});

export default EspaceCompte;
