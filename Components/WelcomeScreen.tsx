

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';




export default function WelcomeScreen({route, navigation}) {
	return (
		<View style={styles.container}>
			<Text>Welcome screen!</Text>
			<Button title='Sign in' onPress={() => {
				navigation.navigate('LoginScreen');
			}}></Button>
			<Button title='Sign up' onPress={() => {
				navigation.navigate('CreateAccountScreen');
			}}></Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

