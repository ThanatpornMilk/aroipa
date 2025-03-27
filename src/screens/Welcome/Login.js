import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import SearchBox from "../../components/SearchBox";

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert('เข้าสู่ระบบไม่สำเร็จ', 'กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        Alert.alert('เข้าสู่ระบบสำเร็จ');
        navigation.navigate('Main', { username });
    };

    return (
        <View style={styles.container}>
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
                title="เข้าสู่ระบบ"
                backgroundColor="#5CACEE"
                onPress={handleLogin}
            />
            <CustomButton 
                title="ลงทะเบียน"
                backgroundColor="#4F94CD"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: '#E0FFFF',
    }
});

export default Login;
