import React, { useEffect, useState } from "react";
import { StyleSheet, Image, ScrollView, View, Text } from "react-native";
import { Box, Center, Progress, NativeBaseProvider } from "native-base";
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import { useRoute } from '@react-navigation/native';
import port from '../port';

const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png');

function MyObjectif() {
    const route = useRoute();
    const { ani } = route.params;

    const [categories, setCategories] = useState([]);
    const [references, setReferences] = useState([]);
    const [sellouts, setSellouts] = useState([]);
    const [sellRef, setSellRef] = useState([]);
    const [progressValues, setProgressValues] = useState({});
    const [objectives, setObjectives] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, referencesRes, selloutsRes, sellRefRes] = await Promise.all([
                    axios.get(`${port}/api/categories/categorie`),
                    axios.get(`${port}/api/reference/references`),
                    axios.get(`${port}/api/sellout/sellouts`),
                    axios.get(`${port}/api/refsel/ReferenceSel`)
                ]);

                setCategories(categoriesRes.data);
                setReferences(referencesRes.data);
                setSellouts(selloutsRes.data);
                setSellRef(sellRefRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const calculateProgressForCategories = async () => {
            const progressMap = {};
            const objectiveMap = {};  // To store the objectives

            for (const category of categories) {
                const progress = await calculCategByObj(category.idCategory);
                const objectif = await getObjectifByPC(category.idCategory);  // Get the objective
                progressMap[category.idCategory] = progress;
                objectiveMap[category.idCategory] = objectif;  // Store the objective
            }

            setProgressValues(progressMap);
            setObjectives(objectiveMap);  // Set the objectives state
            setLoading(false);
        };

        if (categories.length && references.length && sellouts.length && sellRef.length) {
            calculateProgressForCategories();
        }
    }, [categories, references, sellouts, sellRef]);

    const getObjectifByPC = async (categid) => {
        try {
            const response = await axios.get(`${port}/api/pdvCat/get`);
            const objbyCategPdv = response.data.find(
                (e) => e.PDV_idPDV === ani.PDV_idPDV && e.Category_idCategory === categid
            );
            return objbyCategPdv ? objbyCategPdv.objective : 0;
        } catch (error) {
            console.log("Error fetching objectif:", error);
            return 0;
        }
    };

    const calculCategByObj = async (categid) => {
        const refCat = references.filter(e => e.Category_idCategory === categid);
        const selRefFiltered = sellRef.filter(e =>
            refCat.some(ref => ref.idReference === e.Reference_idReference)
        );
        const selFiltered = sellouts.filter(e =>
            selRefFiltered.some(sel => sel.Sellout_idSellout === e.idSellout)
        );

        let total = 0;
        selFiltered.forEach(elem => {
            total += elem.nbrV;
        });

        const objectif = await getObjectifByPC(categid);
        return objectif ? (total * 100) / objectif : 0;
    };

    const LoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );

    const ProgressBar = ({ value }) => (
        <Center w="100%">
            <Box w="90%" maxW="400">
                <Progress colorScheme="yellow" value={value} mx="4" />
            </Box>
        </Center>
    );

    return (
        <NativeBaseProvider>
            <View style={{ marginBottom: '10%', marginTop: '5%' }}></View>
            <Header />
            <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.logo} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    categories.map((category) => (
                        <View key={category.idCategory} style={styles.categoryContainer}>
                            {/* Display Category Name and Objective */}
                            <Text style={styles.categoryName}>
                                {category.Categoryname} - Objectif: {objectives[category.idCategory] || 0}
                            </Text>
                            <ProgressBar value={progressValues[category.idCategory] || 0} />
                        </View>
                    ))
                )}
            </ScrollView>
            <Footer ani={ani} />
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 100,
        marginBottom: 20,
    },
    scrollContainer: {
        padding: 20,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#FFD700',
    },
});

export default MyObjectif;
