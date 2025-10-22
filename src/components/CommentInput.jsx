import React, { useState } from "react";
import {
    View,
    TextInput,
    Pressable,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    Image,
    ActivityIndicator,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { UploadService } from "../api/UploadService";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const CommentInput = ({ onSend }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleAttachImage = async () => {
        try {
            console.log("📂 Opening image picker...");
            let permissionResult;
            if (Platform.OS === "android") {
                const androidPermission =
                    Platform.Version >= 33
                        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Android 13+
                        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // Below 13

                permissionResult = await check(androidPermission);
                if (permissionResult !== RESULTS.GRANTED) {
                    permissionResult = await request(androidPermission);
                    if (permissionResult !== RESULTS.GRANTED) return;
                }
            }

            launchImageLibrary(
                { mediaType: "photo", maxWidth: 800, maxHeight: 800, quality: 0.8 },
                async (response) => {
                    if (response.didCancel) return;
                    if (response.errorCode) {
                        console.error("⚠️ ImagePicker Error:", response.errorMessage);
                        return;
                    }

                    const selectedImage = response.assets[0];
                    console.log("✅ Image selected:", selectedImage.uri);

                    setUploading(true); // show loader while uploading

                    try {
                        const url = await UploadService.uploadImageAndGetUrl(selectedImage);
                        console.log("☁️ Uploaded image URL:", url);
                        setImage(url);
                    } catch (err) {
                        console.error("🚨 Upload failed:", err);
                    } finally {
                        setUploading(false); // stop loader
                    }
                }
            );
        } catch (err) {
            console.warn("🚨 Error attaching image:", err);
        }
    };

    const handleSend = () => {
        console.log("handle send clicked");

        if (!text.trim() && !image) {
            console.log("⚠️ Nothing to send (empty text & no image).");
            return;
        }
        onSend({ text, image });
        setText("");
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={text}
                onChangeText={setText}
            />

            {/* Attach or Preview */}
            {uploading ? (
                <View style={styles.attachBtn}>
                    <ActivityIndicator size="small" color="#007BFF" />
                </View>
            ) : image ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <Pressable
                        style={styles.removeImage}
                        onPress={() => setImage(null)}
                    >
                        <Text style={styles.removeText}>✕</Text>
                    </Pressable>
                </View>
            ) : (
                <TouchableOpacity style={styles.attachBtn} onPress={handleAttachImage}>
                    <Text style={styles.attachText}>＋</Text>
                </TouchableOpacity>
            )}

            {/* Send button */}
            <Pressable style={styles.sendBtn} onPress={handleSend}>
                <Text style={styles.sendText}>Send</Text>
            </Pressable>
        </View>
    );
};

export default CommentInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F3F5",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginTop: 8,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        fontSize: 14,
    },
    attachBtn: {
        marginLeft: 8,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    attachText: { fontSize: 18, color: "#007BFF", fontWeight: "bold" },
    sendBtn: {
        marginLeft: 8,
        backgroundColor: "#007BFF",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    sendText: { color: "#fff", fontWeight: "bold" },

    // Image preview styles
    imagePreviewContainer: {
        position: "relative",
        marginLeft: 8,
    },
    imagePreview: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    removeImage: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 2,
        elevation: 2,
    },
    removeText: {
        fontSize: 12,
        color: "#FF0000",
        fontWeight: "bold",
    },
});
