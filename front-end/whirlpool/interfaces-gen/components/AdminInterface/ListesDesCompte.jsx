import React, { useState } from "react";
import { NativeBaseProvider, Button, Input } from "native-base";
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import port from "../port";

const WHIRLPOOL_LOGO=require('../../../assets/WHIRLPOOL_LOGO.png')

function ListesDesComptes() {
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState("");
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [users,setUsers]= useState ([])
    const accounts = [
        { id: 1, name: "John", surname: "Doe", email: "john.doe@example.com", role: "Admin", password: "********" },
        // Add more accounts as needed
    ];

const getAllUser=async()=>{
    try{
        const response = await axios.get(port+"/api/users/")
        setUsers(response.data)
    }
    catch (error) {
        console.error('Error Update :', error)
    
      }
}
React.useEffect(() => {
    getAllUser()
  }, []);
    const handleAction = (account, action) => {
        setSelectedAccount(account);
        setActionType(action);
        setModalVisible(true);
    };

    return (
        <NativeBaseProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Image resizeMode="contain" source={WHIRLPOOL_LOGO} style={styles.image12} />
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Name</Text>
                        <Text style={styles.tableHeaderText}>lastname</Text>
                        <Text style={styles.tableHeaderText}>Email</Text>
                        <Text style={styles.tableHeaderText}>Role</Text>
                        <Text style={styles.tableHeaderText}>Password</Text>
                        <Text style={styles.tableHeaderText}>Actions</Text>
                    </View>
                    {users.map((account) => (
                        <View key={account.id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{account.name}</Text>
                            <Text style={styles.tableCell}>{account.lastname}</Text>
                            <Text style={styles.tableCell}>{account.email}</Text>
                            <Text style={styles.tableCell}>{account.role}</Text>
                            <Text style={styles.tableCell}>{account.password}</Text>
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

                    {actionType === "modify" && selectedAccount && (
                        <>
                            <Input placeholder="Name" value={selectedAccount.name} style={styles.input} />
                            <Input placeholder="Surname" value={selectedAccount.lastname} style={styles.input} />
                            <Input placeholder="Email" value={selectedAccount.email} style={styles.input} />
                            <Input placeholder="Role" value={selectedAccount.role} style={styles.input} />
                            <Input placeholder="Password" value={selectedAccount.password} secureTextEntry style={styles.input} />
                        </>
                    )}

                    <View style={styles.modalButtons}>
                        <Button onPress={() => setModalVisible(false)}>Cancel</Button>
                        <Button
                            colorScheme={actionType === "delete" ? "danger" : "primary"}
                            onPress={() => {
                                setModalVisible(false);
                                // Add your delete/modify logic here
                            }}
                        >
                            {actionType === "delete" ? "Delete" : "Save"}
                        </Button>
                    </View>
                </View>
            </Modal>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image12: {
        width: '31%', // Adjusted to percentage for responsiveness
        height: '12%',
        position: "absolute",
        top: 0,
        left: 15,
    },
    table: {
        marginTop: 100, // Adjust based on the height of your logo
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        padding: 10,
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
