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

export default function DisplayMessages({messages, tappedMessage}: React.PropsWithChildren<{
    messages: styledMessage[],
	tappedMessage: string,
}>){
    const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
    const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	return (
		<>
			{messages ? (
				messages.map((mess: styledMessage, idx: number) => {
					return <View key={mess.id} >
						{tappedMessage === mess.id ? (
							<DateDisplay time={mess.time} style={{color: theme.primaryText.color, alignSelf: 'center'}} months={false} days={false}></DateDisplay>
						) : (
							<></>
						)}
						{mess.type === 'text' || mess.type === 'quickReaction' ? (
							<TextMessage 
								mess={mess}
								idx={idx}
								length={messages.length}>
							</TextMessage>
						) : (
							mess.type === 'image' ? (
							<ImageMessage
								mess={mess}
								length={messages.length}
								idx={idx}>
							</ImageMessage>) : (
							<></>)
						)}		
					</View>; 
				})
			) : (<></>)}
            
		</>
        
	);
}