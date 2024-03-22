import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import { Emoji } from "rn-emoji-picker/dist/interfaces";

interface ChatRoomData{
    otherUserName: string,
    currentUserId: string,
    otherUserPfp: string | null,
    otherUserId: string,
    tappedMessage: string,
    roomId: string,
    quickReaction: Emoji,
    chatRoomSettingsState: boolean,
    reachedEndOfMessages: boolean,
}

const initialState: ChatRoomData = {
    otherUserName: null,
    currentUserId: null,
    otherUserPfp: null,
    otherUserId: null,
    tappedMessage: null,
    roomId: null,
    quickReaction: null,
    chatRoomSettingsState: false,
    reachedEndOfMessages: false,
}

const ChatRoomDataSlice = createSlice({
    name: 'ChatRoomDataSlice',
    initialState: initialState,
    reducers: {
        setChatRoomData: (state, action: PayloadAction<ChatRoomData>) => {
           return {...action.payload};
        },
        setTappedMessage: (state, action: PayloadAction<string>) => {
            state.tappedMessage = action.payload;
        },
        setReachedEndOfMessages: (state, action: PayloadAction<boolean>) => {
            state.reachedEndOfMessages = action.payload;
        },
        setSettingsState: (state, action: PayloadAction<boolean>) => {
            state.chatRoomSettingsState = action.payload;
        },
        setQuickReaction: (state, action: PayloadAction<Emoji>) => {
            state.quickReaction = action.payload;
        }
    }
})

export const {setChatRoomData, setTappedMessage, setReachedEndOfMessages, setSettingsState, setQuickReaction} = ChatRoomDataSlice.actions;
export default ChatRoomDataSlice.reducer;