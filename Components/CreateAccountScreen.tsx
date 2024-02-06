
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useState} from 'react';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, addDoc, getFirestore, collection, setDoc, getDoc, QuerySnapshot, getDocs } from 'firebase/firestore';
import { ThemeContext } from '../hooks/useTheme';
const auth = getAuth();
const db = getFirestore();
export default function CreateAccountScreen() {
	const theme = useContext(ThemeContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [error, setError] = useState({
		isError: false,
		message: '',
	});

	async function signUp(){
		if(email === '' || password === ''){
			setError({isError: true, message: 'Need email and password!'});
			return -1;
		}
		const usernameExists = await checkUsername();
		if(usernameExists){
			setError({isError: true, message: 'Username already exists'});
			return -1;
		}
		try {
			const createdUser = await createUserWithEmailAndPassword(auth, email, password);
			await setDoc(doc(db, 'Users', `${createdUser.user.uid}`), {
				Username: username,
				PrivateChatRooms: [],
				CreatedAt: new Date(),
				uid: `${createdUser.user.uid}`,
				pfp: '',
			});
		}catch(err){
			setError({isError: true, message: err.message});
		}
	}

	async function checkUsername(){
		let exists = false;
		const users = await getDocs(collection(db, 'Users'));
		users.forEach((user) => {
			console.log('usernames: ', user.data().Username);
			if(user.data().Username === username){
				console.log('username exists');
				exists =  true;
			}
		});
		return exists;
	}


	return (
		<View style={[theme.container, {justifyContent: 'flex-start', paddingTop: 40}]}>
			{error.isError? (<Text style={styles.error}>
				{error.message}
			</Text>) : (<></>)}

			<Input 
				onChangeText={(text) => {
					setUsername(text);}}
				placeholder='Username'
				containerStyle={styles.input}
				style={{fontSize: 14, color: theme.text.color}}
			/>

			<Input onChangeText={(text) => {
				setEmail(text);
			}}
			placeholder='Email' leftIcon={
				<Icon name='envelope' size={16} color={theme.text.color}/>
			}
			containerStyle={styles.input} 
			style={{fontSize: 14, color: theme.text.color}}
			/>
      
			<Input 
				onChangeText={(text) => {
					setPassword(text);}}
				placeholder='Password'
				secureTextEntry={true}
				leftIcon={
					<Icon name='key' size={16} color={theme.text.color}/>
				}
				containerStyle={styles.input}
				style={{fontSize: 14, color: theme.text.color}}
			/>

			<Button title='Sign up' 
				containerStyle={styles.input}
				onPress={() => {
					signUp();
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
		width: '70%'
	},
	error: {
		color: '#fff',
		backgroundColor: '#D54826FF',
		padding: 10,
	}
});