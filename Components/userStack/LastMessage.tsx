
import React, { useContext } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import StorageImage from '../StorageImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';

const iconSize = 14;

export default function LastMessage({message, currentUserID, otherUserPfp, setTappedMessage}){
	//console.log('lastmessage: ', message);
	if(message === null || message === undefined){
		console.log('in lastmessage message is null');
		return -1;
	}
	
	const themeState = useSelector((state: RootState) => {return state?.themeSlice.theme})

	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	return <>
		{message.user === currentUserID ? (
			message.seen ? (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					<Text style={[message.extraStyles, {marginRight: 20-iconSize}, {color: theme.primaryText.color}]}
						onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
							return null;
						}else{
							return message.id;
						}});}}>{message.message}</Text>
					<StorageImage imagePath={otherUserPfp} style={{width: iconSize, height: iconSize, borderRadius: 230}}></StorageImage>
				</View>
			) : (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					<Text style={[message.extraStyles,  {marginRight: 20-iconSize, color: theme.primaryText.color}]}
						onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
							return null;
						}else{
							return message.id;
						}});}}>{message.message}</Text>
					<AntDesign name="checkcircle" size={iconSize} color="grey" />
				</View>
			)
		) : (
			<View style={{flexDirection: 'row', }} >
				<StorageImage imagePath={otherUserPfp} style={{width: 37, height: 37, borderRadius: 30}} ></StorageImage>
				<Text style={[message.extraStyles,{marginLeft: 6, color: theme.primaryText.color} ]}
					onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
						return null;
					}else{
						return message.id;
					}});}}>{message.message}</Text>
			</View>
		)}
        
	</>;
   
}