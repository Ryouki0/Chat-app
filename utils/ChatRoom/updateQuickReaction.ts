import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { store } from '../../state/store';
import { setQuickReaction } from '../../state/slices/chatRoomSlice';

const db = getFirestore();
export default async function updateQuickReaction(roomId: string, emoji: Emoji){
	if(!roomId || !emoji ){
		console.log('no roomId or emoji');
		return null;
	}
	await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`), {quickReaction: emoji});
	store.dispatch(setQuickReaction(emoji));
	console.log('updated reaction');
}