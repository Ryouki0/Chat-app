
import react from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Chats from '../Components/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Components/ProfileScreen';
import ChatRoom from '../Components/ChatRoom';
const Tab = createBottomTabNavigator();

export default function UserStack(){
    return (
        <NavigationContainer>
             <Tab.Navigator>
                <Tab.Screen name='Chats' component={Chats}></Tab.Screen>
                <Tab.Screen name='Profile' component={Profile} ></Tab.Screen>
                <Tab.Screen name='ChatRoom' component={ChatRoom} options={{tabBarButton:(props) => null}}></Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}