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
} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import { useDispatch } from 'react-redux';
import {
    UploadIcon,
    PersonIcon,
    CallIcon,
    CalendarIcon,
    TimeIcon,
    LocationIcon,
    RadioCheckedIcon,
    RadioUncheckedIcon,
} from '../../assets/icon/MenuIcons';
import CustomDropDown from '../../components/CustomDropDown';
import { saveUserSession, UserService } from '../../api/UserService';
import { setUserInfo } from '../../redux/slices/userSlice';
import * as Keychain from 'react-native-keychain';


const UpdateProfileScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [description, setDescription] = useState('');
    const [tob, setTob] = useState('06:00 PM');
    const [pob, setPob] = useState('');

    const handleSave = async () => {
        let body = {
            name: fullName,
            email: email,
            gender: gender,
            mobile_number: phone,
            description: description
        }
        const res = await UserService.updateUserProfile(body);
        console.log("res after update profile", res);
        if (res.status === 200) {
            saveUserSession(res.data.id, null, res?.data?.profile);
            dispatch(setUserInfo(res.data?.profile));
            navigation.navigate("Posts");
        }

    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                {/* Profile Avatar */}
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120x120.png?text=Avatar' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.uploadIcon}>
                        <UploadIcon size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.phoneText}>{fullName}</Text>

                {/* Name */}
                <Text style={styles.label}>Name*</Text>
                <CustomTextInput
                    // icon="person-outline"
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                {/* Mobile */}
                <Text style={styles.label}>Mobile No.</Text>
                <CustomTextInput
                    // icon="call-outline"
                    placeholder="Mobile Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <CustomDropDown
                    label="Gender"
                    placeholder="Select Gender"
                    value={gender}
                    dropDownItems={["Male", "Female", "Other"]}
                    onSelect={setGender}
                    error={!gender}
                    errorMessage="Please select gender"
                />
                <CustomTextInput
                    label="Email Address"
                    // icon="mail-outline"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={!email}
                    errorMessage="Email is required"
                />

                {/* DOB */}
                <Text style={styles.label}>Description</Text>
                <CustomTextInput
                    // icon="calendar-outline"
                    placeholder="About You"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Submit */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                    <Text style={styles.submitText}>SUBMIT</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4267B2',
    },
    scrollContent: {
        padding: 20,
        // backgroundColor: '#fff'
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: '#fff'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    uploadIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#f57c00',
        borderRadius: 15,
        padding: 6,
    },
    phoneText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
        marginTop: 14,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        color: '#fff'
    },
    genderCheck: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        marginRight: 20,
    },
    submitButton: {
        backgroundColor: '#111827',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});

export default UpdateProfileScreen;
