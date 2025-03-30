import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('../../img/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.welcomeText}>ยินดีต้อนรับ</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 2, 
  },
  logo: {
    width: 220,
    height: 220,
  },
  bottomSection: {
    backgroundColor: '#FDDF1C',
    padding: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#141414',
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 5,
    marginBottom: 15,
  },
  loginText: {
    color: '#FFFAFA',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#FFFAFA',
    paddingVertical: 13,
    paddingHorizontal: 70,
    borderRadius: 5,
  },
  registerText: {
    color: '#141414',
    fontWeight: 'bold',
  },
});

export default Welcome;
