import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { RoomData } from '../../../models/roomData';
import { store } from '../../../state/store';
import { setChatRoomData } from '../../../state/slices/chatRoomSlice';
import { ActivityIndicator, View } from 'react-native';
const db = getFirestore();
export default function ChatRoomEntryPoint({route, navigation}){
	const roomId = route.params.roomId;
	const otherUserPfp = route.params.otherUserPfp;
	const currentUserId = route.params.currentUserId;
	const otherUserId = route.params.otherUserId;
	const [loading, setLoading] = useState<boolean>(true);
	useFocusEffect(
		React.useCallback(() => {
			const fetchRoomData = async () => {
				console.log('roomId: in entry:',roomId);
				const roomData = (await getDoc(doc(db, 'PrivateChatRooms',`${roomId}`))).data() as RoomData;
				const otherUserName = roomData.User1.uid === otherUserId ? roomData.User1.Username : roomData.User2.Username;
				store.dispatch(setChatRoomData({
					otherUserName: otherUserName,
					otherUserPfp: otherUserPfp,
					currentUserId: currentUserId,
					otherUserId: otherUserId,
					roomId: roomId,
					tappedMessage: null,
					quickReaction: roomData.quickReaction,
					chatRoomSettingsState: false,
					reachedEndOfMessages: false,
				}));
				console.log('roomData dispatched');
				setLoading(false);
			};
			fetchRoomData();
			return () => {};
		}, [roomId])
	);

	useFocusEffect(
		React.useCallback(() => {
			if(!loading){
				console.log('navigated to ChatRoom, loading: ', loading);
				navigation.navigate('ChatRoom');
			}
		}, [loading])
	);

	return (
		<View style={{justifyContent: 'center', flex:1,flexGrow:1}}>
			<ActivityIndicator size={50} style={{justifyContent: 'center', alignSelf: 'center'}}></ActivityIndicator>
		</View>
	);
}