import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import SearchBox from "../../components/SearchBox";
import { loginUser } from "../../services/api";

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const handleLogin = async () => {
        try {
            const token = await loginUser(username, password);
            Alert.alert("เข้าสู่ระบบสำเร็จ", "กำลังนำคุณไปยังหน้าแรก...", [
                { text: "OK", onPress: () => navigation.navigate("Main") }
            ]);
        } catch (error) {
            Alert.alert("เข้าสู่ระบบล้มเหลว", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <SearchBox 
                placeholder="ชื่อผู้ใช้"
                value={username}
                onChangeText={setUsername}
                backgroundColor="#F0F8FF"
                iconColor="#141414"
                textColor="#333"
            />
            <SearchBox 
                placeholder="รหัสผ่าน"
                secureTextEntry={!isPasswordVisible} 
                value={password}
                onChangeText={setPassword}
                backgroundColor="#F0F8FF"
                iconColor="#141414"
                textColor="#888"
                rightIcon={{
                    name: isPasswordVisible ? 'eye-off' : 'eye', 
                    size: 24,
                    color: '#141414', 
                    onPress: () => setIsPasswordVisible(!isPasswordVisible), 
                }}
            />
            <CustomButton 
                title="เข้าสู่ระบบ"
                backgroundColor="#FF8A02"
                textColor="#000"
                onPress={handleLogin}
            />
            <CustomButton 
                title="ลงทะเบียน"
                backgroundColor="#FDDF1C"
                textColor="#000"
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
        backgroundColor: '#141414',
    }
});

export default Login;
