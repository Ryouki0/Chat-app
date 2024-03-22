import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc } from 'firebase/firestore';
import { Message } from '../../models/message';
import getStyles from './getStyles';
import { store } from '../../state/store';
import { styledMessage } from '../../models/styledMessage';
import { setReachedEndOfMessages } from '../../state/slices/chatRoomSlice';
const db = getFirestore();

export async function addMessages(
	messageDoc: QuerySnapshot<DocumentData, DocumentData>,
	setStyledMessages: React.Dispatch<React.SetStateAction<styledMessage[]>>,
	queryStartAfter: QueryDocumentSnapshot<DocumentData, DocumentData> | DocumentData,
	setQueryStartAfter: React.Dispatch<React.SetStateAction<DocumentData | QueryDocumentSnapshot<DocumentData, DocumentData>>>
){
	const roomId = store.getState().ChatRoomDataSlice.roomId;
	const currentUserId = store.getState().ChatRoomDataSlice.currentUserId;
	
	//console.log('roomdata in loadMessages/addMessage:',roomData);
	//console.log('hasPendingWrites?:', messageDoc.metadata.hasPendingWrites);
    
	let newMessages = [];
	messageDoc.docChanges().map((change, idx) => {
		if(change.type === 'added'){
			//console.log('change.doc.data.message: ', change.doc.data().message);
			if(messageDoc.docChanges().length === idx +1){
				console.log('setQuery with query: ', queryStartAfter);
				setQueryStartAfter(prev => {if(prev == null){
					return change.doc;
				}else{
					return prev;
				}});
			}
			newMessages.push({...change.doc.data() as Message, uid: change.doc.id, changeType: change.type});
		}
	});
	if(newMessages.length < 1){
		return;
	}

	newMessages = newMessages.reverse();
	if(newMessages[newMessages.length - 1].senderId !== currentUserId && !newMessages[newMessages.length - 1].seen){
		console.log('updating seen of : ', newMessages[newMessages.length-1].message);
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`, 'Messages', `${newMessages[newMessages.length-1].uid}`), {
			...newMessages[newMessages.length - 1], seen: true
		});
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomId}`), {lastMessage: {
			...newMessages[newMessages.length - 1], seen: true
		}});
	}

	if(newMessages.length === 1 && newMessages[0].changeType === 'modified'){
		setStyledMessages(prev => {
			const lastMess = {...prev.pop(), seen: true};
			return [ ...prev, lastMess,];
		});
	}
	console.log('setting setStyledMessages with hasPendingWrites: ', messageDoc.metadata.hasPendingWrites);
	setStyledMessages(prev => {
		if(prev != null){
			return [...prev.slice(0, -1), ...getStyles([prev[prev.length - 1], ...newMessages]), ];
		}else{
			return getStyles(newMessages);
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
		console.log('reachedEnd of Messages: ', reachedEndOfMessages);
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
			const styledNewMessages = getStyles(newMessages);
			setStyledMessages(prev => {return [
				...styledNewMessages.slice(0,-1),
				...getStyles([styledNewMessages[styledNewMessages.length - 1],prev[0]]), 
				...prev.slice(1)];
			});
			setLoadingChunk(false);
		}
		
	}catch(err){
		console.warn('error in loadMessages/loadMessageChunk: ', err);
		console.log('query: ', queryStartAfter?.data());
	}
}