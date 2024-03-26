
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DocumentData, Query } from 'firebase/firestore';
import { Message } from '../../models/message';

interface ChatRoomState{
    chatRoomIds: any[],
    chatRoomQuery: Query<DocumentData, DocumentData>,
	chatHistory: {
		otherUser: {
			Username: string,
			pfp: string,
			uid: string
		},
		lastMessage: Message,
		chatRoomId: string
	}[]
}

const initialState: ChatRoomState = {
	chatRoomIds: [],
	chatRoomQuery: null,
	chatHistory: null,
};

const ChatRoomSlice = createSlice({
	name: 'ChatRoomSlice',
	initialState: initialState,
	reducers: {
		setChatRoomState: (state, action: PayloadAction<any[]>) => {
			state.chatRoomIds = action.payload;
		},
		setChatRoomQueryState: (state, action:PayloadAction<Query<DocumentData, DocumentData>>) => {
			state.chatRoomQuery = action.payload;
		},
		setChatHistory: (state, action: PayloadAction<
			{
				otherUser: {
					Username: string,
					pfp: string,
					uid: string
				},
				lastMessage: Message,
				chatRoomId: string
			}[]>
			) => {
			state.chatHistory = action.payload;
		}
	}
});

export const {setChatRoomState, setChatRoomQueryState, setChatHistory} = ChatRoomSlice.actions; 
export default ChatRoomSlice.reducer;