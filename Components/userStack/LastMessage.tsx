
import React, { useContext } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import StorageImage from '../StorageImage';
import { ThemeContext } from '../../hooks/useTheme';
export default function LastMessage({message, currentUserID, otherUserPfp, setTappedMessage}){
	//console.log('lastmessage: ', message);
	const theme = useContext(ThemeContext);
	return <>
		{message.user === currentUserID ? (
			message.seen ? (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					<Text style={[message.extraStyles, {marginRight: 3}, {color: theme.text.color}]}
						onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
							return null;
						}else{
							return message.id;
						}});}}>{message.message}</Text>
					<StorageImage imagePath={otherUserPfp} style={{width: 18, height: 18, borderRadius: 230}}></StorageImage>
				</View>
			) : (
				<View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}} >
					<Text style={[message.extraStyles, {marginRight: 3}, {color: theme.text.color}]}
						onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
							return null;
						}else{
							return message.id;
						}});}}>{message.message}</Text>
					<AntDesign name="checkcircle" size={18} color="grey" />
				</View>
			)
		) : (
			<View style={{flexDirection: 'row', }} >
				<StorageImage imagePath={otherUserPfp} style={{width: 37, height: 37, borderRadius: 30}} ></StorageImage>
				<Text style={[message.extraStyles,{marginLeft: 6},{color: theme.text.color} ]}
					onPress={() => {setTappedMessage((messId) => {if(messId === message.id){
						return null;
					}else{
						return message.id;
					}});}}>{message.message}</Text>
			</View>
		)}
        
	</>;
   
}