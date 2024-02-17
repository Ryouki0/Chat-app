
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, FlatList, } from 'react-native';
import { Input } from 'react-native-elements';
import { getAuth, } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore'; 
import getAllUsers from '../../utils/getAllUsers';
import { useFocusEffect } from '@react-navigation/native';
import { registerForPushNotificationsAsync } from '../../notification';

import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import { Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DisplayUsers from './DisplayUsers';

const auth = getAuth();
const db = getFirestore();

export default function Chats({route, navigation}) {
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	const [allUsers, setAllUsers] = useState(null);
	const localInputRef = useRef();
	

	const keyboardDidHideCallback = () => {
		// @ts-ignore comment
		localInputRef.current.blur?.(); 
	 }

	useFocusEffect(
		React.useCallback(() => {
			const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHideCallback);
			const observer = onSnapshot(doc(db, 'Users', `${auth.currentUser.uid}`), async () => {
				setAllUsers(await getAllUsers())
			})

			async function getUsers() {
				setAllUsers(await getAllUsers());
			}
			
			getUsers();
			return () => {
				observer();
				keyboardDidHideSubscription?.remove();
			}
		}, [])
	);

	return (
		<>
			<ScrollView contentContainerStyle={{flexGrow: 1}}>
			<Input placeholder='Search users...' placeholderTextColor={'#d3d3d3'}
				
				ref={(ref) => {
					localInputRef && (localInputRef.current = ref as any);
				 }}
				onFocus={() => {console.log('ONFOCUS')}}
				onBlur={() => {console.log('ONBLUUUR')}}
				style={{color: theme.primaryText.color}}
				inputContainerStyle={styles.searchBar}
				leftIcon={<AntDesign name="search1" size={16} color={theme.primaryText.color} />}>
				</Input>
			<DisplayUsers allUsers={allUsers} navigation={navigation}></DisplayUsers>
		</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	searchBar: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10, 
		fontSize: 15, 
		borderColor:'#636363',
		borderWidth: 1, 
		height: 35, 
		borderRadius: 30,
		padding: 10, 
		marginBottom: -10,
		alignItems: 'center',
		verticalAlign: 'middle',
	}
});