import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import { ThemeContext } from '../hooks/useTheme';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { darkTheme, lightTheme } from '../constants/theme';
export default function LoadingScreen(){
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	return <View style={[theme.container, {justifyContent: 'center'}]}>
		<Text style={{color: theme.primaryText.color, fontSize: 30,}}>Loading...</Text> 
	</View>;
}