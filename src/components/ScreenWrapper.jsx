import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    View,
} from 'react-native';

const ScreenWrapper = ({ children, style, behavior = Platform.OS === 'ios' ? 'padding' : 'height', keyboardVerticalOffset = 0 }) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, style]}>
                <KeyboardAvoidingView
                    behavior={behavior}
                    style={styles.flex}
                    keyboardVerticalOffset={keyboardVerticalOffset}
                >
                    {children}
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
});

export default ScreenWrapper;
