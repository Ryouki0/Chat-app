
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { User, getAuth, signOut } from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'; 
import { getDoc } from 'firebase/firestore';
import getAllUsers from '../utils/getAllUsers';
import StorageImage from './StorageImage';
import { useFocusEffect } from '@react-navigation/native';
import createChatRoom from '../utils/createChatRoom';

const auth = getAuth();
const db = getFirestore();
interface user{
	pfp: string, 
	name: string, 
	uid: string
}
async function getUser() {
	const docRef = doc(db, 'Users', `${auth.currentUser.uid}`);
	const docSnap = await getDoc(docRef);
	return docSnap.data();
}

export default function Chats({route, navigation}) {

	const [currentUser, setCurrentUser] = useState(null);
	const [allUsers, setAllUsers] = useState(null);

  
	useFocusEffect(
		React.useCallback(() => {
			async function getUsers() {
				setAllUsers(await getAllUsers(auth));
				setCurrentUser(await getUser());
			}
			getUsers();
		}, [])
	);


	return (
		<ScrollView>
			{allUsers ? (
				allUsers.map((user: user, idx: number) => {
					
					return <TouchableOpacity key={idx} onPress={() => {
						createChatRoom(currentUser.uid, user.uid, navigation)
					}}>
						<View  style={{flexDirection: 'row', alignItems: 'center'}}>
						<StorageImage imagePath={user.pfp} style={styles.image} />
						<Text>{user.name}</Text>
					</View>
					</TouchableOpacity>
				})
			) : (
				<></>
			)}
			<StatusBar style="auto" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	image: {
		width: 70,
		height: 70,
		padding: 4,
		borderRadius: 300,
	}
});