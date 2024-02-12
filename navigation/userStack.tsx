
import Rract, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import Chats from '../Components/userStack/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Components/userStack/ProfileScreen';
import ChatRoom from '../Components/userStack/ChatRoom';
import { ThemeContext } from '../hooks/useTheme';
import ThemeChange from '../Components/ThemeChange';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ChatRoomHeader from '../Components/userStack/ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
const Tab = createBottomTabNavigator();

export default function UserStack(){

    const theme = useContext(ThemeContext);
    let navigationTheme = null;
    if(theme.isDark){
        navigationTheme = DarkTheme;
    }else{
        navigationTheme = DefaultTheme;
    }

    return (
        <>
        <StatusBar ></StatusBar>
            <NavigationContainer theme={navigationTheme}>
             <Tab.Navigator screenOptions={({route}) => (
                {
                    tabBarIcon: ({focused, color, size}) => {
                        if(route.name === 'Chats'){
                            return <Ionicons name='chatbubble-ellipses' size={27} color={color}></Ionicons>
                        }else if(route.name === 'Profile'){
                            return <Ionicons name='person-circle' size={27} color={color}></Ionicons>
                        }
                    }
                }
             )}>
                <Tab.Screen name='Chats' component={Chats} options={({route}) => (
                    {
                        headerRight: () => <ThemeChange></ThemeChange>
                    })}>
                </Tab.Screen>
                <Tab.Screen name='Profile' component={Profile} options={({route}) => (
                    {
                        headerRight: () => <ThemeChange></ThemeChange>
                    }
                )}></Tab.Screen>
                <Tab.Screen name='ChatRoom' component={ChatRoom} options={({route}) => ({
                    tabBarButton:(props) => null,
                    headerTitle: (props) => {return <ChatRoomHeader params={route.params}></ChatRoomHeader>},
                })}></Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
        </>
        
    )
}