import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import NavBar from './src/components/Navbar'; 
import DetailScreen from './src/screens/Home/DetailScreen';
import FavoriteScreen from './src/screens/Favorite/FavoriteScreen';
import Welcome from './src/screens/Welcome/Welcome';
import Register from './src/screens/Welcome/Register';
import Login from './src/screens/Welcome/Login';

const Stack = createStackNavigator();

const getHeaderTitle = (routeName) => {
  switch (routeName) {
    case 'หน้าแรก': return 'หน้าแรก';
    case 'ถูกใจ': return 'ร้านที่ถูกใจ';
    case 'เพิ่มรีวิว': return 'โพสใหม่';
    case 'ที่บันทึกไว้': return 'รายการของฉัน';
    case 'รีวิวของฉัน': return 'รีวิวของฉัน';
    case 'DetailScreen': return 'รายละเอียด';
    default: return 'แอปของฉัน';
  }
};

const App = () => {
  const [favoritePlaces, setFavoritePlaces] = useState([]); // เก็บรายการร้านที่ถูกใจ

  const addToFavorites = (place) => {
    setFavoritePlaces((prev) => {
      if (!prev.some((item) => item.placeId === place.placeId)) {
        return [...prev, place];
      }
      return prev;
    });
  };

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
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'เข้าสู่ระบบ' }} 
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: 'ลงทะเบียน' }} 
        />
        <Stack.Screen
          name="Main"
          component={NavBar}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'หน้าแรก';
            return { title: getHeaderTitle(routeName) };
          }}
        />
        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{ title: 'รายละเอียด' }}
          initialParams={{ addToFavorites }}
        />
        <Stack.Screen
          name="FavoriteScreen"
          component={FavoriteScreen}
          initialParams={{ favoritePlaces }} // ส่ง favoritePlaces ไปที่ FavoriteScreen
          listeners={({ navigation }) => ({
            focus: () => {
              // รีเฟรชเมื่อกลับมาที่หน้าจอ FavoriteScreen
              navigation.setParams({ favoritePlaces });
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
