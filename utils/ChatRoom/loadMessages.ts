import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc } from 'firebase/firestore';
import { Message } from '../../models/message';
import getStyles from './getStyles';
import { store } from '../../state/store';
import { styledMessage } from '../../models/styledMessage';
import { setReachedEndOfMessages } from '../../state/slices/chatRoomSlice';
const db = getFirestore();
/**
 * 1. Get 30 or less "added" messages
 * 2. When currentUser sends a new message:
 *    - If there was 30 message, the listener will fire first for local change,
 * 		with the oldest message "removed" and the newest message "added".
 * 	  - The new message's serverTime field inside .data() is null, so when the message is written to the backend
 *      the listener will fire again, this time only with the sent message, as "modified", because the serverTime is not null anymore. 
 * 
 **/
export async function addMessages(
	messageDoc: QuerySnapshot<DocumentData, DocumentData>,
	setStyledMessages: React.Dispatch<React.SetStateAction<styledMessage[]>>,
	setQueryStartAfter: React.Dispatch<React.SetStateAction<DocumentData | QueryDocumentSnapshot<DocumentData, DocumentData>>>
){
	const roomId = store.getState().ChatRoomDataSlice.roomId;
	const currentUserId = store.getState().ChatRoomDataSlice.currentUserId;
	console.log('called addMessages for: ', messageDoc.docChanges().map((doc) => {return {
		data: doc.doc.data(),
		pendingWrites: doc.doc.metadata.hasPendingWrites,
		changeType: doc.type,
		}}));
	
	let newMessages = [];
	messageDoc.docChanges().map((change, idx) => {
		//Set the query cursor to the oldest message, the first time it loads
		if(change.type === 'added'){
			if(messageDoc.docChanges().length === idx +1){
				setQueryStartAfter(prev => {if(prev == null){
					return change.doc;
				}else{
					return prev;
				}});
			}
		}
		newMessages.push({message: change.doc.data() as Message, uid: change.doc.id, changeType: change.type});
	});

	newMessages = newMessages.reverse();

	//If other user sent a message, update the seen field of it
	if(newMessages[newMessages.length - 1].message.senderId !== currentUserId && !newMessages[newMessages.length - 1].message.seen){
		console.log('updating seen of : ', newMessages[newMessages.length-1].message);
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`, 'Messages', `${newMessages[newMessages.length-1].uid}`), {
			...newMessages[newMessages.length - 1].message, seen: true
		});
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`), {lastMessage: {
			...newMessages[newMessages.length - 1].message, seen: true
		}});
	}

	//If other user sees the message, update the message in the state
	if(newMessages.length === 1 && newMessages[0].changeType === 'modified' && newMessages[0]?.message?.seen && newMessages[0]?.message?.senderId === currentUserId){
		console.log('newMessages[0], when updating setStyledMessages: ', newMessages[0]);
		setStyledMessages(prev => {
			const lastMess = {...prev.pop(), seen: true};
			return [ ...prev, lastMess];
		});
		return null;
	}

	//Add the "added" messages to the state
	newMessages = newMessages.filter((newMessage) => newMessage.changeType === 'added');
	if(newMessages.length < 1){
		return null;
	}
	setStyledMessages(prev => {
		if(prev != null){
			return [...prev.slice(0, -1), ...getStyles([prev[prev.length - 1], ...newMessages.map(m => m.message)]), ];
		}else{
			return getStyles(newMessages.map(m => m.message));
		}
	}); 
    
}

export async function loadMessageChunk(
	setStyledMessages: React.Dispatch<React.SetStateAction<styledMessage[]>>,
	setLoadingChunk: React.Dispatch<React.SetStateAction<boolean>>,
	queryStartAfter: QueryDocumentSnapshot<DocumentData, DocumentData> | DocumentData,
	setQueryStartAfter: React.Dispatch<React.SetStateAction<DocumentData | QueryDocumentSnapshot<DocumentData, DocumentData>>>
){
	try{
		const reachedEndOfMessages = store.getState().ChatRoomDataSlice.reachedEndOfMessages;
		//console.log('reachedEnd of Messages: ', reachedEndOfMessages);
		if(!reachedEndOfMessages){

			console.log('loading new chunk...');
			setLoadingChunk(true);
			
			const roomId = store.getState().ChatRoomDataSlice.roomId;
			const nextChunk = query(
				collection(db, 'PrivateChatRooms', `${roomId}`, 'Messages'),
				orderBy('serverTime', 'desc'),
				limit(30),
				startAfter(queryStartAfter)
				);
			let newMessages = (await getDocs(nextChunk)).docs.map((doc, idx, array) => {
				console.log('new data: ', doc.data().message);
				if(array.length === idx+1){
					setQueryStartAfter(doc);
				}
				return doc.data() as Message;
			});
			if(newMessages.length < 30){
				store.dispatch(setReachedEndOfMessages(true));
				if(newMessages.length < 1){
					console.log('newMessages.length < 1');
					setLoadingChunk(false);
					return null;
				}
			}
			newMessages = newMessages.reverse();

			//get the styles separately for the next batch
			const styledNewMessages = getStyles(newMessages);

			//Connect the styles of the already loaded, and the next batch of messages
			setStyledMessages(prev => {return [
				...styledNewMessages.slice(0,-1), //Prepend the next batch of messages, excluding the newest message in the next batch
				...getStyles([styledNewMessages[styledNewMessages.length - 1],prev[0]]), //Appends the new styles to the newest message in the next batch, and the oldest message in the already loaded messages
				...prev.slice(1)]; //The already loaded messages, excluding the oldest
			});
			setLoadingChunk(false);
		}
		
	}catch(err){
		console.warn('error in loadMessages/loadMessageChunk: ', err);
		console.log('query: ', queryStartAfter?.data());
	}
}