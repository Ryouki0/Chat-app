import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import sendMessage from '../../../utils/sendMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import {EmojiCell} from 'rn-emoji-picker/dist/emojiCell';
import {  View, TextInput } from 'react-native';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';

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
			<View style={[styles.inputBar, {width: '80%',  flexDirection: 'row', alignItems: 'center'}]}>
				<TextInput  style={{width: '90%', color: theme.primaryText.color, padding: 10, height: 35}}
					onChangeText={(text) => {setMessToSend(text);}}
					value={messToSend}
					onSubmitEditing={() => {
						sendMessage(roomId, currentUserId, otherUserId, messToSend, 'text');
						setMessToSend('');
					}}/>
				<FontAwesome name='send' size={20} color={theme.primaryText.color} onPress={() => {
					sendMessage(roomId, currentUserId, otherUserId, messToSend, 'text');
					setMessToSend('');
				}}></FontAwesome>
			</View>
			{quickReaction && <EmojiCell emoji={quickReaction} colSize={40} onPress={() => {
				sendMessage(roomId, currentUserId, otherUserId, quickReaction.emoji, 'quickReaction');
			}}></EmojiCell>}
		</View>
	);
}

const styles = {
	inputBar: {
		marginLeft: 10,
		marginTop: 10, 
		fontSize: 15, 
		borderColor:'#636363',
		borderWidth: 1, 
		height: 40, 
		borderRadius: 30,
		padding: 10, 
	}
};