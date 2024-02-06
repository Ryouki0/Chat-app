
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
export default async function getLastMessages(allUsers){
	const chatRooms = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data().PrivateChatRooms;
	const allUsersWithMessages = allUsers.map((user) => {
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
	console.log('allUserWithMessages: ', allUsersWithMessages);
	return(allUsersWithMessages);
}