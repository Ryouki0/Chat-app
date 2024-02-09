

import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ThemeContext, Theme } from '../../hooks/useTheme';
export default function WelcomeScreen({route, navigation}) {
	const theme = useContext<Theme>(ThemeContext);
	console.log('theme: ', theme);

	return (
		<View style={[theme.container]}>
			<Button title='Sign in' onPress={() => {
				navigation.navigate('LoginScreen');
			}}></Button>
			<Button title='Sign up' onPress={() => {
				navigation.navigate('CreateAccountScreen');
			}}></Button>	
		</View>
	);
}


