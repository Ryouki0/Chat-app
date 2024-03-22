
import { addDoc, getFirestore, doc, getDoc, collection, query, where, and, or, getDocs, setDoc } from 'firebase/firestore';

const db = getFirestore();



export default async function createChatRoom(currentUserId: string, otherUserId: string, navigation){
	if(currentUserId === otherUserId){
		console.log('currentUserId === otherUserId in createChatRoom');
		return null;
	}
	try{
		let foundRoom = false;
		const userData = (await getDoc(doc(db, 'Users', currentUserId))).data();
		const otherUserData = (await getDoc(doc(db, 'Users', otherUserId))).data();
		const otherUserName = otherUserData.Username;

		const chatRoomQuery = query(collection(db, 'PrivateChatRooms'),
			and(or(where('User1.uid', '==', currentUserId), where('User2.uid', '==', currentUserId)),
				or(where('User1.uid', '==', otherUserId), where('User2.uid', '==', otherUserId))));
		
		const chatRoom = await getDocs(chatRoomQuery);

		if(!chatRoom.empty){
			foundRoom = true;
			console.log('chatRoom.docs[0].data', chatRoom.docs[0].id);
			navigation.navigate('ChatRoomEntryPoint',{
				currentUserId: currentUserId,
				otherUserId: otherUserId,
				roomId: chatRoom.docs[0].id,
				otherUserPfp: otherUserData.pfp});
		}
		const currentUserName = userData.Username;

		if(!foundRoom){
			const createdRoom = await addDoc(collection(db, 'PrivateChatRooms'), {
				User1: {
					Username: currentUserName, pfp: userData.pfp, uid: userData.uid 
				},	User2: {
					Username: otherUserName, pfp: otherUserData.pfp, uid: otherUserData.uid
				},
				quickReaction: {
					'category': 'people & body', 
					'emoji': '👍', 
					'keywords': ['ok', 'yep', 'great', 'nice', 'thumbs up', 'good job', 'well done', 'sounds good', 'thumbsup', 'yes', 'awesome', 'good', 'agree', 'accept', 'cool', 'hand', 'like', '+1', 'thumbs up sign'], 
					'name': 'thumbs up sign', 
					'order': 20, 
					'unified': '1F44D'}});
			await setDoc(doc(db, 'PrivateChatRooms', `${createdRoom.id}`, 'Messages', 'InitDoc'), {});
			navigation.navigate('ChatRoomEntryPoint', {
				currentUserId: currentUserId,
				otherUserId: otherUserId,
				roomId: createdRoom.id,
				otherUserPfp: otherUserData.pfp});
		}
	}catch(err){
		console.log('error in createAccount: ', err);
	}
}