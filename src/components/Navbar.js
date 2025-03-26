import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/Home/HomeScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import MyListScreen from '../screens/List/MyListScreen';
import NewPostScreen from '../screens/Review/NewPostScreen';
import MyReviewScreen from '../screens/Review/MyReviewScreen';

const Tab = createBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // ซ่อน header
        tabBarStyle: { backgroundColor: '#212329' },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: '#A9A4B0',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'หน้าแรก') iconName = 'home';
          else if (route.name === 'ถูกใจ') iconName = 'heart';
          else if (route.name === 'เพิ่มรีวิว') iconName = 'add-circle';
          else if (route.name === 'ที่บันทึกไว้') iconName = 'bookmark';
          else if (route.name === 'รีวิวของฉัน') iconName = 'chatbubble';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="หน้าแรก" component={HomeScreen} />
      <Tab.Screen name="ถูกใจ" component={FavoriteScreen} />
      <Tab.Screen name="เพิ่มรีวิว" component={NewPostScreen} />
      <Tab.Screen name="ที่บันทึกไว้" component={MyListScreen} />
      <Tab.Screen name="รีวิวของฉัน" component={MyReviewScreen} />
    </Tab.Navigator>
  );
};

export default NavBar;
