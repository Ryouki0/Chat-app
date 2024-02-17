


interface message{
    message: string,
    seen: boolean,
    time: Date,
    user: string
}

export default function getStyles(currentUserID: string, messages: message[], theme: 'lightTheme' | 'darkTheme'){

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


   
	const newMessages = messages.map((mess, idx) => {
		const extraStyles = [];
		let hasStyle = false;
		let userChange = false;
		if(mess.user === currentUserID){
			if(messages[idx - 1] != undefined && messages[idx-1].user === currentUserID) {
				extraStyles.push({borderTopRightRadius: 10, ...right});
				hasStyle= true;
			}
			if(messages[idx + 1] != undefined && messages[idx +1 ].user === currentUserID){
				extraStyles.push({borderBottomRightRadius: 10, ...right});
				hasStyle = true;
			}
			if(!hasStyle){
				extraStyles.push(right);
			}
		}
		else{
			if(messages[idx - 1] != undefined && messages[idx-1].user != currentUserID){
				extraStyles.push({borderTopLeftRadius: 10, ...left});
				hasStyle = true;
			}
			if(messages[idx + 1] != undefined && messages[idx + 1].user != currentUserID){
				extraStyles.push({borderBottomLeftRadius: 10, ...left});
				hasStyle = true;
			}else{
				userChange = true;
			}
			if(!hasStyle){
				extraStyles.push(left);
			}
		}
		return {...mess, userChange, extraStyles};
	});
	return newMessages;
}




