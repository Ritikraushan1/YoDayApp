import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import SimpleHeader from "../../components/SimpleHeader";

const Terms = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState("terms");

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SimpleHeader
                title="Terms and Condition"
                onBack={() => navigation.goBack()}
            />
            <View style={{ backgroundColor: "#4267b2" }}>
                <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: 0 }}>

                    {/* Tab Buttons */}
                    <View style={styles.tabContainer}>
                        <Pressable
                            style={[
                                styles.tabButton,
                                selectedTab === "terms" && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab("terms")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "terms" && styles.activeTabText,
                                ]}
                            >
                                TERMS & CONDITIONS
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.tabButton,
                                selectedTab === "privacy" && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab("privacy")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "privacy" && styles.activeTabText,
                                ]}
                            >
                                PRIVACY POLICY
                            </Text>
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        {selectedTab === "terms" ? (
                            <>
                                <Text style={styles.heading}>Terms & Conditions</Text>
                                <Text style={styles.body}>
                                    Welcome to our platform! By accessing or using our social media
                                    app, you agree to be bound by these Terms and Conditions.{"\n\n"}
                                    1. You must be at least 13 years old to use the app.{"\n"}
                                    2. You are responsible for the content you post and must not
                                    violate any laws or rights of others.{"\n"}
                                    3. We may suspend or terminate accounts that violate these rules.{"\n"}
                                    4. Your use of the app is at your own risk.{"\n\n"}
                                    Please read these Terms carefully before using the app.
                                </Text>
                                <Text style={styles.lastUpdated}>Last updated: August 19, 2025</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.heading}>Privacy Policy</Text>
                                <Text style={styles.body}>
                                    Your privacy is important to us. This Privacy Policy explains how
                                    we collect, use, and protect your personal information.{"\n\n"}
                                    1. We may collect your name, email, and profile data to improve
                                    our services.{"\n"}
                                    2. We do not sell your data to third parties.{"\n"}
                                    3. We may share limited information with trusted service providers
                                    to operate our platform.{"\n"}
                                    4. You can delete your account anytime and request removal of your
                                    data.{"\n\n"}
                                    By using our app, you consent to this Privacy Policy.
                                </Text>
                                <Text style={styles.lastUpdated}>Last updated: August 19, 2025</Text>
                            </>
                        )}
                    </ScrollView>
                </View>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        overflow: "hidden",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#555",
    },
    activeTab: {
        backgroundColor: "#1f6f8b",
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "600",
    },
    contentContainer: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },
    body: {
        fontSize: 14,
        lineHeight: 22,
        color: "#444",
    },
    lastUpdated: {
        marginTop: 20,
        fontSize: 12,
        color: "#888",
    },
});

export default Terms;
