
import React, { useRef } from 'react';
import { useState } from 'react';
import { DocumentData, QueryDocumentSnapshot, collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Message } from '../../../models/message';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { RootState } from '../../../state/store';
import ChatroomSettings from './ChatroomSettings';
import InputBar from './InputBar';
import EmojiPicker from 'rn-emoji-picker';
import {emojis} from 'rn-emoji-picker/dist/data';
import updateQuickReaction from '../../../utils/ChatRoom/updateQuickReaction';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { styledMessage } from '../../../models/styledMessage';
import DisplayMessages from './DisplayMessages';
import { addMessages, loadMessageChunk } from '../../../utils/ChatRoom/loadMessages';
const db = getFirestore();

let isScrollAtBottom = true;
let isScrollAtTop = false;


export default function ChatRoom() {
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme;});
	const roomId = useSelector((state: RootState) => {return state.ChatRoomDataSlice.roomId;});
	const otherUserId = useSelector((state: RootState) => {return state.ChatRoomDataSlice.otherUserId;});
	const settingsState = useSelector((state: RootState) => {return state.ChatRoomDataSlice.chatRoomSettingsState});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	
	const flatListRef = useRef(null);
	const messageQuery = query(collection(db, 'PrivateChatRooms', `${roomId}`, 'Messages'), orderBy('serverTime', 'desc'), limit(30));
	const [styledMessages, setStyledMessages] = useState<styledMessage[]>(null);
	const [emojiPicker, setEmojiPicker] = useState(false);
	const [loadingChunk, setLoadingChunk] = useState<boolean>(false);
	const [queryStartAfter, setQueryStartAfter] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | DocumentData>(null);
	useFocusEffect(
		React.useCallback(() => {
			
			const messageObserver = onSnapshot(messageQuery, {includeMetadataChanges: false},(messageDoc) => {
				if(messageDoc.docChanges().length < 1){
					return null;
				}
				addMessages(messageDoc, setStyledMessages, setQueryStartAfter);
			});

			return () => {
				messageObserver();
				setStyledMessages(null);
				setQueryStartAfter(null);
				setLoadingChunk(false);
			};
		}, [otherUserId])
	);

	
	const isCloseToTop = ({ contentOffset }) => {
		return contentOffset.y <= 50;
	};

	const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
		const paddingToBottom = 50;
		return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
	};
    //type messageProps = {message: styledMessage};
    // const Item = React.useCallback(({message}: messageProps) => {
    // 	return <DisplayMessages message={message} ></DisplayMessages>;},[]);
    return <>
		{loadingChunk && <ActivityIndicator></ActivityIndicator>}
		{settingsState && <ChatroomSettings setEmojiPicker={setEmojiPicker}></ChatroomSettings>} 
    	<ScrollView
    		ref = {flatListRef}
    		onContentSizeChange={() => {
    			if(isScrollAtBottom){
    				setTimeout(() => flatListRef?.current?.scrollToEnd({animated: false}), 60);
    			}
    		}}
    		maintainVisibleContentPosition={{ minIndexForVisible: 0}}
    		onScroll={({nativeEvent}) => {
    			if(isCloseToBottom(nativeEvent)){
    				isScrollAtBottom = true;
    			}else{
    				isScrollAtBottom = false;
    			}
    			if(isCloseToTop(nativeEvent)){
    				if(!loadingChunk){
    					loadMessageChunk(setStyledMessages, setLoadingChunk, queryStartAfter, setQueryStartAfter);
    				}
    			}else{
    				isScrollAtTop = false;
    			}
    		}}
		
    		scrollEventThrottle={16}>
    		<>
    			{styledMessages?.map((mess) => {
    				return <View key={mess.id}>
    					<DisplayMessages message={mess}></DisplayMessages>
    				</View>
    			})}
    		</>
			
    	</ScrollView>
		
    	<InputBar></InputBar>

    	{emojiPicker && <View style={{flex:1, width: '100%', position:'absolute', height: '100%'}}>
    		<EmojiPicker 
    			emojis={emojis}
    			loading={false}
    			autoFocus={false}
    			darkMode={true}
    			perLine={7}
    			onSelect={(emoji) => {updateQuickReaction(roomId, emoji); setEmojiPicker(false);}}></EmojiPicker>
    	</View>}
    </>;
}
