import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { styledMessage } from "../../models/styledMessage";


interface RoomMessages{
    roomId: string,
    messages: styledMessage[],
}

const initialState: RoomMessages = {
    roomId: null,
    messages: [],
}

const MessagesSlice = createSlice({
    name: 'MessagesSlice',
    initialState: initialState,
    reducers: {
        setRoomMessages: (state, action: PayloadAction<RoomMessages>) => {
            return {...action.payload};
        },
        addMessage: (state, action: PayloadAction<styledMessage>) => {
            state.messages.push(action.payload);
        }
    }
})

export const {setRoomMessages, addMessage} = MessagesSlice.actions;
export default MessagesSlice.reducer;