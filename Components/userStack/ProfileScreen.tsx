import React, { useContext } from 'react';
import {useState} from 'react';
import {Text, View,} from 'react-native';
import {Button} from 'react-native-elements';
import { User, getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import StorageImage from '../StorageImage';
import { ThemeContext } from '../../hooks/useTheme';
import { DocumentData } from 'firebase/firestore';
const storage = getStorage();
const auth = getAuth();
const db = getFirestore();
export default function Profile({route, navigation}) {
	const theme = useContext(ThemeContext);
	const [userPfp, setUserPfp] = useState<string>(null);
	const [userId, setUserId] = useState<string>(null);
	const [userData, setUserData] = useState<DocumentData>(null);
	useFocusEffect(
		React.useCallback(() => {
			setUserId(auth.currentUser.uid);
			async function getPfp() {
				console.log('called');
				const userData = (await getDoc(doc(db, 'Users', `${userId}`))).data();
				setUserData(userData);
				setUserPfp(userData.pfp);
			}
			if(userId !== null){
				getPfp();
			}
		}, [userId])
	);

	const pickImage = async () => {
		try{
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				quality: 1,
			  });
			  console.log('result:', result.assets[0].uri);
			  const refId = uuid.v4();
			  const  storageRef = ref(storage, `${refId}`);
			  const fetchUri = await fetch(result.assets[0].uri);
			  const blob = await fetchUri.blob();
			  await uploadBytesResumable(storageRef, blob).then((snapShot) => {
				  console.log('snapshot: ', snapShot.state);
			  });
			  await updateDoc(doc(db, 'Users', `${userId}`), {pfp: `${refId}`});
			  setUserPfp((await getDoc(doc(db, 'Users', `${userId}`))).data().pfp);
		}catch(err){
			console.log('error in pickImage: ', err);
		}
	};

	async function signOut(){
		try{
			await auth.signOut();
			console.log('signed out');
		}catch(err){
			console.log('error signing out: ', err);
		}
	}

	return <View style={{alignItems: 'center'}}>
		{userData && <Text style={{color: theme.text.color, fontSize: 18, margin: 5}}>{userData.Username}</Text>}
		<StorageImage imagePath={userPfp} style={{width: 200, height: 200, borderRadius: 200}}></StorageImage>
		<Button title='sign out' onPress={() => {signOut();}}></Button>
		<Button title='Change pfp' onPress={() => {pickImage();}}></Button>
	</View>;
}