import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import { Emoji } from "rn-emoji-picker/dist/interfaces";

interface ChatRoomData{
    otherUserName: string,
    currentUserId: string,
    otherUserPfp: string | null,
    setTappedMessage: Dispatch<SetStateAction<string>>,
    roomId: string,
    quickReaction: Emoji,
    chatRoomSettingsState: boolean,
}

const initialState: ChatRoomData = {
    otherUserName: null,
    currentUserId: null,
    otherUserPfp: null,
    setTappedMessage: null,
    roomId: null,
    quickReaction: null,
    chatRoomSettingsState: false,
}

const ChatRoomDataSlice = createSlice({
    name: 'ChatRoomDataSlice',
    initialState: initialState,
    reducers: {
        setChatRoomData: (state, action: PayloadAction<ChatRoomData>) => {
           return {...action.payload};
        }
    }
})

export const {setChatRoomData} = ChatRoomDataSlice.actions;
export default ChatRoomDataSlice.reducer;