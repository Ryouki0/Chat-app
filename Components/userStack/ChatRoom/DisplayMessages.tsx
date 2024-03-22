import React, { useState } from 'react';
import { styledMessage } from '../../../models/styledMessage';
import LastMessage from '../LastMessage';
import { Text, View } from 'react-native';
import DateDisplay from '../../DateDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';

export default function DisplayMessages({message}: React.PropsWithChildren<{
    message: styledMessage,
}>){
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const tappedMessage = useSelector((state:RootState) => {return state.ChatRoomDataSlice.tappedMessage;});

	return (
		<View>
			{tappedMessage === message.id && (<DateDisplay time={message.time} style={{color: theme.primaryText.color, alignSelf: 'center'}} months={false} days={false}></DateDisplay>)}
			{message.type === 'text' || message.type === 'quickReaction' ? (
				<TextMessage mess={message}></TextMessage>
			) : (
				message.type === 'image' && <ImageMessage mess={message} ></ImageMessage>
			)}
		</View>
		
	);
}