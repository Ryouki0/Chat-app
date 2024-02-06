
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import sendMessage from '../../utils/sendMessage';
import getStyles from '../../utils/getStyles';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import LastMessage from './LastMessage';
import { ThemeContext } from '../../hooks/useTheme';
import DateDisplay from '../DateDisplay';
const db = getFirestore();
const months = ['Jan','Feb','Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let isScrollAtBottom = true;

export default function ChatRoom({route, navigation}) {
	const theme = useContext(ThemeContext);
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
				setMessages(getStyles(currentUserID, messages));
				console.log('getMessages');
			}
			getMessages();
			getPfp();
			return () => {observer();
			setMessages(null)};
		}, [otherUserID])
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
					console.log('closeto bottom ad');
					isScrollAtBottom = true;
				}else{
					isScrollAtBottom = false;
				}
			}}
			onContentSizeChange={() => {if(isScrollAtBottom){
				this.scrollView.scrollToEnd({animated: false});
			}}}
			scrollEventThrottle={200}>

			{messages ? (
				messages.map((mess, idx: number) => {
					//console.log('mess: ', mess);
               
					return <View key={mess.id} >
						{tappedMessage === mess.id ? (
							<DateDisplay time={mess.time} style={{color: theme.text.color, alignSelf: 'center'}} months={false} days={false}></DateDisplay>
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
								<Text style={[mess.extraStyles, {color: theme.text.color}]} onPress={() => {
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

		<Input value={messToSend} placeholder='Type something...' style={{color: theme.text.color}} onChangeText={(text) => {
			setMessToSend(text);
        }} onSubmitEditing={() => {
			sendMessage(roomID, currentUserID, otherUserID, messToSend);
			setMessToSend('');
		}}></Input>
	</>;
}
