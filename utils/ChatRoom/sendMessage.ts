
import { addDoc, collection, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import uid from 'react-native-uuid';
import {sendPushNotification} from '../../notification';
import { userData } from '../../models/userData';
import { store } from '../../state/store';
const db = getFirestore();

export default async function sendMessage(roomId: string, currentUserId: string, otherUserId: string, message: string, type: string){
	if(message === ''){
		console.log('No message');
		return -1;
	}
	try{
		const messageToSend = {
			message: message,
			type: type,
			time: new Date(),
			serverTime: serverTimestamp(),
			senderId: currentUserId,
			seen: false,
			id: String(uid.v4()),
		};
		await addDoc(collection(db, 'PrivateChatRooms', `${roomId}`, 'Messages'), {...messageToSend});

		await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`), {lastMessage: messageToSend});

		const currentUserData = store.getState().userDataSlice;
		
		const otherUserData = (await getDoc(doc(db, 'Users', `${otherUserId}`))).data() as userData;
		const token = otherUserData.expoPushToken;

		if(!token || !otherUserData.signedIn || otherUserData.mutedRooms?.includes(roomId)){
			console.log('no device token or signed out or muted');
		}else{
			sendPushNotification(token, currentUserData.Username, message );
		}
	}catch(err){
		console.log('error in sendMessage: ', err);
	}
}