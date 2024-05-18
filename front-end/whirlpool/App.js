import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './interfaces-gen/components/login'
import Creationpdv from '../whirlpool/interfaces-gen/components/AdminInterface/creationpdv'
import CreationArt from '../whirlpool/interfaces-gen/components/AdminInterface/creationdArticle'
import ConsultRapports from '../whirlpool/interfaces-gen/components/AdminInterface/ConsultationDesRapports'
import RapportExpo from './interfaces-gen/components/AdminInterface/RapportExpo';
import RapportExpoDet from './interfaces-gen/components/AdminInterface/RapportdesxpoDet'
import Modifpopup from './interfaces-gen/components/AdminInterface/ModifRapExpo'
import RapportPriceMap from './interfaces-gen/components/AdminInterface/RapportPriceMap'
import RapportPriceMapDet from './interfaces-gen/components/AdminInterface/RapportPriceMapDet'
import RapportSellOut from './interfaces-gen/components/AdminInterface/RapportsSellOut';
import RapportDePresence from './interfaces-gen/components/AdminInterface/RapportDePresence'
import RapportLog from './interfaces-gen/components/AdminInterface/RapportLog'
import CreationCompte from './interfaces-gen/components/AdminInterface/creationCompte'
import PopupRapport from './interfaces-gen/components/AdminInterface/PopupRapport'


export default function App() {
  return (
    <View style={styles.container}>
      <RapportSellOut/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});