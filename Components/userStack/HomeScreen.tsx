
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { User, getAuth, signOut } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'; 
import { getDoc } from 'firebase/firestore';
import getAllUsers from '../../utils/getAllUsers';
import StorageImage from '../StorageImage';
import { useFocusEffect } from '@react-navigation/native';
import createChatRoom from '../../utils/createChatRoom';
import { ThemeContext } from '../../hooks/useTheme';
import { registerForPushNotificationsAsync } from '../../notification';
import DateDisplay from '../DateDisplay';
import LoadingScreen from '../LoadingScreen';
const auth = getAuth();
const db = getFirestore();
interface user{
	pfp: string, 
	name: string, 
	uid: string,
}
async function getUser() {
	const docRef = doc(db, 'Users', `${auth.currentUser.uid}`);
	const docSnap = await getDoc(docRef);
	return docSnap.data();
}

export default function Chats({route, navigation}) {
	const theme = useContext(ThemeContext);
	const [currentUser, setCurrentUser] = useState(null);
	const [allUsers, setAllUsers] = useState(null);

  
	useFocusEffect(
		React.useCallback(() => {

			const observer = onSnapshot(doc(db, 'Users', `${auth.currentUser.uid}`), async ()=> {setAllUsers(await getAllUsers())})

			async function getUsers() {
				setCurrentUser(await getUser());
				setAllUsers(await getAllUsers());
			}

			async function getExpoPushToken(){
				const token = await registerForPushNotificationsAsync();
				await updateDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {expoPushToken: token});
			}
			getExpoPushToken();
			getUsers();
			return () => {
				observer();
			}
		}, [])
	);


	return (
		<ScrollView contentContainerStyle={{flexGrow: 1}}>
			{allUsers ? (
				allUsers.map((user, idx: number) => {
					console.log('user: ', user);
					return <TouchableOpacity key={idx} onPress={() => {
						createChatRoom(currentUser.uid, user.uid, navigation);
					}}>
						<View  style={[{flexDirection: 'row', alignItems: 'center'}]}>
							<StorageImage imagePath={user.pfp} style={styles.image} />
							<View>
								<Text style={{color: theme.text2.color, fontSize: 16}}>
									{user.name}
								</Text>
								{user.lastMessage.user === currentUser.uid ? (
									<Text style={{color: theme.text2.color, fontSize: theme.text2.fontSize}}>
										You: {user.lastMessage.message}{'  '}·{'  '}
										<DateDisplay time={user.lastMessage.time} style={theme.text2}></DateDisplay>
									</Text>
								):(
									<Text style={{color: theme.text2.color, fontSize: theme.text2.fontSize}}>
										{user.lastMessage.message}{'  '}{user.lastMessage.time && '·'}{'  '}
										<DateDisplay time={user.lastMessage.time} style={theme.text2}></DateDisplay>
									</Text>
								)}
							</View>
						</View>
					</TouchableOpacity>;
				})
			) : (
				<LoadingScreen></LoadingScreen>
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
		width: 60,
		height: 60,
		padding: 4,
		borderRadius: 300,
		marginLeft: 10,
		marginRight: 4,
		marginBottom: 2,
	},
});