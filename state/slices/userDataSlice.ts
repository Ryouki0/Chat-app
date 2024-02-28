import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
import { userData } from "../../models/userData";

const initialState: userData = {
    CreatedAt: null,
    Username: null,
    expoPushToken: null,
    mutedRooms: null,
    pfp: null,
    signedIn: null,
    uid: null,
}

const userDataSlice = createSlice({
    name: 'userDataSlice',
    initialState: initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<userData>) => {
            return action.payload
        },
        updateUserData: (state, action: PayloadAction<{element: string, newValue: any}>) => {
            state[action.payload.element] = action.payload.newValue;
        }
    }
})

export const {setUserData, updateUserData} = userDataSlice.actions;
export default userDataSlice.reducer;