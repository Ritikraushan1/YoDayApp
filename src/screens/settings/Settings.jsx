import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import SimpleHeader from "../../components/SimpleHeader";
import { CameraIcon, EditIcon } from "../../assets/icon/MenuIcons";
import AlertModal from "../../components/AlertModal";

const Settings = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false);


    const handleLogout = () => {
        setShowModal(false)
        navigation.navigate("Login")
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SimpleHeader title="Personal details" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/150" }} // replace with user profile URI
                        style={styles.avatar}
                    />
                    <Pressable style={styles.editButton}>
                        <CameraIcon />
                        <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Full name (as on PAN card)</Text>
                        <Text style={styles.value}>Ritik Raushan</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <Text style={styles.value}>**/**/2003</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.editableRow}>
                            <Text style={styles.value}>*****43824</Text>
                            <EditIcon />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.editableRow}>
                            <Text style={styles.value}>rkr***8@gmail.com</Text>
                            <EditIcon />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>PAN number</Text>
                        <Text style={styles.value}>******525G</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>Male</Text>
                    </View>
                </View>
                <View style={styles.logoutContainer}>
                    <Pressable style={styles.logoutButton} onPress={() => setShowModal(true)}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </Pressable>
                </View>
                <AlertModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    alertText="Are you sure you want to delete this post?"
                    showCancel={true}
                    showOk={true}
                    cancelText="No"
                    okText="Yes"
                    onCancel={() => setShowModal(false)}
                    onOk={() => handleLogout()}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    profileSection: { alignItems: "center", marginVertical: 20 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ddd",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginTop: -20,
    },
    editText: { color: "#fff", marginLeft: 6, fontSize: 14, fontWeight: "500" },

    detailsContainer: {
        width: "100%",
        marginTop: 10,
    },
    row: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 12,
    },
    label: { color: "#666", fontSize: 13, marginBottom: 4 },
    value: { color: "#000", fontSize: 16, fontWeight: "500" },
    editableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoutContainer: {
        // position: "absolute",
        bottom: 0, // a little above bottom
        left: 0,
        right: 0,
        alignItems: "center",
    },
    logoutButton: {
        backgroundColor: "#4267b2",
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 25,
        elevation: 3,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Settings;
