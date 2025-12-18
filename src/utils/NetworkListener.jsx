import { useEffect, useState, useRef } from "react";
import { BackHandler } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AlertModal from "../components/AlertModal";

export default function NetworkListener() {
    const [visible, setVisible] = useState(false);
    const isAlertShown = useRef(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const isOffline =
                !state.isConnected || state.isInternetReachable === false;

            if (isOffline && !isAlertShown.current) {
                isAlertShown.current = true;
                setVisible(true);
            }

            if (!isOffline) {
                isAlertShown.current = false;
                setVisible(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleRetry = async () => {
        const state = await NetInfo.fetch();
        const isOffline =
            !state.isConnected || state.isInternetReachable === false;

        if (!isOffline) {
            isAlertShown.current = false;
            setVisible(false);
        }
        // if still offline → modal stays open
    };

    const handleExit = () => {
        BackHandler.exitApp();
    };

    return (
        <AlertModal
            visible={visible}
            alertText="No Internet Connection. Please check your network."
            showCancel={true}
            showOk={true}
            cancelText="Exit"
            okText="Retry"
            onCancel={handleExit}
            onOk={handleRetry}
            onClose={() => { }}
        />
    );
}
