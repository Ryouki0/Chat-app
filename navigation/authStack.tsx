
import react from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../Components/LoginScreen';
import CreateAccountScreen from '../Components/CreateAccountScreen';
import WelcomeScreen from '../Components/WelcomeScreen';

const Stack = createStackNavigator();

export default function AuthStack(){
    return (
        <NavigationContainer>
             <Stack.Navigator initialRouteName='WelcomeScreen'>
                <Stack.Screen name='LoginScreen' component={LoginScreen}></Stack.Screen>
                <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen}></Stack.Screen>
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}