
import { addDoc, getFirestore, doc, getDoc, collection, arrayUnion, updateDoc } from 'firebase/firestore';

const db = getFirestore();

interface room {
    chatRoomId: string,
    otherUser: string,
}

export default async function createChatRoom(currentUserID: string, otherUserID: string, navigation){
	try{
		let foundRoom = false;
		const userData = (await getDoc(doc(db, 'Users', currentUserID))).data();
		const chatRooms = userData.PrivateChatRooms;
		const currentUserName = userData.Username;
		const otherUserName = (await getDoc(doc(db, 'Users', otherUserID))).data().Username;
		chatRooms.forEach((room: room) => {
			if(room.otherUser === otherUserName){
				foundRoom = true;
				navigation.navigate('ChatRoom', {currentUserID: currentUserID, otherUserID: otherUserID, roomID: room.chatRoomId});
			}
		});
		if(!foundRoom){
			const createdRoom = await addDoc(collection(db, 'PrivateChatRooms'), {User1: currentUserName, User2: otherUserName, Messages: []});
			await updateDoc(doc(db, 'Users', `${currentUserID}`), {PrivateChatRooms: arrayUnion(
				{chatRoomId: createdRoom.id, otherUser: otherUserName, lastMessage: null}
			)});
			await updateDoc(doc(db, 'Users', `${otherUserID}`), {PrivateChatRooms: arrayUnion(
				{chatRoomId: createdRoom.id, otherUser: currentUserName, lastMessage: null}
			)});
			navigation.navigate('ChatRoom', {currentUserID: currentUserID, otherUserID: otherUserID, roomID: createdRoom.id});
		}
	}catch(err){
		console.log('error in createAccount: ', err);
	}
}