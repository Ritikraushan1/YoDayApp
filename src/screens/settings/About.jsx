import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
} from "react-native";
import SimpleHeader from "../../components/SimpleHeader";
import Swiper from "react-native-swiper";
import { CommunityIllustration } from "../../assets/icon/MenuIcons";

const { width, height } = Dimensions.get("window");

const slides = [
    {
        id: 1,
        title: "Welcome to Our App",
        description:
            "Discover a new way to connect. Our app lets the community engage with posts made by owners.",
    },
    {
        id: 2,
        title: "Posts by Owners",
        description:
            "Only the platform owners can create posts. You always see meaningful & quality content.",
    },
    {
        id: 3,
        title: "Engage with Content",
        description:
            "Like, dislike, and comment to share your thoughts with others. It’s that simple!",
    },
    {
        id: 4,
        title: "Join the Community",
        description:
            "Be part of a growing network. Stay connected, enjoy discussions, and engage responsibly.",
    },
];

const About = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SimpleHeader title="About Us" onBack={() => navigation.goBack()} />

            <Swiper
                style={styles.wrapper}
                loop={false}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <CommunityIllustration />

                        <View style={styles.card}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.description}>{slide.description}</Text>

                            {slide.id === 4 && (
                                <Pressable
                                    style={styles.button}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={styles.buttonText}>Get Started</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f4f9ff",
    },
    image: {
        width: width * 0.8,
        height: height * 0.35,
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        width: "90%",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1f6f8b",
        marginBottom: 12,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 20,
    },
    dot: {
        backgroundColor: "rgba(0,0,0,.2)",
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: "#1f6f8b",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#1f6f8b",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default About;
