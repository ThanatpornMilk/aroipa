import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import SearchBox from "../../components/SearchBox";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (!username || !password) {
            Alert.alert('ลงทะเบียนไม่สำเร็จ', 'กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        Alert.alert('ลงทะเบียนสำเร็จ');
        navigation.navigate('Login'); // กลับไปหน้า Login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ลงทะเบียน</Text>
            <SearchBox 
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <SearchBox 
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <CustomButton 
                title="ลงทะเบียน"
                backgroundColor="#EE799F"
                onPress={handleRegister}
            />
            <CustomButton 
                title="เข้าสู่ระบบ"
                backgroundColor="#CD6889"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: '#EEE0E5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default Register;
