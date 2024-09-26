import * as React from "react";
import {FlatList,ScrollView,View,StyleSheet,Image,Text,TouchableOpacity,Button,Dimensions, Platform} from "react-native";
import { Alert,CheckIcon,Input, HStack,Select, IconButton,CloseIcon,VStack,Box, Center, NativeBaseProvider,Stack, Icon} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import port from '../port'
import Footer from './footer'
import {useRoute } from '@react-navigation/native';

const leftimage = require('../../../assets/left-icon.png'); 
const downicon = require('../../../assets/down-icon.png')
const IconRregion=require ('../../../assets/region-icon.png')
const ptDv = require ('../../../assets/point-de-vente-icon.png')
const refference = require('../../../assets/reference-icon.png')
const categorie = require ('../../../assets/category-icon.png')
const marque =require ('../../../assets/marque-icon.png')
const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')

function Creationpdv() {
  const [alertData, setAlertData] = React.useState({ visible: false, status: '', message: '' });
  const route = useRoute();
  const { adm } = route.params;
const [load,setload]=React.useState(false)  
const [pdv,setPdv]=React.useState(false);
const [affanim, setAffanim] = React.useState(false);
const [categ,setCateg] =React.useState(false);
const [marque, setMarque] = React.useState(false);
const [ref,setRef]=React.useState(false)
const [object,setObject]=React.useState(false)
const [categs,setCategs]=React.useState([]);
const [marques,setMarques]=React.useState([])
const [nomspdv,setNomspdv]=React.useState([]);
const [nomsanims,setNomanims]=React.useState([]);
const [refnom,setRefnom]=React.useState([]);


const [nomsanim,setNomanim]=React.useState('Animatrices');
const [nompdv,setNompdv]=React.useState("Point de Vente");
const [nomcateg,setNomcateg]=React.useState('')
const [nommarq,setNommar]=React.useState('')
const [nomref,setNomref]=React.useState("")
const [objct,setObjct]=React.useState('')
const [obj,setObj]=React.useState(null)
const [region,setRegion]=React.useState('Region')

const [idcateg,setIdcateg]=React.useState(null)
const [idmarque,setIdmarque]=React.useState(null)
const [iduser,setIdUser]=React.useState([])
const [idpdv,setIdpdv]=React.useState([])
const [pdvs, setPdvs] = React.useState([]);
// const port='192.168.218.26'

const Regions=["Ariana","Béja","Ben Arous","Bizerte","Gabès","Gafsa","Jendouba","Kairouan","Kasserine","Kébili","Kef","Mahdia","Manouba","Médenine","Monastir","Nabeul","Sfax","Sidi Bouzid","Siliana","Sousse","Tataouine","Tozeur","Tunis","Zaghouan"]
 
const Ref={
  Referencename:nomref,
  Marque_idMarque:idmarque,
  Category_idCategory:idcateg
}

const Pdv={
  pdvname:nompdv,
  location:region
}
////////////////////////FUNCTIONS///////////////////////////
const Fetchallref=async()=>{
  try{
    const response=await axios.get(port+"/api/reference/references")
    setRefnom(response.data)
    console.log(response.data);
  }catch (error) {
    console.error('Error fetching :', error)
  }
}
// const addObjectif=async(idref,idsel,objc)=>{
//   try{

//     const response=await axios.put(`${port}/api/refsel/addobjct/${idref}/${idsel}`,objc)
//     setObjct(response.data)
//     console.log(response.data);
//   }catch (error) {
//     console.error('Error fetching :', error)
//   }
// }
const handleClick = async (nompdv, nomcateg, obj) => {
  try {
    // Récupération des points de vente depuis l'API
    const pointV = await axios.get(`${port}/api/pdvs/pdvs`);
    
    // Trouver la catégorie correspondante à partir de la liste locale
    const categ = categs.find(el => el.Categoryname === nomcateg); 

    // Trouver le PDV correspondant dans les données récupérées depuis l'API
    const pdvss = pointV.data.find(el => el.pdvname === nompdv); 

    console.log("Point de vente récupéré:", categ);

    // Vérification que les données ont été trouvées
    if (!categ || !pdvss) {
      console.error("Catégorie ou PDV non trouvés");
      return;
    }

    // Envoi des données pour ajouter l'objectif de vente
    const response = await axios.post(`${port}/api/pdvCat/add`, {
      PDV_idPDV: pdvss.idPDV, // Utilisation du bon identifiant de PDV
      Category_idCategory: categ.idCategory, // Utilisation du bon identifiant de catégorie
      objective: obj
    });

    console.log('Mise à jour réussie:', response.data);
    showAlert('success', "Un Nouveau objectif de vente a été créé");
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    showAlert('error', "Échec de la création de l'objectif");
  }
};

const MAJ = async (nompdv, nomcateg, obj) => {
  try {
    // Récupération des points de vente depuis l'API
    const pointV = await axios.get(`${port}/api/pdvs/pdvs`);
    
    // Trouver la catégorie correspondante à partir de la liste locale
    const categ = categs.find(el => el.Categoryname === nomcateg); 

    // Trouver le PDV correspondant dans les données récupérées depuis l'API
    const pdvss = pointV.data.find(el => el.pdvname === nompdv); 

    console.log("Point de vente récupéré:", pdvss);

    // Vérification que les données ont été trouvées
    if (!categ || !pdvss) {
      console.error("Catégorie ou PDV non trouvés");
      return;
    }

    // Envoi des données pour ajouter l'objectif de vente
    const response = await axios.put(`${port}/api/pdvCat/update/${pdvss.idPDV}/${categ.idCategory}`,{
      objective: obj
    }
    );

    console.log('Mise à jour réussie:', response.data);
    showAlert('success', "Mise à jour effectuée");
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    showAlert('error', "Échec de la mise a jour de l'objectif");
  }
};
const supp = async (nompdv, nomcateg) => {
  try {
    // Récupération des points de vente depuis l'API
    const pointV = await axios.get(`${port}/api/pdvs/pdvs`);
    
    // Trouver la catégorie correspondante à partir de la liste locale
    const categ = categs.find(el => el.Categoryname === nomcateg); 

    // Trouver le PDV correspondant dans les données récupérées depuis l'API
    const pdvss = pointV.data.find(el => el.pdvname === nompdv); 

    console.log("Point de vente récupéré:", categ);

    // Vérification que les données ont été trouvées
    if (!categ || !pdvss) {
      console.error("Catégorie ou PDV non trouvés");
      return;
    }

    // Envoi des données pour ajouter l'objectif de vente
    const response = await axios.delete(`${port}/api/pdvCat/del/${pdvss.idPDV}/${categ.idCategory}`);

    console.log('Mise à jour réussie:', response.data);
    showAlert('success', "Objectif de vente a été supprimé");
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    showAlert('error', "Échec de la suppression de l'objectif");
  }
};
const Fetchallmarq=async()=>{
  try{
    const response=await axios.get(port+"/api/marques/marques")
    setMarques(response.data)
    console.log(response.data);
  }catch (error) {
    console.error('Error fetching :', error)
  }
}
const Fetchallcateg=async()=>{
  try{
    const response=await axios.get(port+"/api/categories/categorie")
    setCategs(response.data)
    console.log(response.data);
  }
  catch (error) {
    console.error('Error fetching :', error)
  }
}
const fetchPdvsname = async () => {
  try {
    const response = await axios.get(`${port}/api/pdvs/pdvs`);
    const pdvNames = response.data.map(pdv => pdv.pdvname);
    setNomspdv(pdvNames);
  } catch (error) {
    console.error('Error fetching PDVs:', error)
  }
}
const getpdvByname=async(info)=>{
  try{
    let response=await axios.get(port+"/api/pdvs/getId/"+info)
    setIdpdv(response.data.idPDV)
    return response.data.idPDV
    setload(!load)
  }
  catch (error) {
    console.error('Error fetching PDV:', error)
  }
}
const fetchAnimname = async () => {
  try {
    const response = await axios.get(`${port}/api/users/`);
    const nameAnims = response.data.reduce((acc, el) => {
      if (el.role === 'animatrice' && el.name && el.lastname) {
        const fullName = `${el.name} ${el.lastname}`;
        if (!acc.includes(fullName.trim())) {
          acc.push(fullName.trim());
        }
      }
      return acc;
    }, []);

    console.log(nameAnims);
    setNomanims(nameAnims);
  } catch (error) {
    console.error('Error fetching Anims:', error);
  }
};
const getIdbyname = async (name, lastname) => {
  try {
    const response = await axios.get(`${port}/api/users/getonenameuser`, {
      params: {
        name: name,
        lastname: lastname
      }
    });

    if (response.data && response.data.idusers) {
      console.log(response.data.idusers, "id de l'utilisateur"); // Vérifiez que vous recevez l'ID de l'utilisateur
      setIdUser(response.data.idusers);
      return response.data.idusers; // Retourne l'ID de l'utilisateur
    } else {
      throw new Error('User ID not found');
    }
  } catch (error) {
    console.error('Error fetching user by name:', error);
    throw error; // Laisser l'erreur être capturée par le bloc catch de la fonction appelante
  }
};


const Addpdvs=async (info,showAlert)=>{
  try{
    axios.post(port+'/api/pdvs/pdvs',info)
    console.log('pdv aded');
    setload(!load)
    showAlert('success', "Un Nouveau Point de vente a été créé");
  }
   catch (error) {
    console.error('Error adding point de vente:', error)
    showAlert('error', "Erreur lors de la création de la point de vente. Veuillez réessayer plus tard.");

  }
}
const AddCateg=async (info,showAlert)=>{
  try{
      axios.post(port+'/api/categories/categories',{Categoryname:info})
      setload(!load)
    showAlert('success', "Un Nouveau Categorie a été créé");

  }
   catch (error) {
    console.error('Error adding Category', error)
    showAlert('error', "Erreur lors de la création de la point de vente. Veuillez réessayer plus tard.");

  }
}
const AddMarque=async (info,showAlert)=>{
  try{
    axios.post(port+'/api/marques/marques',{marquename:info})
    setload(!load)
    showAlert('success', "Un Nouveau Marque a été créé");
  }
  catch (error) {
    console.error('Error adding Marque', error)
    showAlert('error', "Erreur lors de la création de la point de vente. Veuillez réessayer plus tard.");

  }
}
const AddRef=async(info,showAlert)=>{
  try{
    axios.post(port+'/api/reference/references',info)
    setload(!load)
    showAlert('success', "Un Nouveau Refernce a été créé");
  }
  catch (error) {
    console.error('Error adding Marque', error)
    showAlert('error', "Erreur lors de la création de la point de vente. Veuillez réessayer plus tard.");

  }
}
const updateAnimByPdv = async (userId, pdvId, showAlert) => {
  try {
    if (!userId || !pdvId) {
      throw new Error('User ID or PDV ID is missing');
    }

    const response = await axios.put(`${port}/api/users/animbypdv/${userId}`, { PDV_idPDV: pdvId });

    if (response.status === 200) {
      console.log('Animateur bien affecté');
      showAlert('success', "Animateur bien affecté");
    } else {
      console.error('Error updating user1:', response);
      showAlert('error', "Erreur lors de la mise à jour de l'animateur. Veuillez réessayer plus tard.");
    }
  } catch (error) {
    console.error('Error updating user2:', error);
    showAlert('error', "Erreur lors de la mise à jour de l'animateur. Veuillez réessayer plus tard.");
  }
};


React.useEffect(()=>{
  fetchPdvsname();
  fetchAnimname()
  Fetchallmarq()
  Fetchallcateg()
  Fetchallref()
},[load])
////////////////////////FUNCTIONS///////////////////////////

const ExampleAlert = ({ status, message, onClose }) => {
  return (
      <Stack space={3} w="100%" maxW="400">
        <Alert w="100%" status={status}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
              <HStack space={2} flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  {message}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{ borderWidth: 0 }}
                icon={<CloseIcon size="3" />}
                _icon={{ color: "coolGray.600" }}
                onPress={onClose}
              />
            </HStack>
          </VStack>
        </Alert>
      </Stack>
  );
};
const showAlert = (status, message) => {
  setAlertData({ visible: true, status, message });
};

