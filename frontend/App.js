import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import NavBar from './src/components/Navbar'; 

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DetailScreen from './src/screens/Home/DetailScreen';
import FavoriteScreen from './src/screens/Favorite/FavoriteScreen';
import Welcome from './src/screens/Welcome/Welcome';
import Register from './src/screens/Welcome/Register';
import Login from './src/screens/Welcome/Login';
import MyReviewScreen from './src/screens/Review/MyReviewScreen';
import DetailReviewScreen from './src/screens/Review/DetailReviewScreen';

import DetailListScreen from './src/screens/List/DetailListScreen';
import MyListScreen from './src/screens/List/MyListScreen';
import NewListScreen from './src/screens/List/NewListScreen';



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
        {/* เพิ่ม NavBar ใน Stack.Navigator */}
        <Stack.Screen
          name="Main"
          component={NavBar}
          options={({ route, navigation }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'หน้าแรก';
            return {
              title: getHeaderTitle(routeName),
              headerRight: () =>
                routeName === 'ที่บันทึกไว้' ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NewListScreen')} 
                    style={{ marginRight: 15 }}
                  >
                    <Ionicons name="add" size={28} color="#fff" />
                  </TouchableOpacity>
                ) : null
            };
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
        <Stack.Screen 
          name="MyReviewScreen" 
          component={MyReviewScreen} 
          options={{ title: 'รีวิวของฉัน' }} 
        />
        <Stack.Screen 
          name="NewListScreen" 
          component={NewListScreen} 
          options={{ title: 'เพิ่มรายการใหม่' }} 
        />
        <Stack.Screen 
          name="MyListScreen" 
          component={MyListScreen} 
          options={{ title: 'รายการของฉัน' }} 
        />
        <Stack.Screen 
          name="DetailListScreen" 
          component={DetailListScreen} 
          options={{ title: 'รายการของฉัน' }} 
        />

        <Stack.Screen 
          name="ReviewDetail"
          component={DetailReviewScreen}
          options={{ title: 'รายละเอียดรีวิว' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
