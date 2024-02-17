

import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Input, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ThemeContext, Theme } from '../../hooks/useTheme';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { lightColors } from '@rneui/base';
import { darkTheme, lightTheme } from '../../constants/theme';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { registerForPushNotificationsAsync } from '../../notification';
const auth = getAuth();
const db = getFirestore();
export default function WelcomeScreen({route, navigation}) {
	const themeState = useSelector((state:RootState) => {return state.themeSlice.theme});
	const theme = themeState ==='lightTheme' ? lightTheme : darkTheme;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState({
		isError: false,
		message: '',
	});

	async function signIn(){
		if(email === '' || password === ''){
			setError({isError: true, message: 'Need email and password'});
			return -1;
		}
		try {
			await signInWithEmailAndPassword(auth, email, password);
			const token = registerForPushNotificationsAsync();
			updateDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {signedIn: true, expoPushToken: token})
		}catch(err){
			setError({isError: true, message: err.message});
		}
	}

	return (
		<View style={[theme.container, {justifyContent: 'flex-start', paddingTop: 40}]}>

			{error.isError && <Text style={styles.error}>{error.message}</Text>}

			<Input onChangeText={(text) => {
				setEmail(text);
			}} placeholder='Email' leftIcon={
				<Icon name='envelope' size={16} 
					color={theme.primaryText.color} />
			}
			containerStyle={styles.input} 
			 style={{fontSize: 14, color: theme.primaryText.color}}/>
      
			<Input 
				onChangeText={(text) => {
					setPassword(text);}
				}
				placeholder='Password'
				secureTextEntry={true}
				leftIcon={
					<Icon name='key' size={16} color={theme.primaryText.color}/>
				}
				containerStyle={styles.input} style={{fontSize: 14, color: theme.primaryText.color}}
			/>

			<Text style={{color: theme.primaryText.color, marginBottom: 10, width: '70%'}}>
				Don't have an account? {'\t'}
				<Text style={{color: '#007FFF', fontStyle: 'italic'}}onPress={() => {navigation.navigate('CreateAccountScreen')}}>
					Sign up
				</Text>
			</Text>

			<Button title='Login' 
				containerStyle={styles.input}
				onPress={() => {
					signIn();
				}}/>
				
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		paddingTop: 40,
	},
	input: {
		width: '70%',
		fontSize: 10,
	},
	error: {
		color: '#fff',
		backgroundColor: '#D54826FF',
		padding: 10,
	}
});
