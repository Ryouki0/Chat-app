import React, { useState } from 'react';
import sendMessage from '../../../utils/sendMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import {EmojiCell} from 'rn-emoji-picker/dist/emojiCell';
import { Ionicons } from '@expo/vector-icons';
import {  View, TextInput } from 'react-native';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import sendImage from '../../../utils/sendImage';
export default function InputBar({roomId, otherUserId, quickReaction}: React.PropsWithChildren<{
    roomId: string,
    otherUserId: string,
	quickReaction: Emoji | undefined,
}>){
	
	const themeState = useSelector((state:RootState) => {return state.themeSlice.theme;});
	const currentUserId = useSelector((state: RootState) => {return state.userDataSlice.uid;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const [messToSend, setMessToSend] = useState('');
		
	return (
		<View style={{flexDirection: 'row', backgroundColor: theme.container.backgroundColor, alignItems: 'center'}}>
			<TouchableOpacity onPress={() => {sendImage(roomId, currentUserId, otherUserId)}}>
				<View style={{alignItems: 'center', marginLeft: 6}}>
					<AntDesign name="picture" color={theme.secondaryText.color} size={28} />
				</View>
			</TouchableOpacity>
			
			<View style={[styles.inputBar, {width: '75%',  flexDirection: 'row', alignItems: 'center'}]}>
				<TextInput  style={{width: '90%', color: theme.primaryText.color, padding: 10, height: 35}}
					onChangeText={(text) => {setMessToSend(text);}}
					value={messToSend}
					placeholder='Type something...'
					placeholderTextColor={theme.secondaryText.color}
					onSubmitEditing={() => {
						setMessToSend('');
						sendMessage(roomId, currentUserId, otherUserId, messToSend, 'text');
					}}/>
				<TouchableOpacity onPress={() => {
							sendMessage(roomId, currentUserId, otherUserId, messToSend, 'text');
							setMessToSend('');}}>
					<View >
						<Ionicons name="send" size={21} color={theme.primaryText.color} />
					</View>
				</TouchableOpacity>
			</View>
			{quickReaction && <EmojiCell emoji={quickReaction} colSize={40} onPress={() => {
				sendMessage(roomId, currentUserId, otherUserId, quickReaction.emoji, 'quickReaction');
			}}></EmojiCell>}
		</View>
	);
}

const styles = {
	inputBar: {
		fontSize: 15, 
		borderColor:'#636363',
		marginLeft: 6,
		borderWidth: 1, 
		height: 38, 
		borderRadius: 30,
		 
	}
};