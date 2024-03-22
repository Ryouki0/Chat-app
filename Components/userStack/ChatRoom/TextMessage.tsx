import React, { Dispatch, SetStateAction } from 'react';
import { styledMessage } from '../../../models/styledMessage';
import LastMessage from '../LastMessage';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import ChatroomSettings from './ChatroomSettings';
import { setTappedMessage } from '../../../state/slices/chatRoomSlice';
export default React.memo(function TextMessage({mess}: React.PropsWithChildren<{
    mess: styledMessage,
}>){
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const tappedMessage = useSelector((state: RootState) => {return state.ChatRoomDataSlice.tappedMessage;});
	const dispatch = useDispatch();
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	return <>
	{console.log('rendered textMessage')}
		{mess.userChange ? (
			<LastMessage message={mess}></LastMessage>
		) : (
			<Text style={[mess.extraStyles, {color: theme.primaryText.color}]} onPress={() => {
				dispatch(setTappedMessage(tappedMessage === mess.id ? null : mess.id));
			}}>{mess.message}</Text>
		)
		}
	</>;
});