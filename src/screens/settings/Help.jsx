import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";
import SimpleHeader from "../../components/SimpleHeader";

const Help = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [problem, setProblem] = useState("");

    const handleSubmit = () => {
        console.log("Grievance submitted:", { title, problem });
        // here you can call API to submit grievance
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SimpleHeader title="Help & Support" onBack={() => navigation.goBack()} />
            <View style={{ flex: 1, backgroundColor: "#4267B2" }}>

                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.infoText}>
                        If you are experiencing any issues, please let us know. We will try
                        to solve them as soon as possible.
                    </Text>

                    {/* Title input */}
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add your grievance title here"
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Problem input */}
                    <Text style={styles.label}>Explain the problem</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your query here"
                        value={problem}
                        onChangeText={setProblem}
                        multiline
                        numberOfLines={5}
                    />

                    {/* Submit button */}
                    <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>SUBMIT</Text>
                    </Pressable>

                    {/* Contact info */}
                    <Text style={styles.contactText}>
                        You can contact us on this number{" "}
                        <Text style={styles.phone}>1234567892</Text>
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: "flex-start",
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        marginTop: 12,
        color: "#222",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: "#f9f9f9",
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    submitBtn: {
        backgroundColor: "#1f6f8b",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    contactText: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 13,
        color: "#666",
    },
    phone: {
        color: "#007bff",
        textDecorationLine: "underline",
    },
});

export default Help;
