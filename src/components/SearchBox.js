import React from "react";
import { View, StyleSheet, TextInput} from "react-native";

const SearchBox = ({placeholder, value, onChangeText, secure}) => {

  return (
    <View style={styles.container}>
        <TextInput 
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secure}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",  
        backgroundColor: '#f9f9f9',
        marginVertical: 5,  
        flexDirection: "row",
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
  },
});

export default SearchBox;
