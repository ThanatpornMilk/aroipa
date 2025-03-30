import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import SearchBox from "../../components/SearchBox";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const handleRegister = () => {
        if (!username || !password) {
            Alert.alert('ลงทะเบียนไม่สำเร็จ', 'กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        Alert.alert('ลงทะเบียนสำเร็จ');
        navigation.navigate('Login'); 
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
