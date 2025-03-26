import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import NavBar from './src/components/Navbar'; // Import NavBar
import DetailScreen from './src/screens/Home/DetailScreen';

const Stack = createStackNavigator();

const getHeaderTitle = (routeName) => {
  switch (routeName) {
    case 'หน้าแรก': return 'หน้าแรก';
    case 'ถูกใจ': return 'ร้านที่ถูกใจ';
    case 'เพิ่มรีวิว': return 'โพสใหม่';
    case 'ที่บันทึกไว้': return 'รายการของฉัน';
    case 'รีวิวของฉัน': return 'รีวิวของฉัน';
    case 'DetailScreen': return 'รายละเอียด'; // ถ้ามีการใช้ DetailScreen
    default: return 'แอปของฉัน';
  }
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FF8A02' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold' }
        }}
      >
        {/* เพิ่ม NavBar ใน Stack.Navigator */}
        <Stack.Screen
          name="Main"
          component={NavBar}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'หน้าแรก';
            return { title: getHeaderTitle(routeName) };
          }}
        />
        {/* เพิ่มหน้าจอ DetailScreen */}
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'รายละเอียด' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
