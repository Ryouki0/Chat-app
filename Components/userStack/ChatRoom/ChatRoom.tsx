
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
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { RootState } from '../../../state/store';
import ChatroomSettings from './ChatroomSettings';
import InputBar from './InputBar';
import EmojiPicker from 'rn-emoji-picker';
import {emojis} from 'rn-emoji-picker/dist/data';
import updateQuickReaction from '../../../utils/updateQuickReaction';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { lastMessage } from '../../../models/lastMessage';
const db = getFirestore();

let isScrollAtBottom = true;

export default function ChatRoom({route}: React.PropsWithChildren<any>) {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme;});
	const chatRoomSettingState = useSelector((state: RootState) => {return state.chatRoomSettingSlice.isOn;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const roomID = route.params.roomID;
	const currentUserID = route.params.currentUserID;
	const otherUserID = route.params.otherUserID;


	const [tappedMessage, setTappedMessage] = useState<string>(null);
	const [quickReaction, setQuickReaction] = useState<Emoji | undefined>();
	const [messages, setMessages] = useState<lastMessage[]>(null);
	const [otherUserPfp, setOtherUserPfp] = useState(null);
	const [emojiPicker, setEmojiPicker] = useState(false);

	useFocusEffect(
		React.useCallback(() => {
			const observer = onSnapshot(doc(db, 'PrivateChatRooms', `${roomID}`), () => {getMessages();});

			async function getPfp() {
				const pfp = (await getDoc(doc(db, 'Users', `${otherUserID}`))).data().pfp;
				setOtherUserPfp(pfp);
			}

			async function getMessages() {
				const roomData = (await getDoc(doc(db, 'PrivateChatRooms', `${roomID}`))).data();
				setQuickReaction(roomData.quickReaction);
				const messages = roomData.Messages;
				if(messages.length < 1){
					return -1;
				}
				if(messages[messages.length-1].senderId === otherUserID){
					const newMessages = messages.map((mess:Message, idx:number) => {
						if(idx === messages.length-1){
							return {
								id: mess.id,
								message: mess.message,
								seen: true,
								time: mess.time,
								senderId: mess.senderId,
							};
						}else{
							return mess;
						}
					});
					updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: newMessages});
					
				}
				setMessages(getStyles(currentUserID, messages, themeState));
				console.log('getMessages');
			}
			getMessages();
			getPfp();
			return () => {observer();
				setOtherUserPfp(null);
				setMessages(null);};
		}, [otherUserID, themeState])
	);
        
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
				}
			}}
			onContentSizeChange={() => {if(isScrollAtBottom){
				this.scrollView.scrollToEnd({animated: false});
			}}}
			scrollEventThrottle={16}>

			{messages ? (
				messages.map((mess: lastMessage, idx: number) => {
               
					return <View key={mess.id} >
						{tappedMessage === mess.id ? (
							<DateDisplay time={mess.time} style={{color: theme.primaryText.color, alignSelf: 'center'}} months={false} days={false}></DateDisplay>
						) : (
							<></>
						)}
						{messages.length === idx + 1 ? (
							<LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp} 
								setTappedMessage={setTappedMessage}></LastMessage>
						) : (
							mess.userChange ? (
								<LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp}
									setTappedMessage={setTappedMessage} ></LastMessage>
							) : (
								<Text style={[mess.extraStyles, {color: theme.primaryText.color}]} onPress={() => {
									setTappedMessage((messId: string) => {if(messId === mess.id){
										return null;
									}else{
										return mess.id;
									}});
								}} >{mess.message}</Text>
							)
						)}
					</View>; 
				})
			) : (<></>)}
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
