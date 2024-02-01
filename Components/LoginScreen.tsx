
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

export default function LoginScreen() {

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
		}catch(err){
			setError({isError: true, message: err.message});
		}
	}


	return (
		<View style={styles.container}>
			{error.isError? (<Text style={styles.error}>
				{error.message}
			</Text>) : (<></>)}
			<Input onChangeText={(text) => {
				setEmail(text);
			}} placeholder='Email' leftIcon={
				<Icon name='envelope' size={16} />}
			containerStyle={styles.input}  style={{fontSize: 14}}/>
      
			<Input 
				onChangeText={(text) => {
					setPassword(text);}}
				placeholder='Password'
				secureTextEntry={true}
				leftIcon={
					<Icon name='key' size={16}/>
				}
				containerStyle={styles.input} style={{fontSize: 14}}
			/>

			<Button title='Sign in' 
				containerStyle={styles.input}
				onPress={() => {
					signIn();
				}}/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
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