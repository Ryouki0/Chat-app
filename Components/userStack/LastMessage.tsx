
import React, { Dispatch } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import StorageImage from '../StorageImage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import { styledMessage } from '../../models/styledMessage';
import { images } from '../../constants/images';
import { setTappedMessage } from '../../state/slices/chatRoomSlice';
const iconSize = 14;

export default function LastMessage({message}: React.PropsWithChildren<{
	message: styledMessage,
}>){
	if(message === null || message === undefined){
		console.log('in lastmessage message is null');
		return -1;
	}
	const currentUserId = useSelector((state:RootState) => {return state.ChatRoomDataSlice.currentUserId});
	const otherUserPfp = useSelector((state: RootState) => {return state.ChatRoomDataSlice.otherUserPfp});
	const tappedMessage = useSelector((state: RootState) => {return state.ChatRoomDataSlice.tappedMessage;});
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const dispatch = useDispatch();
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	return <>
		{message.senderId === currentUserId ? (
			message.seen ? (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					{message.type === 'image' ? (
						<StorageImage style={[message.extraStyles, {marginRight: 20-iconSize}, images.imageMessage]} imagePath={message.message}></StorageImage>
					) : (
						<Text style={[message.extraStyles, {marginRight: 20-iconSize}, {color: theme.primaryText.color}]}
							onPress={() => {dispatch(
								setTappedMessage(
									tappedMessage === message.id 
									? null 
									: message.id
								)
							);
						}}>
							{message.message}
						</Text>
					)}
					<StorageImage imagePath={otherUserPfp} style={{width: iconSize, height: iconSize, borderRadius: 230}}></StorageImage>
				</View>
			) : (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					{message.type === 'image' ? (
						<StorageImage style={[message.extraStyles, {marginRight: 20-iconSize}, images.imageMessage]} imagePath={message.message}></StorageImage>
					) : (
						<Text style={[message.extraStyles,  {marginRight: 20-iconSize, color: theme.primaryText.color}]}
							onPress={() => {dispatch(
								setTappedMessage(
									tappedMessage === message.id 
									? null 
									: message.id
								)
							);
						}}>
							{message.message}
						</Text>
					)}
					
					<AntDesign name="checkcircle" size={iconSize} color="grey" />
				</View>
			)
		) : (
			<View style={{flexDirection: 'row', }} >
				<StorageImage imagePath={otherUserPfp} style={{width: 37, height: 37, borderRadius: 30}} ></StorageImage>
				{message.type === 'image' ? (
					<StorageImage style={[message.extraStyles, {marginRight: 20-iconSize, marginLeft: 6}, images.imageMessage]} imagePath={message.message}></StorageImage>
				) : (
					<Text style={[message.extraStyles,{marginLeft: 6, color: theme.primaryText.color} ]}
						onPress={() => {dispatch(
							setTappedMessage(
								tappedMessage === message.id 
								? null
								: message.id
							)
						);
					}}>
						{message.message}
					</Text>
				)}
				
			</View>
		)}
        
	</>;
   
}