import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import { useDispatch } from 'react-redux';
import {
    UploadIcon,
} from '../../assets/icon/MenuIcons';
import CustomDropDown from '../../components/CustomDropDown';
import { saveUserSession, UserService } from '../../api/UserService';
import { setUserInfo } from '../../redux/slices/userSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import { UploadService } from '../../api/UploadService';
import ScreenWrapper from '../../components/ScreenWrapper';

const UpdateProfileScreen = ({ navigation, route }) => {
    const { id, token } = route.params; // Pass existing user if available
    const dispatch = useDispatch();

    const [avatar, setAvatar] = useState(null);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [description, setDescription] = useState('');

    // Handle profile image picker
    const handleChooseImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
            },
            async (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    console.error("ImagePicker Error: ", response.errorMessage);
                    return;
                }

                const image = response.assets[0];
                try {
                    const url = await UploadService.uploadImageAndGetUrl(image);
                    setAvatar(url); // update local state
                } catch (err) {
                    console.error("Image upload failed", err);
                }
            }
        );
    };

    // Handle profile save
    const handleSave = async () => {
        const body = {
            avatar, // include updated avatar
            name: fullName,
            email: email,
            gender: gender,
            mobile_number: phone,
            description: description
        };

        try {
            const res = await UserService.updateUserProfile(body);
            console.log("res after update profile", res);
            if (res.status === 200) {
                const updatedUser = { ...res.data?.profile, avatar };
                saveUserSession(res.data.id, null, updatedUser);
                dispatch(setUserInfo(updatedUser));
                navigation.navigate("Posts");
            }
        } catch (err) {
            console.error("Profile update failed", err);
        }
    };

    return (
        <ScreenWrapper behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {/* Profile Avatar */}
                    <View style={styles.avatarWrapper}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
                                    {fullName ? fullName.slice(0, 2).toUpperCase() : 'NA'}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.uploadIcon} onPress={handleChooseImage}>
                            <UploadIcon size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.phoneText}>{fullName}</Text>

                    {/* Name */}
                    <Text style={styles.label}>Name*</Text>
                    <CustomTextInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        maxLength={30}
                    />

                    {/* Mobile */}
                    <Text style={styles.label}>Mobile No.</Text>
                    <CustomTextInput
                        placeholder="Mobile Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />

                    {/* Gender */}
                    <CustomDropDown
                        label="Gender"
                        placeholder="Select Gender"
                        value={gender}
                        dropDownItems={["Male", "Female", "Other"]}
                        onSelect={setGender}
                        error={!gender}
                        errorMessage="Please select gender"
                    />

                    {/* Email */}
                    <CustomTextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        error={!email}
                        maxLength={50}
                        errorMessage="Email is required"
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <CustomTextInput
                        placeholder="About You"
                        value={description}
                        onChangeText={setDescription}
                        maxLength={200}
                    />

                    {/* Submit */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                        <Text style={styles.submitText}>SUBMIT</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4267B2' },
    scrollContent: { padding: 20 },
    avatarWrapper: { alignSelf: 'center', marginBottom: 10, borderWidth: 1, borderRadius: 50, backgroundColor: '#fff' },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    uploadIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f57c00', borderRadius: 15, padding: 6 },
    phoneText: { textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6, marginTop: 14 },
    submitButton: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 25 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '600', textTransform: 'uppercase' },
});

export default UpdateProfileScreen;
