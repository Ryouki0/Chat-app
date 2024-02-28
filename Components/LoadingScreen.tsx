import React from 'react';
import {View, Text, StatusBar, StatusBarStyle} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { darkTheme, lightTheme } from '../constants/theme';
export default function LoadingScreen(){
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	let statusBarStyle: StatusBarStyle = 'default';
	let statusBarColor = 'white';
	if(themeState === 'darkTheme'){
		statusBarStyle='light-content';
		statusBarColor = 'black';
	}else{
		statusBarStyle = 'dark-content';

	}

	return <View style={[theme.container, {justifyContent: 'center'}]}>
		<StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor}></StatusBar>
		<Text style={{color: theme.primaryText.color, fontSize: 30,}}>Loading...</Text> 
	</View>;
}