import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import SearchBox from "../../components/SearchBox";
import { registerUser } from "../../services/api";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const handleRegister = async () => {
        try {
            await registerUser(username, password);
            Alert.alert("ลงทะเบียนสำเร็จ", "โปรดเข้าสู่ระบบด้วยบัญชีของคุณ");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("ลงทะเบียนล้มเหลว", error.message);
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
                title="ลงทะเบียน"
                backgroundColor="#FDDF1C"
                textColor="#000"
                onPress={handleRegister}
            />
            <CustomButton 
                title="กลับไปหน้าเข้าสู่ระบบ"
                backgroundColor="#FF8A02"
                textColor="#000"
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
        backgroundColor: '#141414',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default Register;
