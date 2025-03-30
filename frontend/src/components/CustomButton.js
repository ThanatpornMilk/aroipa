import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, backgroundColor, onPress, textColor = '#fff' }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, { backgroundColor }]} 
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default CustomButton;
