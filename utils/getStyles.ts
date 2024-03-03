import { styledMessage } from '../models/styledMessage';
import { Message } from '../models/message';

export default function getStyles(currentUserID: string, messages: Message[], theme: 'lightTheme' | 'darkTheme'){

	const rightBGColor = theme === 'lightTheme' ? '#a6a6a6' : '#636363';

	const right = {
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
	const left= {
		alignSelf: 'flex-start',
		borderWidth: 1,
		marginBottom: 1, 
		padding: 10, 
		borderRadius: 30, 
		maxWidth: '75%',
		borderColor: '#3b3b3b',
		marginLeft: 44,
	};

	const newMessages = messages.map((mess: Message, idx) => {
		const extraStyles = [];
		let hasStyle = false;
		let userChange = false;
		if(mess.senderId === currentUserID){
			if(messages[idx-1]?.senderId === currentUserID) {
				extraStyles.push({borderTopRightRadius: 10, });
				hasStyle= true;
			}
			if(messages[idx + 1]?.senderId === currentUserID){
				extraStyles.push({borderBottomRightRadius: 10, });
				hasStyle = true;
			}
			mess.type === 'quickReaction' ? extraStyles.push({alignSelf:'flex-end', marginRight: 20, fontSize: 20}) : extraStyles.push(right);
		}
		else{
			if(messages[idx-1]?.senderId != currentUserID){
				extraStyles.push({borderTopLeftRadius: 10 });
				hasStyle = true;
			}
			if(messages[idx + 1]?.senderId != currentUserID){
				extraStyles.push({borderBottomLeftRadius: 10, });
				hasStyle = true;
			}else{
				userChange = true;
			}
			mess.type === 'quickReaction' ? extraStyles.push({alignSelf:'flex-start', fontSize:20, marginLeft:44}) : extraStyles.push(left);
		}
		return {...mess, userChange, extraStyles} as styledMessage;
	});
	return newMessages;
}




