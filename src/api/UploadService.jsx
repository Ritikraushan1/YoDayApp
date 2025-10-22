import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';
import { UserService } from "./UserService";

async function uploadImageAndGetUrl(image) {
    try {
        if (!image || !image.uri) {
            throw new Error("No image provided");
        }
        const user = await UserService.getUserInformation()
        let token = user.token;

        // FormData for file upload
        const formData = new FormData();
        formData.append("image", {
            uri: Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
            name: image.name || "photo.jpg",
            type: image.type || "image/jpeg",
        });

        // Call your Node backend
        const response = await axios.post(
            `${Config.API_URL}${YDAPI.UPLOAD_IMAGES}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            }
        );

        const data = response.data;

        if (!data.success) {
            throw new Error(data.message || "Image upload failed");
        }

        return data.url; // URL returned by your Node backend (S3 link)
    } catch (error) {
        console.error("Upload image error:", error.message);
        throw error;
    }
}

export const UploadService = {
    uploadImageAndGetUrl
}