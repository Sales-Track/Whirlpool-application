import React, { useState } from "react";
import { NativeBaseProvider, Button, Input } from "native-base";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, Modal } from "react-native";
import {useRoute ,useNavigation} from '@react-navigation/native';
import Footer from './footer';

import axios from "axios";
import port from "../port";
import Footer from './footer';
import {useRoute ,useNavigation} from '@react-navigation/native';

const WHIRLPOOL_LOGO = require('../../../assets/WHIRLPOOL_LOGO.png')

function ListesDesComptes() {
    const route = useRoute();
    const { adm } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState("");
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [users, setUsers] = useState([]);
    const [newname, setNewname] = useState("");
    const [newlastn, setNewlastn] = useState("");
    const [newemail, setNewemail] = useState("");
    const [newpassword, setNewpassword] = useState("");

    const getAllUser = async () => {
        try {
            const response = await axios.get(port + "/api/users/");
            const usersByLetter = response.data.reduce((acc, user) => {
                const firstLetter = user.name[0].toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(user);
                return acc;
            }, {});
    
            // Ensure each letter key has an array even if no users are present
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            alphabet.forEach(letter => {
                if (!usersByLetter[letter]) {
                    usersByLetter[letter] = [];
                }
            });
    
            setUsers(usersByLetter);
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };
    

    const UpdateUser = async (id, info) => {
        try {
            console.log(info);
            
            await axios.put(port + "/api/users/" + id, info);
            getAllUser(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteAccount = async (id) => {
        try {
            await axios.delete(port + "/api/users/" + id);
            getAllUser(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    React.useEffect(() => {
        getAllUser();
    }, []);

    const handleAction = (account, action) => {
        setSelectedAccount(account);
        setActionType(action);
        setNewname(account.name);
        setNewlastn(account.lastname);
        setNewemail(account.email);
        setNewpassword(account.password);
        setModalVisible(true);
    };

    const handleSave = () => {
        const updatedData = {
            name: newname,
            lastname: newlastn,
            email: newemail,
            password: newpassword,
        };
        UpdateUser(selectedAccount.idusers, updatedData);
        setModalVisible(false);
    };

    return (
        <NativeBaseProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
                <View style={styles.table}>
                    {Object.keys(users).sort().map((letter) => (
                        <View key={letter}>
                            <Text style={styles.letterHeader}>{letter}</Text>
                            {users[letter].map((account) => (
                                <View key={account.idusers} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{account.name}</Text>
                                    <Text style={styles.tableCell}>{account.lastname}</Text>
                                    <Text style={styles.tableCell}>{account.email}</Text>
                                    <Text style={styles.tableCell}>{account.role}</Text>
                                    <Text style={styles.tableCell}>******</Text>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity
                                            onPress={() => handleAction(account, "modify")}
                                            style={styles.modifyButton}
                                        >
                                            <Text style={styles.buttonText}>Modif</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleAction(account, "delete")}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.buttonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
    
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        {actionType === "delete"
                            ? "Are you sure you want to delete this account?"
                            : "Modify Account Details"}
                    </Text>
    
                    {actionType === "modify" && (
                        <>
                            <Input placeholder="Name" value={newname} onChangeText={setNewname} style={styles.input} />
                            <Input placeholder="Surname" value={newlastn} onChangeText={setNewlastn} style={styles.input} />
                            <Input placeholder="Email" value={newemail} onChangeText={setNewemail} style={styles.input} />
                            <Input placeholder="Password" value={newpassword} onChangeText={setNewpassword} secureTextEntry style={styles.input} />
                        </>
                    )}
    
                    <View style={styles.modalButtons}>
                        <Button onPress={() => setModalVisible(false)}>Cancel</Button>
                        <Button
                            colorScheme={actionType === "delete" ? "danger" : "primary"}
                            onPress={() => {
                                if (actionType === "delete") {
                                    deleteAccount(selectedAccount.idusers);
                                } else {
                                    handleSave();
                                }
                            }}
                        >
                            {actionType === "delete" ? "Delete" : "Save"}
                        </Button>
                    </View>
                </View>
            </Modal>
            <Footer adm={adm}/>
        </NativeBaseProvider>
    );
    
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image12: {
        width: '31%',
        height: '12%',
        position: "absolute",
        top: 0,
        left: 15,
    },
    table: {
        marginTop: 100,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        padding: 10,
    },
    letterHeader: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: 10,
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
    },
    modifyButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: "#F44336",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        width: "80%",
        marginVertical: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 20,
    },
});

export default ListesDesComptes;
