import React, { Dispatch, SetStateAction } from 'react';
import { styledMessage } from '../../../models/styledMessage';
import LastMessage from '../LastMessage';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import ChatroomSettings from './ChatroomSettings';

export default React.memo(function TextMessage({mess, length, idx,}: React.PropsWithChildren<{
    mess: styledMessage,
    length: number,
    idx: number,
}>){
    const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
	const chatRoomData = useSelector((state: RootState) => {return state.ChatRoomDataSlice});
	const setTappedMessage = chatRoomData.setTappedMessage;
	const currentUserId = chatRoomData.currentUserId;
	const otherUserPfp = chatRoomData.otherUserPfp;
    const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	return <>
		{length === idx + 1 ? (
			<LastMessage message={mess} currentUserID={currentUserId} otherUserPfp={otherUserPfp} 
				setTappedMessage={setTappedMessage}></LastMessage>
		) : (
			mess.userChange ? (
				<LastMessage message={mess} currentUserID={currentUserId} otherUserPfp={otherUserPfp}
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
	</>;
})