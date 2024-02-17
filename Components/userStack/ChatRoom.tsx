
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import sendMessage from '../../utils/sendMessage';
import getStyles from '../../utils/getStyles';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import LastMessage from './LastMessage';
import DateDisplay from '../DateDisplay';
import { Message } from '../../models/message';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../constants/theme';
import { RootState } from '../../state/store';
import { FontAwesome } from '@expo/vector-icons';
const db = getFirestore();

let isScrollAtBottom = true;

export default function ChatRoom({route, navigation}) {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme})

	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const roomID = route.params.roomID;
	const currentUserID = route.params.currentUserID;
	const otherUserID = route.params.otherUserID;


	const [tappedMessage, setTappedMessage] = useState(null);
	const [messToSend, setMessToSend] = useState(null);
	const [messages, setMessages] = useState(null);
	const [otherUserPfp, setOtherUserPfp] = useState(null);
	useFocusEffect(
		React.useCallback(() => {
			const observer = onSnapshot(doc(db, 'PrivateChatRooms', `${roomID}`), () => {getMessages();});

			async function getPfp() {
				const pfp = (await getDoc(doc(db, 'Users', `${otherUserID}`))).data().pfp;
				setOtherUserPfp(pfp);
			}

			async function getMessages() {
				const messages = (await getDoc(doc(db, 'PrivateChatRooms', `${roomID}`))).data().Messages;
				if(messages.length < 1){
					//console.log('getMessages: ', messages);
					return -1;
				}
				if(messages[messages.length-1].user === otherUserID){
					const newMessages = messages.map((mess:Message, idx:number) => {
						if(idx === messages.length-1){
							return {
								id: mess.id,
								message: mess.message,
								seen: true,
								time: mess.time,
								user: mess.user,
							}
						}else{
							return mess;
						}
					})
					updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: newMessages});
					
				}
				setMessages(getStyles(currentUserID, messages, themeState));
				console.log('getMessages');
			}
			getMessages();
			getPfp();
			return () => {observer();
				setOtherUserPfp(null);
			setMessages(null)};
		}, [otherUserID, themeState])
	);
        
	const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
		const paddingToBottom = 50;
		return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
	};
         

	console.log(roomID, 'currentID: ', currentUserID, 'otherUserID', otherUserID);
	return <>
		<ScrollView 
			ref={ref => {this.scrollView = ref;}}
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
				messages.map((mess, idx: number) => {
					//console.log('mess: ', mess);
               
					return <View key={mess.id} >
						{tappedMessage === mess.id ? (
							<DateDisplay time={mess.time} style={{color: theme.primaryText.color, alignSelf: 'center'}} months={false} days={false}></DateDisplay>
						) : (
							<></>
						)}
						{messages.length === idx + 1 ? (
							<>
								<LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp} 
									setTappedMessage={setTappedMessage}></LastMessage>
							</>
						) : (
							mess.userChange ? (
								<LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp}
									setTappedMessage={setTappedMessage} ></LastMessage>
							) : (
								<Text style={[mess.extraStyles, {color: theme.primaryText.color}]} onPress={() => {
									setTappedMessage((messId) => {if(messId === mess.id){
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

		<Input value={messToSend} placeholder='Type something...' style={{color: theme.primaryText.color}}
		 	rightIcon={<FontAwesome name="send" size={18} color={theme.primaryText.color} onPress={() => {
				sendMessage(roomID, currentUserID, otherUserID, messToSend);
				setMessToSend('');
			}}/>}
			inputContainerStyle={styles.inputBar}
			onChangeText={(text) => {
			setMessToSend(text);
        }} onSubmitEditing={() => {
			sendMessage(roomID, currentUserID, otherUserID, messToSend);
			setMessToSend('');
		}}></Input>
	</>;
}
const styles = {
	inputBar: {
		marginLeft: 10,
		marginTop: 10, 
		fontSize: 15, 
		borderColor:'#636363',
		borderWidth: 1, 
		height: 35, 
		borderRadius: 30,
		padding: 10, 
		marginBottom: -10,
	}
}