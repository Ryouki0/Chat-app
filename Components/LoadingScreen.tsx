import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import { ThemeContext } from '../hooks/useTheme';
export default function LoadingScreen(){
    const theme = useContext(ThemeContext);
    return <View style={theme.container}>
       <Text style={{color: theme.text.color, fontSize: 30,}}>Loading...</Text> 
    </View>
}