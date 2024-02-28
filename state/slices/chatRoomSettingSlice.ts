import { createSlice} from '@reduxjs/toolkit';

interface chatRoomSettingState{
    isOn: boolean,
}

const initialState: chatRoomSettingState = {isOn: false};

const chatRoomSettingSlice = createSlice({
	name:'chatRoomSetting',
	initialState: initialState,
	reducers: {
		chatRoomSettingToggle: (state) => {
			state.isOn = !state.isOn;
		}
	}
});

export const {chatRoomSettingToggle} = chatRoomSettingSlice.actions;
export default chatRoomSettingSlice.reducer;