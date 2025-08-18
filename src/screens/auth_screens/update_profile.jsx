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
import { Icon, CheckBox } from '@rneui/themed';
import CustomTextInput from '../../components/CustomTextInput';

const UpdateProfileScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('Pradeep');
    const [phone, setPhone] = useState('+91-9838959106');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Male');
    const [dob, setDob] = useState('10-August-1989');
    const [tob, setTob] = useState('06:00 PM');
    const [pob, setPob] = useState('');

    const handleSave = () => {
        navigation.navigate("Posts");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Avatar */}
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120x120.png?text=Avatar' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.uploadIcon}>
                        <Icon name="upload" type="feather" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.phoneText}>{phone}</Text>

                {/* Name */}
                <Text style={styles.label}>Name*</Text>
                <CustomTextInput
                    icon="person-outline"
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                {/* Mobile */}
                <Text style={styles.label}>Mobile No.</Text>
                <CustomTextInput
                    icon="call-outline"
                    placeholder="Mobile Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                {/* Gender */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                    {['Male', 'Female', 'Others'].map((item) => (
                        <CheckBox
                            key={item}
                            title={item}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={gender === item}
                            onPress={() => setGender(item)}
                            containerStyle={styles.genderCheck}
                            textStyle={{ fontSize: 14, fontWeight: '500', color: '#fff' }}
                        />
                    ))}
                </View>

                {/* DOB */}
                <Text style={styles.label}>Date of Birth</Text>
                <CustomTextInput
                    icon="calendar-outline"
                    placeholder="DD-MM-YYYY"
                    value={dob}
                    onChangeText={setDob}
                />

                {/* Time of Birth */}
                <Text style={styles.label}>Time of Birth</Text>
                <CustomTextInput
                    icon="time-outline"
                    placeholder="HH:MM"
                    value={tob}
                    onChangeText={setTob}
                />

                {/* Place of Birth */}
                <Text style={styles.label}>Place of Birth</Text>
                <CustomTextInput
                    icon="location-outline"
                    placeholder="City / Town"
                    value={pob}
                    onChangeText={setPob}
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
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 10,
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
