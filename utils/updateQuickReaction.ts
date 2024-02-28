import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';

const db = getFirestore();
export default async function updateQuickReaction(roomId: string, emoji: Emoji){
	if(!roomId || !emoji ){
		console.log('no roomId or emoji');
		return null;
	}
	await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`), {quickReaction: emoji});
	console.log('updated reaction');
}