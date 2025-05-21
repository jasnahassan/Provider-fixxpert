
import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Dimensions
} from "react-native";
import AddAddressModal from "./AddAddressModal";
import { useNavigation } from "@react-navigation/native";
const { height: screenHeight } = Dimensions.get('window');

const CheckoutModal = ({
    visible,
    onClose,
    addresses = [],
    selectedAddressId,
    setSelectedAddressId,
    onAddAddress,
    onConfirm,
    handleDeleteAddress
}) => {
    const navigation = useNavigation();
    const [addAddressVisible, setAddAddressVisible] = useState(false);
    const [Addressdetails, setAddressdetails] = useState('');

    const handleAddAddress = (newAddress) => {
        onAddAddress(newAddress); // parent handles saving and updating list
        setAddAddressVisible(false);
    };

    const handleProceed = () => {
        if (!selectedAddressId) {
            Alert.alert("Select an Address", "Please select an address before proceeding.");
            return;
        }
        navigation.navigate("BookingSummary", { selectedAddressId });
        onConfirm(); // optional callback to parent after confirm
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Select Address</Text>

                    {/* Add New Address */}
                    <TouchableOpacity
                        style={styles.addNewAddress}
                        onPress={() => setAddAddressVisible(true)}
                    >
                        <Text style={styles.addNewAddressText}>+ Add new address</Text>
                    </TouchableOpacity>

                    {/* Address List */}
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => item?.id}
                        renderItem={({ item }) => (
                            <View style={styles.addressWrapper}>
                            <TouchableOpacity
                                    style={[
                                        styles.addressContainer,
                                        selectedAddressId === item?.address_id && styles.selectedAddress,
                                    ]}
                                    onPress={() => {setSelectedAddressId(item?.address_id),setAddressdetails(item)}}
                            >
                                <View style={styles.radioButtonOuter}>
                                        {selectedAddressId === item?.address_id && (
                                            <View style={styles.radioButtonInner} />
                                        )}
                                </View>
                                <View style={styles.addressTextContainer}>
                                        <Text style={styles.addressTitle}>{item?.address_line1}</Text>
                                        <Text style={styles.addressDetail}>{item?.address_line2}</Text>
                                    <Text style={styles.phone}>Ph: {item.phone}</Text>
                                </View>
                            </TouchableOpacity>

                                {/* 🗑️ Delete Button */}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteAddress(item.id)}
                                >
                                    {/* <Text style={{ fontSize: 16, color: "red" }}>🗑️</Text> */}
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    {/* <FlatList
                        data={addresses}
                        keyExtractor={(item) => item?.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.addressContainer,
                                    selectedAddressId === item.id && styles.selectedAddress,
                                ]}
                                onPress={() => setSelectedAddressId(item.id)}
                            >
                                <View style={styles.radioButtonOuter}>
                                    {selectedAddressId === item.id && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                                <View style={styles.addressTextContainer}>
                                    <Text style={styles.addressTitle}>{item?.address_line1}</Text>
                                    <Text style={styles.addressDetail}>{item?.address_line2}</Text>
                                    <Text style={styles.phone}>Ph: {item.phone}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    /> */}

                    {/* Proceed Button */}
                    {/* <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.proceedButton}
                        onPress={() => {
                            if (!selectedAddressId) {
                                Alert.alert("Select an Address", "Please select an address before proceeding.");
                                return;
                            }
                            onConfirm(Addressdetails); // ✅ Pass selected ID to parent
                        }}
                    >
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>

                    {/* Add Address Modal */}
                    <AddAddressModal
                        visible={addAddressVisible}
                        onClose={() => setAddAddressVisible(false)}
                        onSave={handleAddAddress}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        maxHeight: screenHeight - 150,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 10,
    },
    closeText: {
        fontSize: 22,
        color: "black",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center",
        color:'#161616'
    },
    addNewAddress: {
        marginBottom: 15,
    },
    addNewAddressText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F7F9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedAddress: {
        borderColor: "red",
        borderWidth: 2,
    },
    radioButtonOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "black",
    },
    addressTextContainer: {
        flex: 1,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color:'#161616'
    },
    addressDetail: {
        fontSize: 14,
        color: '#666',
    },
    phone: {
        fontSize: 14,
        color: '#666',
    },
    proceedButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    proceedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 1,
    },
});

export default CheckoutModal;

