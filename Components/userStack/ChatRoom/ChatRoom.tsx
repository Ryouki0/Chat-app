
import React from 'react';
import { useState } from 'react';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ScrollView, Text, View } from 'react-native';
import getStyles from '../../../utils/getStyles';
import { useFocusEffect } from '@react-navigation/native';
import LastMessage from '../LastMessage';
import DateDisplay from '../../DateDisplay';
import { Message } from '../../../models/message';
import { useDispatch, useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { RootState } from '../../../state/store';
import ChatroomSettings from './ChatroomSettings';
import InputBar from './InputBar';
import EmojiPicker from 'rn-emoji-picker';
import {emojis} from 'rn-emoji-picker/dist/data';
import updateQuickReaction from '../../../utils/updateQuickReaction';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { styledMessage } from '../../../models/styledMessage';
import sizeof from 'object-sizeof';
import DisplayMessages from './DisplayMessages';
import { setChatRoomData } from '../../../state/slices/chatRoomSlice';
import { setRoomMessages } from '../../../state/slices/messagesSlice';
const db = getFirestore();

let isScrollAtBottom = true;

export default function ChatRoom({route}: React.PropsWithChildren<any>) {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme;});
	const chatRoomSettingState = useSelector((state: RootState) => {return state.chatRoomSettingSlice.isOn;});
	const roomMessages = useSelector((state: RootState) => {return state.RoomMessages.messages});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const roomID = route.params.roomID;
	const currentUserID = route.params.currentUserID;
	const otherUserID = route.params.otherUserID;
	const otherUserPfp = route.params.otherUserPfp;

	const dispatch = useDispatch();

	const [tappedMessage, setTappedMessage] = useState<string>(null);
	const [quickReaction, setQuickReaction] = useState<Emoji | undefined>(null);
	const [messages, setMessages] = useState<styledMessage[]>(null);
	const [emojiPicker, setEmojiPicker] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	useFocusEffect(
		React.useCallback(() => {
			const observer = onSnapshot(doc(db, 'PrivateChatRooms', `${roomID}`), () => {getMessages();});
			
			if(!loading){
				dispatch(setChatRoomData({
					otherUserName: null,
					otherUserPfp: otherUserPfp,
					currentUserId: currentUserID,
					roomId: roomID,
					setTappedMessage: setTappedMessage,
					quickReaction: quickReaction,
					chatRoomSettingsState: false,
				}))
				console.log('roomdata dispatched');
			} 

			async function getMessages() {
				const roomData = (await getDoc(doc(db, 'PrivateChatRooms', `${roomID}`))).data();
				
				setQuickReaction(roomData.quickReaction);
				const messages = roomData.Messages;
				console.log('sizeof 1 message: ', sizeof(messages[0]));
				

				if(messages.length < 1){
					return null;
				}
				
				if(messages[messages.length-1].senderId === otherUserID && !messages[messages.length - 1].seen){
					const newMessages = messages.map((mess:Message, idx:number) => {
						if(idx === messages.length-1){
							return {
								id: mess.id,
								message: mess.message,
								seen: true,
								time: mess.time,
								senderId: mess.senderId,
								type: mess.type,
							};
						}else{
							return mess;
						}
					});
					updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: newMessages});
				}

				const styledMessages = getStyles(currentUserID, messages, themeState);
				setMessages(styledMessages);
				setLoading(false);
				console.log('getMessages');
			}
			getMessages();
			return () => {
				observer();
				setMessages(null);
			};
		}, [otherUserID, themeState, loading])
	);
        
	const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
		return contentOffset.y <= 50;
	}

	const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
		const paddingToBottom = 50;
		return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
	};
         
	return <>
		{chatRoomSettingState && 
	<View style={{alignItems: 'flex-end'}}>
		<ChatroomSettings roomId={roomID} setEmojiPicker={setEmojiPicker} quickReaction={quickReaction}></ChatroomSettings>
	</View>}
		
		<ScrollView 
			ref={ref => {this.scrollView = ref;}}
			style={{backgroundColor: theme.container.backgroundColor}}
			onScroll={({nativeEvent}) => {
				if (isCloseToBottom(nativeEvent)) {
					isScrollAtBottom = true;
				}else{
					isScrollAtBottom = false;
				}if(isCloseToTop(nativeEvent)){
					return null;
				}
			}}
			onContentSizeChange={() => {if(isScrollAtBottom){
				this.scrollView.scrollToEnd({animated: false});
			}}}
			scrollEventThrottle={16}>
				{!loading && <DisplayMessages messages={messages} tappedMessage={tappedMessage}></DisplayMessages>}
		</ScrollView>
		
		<InputBar roomId={roomID} otherUserId={otherUserID} quickReaction={quickReaction}></InputBar>

		{emojiPicker && <View style={{flex:1, width: '100%', position:'absolute', height: '100%'}}>
			<EmojiPicker 
				emojis={emojis}
				loading={false}
				autoFocus={false}
				darkMode={true}
				perLine={7}
				onSelect={(emoji) => {updateQuickReaction(roomID, emoji); setEmojiPicker(false);}}></EmojiPicker>
		</View>}
	</>;
}
