
import { addDoc, getFirestore, doc, getDoc, collection, query, where, and, or, getDocs } from 'firebase/firestore';

const db = getFirestore();



export default async function createChatRoom(currentUserID: string, otherUserID: string, navigation){
	if(currentUserID === otherUserID){
		console.log('currentUserID === otherUserID in createChatRoom');
		return null;
	}
	try{
		let foundRoom = false;
		const userData = (await getDoc(doc(db, 'Users', currentUserID))).data();
		const otherUserData = (await getDoc(doc(db, 'Users', otherUserID))).data();
		const otherUserName = otherUserData.Username;

		const chatRoomQuery = query(collection(db, 'PrivateChatRooms'),
			and(or(where('User1.uid', '==', currentUserID), where('User2.uid', '==', currentUserID)),
				or(where('User1.uid', '==', otherUserID), where('User2.uid', '==', otherUserID))));
		
		const chatRoom = await getDocs(chatRoomQuery);

		if(!chatRoom.empty){
			foundRoom = true;
			console.log('chatRoom.docs[0].data', chatRoom.docs[0].id);
			navigation.navigate('ChatRoom',{currentUserID: currentUserID, otherUserID: otherUserID, roomID: chatRoom.docs[0].id});
		}
		const currentUserName = userData.Username;

		if(!foundRoom){
			const createdRoom = await addDoc(collection(db, 'PrivateChatRooms'), {
				User1: {
					Username: currentUserName, pfp: userData.pfp, uid: userData.uid 
				},	User2: {
					Username: otherUserName, pfp: otherUserData.pfp, uid: otherUserData.uid
				}, 	Messages: [],
				quickReaction: {
					'category': 'people & body', 
					'emoji': '👍', 
					'keywords': ['ok', 'yep', 'great', 'nice', 'thumbs up', 'good job', 'well done', 'sounds good', 'thumbsup', 'yes', 'awesome', 'good', 'agree', 'accept', 'cool', 'hand', 'like', '+1', 'thumbs up sign'], 
					'name': 'thumbs up sign', 
					'order': 20, 
					'unified': '1F44D'}});
			
			navigation.navigate('ChatRoom', {currentUserID: currentUserID, otherUserID: otherUserID, roomID: createdRoom.id});
		}
	}catch(err){
		console.log('error in createAccount: ', err);
	}
}