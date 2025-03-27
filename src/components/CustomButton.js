import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, backgroundColor }) => {
    return (
        <TouchableOpacity 
            style={[Styles.Button, { backgroundColor }]}
            onPress={onPress}
        >
            <Text style={Styles.Text}>{title}</Text>
        </TouchableOpacity>
    );
};

const Styles = StyleSheet.create({
    Button: {
        padding: 8,
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 5,
    },
    Text: {
        fontSize: 16,
        color: 'white',
    },
});

export default CustomButton;
