import React from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';

const { width, height } = Dimensions.get('window');

const ImageModal = ({ show, closeModal, file, text }) => {
    return (
        <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}
        >
            <View style={styles.container}>
                {/* Image Display */}
                {file ? (
                    <Image
                        source={{ uri: file }}
                        resizeMode="contain"
                        style={styles.imageViewer}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No Image Available</Text>
                    </View>
                )}

                {/* Close Button */}
                <TouchableOpacity
                    delayPressIn={0}
                    onPress={closeModal}
                    style={styles.closeButton}
                >
                    <Feather size={30} name="x" color={'#fff'} />
                </TouchableOpacity>

                {/* Optional Text Overlay */}
                {text ? (
                    <View style={styles.centeredTextWrapper}>
                        <Text style={styles.centeredText}>{text}</Text>
                    </View>
                ) : null}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageViewer: {
        width: width,
        height: height,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#ccc',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 25,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 4,
    },
    centeredTextWrapper: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
    },
    centeredText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ImageModal;
