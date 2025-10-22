import { View, Text, StyleSheet, ScrollView, Pressable, Image, KeyboardAvoidingView, Platform, PermissionsAndroid, Linking } from "react-native";
import React, { useState } from "react";
import SimpleHeader from "../../components/SimpleHeader";
import { CameraIcon, EditIcon } from "../../assets/icon/MenuIcons";
import AlertModal from "../../components/AlertModal";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo, setUserInfo } from "../../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/CustomTextInput";
import CustomDropDown from "../../components/CustomDropDown";
import { UserService } from "../../api/UserService";
import { saveUserSession } from "../../api/UserService";
import { UploadService } from "../../api/UploadService";
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request, check, openSettings } from 'react-native-permissions';



const Settings = ({ navigation }) => {
    const user = useSelector(state => state.user.userInfo);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    // Editable states
    const [avatar, setAvatar] = useState(user?.avatar);
    const [editingField, setEditingField] = useState(null);
    const [fullName, setFullName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.mobile_number || '');
    const [email, setEmail] = useState(user?.email || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [description, setDescription] = useState(user?.description || '');

    const [customAlert, setCustomAlert] = useState({
        visible: false,
        message: "",
        onOk: null,
        onCancel: null,
        showCancel: true,
    });

    const handleSaveField = async (field, avatarUrl = avatar) => {
        let body = {
            avatar: avatarUrl,
            name: fullName,
            email,
            mobile_number: phone,
            gender,
            description,
        };

        try {
            const res = await UserService.updateUserProfile(body);
            if (res.status === 200) {
                saveUserSession(res.data.id, null, res?.data?.profile);
                dispatch(setUserInfo(res.data?.profile));
                setEditingField(null);
            }
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    const handleLogout = async () => {
        setShowModal(false);
        await dispatch(clearUserInfo());
        await AsyncStorage.clear();
        navigation.navigate("Login");
    };

    const getAndroidPermission = () => {
        if (Platform.Version >= 33) {
            return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES; // for photos
        } else {
            return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // legacy storage
        }
    };
    const handleChooseImage = async () => {
        console.log("handleChooseImage called");

        const permission = Platform.OS === 'android' ? getAndroidPermission() : PERMISSIONS.IOS.PHOTO_LIBRARY;

        console.log("Checking permission:", permission);
        const status = await check(permission);
        console.log("Current permission status:", status);

        if (status === 'granted') {
            console.log("Permission granted → opening image picker");
            openImagePicker();
            return;
        }

        if (status === 'denied') {
            console.log("Permission denied → requesting permission");
            const result = await request(permission);
            console.log("Permission request result:", result);
            if (result === 'granted') {
                console.log("Permission granted after request → opening image picker");
                openImagePicker();
            } else {
                console.log("Permission denied after request → showing custom alert");
                showPermissionAlert();
            }
            return;
        }

        if (status === 'blocked' || status === 'unavailable') {
            console.log("Permission blocked or unavailable → showing custom alert");
            showPermissionAlert();
            return;
        }
    };

    // Helper: Show custom alert to redirect user to settings
    const showPermissionAlert = () => {
        console.log("Showing custom permission alert");
        setCustomAlert({
            visible: true,
            message: "App needs permission to access photos. Please enable it in settings.",
            showCancel: true,
            onOk: () => {
                console.log("User pressed OK → opening app settings");
                setCustomAlert(prev => ({ ...prev, visible: false }));
                setTimeout(() => {
                    openSettings();
                }, 300);
            },
            onCancel: () => {
                console.log("User pressed Cancel on permission alert");
                setCustomAlert(prev => ({ ...prev, visible: false }));
            }
        });
    };

    const deleteUserAccount = async () => {
        try {
            const res = await UserService.deleteUserProfile(user);
            console.log("res after deleting user profile");
            await dispatch(clearUserInfo());
            await AsyncStorage.clear();
            navigation.navigate("Login");
        } catch (error) {

        }
    }

    // Helper: Launch image picker
    const openImagePicker = () => {
        console.log("Opening image library...");
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
            },
            async (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                    return;
                }
                if (response.errorCode) {
                    console.error("ImagePicker Error: ", response.errorMessage);
                    return;
                }

                const image = response.assets[0];
                console.log("Image selected:", image);

                try {
                    const url = await UploadService.uploadImageAndGetUrl(image);
                    console.log("Image uploaded successfully, URL:", url);
                    setAvatar(url);

                    const updatedProfile = { ...user, avatar: url };
                    dispatch(setUserInfo(updatedProfile));
                    saveUserSession(user.id, null, updatedProfile);
                    handleSaveField("avatar", url)
                    console.log("User profile updated with new avatar");
                } catch (err) {
                    console.error("Image upload failed", err);
                }
            }
        );
    };



    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <SimpleHeader title="Personal Details" onBack={() => navigation.goBack()} />

                <ScrollView contentContainerStyle={styles.container}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.initials}>
                                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "NA"}
                                </Text>
                            </View>
                        )}
                        <Pressable style={styles.editButton} onPress={handleChooseImage}>
                            <CameraIcon />
                            <Text style={styles.editText}>Edit</Text>
                        </Pressable>
                    </View>

                    {/* Editable Fields */}
                    <View style={styles.detailsContainer}>
                        {/* Full Name */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Full Name</Text>
                            {editingField === "name" ? (
                                <CustomTextInput value={fullName} onChangeText={setFullName} maxLength={30} />
                            ) : (
                                <View style={styles.editableRow}>
                                    <Text style={styles.value}>{fullName}</Text>
                                    <Pressable onPress={() => setEditingField("name")}>
                                        <EditIcon />
                                    </Pressable>
                                </View>
                            )}
                            {editingField === "name" && (
                                <Pressable style={styles.saveButton} onPress={() => handleSaveField("name")}>
                                    <Text style={styles.saveText}>Save</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Mobile Number */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Mobile Number</Text>
                            {editingField === "phone" ? (
                                <CustomTextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />
                            ) : (
                                <View style={styles.editableRow}>
                                    <Text style={styles.value}>{phone}</Text>
                                    <Pressable onPress={() => setEditingField("phone")}>
                                        <EditIcon />
                                    </Pressable>
                                </View>
                            )}
                            {editingField === "phone" && (
                                <Pressable style={styles.saveButton} onPress={() => handleSaveField("phone")}>
                                    <Text style={styles.saveText}>Save</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Email */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Email</Text>
                            {editingField === "email" ? (
                                <CustomTextInput value={email} onChangeText={setEmail} keyboardType="email-address" maxLength={50} />
                            ) : (
                                <View style={styles.editableRow}>
                                    <Text style={styles.value}>{email}</Text>
                                    <Pressable onPress={() => setEditingField("email")}>
                                        <EditIcon />
                                    </Pressable>
                                </View>
                            )}
                            {editingField === "email" && (
                                <Pressable style={styles.saveButton} onPress={() => handleSaveField("email")}>
                                    <Text style={styles.saveText}>Save</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Gender */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Gender</Text>
                            {editingField === "gender" ? (
                                <CustomDropDown
                                    placeholder="Select Gender"
                                    value={gender}
                                    dropDownItems={["Male", "Female", "Other"]}
                                    onSelect={setGender}
                                />
                            ) : (
                                <View style={styles.editableRow}>
                                    <Text style={styles.value}>{gender}</Text>
                                    <Pressable onPress={() => setEditingField("gender")}>
                                        <EditIcon />
                                    </Pressable>
                                </View>
                            )}
                            {editingField === "gender" && (
                                <Pressable style={styles.saveButton} onPress={() => handleSaveField("gender")}>
                                    <Text style={styles.saveText}>Save</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Description */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Description</Text>
                            {editingField === "description" ? (
                                <CustomTextInput value={description} onChangeText={setDescription} maxLength={200} />
                            ) : (
                                <View style={styles.editableRow}>
                                    <Text style={styles.value}>{description}</Text>
                                    <Pressable onPress={() => setEditingField("description")}>
                                        <EditIcon />
                                    </Pressable>
                                </View>
                            )}
                            {editingField === "description" && (
                                <Pressable style={styles.saveButton} onPress={() => handleSaveField("description")}>
                                    <Text style={styles.saveText}>Save</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {/* Logout */}
                    <View style={styles.logoutContainer}>
                        <Pressable style={styles.logoutButton} onPress={() => setCustomAlert({
                            visible: true,
                            message: "Are you sure you want to log out?",
                            showCancel: true,
                            onOk: handleLogout,
                            onCancel: () => setCustomAlert({ ...customAlert, visible: false }),
                        })}>
                            <Text style={styles.logoutText}>Log Out</Text>
                        </Pressable>
                    </View>
                    <View style={styles.logoutContainer}>
                        <Pressable style={styles.logoutButton} onPress={() => setCustomAlert({
                            visible: true,
                            message: "Are you sure you want to delete your account?",
                            showCancel: true,
                            onOk: deleteUserAccount,
                            onCancel: () => setCustomAlert({ ...customAlert, visible: false }),
                        })}>
                            <Text style={styles.logoutText}>Delete Account</Text>
                        </Pressable>
                    </View>

                    <AlertModal
                        visible={customAlert.visible}
                        alertText={customAlert.message}
                        showCancel={customAlert.showCancel}
                        showOk={true}
                        onOk={() => {
                            if (customAlert.onOk) customAlert.onOk();
                            setCustomAlert(prev => ({ ...prev, visible: false }));
                        }}
                        onCancel={() => {
                            if (customAlert.onCancel) customAlert.onCancel();
                            setCustomAlert(prev => ({ ...prev, visible: false }));
                        }}
                        okText="OK"
                        cancelText="Cancel"
                    />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    profileSection: { alignItems: "center", marginVertical: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#ddd" },
    avatarFallback: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    initials: { fontSize: 32, fontWeight: "bold", color: "#4267B2" },
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
    detailsContainer: { width: "100%", marginTop: 10 },
    row: { marginBottom: 20 },
    label: { color: "#666", fontSize: 13, marginBottom: 4 },
    value: { color: "#000", fontSize: 16, fontWeight: "500" },
    editableRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    saveButton: {
        marginTop: 6,
        alignSelf: "flex-end",
        backgroundColor: "#4267b2",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    saveText: { color: "#fff", fontWeight: "500" },
    logoutContainer: { alignItems: "center", marginTop: 30 },
    logoutButton: {
        backgroundColor: "#4267b2",
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 25,
        elevation: 3,
    },
    logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default Settings;
