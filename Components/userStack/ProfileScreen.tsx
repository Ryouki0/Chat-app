import React from 'react';
import {useState} from 'react';
import {Text, View,} from 'react-native';
import {Button} from 'react-native-elements';
import {getAuth } from 'firebase/auth';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import StorageImage from '../StorageImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { lightTheme, darkTheme } from '../../constants/theme';
import { pickImage } from '../../utils/pickImage';

const auth = getAuth();
const db = getFirestore();

export default function Profile() {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme;});
	const userData = useSelector((state: RootState) => {return state.userDataSlice;});
	const userId = userData.uid;
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const [userPfp, setUserPfp] = useState(userData.pfp);
	const chatRoomState = useSelector((state: RootState) => {return state.chatRoomSlice.chatRoomIds;});

	
	const changePfp = async () => {
		try{
			const refId = await pickImage(true);
			
			await updateDoc(doc(db, 'Users', `${userId}`), {pfp: `${refId}`});
			setUserPfp((await getDoc(doc(db, 'Users', `${userId}`))).data().pfp);

			await Promise.all(chatRoomState.map(async (room: {
				chatRoomId: string, 
				currentUserNumber: string,
				Username: string, 
				pfp: string, 
				uid: string,
			}) => {
				await updateDoc(doc(db, 'PrivateChatRooms', `${room.chatRoomId}`), {[room.currentUserNumber] : 
					{pfp: `${refId}`, Username: room.Username, uid: room.uid}});
			}));

		}catch(err){
			console.log('error in pickImage: ', err);
		}
	};

	async function signOut(){
		try{
			await auth.signOut();
			await updateDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {signedIn: false});
			console.log('signed out');
		}catch(err){
			console.log('error signing out: ', err);
		}
	}

	return <View style={[{alignItems: 'center', }, theme.container]}>
		{userData && <Text style={[theme.primaryText, {fontSize: 17, margin: 5}]}>{userData.Username}</Text>}
		<StorageImage imagePath={userPfp} style={{width: 200, height: 200, borderRadius: 200}}></StorageImage>
		<Button title='sign out' onPress={() => {signOut();}}></Button>
		<Button title='Change pfp' onPress={() => {changePfp();}}></Button>
		
	</View>;
}