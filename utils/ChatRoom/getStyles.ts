import { styledMessage } from '../../models/styledMessage';
import { Message } from '../../models/message';
import { store } from '../../state/store';
import { TextStyle } from 'react-native';
/**
 * Gets the styles for the messages, based on the neighboring messages.
 */
export default function getStyles(messages: Message[] | [styledMessage | Message, styledMessage | Message]){
	const theme = store.getState().themeSlice.theme;
	const currentUserId = store.getState().userDataSlice.uid;
	const rightBGColor = theme === 'lightTheme' ? '#a6a6a6' : '#636363';
	
	const right: TextStyle = {
		alignSelf:'flex-end', 
		borderWidth: 1, 
		padding: 10, 
		marginBottom: 1, 
		borderColor: '#636363',
		borderRadius: 30,
		marginRight: 20,
		maxWidth: '75%',
		backgroundColor: rightBGColor,
	};
	const left:TextStyle = {
		alignSelf: 'flex-start',
		borderWidth: 1,
		marginBottom: 1, 
		padding: 10, 
		borderRadius: 30, 
		maxWidth: '75%',
		borderColor: '#3b3b3b',
		marginLeft: 44,
	};
	const quickReactionRight:TextStyle = {
		alignSelf:'flex-end', marginRight: 20, fontSize: 20
	};
	const quickReactionLeft:TextStyle = {
		alignSelf: 'flex-start', marginLeft: 44, fontSize: 20
	}
	const newMessages = messages.map((mess: Message | styledMessage, idx: number) => {
		let extraStyles = [];
		if('extraStyles' in mess){
			console.log('styledMessage: ', mess.message);
			extraStyles = mess.extraStyles;
		}
		let userChange = false;
		
		if(mess.senderId === currentUserId){
			if(messages[idx-1] && messages[idx-1]?.senderId === currentUserId) {
				extraStyles.push({borderTopRightRadius: 10, });
			}
			if(messages[idx + 1] && messages[idx+1]?.senderId === currentUserId){
				extraStyles.push({borderBottomRightRadius: 10, });
			}
			mess.type === 'quickReaction' ? extraStyles.push(quickReactionRight) : extraStyles.push(right);
		}
		else{
			if(messages[idx-1] && messages[idx-1].senderId != currentUserId){
				extraStyles.push({borderTopLeftRadius: 10 });
			}
			if(messages[idx + 1] && messages[idx+1].senderId != currentUserId){
				extraStyles.push({borderBottomLeftRadius: 10, });
			}else{
				userChange = true;
			}
			mess.type === 'quickReaction' ? extraStyles.push(quickReactionLeft) : extraStyles.push(left);
		}
		if(!messages[idx+1]){
			userChange = true;
			if('extraStyles' in mess){
				userChange = mess.userChange;
			}
		}
		return {...mess, userChange, extraStyles} as styledMessage;
	});
	
	return newMessages;
}




