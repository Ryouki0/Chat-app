
import { getAuth } from 'firebase/auth';
import { DocumentSnapshot, collection, doc, getDoc, getDocs, getFirestore, or, orderBy, query, where } from 'firebase/firestore';
import { setChatHistory, setChatRoomQueryState, setChatRoomState } from '../../state/slices/chatRoomHistorySlice';
import { store } from '../../state/store';
const auth = getAuth();
const db = getFirestore();


interface user{
	Username: string,
	pfp: string,
	uid: string,
}

export default async function getChatHistory(){
	//const chatRooms = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data().PrivateChatRooms;
	const pfp = store.getState().userDataSlice.pfp;
	const uid = store.getState().userDataSlice.uid;
	const userName = store.getState().userDataSlice.Username;

	const chatHistoryQuery = store.getState().chatRoomSlice.chatRoomQuery;

	const chatRoomsWithMessage = [];

	const qSnapShot = await getDocs(chatHistoryQuery);
	if(qSnapShot.empty){
		console.log('query empty : ', qSnapShot.empty);
		return null;
	}


	const chatRoomIds = [];
	qSnapShot.forEach((doc: DocumentSnapshot) => {
		let otherUser: user = doc.data().User1;
		let currentUserNumber = 'User2';
		if(doc.data().User1.Username === userName){
			otherUser = doc.data().User2;
			currentUserNumber = 'User1';
		}
		//chatRoomIds for updating the pfp in profile screen
		chatRoomIds.push({
			chatRoomId: doc.id, 
			currentUserNumber: currentUserNumber,  
			Username: userName,
			pfp: pfp,
			uid: uid,
		});
		chatRoomsWithMessage.push({otherUser,
			chatRoomId: doc.id,
			lastMessage: doc.data().lastMessage});
	});
	
	store.dispatch(setChatRoomState(chatRoomIds ));
	store.dispatch(setChatHistory(chatRoomsWithMessage));
	console.log('dispatched chatRoomHistory');
	return chatRoomsWithMessage;
}