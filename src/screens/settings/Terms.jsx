import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { WebView } from "react-native-webview";
import SimpleHeader from "../../components/SimpleHeader";

const Terms = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState("terms");

    // Replace these with your actual hosted URLs
    const TERMS_URL = "https://yoday.app/terms-conditions.html";
    const PRIVACY_URL = "https://yoday.app/privacy-policy.html";

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SimpleHeader
                title="Terms of Use & Privacy"
                onBack={() => navigation.goBack()}
            />

            <View style={{ backgroundColor: "#4267b2", flex: 1 }}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        flex: 1,
                    }}
                >
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
                                TERMS OF USE
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

                    {/* WebView Section */}
                    <View style={{ flex: 1, overflow: "hidden", borderRadius: 10 }}>
                        <WebView
                            source={{
                                uri: selectedTab === "terms" ? TERMS_URL : PRIVACY_URL,
                            }}
                            startInLoadingState
                            style={{ flex: 1, marginTop: -110 }}
                            javaScriptEnabled
                            domStorageEnabled
                            showsVerticalScrollIndicator={false}
                            scalesPageToFit
                        />
                    </View>
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
});

export default Terms;
