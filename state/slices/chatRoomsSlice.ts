
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DocumentData, Query } from 'firebase/firestore';

interface ChatRoomState{
    chatRoomIds: any[],
    chatRoomQuery: Query<DocumentData, DocumentData>,
}

const initialState: ChatRoomState = {
	chatRoomIds: [],
	chatRoomQuery: null,
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
		}
	}
});

export const {setChatRoomState, setChatRoomQueryState} = ChatRoomSlice.actions; 
export default ChatRoomSlice.reducer;