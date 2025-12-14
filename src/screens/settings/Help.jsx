import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import SimpleHeader from "../../components/SimpleHeader";
import { TicketService } from "../../api/TicketService";

const Help = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [problem, setProblem] = useState("");
    const [tickets, setTickets] = useState([]);
    const [showAddTicket, setShowAddTicket] = useState(false);

    useEffect(() => {
        getAllTickets();
    }, []);

    const getAllTickets = async () => {
        try {
            const res = await TicketService.getAllTickets();
            if (res && Array.isArray(res?.data?.tickets)) {
                setTickets(res?.data?.tickets);
                // if no tickets, directly show add form
                if (res?.data?.tickets.length === 0) {
                    setShowAddTicket(true);
                }
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("Please enter a title for your grievance.");
            return;
        }
        if (!problem.trim()) {
            alert("Please explain your problem.");
            return;
        }
        try {
            await TicketService.addNewTickets(title, problem);
            setTitle("");
            setProblem("");
            getAllTickets(); // refresh after submitting
            setShowAddTicket(false); // go back to ticket list
        } catch (error) {
            console.error("Error submitting ticket:", error);
        }
    };

    const renderTicketCard = (ticket) => {
        const date = new Date(ticket.raised_date).toLocaleDateString();
        return (
            <View key={ticket.id} style={styles.card}>
                <Text style={styles.cardTitle}>{ticket.title}</Text>
                <Text style={styles.cardDate}>Raised on: {date}</Text>
                <Text style={styles.cardStatus}>
                    Status: <Text style={{ fontWeight: "600" }}>{ticket.status}</Text>
                </Text>
                <Text style={styles.cardContent}>{ticket.content}</Text>
                {ticket.reply && (
                    <Text style={styles.cardReply}>
                        Reply: <Text style={{ fontWeight: "500" }}>{ticket.reply}</Text>
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#7030A0" }}>
            <SimpleHeader title="Help & Support" onBack={() => navigation.goBack()} />
            <View style={{ flex: 1, backgroundColor: "#7030A0" }}>
                <ScrollView contentContainerStyle={styles.container}>
                    {showAddTicket ? (
                        <>
                            <Text style={styles.infoText}>
                                Please describe your issue below. We will try
                                to solve it as soon as possible.
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
                        </>
                    ) : (
                        <>
                            <Text style={styles.infoText}>
                                Below are your raised tickets.
                            </Text>

                            {/* Ticket List */}
                            {tickets.length > 0 ? (
                                <View style={{ marginBottom: 30 }}>
                                    <Text style={styles.sectionTitle}>Your Tickets</Text>
                                    {tickets.map(renderTicketCard)}
                                </View>
                            ) : null}

                            {/* Contact info */}
                            <Text style={styles.contactText}>
                                You can reach to us via mail{" "}
                                <Text style={styles.phone}>support@yoday.app</Text>
                            </Text>
                        </>
                    )}
                </ScrollView>

                {/* Floating Add Ticket Button (only if tickets exist and not in add form) */}
                {!showAddTicket && tickets.length > 0 && (
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => setShowAddTicket(true)}
                    >
                        <Text style={styles.fabText}>+ Add Ticket</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: "flex-start",
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#222",
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
    },
    cardDate: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    cardStatus: {
        fontSize: 13,
        color: "#444",
        marginBottom: 6,
    },
    cardContent: {
        fontSize: 14,
        color: "#333",
        marginBottom: 6,
    },
    cardReply: {
        fontSize: 13,
        color: "#1f6f8b",
        marginTop: 6,
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
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#1f6f8b",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    fabText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default Help;
