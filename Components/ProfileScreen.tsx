import React from 'react';
import {useState} from 'react';
import {Text, View,} from 'react-native';
import {Button} from 'react-native-elements';
import { User, getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import StorageImage from './StorageImage';

const storage = getStorage();
const auth = getAuth();
const db = getFirestore();
export default function Profile() {
	const [userPfp, setUserPfp] = useState<String>(null);
	const [user, setUser] = useState<User>(null);
	useFocusEffect(
		React.useCallback(() => {
			setUser(auth.currentUser);
			async function getPfp() {
				console.log('called');
				setUserPfp((await getDoc(doc(db, 'Users', `${user.uid}`))).data().pfp);
			}
			if(user !== null){
				getPfp();
			}
		}, [user])
	)

	const pickImage = async () => {
		
		try{
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				quality: 1,
			  });
			  console.log('result:', result.assets[0].uri);
			  let refId = uuid.v4();
			  const  storageRef = ref(storage, `${refId}`);
			  const fetchUri = await fetch(result.assets[0].uri);
			  const blob = await fetchUri.blob();
			  await uploadBytesResumable(storageRef, blob).then((snapShot) => {
				  console.log('snapshot: ', snapShot.state);
			  })
			  await updateDoc(doc(db, 'Users', `${user.uid}`), {pfp: `${refId}`});
			  setUserPfp((await getDoc(doc(db, 'Users', `${user.uid}`))).data().pfp);
		}catch(err){
			console.log('error in pickImage: ', err);
		}
	}


	async function signOut(){
		try{
			await auth.signOut();
			console.log('signed out');
		}catch(err){
			console.log('error signing out: ', err);
		}
	}

	return <>
		{userPfp ? (
			<StorageImage imagePath={userPfp} style={{width: 200, height: 200}}></StorageImage>
		):(<></>)}
			<Button title='sign out' onPress={() => {signOut()}}></Button>
			<Button title='imagepicker' onPress={() => {pickImage()}}></Button>
	</>
}