const hideAlert = () => {
  setAlertData({ visible: false, status: '', message: '' });
};

const affectanim = async (nameanim, namepdv) => {
  let name = '';
  let lastname = '';

  if (nameanim !== "") {
    const parts = nameanim.split(' ');
    name = parts[0];
    lastname = parts[1];
  }

  try {
    const userId = await getIdbyname(name, lastname); // Fetch user ID by name and last name
    const pdvId = await getpdvByname(namepdv); // Fetch PDV ID by name
    console.log(pdvId,userId,'gooo');
    await updateAnimByPdv(userId, pdvId, showAlert); // Update assuming this function requires userId and pdvId

    console.log('Animateur bien affecté');
  } catch (error) {
    console.error('Error in operation:', error);
  }
};

  function RowItem({ text, truc,settruc}) {
    return (
      
      <TouchableOpacity onPress={() => {settruc(!truc),console.log(truc,text)}}>
          <View style={styles.row}>
        <Text style={styles.text}>{text}</Text>
          <Image
            resizeMode="contain"
            source={truc ? downicon : leftimage}
            style={styles.leftimage}
          />
      </View>
        </TouchableOpacity>
    );
  }
    /////////////////////////Exemple//////////////////////////////
  const Example = ({text}) => {
    if(text=='Point de Vente'){
      return (
        <Center>
        <Box maxW="250">
         
          <Select
            selectedValue={nompdv}
            minWidth="200"
            accessibilityLabel={nompdv}
            placeholder={nompdv}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            InputLeftElement={
              <Icon as={<MaterialIcons name="store" />} size={5} ml="2" color="muted.400" />
            } 
            mt={1}
            onValueChange={itemValue => setNompdv(itemValue.toLowerCase())}
          >
            {nomspdv.map((el, index) => (
              <Select.Item key={index} label={el} value={el} />
            ))}
          </Select>
        </Box>
      </Center>
      );
    }
    else if(text=='Animatrices'){
      return(
        <Center>
        <Box maxW="250">
          <Select
            selectedValue={nomsanim}
            minWidth="240"
            accessibilityLabel={nomsanim}
            placeholder= {nomsanim}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            InputLeftElement={
              <Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />
            } 
            mt={1}
            onValueChange={itemValue => setNomanim(itemValue)}
          >
          {nomsanims.map(el=>{
            return(
            <Select.Item label={el} value={el} />
          )
          })}

          </Select>
        </Box>
      </Center>
      )
    }
    else if(text=="Categories"){
      return(
        <Center>
        <Box maxW="250">
          <Select
            selectedValue={nomcateg}
            minWidth="200"
            accessibilityLabel={nomcateg}
            placeholder= {text}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            InputLeftElement={
              <Icon as={<MaterialIcons name="category" />} size={5} ml="2" color="muted.400" />
            } 
            mt={1}
            onValueChange={(itemValue) => {
              setNomcateg(itemValue);
              const selectedCategory = categs.find(el => el.Categoryname === itemValue);
              setIdcateg(selectedCategory ? selectedCategory.idCategory : null);
            }}          >
          {categs.map(el=>{
            return(
            <Select.Item label={el.Categoryname} value={el.Categoryname} />
          )
          })}
          </Select>
        </Box>
      </Center>
      )
    }
    else if(text=="Marques"){
      return(
        <Center>
        <Box maxW="250">
          <Select
            selectedValue={nommarq}
            minWidth="200"
            accessibilityLabel={nommarq}
            placeholder= "Marque"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            InputLeftElement={
              <Icon as={<MaterialIcons name="sell" />} size={5} ml="2" color="muted.400" />
            } 
            mt={1}
            onValueChange={(itemValue) => {
              setNommar(itemValue);
              const selectedMarque = marques.find(el => el.marquename === itemValue);
              setIdmarque(selectedMarque ? selectedMarque.idMarque : null);
            }}          >
          {marques.map(el=>{
            return(
            <Select.Item label={el.marquename} value={el.marquename} />
          )
          })}
          
          </Select>
        </Box>
      </Center>
      )
    }
    else if(text=="Reference"){
      return(
        <Center>
        <Box maxW="250">
          <Select
            selectedValue={nomref}
            minWidth="200"
            accessibilityLabel={nomref}
            placeholder= "Reference"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            InputLeftElement={
              <Icon as={<MaterialIcons name="tag" />} size={5} ml="2" color="muted.400" />
            } 
            mt={1}
            onValueChange={(itemValue) => {
              setNomref(itemValue);
              const selectedMarque = marques.find(el => el.marquename === itemValue);
              setIdmarque(selectedMarque ? selectedMarque.idMarque : null);
            }}          >
          {refnom.map(el=>{
            return(
            <Select.Item label={el.Referencename} value={el.Referencename} />
          )
          })}
          
          </Select>
        </Box>
      </Center>
      )
    }
   
    return (
      <Center>
        <Box maxW="250">
          <Select
            selectedValue={region}
            minWidth="200"
            accessibilityLabel={region}
            placeholder= {region}
            InputLeftElement={
              <Icon as={<MaterialIcons name="location-on" />} size={5} ml="2" color="muted.400" />
            } 
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            mt={1}
            onValueChange={itemValue => setRegion(itemValue)}
          >
            {Regions.map(el=>(
              <Select.Item  label={el} value={el} />
            ))}
          </Select>
        </Box>
      </Center>
    );
  };
   /////////////////////////Exemple//////////////////////////////
  const renderform =(key)=>{
    if (key==='pdv'&& pdv) {
      return (
        <View style={styles.inputs}>
           <Center flex={1} px="3">
          <Stack space={4} w="100%" alignItems="center">
            <Input 
              w={{
                base: "68%",
                md: "25%"
              }} 
              InputLeftElement={
                <Icon as={<MaterialIcons name="store" />} size={5} ml="2" color="muted.400" />
              } 
              placeholder="Point de vente" 
              onChangeText={item=>setNompdv(item.toLowerCase())}
            />
           
          </Stack>
        <Example text="Region" />
        <TouchableOpacity onPress={() =>{ Addpdvs(Pdv,showAlert),console.log('add',Pdv);}} style={styles.btns}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
        </Center>
        </View>
      )
    }
    else if ( key==='affanim'&& affanim){
      return (
      <View style={styles.inputs}>
      <Center flex={1} px="3">
      <Example text="Point de Vente"  />
      </Center>
      <Center flex={1} px="3">
      <Example text="Animatrices" />
      </Center>
      <Center flex={1} px="3">
          <TouchableOpacity onPress={() => {affectanim(nomsanim, nompdv) }} style={styles.btns}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
      </Center>
      </View>
      )
    }
    else if (key==='categ'&& categ){
      return (
      <View style={styles.inputs}>
      <Center flex={1} px="3">
        <Box alignItems="center">
          <Input  mx="3" placeholder="Categorie" 
            InputLeftElement={
              <Icon as={<MaterialIcons name="category" />} size={5} ml="2" color="muted.400" />
            } onChangeText={item=>setNomcateg(item.toLowerCase())}  w="68%" />
        </Box>
      </Center>
      <Center flex={1} px="3">
      <TouchableOpacity onPress={() => AddCateg(nomcateg,showAlert)} style={styles.btns}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
      </Center>
      </View>
      )
    }
    else if (key==='marque'&& marque){
      return (
      <View style={styles.inputs}>
      <Center flex={1} px="3">
        <Box alignItems="center">
          <Input mx="3" placeholder="Marque"
            InputLeftElement={
              <Icon as={<MaterialIcons name="sell" />} size={5} ml="2" color="muted.400" />
            } onChangeText={item=>setNommar(item.toLowerCase())} w="68%" />
        </Box>
      </Center>
      <Center flex={1} px="3">
      <TouchableOpacity onPress={() => AddMarque(nommarq,showAlert)} style={styles.btns}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
      </Center>
      </View>
      )
    }
    else if (key==='ref'&& ref){
      return (
      <View style={styles.inputs}>
      <Center flex={1} px="3">
        <Box alignItems="center">
          <Input mx="3" placeholder="Reference" 
            InputLeftElement={
              <Icon as={<MaterialIcons name="tag" />} size={5} ml="2" color="muted.400" />
            } onChangeText={item=>setNomref(item.toLocaleLowerCase())} w="68%" />
        </Box>
      </Center>
      <Center flex={1} px="3">
         <Example text={"Categories" }/>
        <Example text={"Marques"} />
      <TouchableOpacity onPress={() => AddRef(Ref,showAlert)} style={styles.btns}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
      </Center>
      </View>
      )
    }
    else if (key==='obj'&& object){
      return (
      <View style={styles.inputs}>
      <Center flex={1} px="3">
        <Box alignItems="center">
          <Input mx="3" placeholder="Objectif" 
            InputLeftElement={
              <Icon as={<MaterialIcons name="show-chart" />} size={5} ml="2" color="muted.400" />
            } onChangeText={item=>setObj(item)} w="68%" />
        </Box>
      </Center>
      <Center flex={1} px="3">
      <Example text={"Categories"} />
      <Example text={"Point de Vente"} />
      <TouchableOpacity onPress={()=>{handleClick(nompdv,nomcateg,obj)}} style={styles.btns}>
        <Text style={styles.btnText}>Ajouter</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{MAJ(nompdv,nomcateg,obj)}} style={styles.btns}>
        <Text style={styles.btnText}>Mise a jour</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{supp(nompdv,nomcateg)}} style={styles.btns}>
        <Text style={styles.btnText}>Suprimer</Text>
      </TouchableOpacity>
      </Center>
      </View>
      )
    }
  }
  return (
    <NativeBaseProvider>
      <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />

    <View style={styles.view1}>
      <Text style={{fontSize:18, fontWeight:700 , marginTop:20}}>Creation de point de vente :</Text>
    {alertData.visible && (
          <ExampleAlert
            status={alertData.status}
            message={alertData.message}
            onClose={hideAlert}
          />
        )}
      <View style={styles.view2}>
     <ScrollView>
        <RowItem text="Point de vente" truc={pdv} settruc={setPdv} />
        {pdv&&renderform('pdv')}
        <RowItem text="Affectation animatrice" truc={affanim} settruc={setAffanim}/>
        {affanim&&renderform('affanim')}
        <RowItem text="Categorie" truc={categ} settruc={setCateg}/>
        {categ&&renderform('categ')}
        <RowItem text="Marque"truc={marque} settruc={setMarque} />
        {marque&&renderform('marque')}
        <RowItem text="Reference" truc={ref} settruc={setRef}/>
        {ref&&renderform('ref')}
        <RowItem text="Objectif" truc={object} settruc={setObject}/>
        {object&&renderform('obj')}


      </ScrollView>
      </View>
    </View>
    <Footer adm={adm}/>
    </NativeBaseProvider>
  );
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  btns: {
    backgroundColor: '#FDC100',
    padding: 10,
    borderRadius: 5,
    width: width * 0.4, // 40% of screen width
    marginTop: height * 0.05, // 5% of screen height
  },
  image12: {
    width: width * 0.33, // 33% of screen width
    height: height * 0.2, // 15% of screen height
    position: 'absolute',
    top: 10,
    left: 15,
  },
  btnText: {
    color: 'white',
    fontSize: width * 0.04, // 4% of screen width
    textAlign: "center",
  },
  inputs: {
    marginTop: height * 0.05, // 5% of screen height
    marginBottom: height * 0.05, // 5% of screen height
  },
  view1: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: width * 0.1, // 10% of screen width
    paddingHorizontal: width * 0.09, // 9% of screen width
    paddingBottom: height * 0.1, // 10% of screen height
    marginTop:height*0.08,

  },
  view2: {
    flex: 1,
    alignItems: 'center',
  },
  image1: {
    width: width * 0.06, // 6% of screen width
    height: width * 0.06, // 6% of screen width (maintaining aspect ratio)
    marginBottom: height * 0.02, // 2% of screen height
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.01, // 1% of screen height
    marginRight:width*-0.05
  },
  text: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
    marginRight: width * 0.12, // 12% of screen width
  },
  leftimage: {
    width: width * 0.08, // 8% of screen width
    height: width * 0.08, // 8% of screen width
  },
});
export default Creationpdv;