
import { getAuth } from 'firebase/auth';
import { DocumentSnapshot, collection, doc, getDoc, getDocs, getFirestore, or, orderBy, query, where } from 'firebase/firestore';
import { setChatRoomQueryState, setChatRoomState } from '../../state/slices/chatRoomHistorySlice';
import { store } from '../../state/store';
const auth = getAuth();
const db = getFirestore();


interface User{
	Username: string,
	pfp: string,
	uid: string,
}

export default async function getChatHistory(){
	//const chatRooms = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data().PrivateChatRooms;
	const userData = store.getState().userDataSlice;
	//console.log('userData in getChatHistory: ', userData);
	const chatHistoryQuery = query(collection(db, 'PrivateChatRooms'), 
		or(where('User1.Username', '==', userData.Username), 
			where('User2.Username', '==', userData.Username)
		), orderBy('lastMessage.serverTime', 'desc'));

	const chatRoomsWithMessage = [];

	const qSnapShot = await getDocs(chatHistoryQuery);
	if(qSnapShot.empty){
		console.log('query empty : ', qSnapShot.empty);
		return null;
	}


	const chatRoomIds = [];
	qSnapShot.forEach((doc: DocumentSnapshot) => {
		let otherUser: User = doc.data().User1;
		let currentUserNumber = 'User2';
		if(doc.data().User1.Username === userData.Username){
			otherUser = doc.data().User2;
			currentUserNumber = 'User1';
		} 

		chatRoomIds.push({
			chatRoomId: doc.id, 
			currentUserNumber: currentUserNumber,  
			Username: userData.Username,
			pfp: userData.pfp,
			uid: userData.uid,
		});
		chatRoomsWithMessage.push({otherUser,
			chatRoomId: doc.id,
			lastMessage: doc.data().lastMessage});
	});
	
	store.dispatch(setChatRoomState(chatRoomIds ));
	store.dispatch(setChatRoomQueryState(chatHistoryQuery));
	
	return chatRoomsWithMessage;
}