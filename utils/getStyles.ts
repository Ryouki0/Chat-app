


interface message{
    message: string,
    seen: boolean,
    time: Date,
    user: string
}

export default function getStyles(currentUserID: string, messages: message[]){
	//console.log('messages: ', messages);

   
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


const right = {
	alignSelf:'flex-end', 
	borderWidth: 1, 
	padding: 10, 
	marginBottom: 1, 
	borderColor: '#636363',
	borderRadius: 30,
	marginRight: 20,
	maxWidth: 275,
	backgroundColor: '#636363',
};
const left= {
	alignSelf: 'flex-start',
	borderWidth: 1,
	marginBottom: 1, 
	padding: 10, 
	borderRadius: 30, 
	maxWidth: 275,
	borderColor: '#3b3b3b',
	marginLeft: 44,
};

