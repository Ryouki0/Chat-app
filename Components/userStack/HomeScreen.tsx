
import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, } from 'react-native';
import { Input } from 'react-native-elements';
import { getAuth, } from 'firebase/auth';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'; 
import getAllUsers from '../../utils/HomeScreen/getAllUsers';
import { useFocusEffect } from '@react-navigation/native';
import { UserData } from '../../models/UserData';
import getChatHistory from '../../utils/HomeScreen/getChatHistory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import { Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DisplayUsers from './DisplayUsers';
import DisplayChatHistory from './DisplayChatHistory';
import { Room } from '../../models/room';
import { user } from '../../models/UserData';
import { setUserData } from '../../state/slices/userDataSlice';
const auth = getAuth();
const db = getFirestore();

export default function Chats({ navigation }) {

	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	const chatRoomQuery = useSelector((state: RootState) => {return state.chatRoomSlice.chatRoomQuery;});
	const [isSearching, setisSearching] = useState(false);
	const [allUsers, setAllUsers] = useState(null);
	const [usersToDisplay, setUsersToDisplay] = useState(null);
	const [chatHistory, setChatHistory] = useState<Room[]>(null);
	const dispatch = useDispatch();
	const localInputRef = useRef();
	
	function onSearch(searchInput?: string) {
		console.log('search input: ', searchInput);
		
		const filteredUsers = allUsers.filter((user: user) => user.name.toLowerCase().includes(searchInput.toLowerCase()));
		setUsersToDisplay(filteredUsers);
	}

	function onFocus(){
		setUsersToDisplay(allUsers);
		setisSearching(true);
	}

	function onBlur(){
		setUsersToDisplay(chatHistory);
		setisSearching(false);
	}

	const keyboardDidHideCallback = () => {
		// @ts-ignore comment
		localInputRef.current?.blur?.(); 
	};

	useFocusEffect(
		React.useCallback(() => {
			const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHideCallback);
			const chatHistorySubscription = onSnapshot(chatRoomQuery, async () => {
				console.log('newMessage in chatHistorySubscription');
				setChatHistory(await getChatHistory());
			});
			async function getUsers() {
				if(!allUsers){
					setAllUsers(await getAllUsers());
				}
			}
			
			getUsers();
			return () => {
				keyboardDidHideSubscription?.remove();
				chatHistorySubscription?.();
			};
		}, [])
	);

	return (
		<>
			<ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
				<Input placeholder='Search users...' placeholderTextColor={'#d3d3d3'}
				
					ref={(ref) => {
						localInputRef && (localInputRef.current = ref as any);
					}}
					onChangeText={(search) => {onSearch(search);}}
					onFocus={() => {onFocus();}}
					onBlur={() => {onBlur();}}
					style={{color: theme.primaryText.color}}
					inputContainerStyle={styles.searchBar}
					leftIcon={<AntDesign name="search1" size={16} color={theme.primaryText.color} />}>
				</Input>
				{isSearching ? (
					<DisplayUsers navigation={navigation} usersToDisplay={usersToDisplay}></DisplayUsers>
				) : (<DisplayChatHistory chatHistory = {chatHistory} navigation={navigation}></DisplayChatHistory>)}
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