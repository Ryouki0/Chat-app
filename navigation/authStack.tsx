
import React, { useContext } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccountScreen from '../Components/authStack/CreateAccountScreen';
import WelcomeScreen from '../Components/authStack/WelcomeScreen';
import { ThemeContext } from '../hooks/useTheme';
import { Button } from 'react-native-elements';
import ThemeChange from '../Components/ThemeChange';
import { StatusBar, StatusBarStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { darkTheme, lightTheme } from '../constants/theme';
const Stack = createStackNavigator();

export default function AuthStack(){
    const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
    const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
    let statusBarStyle: StatusBarStyle = 'default';
    let statusBarColor = 'white';
    let navigationTheme = null;
    if(themeState === 'darkTheme'){
        navigationTheme = DarkTheme;
        statusBarStyle='light-content';
        statusBarColor = 'black';
    }else{
        navigationTheme = DefaultTheme;
        statusBarStyle = 'dark-content';

    }
    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor}></StatusBar>
             <Stack.Navigator initialRouteName='WelcomeScreen' >
                
                <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen} options={({ route }) => (
                    {headerStyle:{
                        backgroundColor: theme.container.backgroundColor,
                    },
                    title: 'Create Account', 
                    headerTintColor: theme.primaryText.color,
                    headerRight: () => <ThemeChange />
                    })
                }></Stack.Screen>
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={({ route }) => (
                    {headerStyle:{
                            backgroundColor: theme.container.backgroundColor,
                        },
                        title: 'Welcome', 
                        headerTintColor: theme.primaryText.color,
                        headerRight: () => <ThemeChange />
                        }
                )}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}