import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import SimpleHeader from '../../components/SimpleHeader';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get("window");

const Contact = ({ navigation }) => {
    const supportEmail = "support@yoday.app";
    const websiteUrl = "https://www.yoday.app";

    const handleReportTicket = () => {
        navigation.navigate("Help")
    };

    const handleVisitWebsite = () => {
        Linking.openURL(websiteUrl);
    };

    return (
        <View style={styles.container}>
            <SimpleHeader title="Contact Us" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <Text style={styles.heading}>Need Help?</Text>
                <Text style={styles.description}>
                    You can reach out to our support team at:
                </Text>
                <Text style={styles.email}>{supportEmail}</Text>

                <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleReportTicket}>
                    <LinearGradient
                        colors={['#3b5998', '#192f6a']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Report a Ticket</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleVisitWebsite}>
                    <LinearGradient
                        colors={['#28a745', '#218838']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Visit Website</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
    },
    content: {
        marginTop: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3b5998',
        marginBottom: 30,
    },
    button: {
        width: width * 0.85,
        borderRadius: 25,
        marginBottom: 20,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Contact;
