
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import uid from 'react-native-uuid';
import {sendPushNotification} from '../notification';
import { userData } from '../models/userData';
import { store } from '../state/store';
const db = getFirestore();

export default async function sendMessage(roomID: string, currentUserID: string, otherUserID: string, message: string, type: string){
	if(message === ''){
		console.log('No message');
		return -1;
	}
	try{
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: arrayUnion({
			message: message,
			type: type,
			time: new Date(),
			senderId: currentUserID,
			seen: false,
			id: String(uid.v4()),
		}
		), lastMessageTime: new Date()});
		const currentUserData = store.getState().userDataSlice;
		
		const otherUserData = (await getDoc(doc(db, 'Users', `${otherUserID}`))).data() as userData;
		const token = otherUserData.expoPushToken;

		if(!token || !otherUserData.signedIn || otherUserData.mutedRooms?.includes(roomID)){
			console.log('no device token or signed out or muted');
		}else{
			sendPushNotification(token, currentUserData.Username, message );
		}
	}catch(err){
		console.log('error in sendMessage: ', err);
	}
}