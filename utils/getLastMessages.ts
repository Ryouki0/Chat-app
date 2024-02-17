
import { getAuth } from 'firebase/auth';
import { Timestamp, doc, getDoc, getFirestore } from 'firebase/firestore';


const auth = getAuth();
const db = getFirestore();
interface room{
    chatRoomId: string,
    lastMessage: {
        message: string,
        time: Timestamp,
        user: string,
    },
    otherUser: string,
}

interface user{
	name: string,
	pfp: string,
	uid: string,
}

export default async function getLastMessages(allUsers: user[]){
	const chatRooms = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data().PrivateChatRooms;
	let allUsersWithMessages = allUsers.map((user) => {
		let userWithMessage = null;
		chatRooms.forEach((room: room) => {
			if(room.otherUser === user.name){
				if(room.lastMessage === undefined || room.lastMessage === null){
					userWithMessage = {...user, lastMessage: {message: 'No messages yet'}};
				}else {
					if(room.lastMessage.message.length >= 20){
						userWithMessage = {...user, lastMessage: {
							message: (room.lastMessage.message.slice(0, 20))+'...',
							time: room.lastMessage.time,
							user: room.lastMessage.user,
						}
						};
					}else{
						userWithMessage = {...user, lastMessage: room.lastMessage};
					}
				}
			}});
		if(userWithMessage === null){
			userWithMessage = {...user, lastMessage: {message: 'No messages yet'}};
		}
		return userWithMessage;
	});
	

	//sort last messages by time
		
	const userWithNoLastMess = [];
	const userWithLastMess = [];
	allUsersWithMessages.forEach((mess) => {
		if(!mess.lastMessage.time){
			userWithNoLastMess.push(mess);
		}else{
			if(userWithLastMess.length < 1){
				userWithLastMess.push(mess);
			}else{
				let inserted = false;
				userWithLastMess.forEach((user, idx) => {
					if(!inserted){
						if(user.lastMessage.time.seconds > mess.lastMessage.time.seconds){
							userWithLastMess.splice(idx, 0, mess);
							inserted = true;
							return;
						}
					}
					
			})
			if(!inserted){
				userWithLastMess.push(mess);
			}
			}
			
		}
	})
	
	const reversed = userWithLastMess.reverse();

	allUsersWithMessages = [...reversed, ...userWithNoLastMess];
	
	return(allUsersWithMessages);
}