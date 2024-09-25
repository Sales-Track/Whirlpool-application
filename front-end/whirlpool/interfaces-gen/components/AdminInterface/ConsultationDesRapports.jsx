import * as React from "react";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, Modal,Dimensions } from "react-native";
import { NativeBaseProvider } from "native-base";
import Footer from './footer';
import PopupRapport from './PopupRapport';
import {useRoute } from '@react-navigation/native';



const leftimage = require('../../../assets/left-icon.png');
const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')


function ConsultationDesRapports() {
    const route = useRoute();
    const { adm } = route.params;
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState("");
    const [rapportName, setRapportName] = React.useState("hello");
    const [pdv, setPdv] = React.useState("");
    const [link, setLink] = React.useState("");

    const handleRowItemPress = (report) => {
        setPopupType(report.popupType);
        setRapportName(report.text);
        setLink(report.link);
        setShowPopup(true);
    };
    
    const reports = [
        { text: "Rapport exposition", popupType: "expo" ,link:"RapportExpo"},
        { text: "Rapport price Map", popupType: "priceMap",link:"RapportPriceMap"},
        { text: "Rapport sell-out", popupType: "sellOut" ,link:"RapportSellOut"},
        { text: "Rapport de Présence", popupType: "presence",link:"RapportDePresence"},
        { text: "Rapport log", popupType: "log" ,link:"RapportLog"},
    ];
    return (
        <NativeBaseProvider>
                  <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />

            <View style={styles.view1}>
                <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 20 }}>Consultation des rapports :</Text>
                <View style={styles.view2}>

                    <ScrollView>
                        {reports.map((report) => (
                            <TouchableOpacity onPress={() => handleRowItemPress(report)}>
                                    <View key={report.popupType} style={styles.row}>
                                <Text style={styles.text}>{report.text}</Text>
                                    <Image
                                        resizeMode="contain"
                                        source={leftimage}
                                        style={styles.leftimage}
                                    />
                            </View>
                                </TouchableOpacity>
                        ))}
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
                    adm={adm}
                />
            </Modal>
            <Footer adm ={adm}/>
        </NativeBaseProvider>
    );
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    alert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textprop: {
        fontSize: 18,
        fontWeight: "600"
    },
    btns: {
        backgroundColor: '#FDC100', // Background color of the button
        padding: 10,
        borderRadius: 5,
        width: 150,
        marginTop: "5%",
    },
    btnText: {
        color: 'white', // Text color
        fontSize: 16,
        textAlign: "center"
    },
    inputs: {
        marginTop: '5%',
        marginBottom: '5%',
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
    image12: {
        width: width * 0.33, // 33% of screen width
        height: height * 0.2, // 15% of screen height
        position: 'absolute',
        top: 10,
        left: 15,
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
});

export default ConsultationDesRapports;
