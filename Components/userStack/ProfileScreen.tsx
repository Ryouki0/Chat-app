import React, { useContext } from 'react';
import {useState} from 'react';
import {Text, View,} from 'react-native';
import {Button} from 'react-native-elements';
import {getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import StorageImage from '../StorageImage';
import { DocumentData } from 'firebase/firestore';
import TestCounter from '../TestCounter';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { lightTheme, darkTheme } from '../../constants/theme';

const storage = getStorage();
const auth = getAuth();
const db = getFirestore();

export default function Profile({route, navigation}) {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme})
	console.log('themestate: ', themeState);
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
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
			updateDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {signedIn: false})
			console.log('signed out');
		}catch(err){
			console.log('error signing out: ', err);
		}
	}

	return <View style={[{alignItems: 'center', }, theme.container]}>
		{userData && <Text style={theme.primaryText}>{userData.Username}</Text>}
		<StorageImage imagePath={userPfp} style={{width: 200, height: 200, borderRadius: 200}}></StorageImage>
		<Button title='sign out' onPress={() => {signOut();}}></Button>
		<Button title='Change pfp' onPress={() => {pickImage();}}></Button>
		<TestCounter></TestCounter>
	</View>;
}