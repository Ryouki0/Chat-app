import { configureStore, } from '@reduxjs/toolkit';
import themeSlice from './slices/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatRoomsSlice from './slices/chatRoomHistorySlice';
import cachedImageSlice from './slices/cachedImageSlice';
import userDataSlice from './slices/userDataSlice';
import ChatRoomDataSlice from './slices/chatRoomSlice';
import messagesSlice from './slices/messagesSlice';
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
};

const persistThemeSlice = persistReducer(persistConfig, themeSlice);
export const store = configureStore({
	reducer: {
		themeSlice: persistThemeSlice,
		chatRoomSlice: chatRoomsSlice,
		cachedImageSlice: cachedImageSlice,
		userDataSlice: userDataSlice,
		ChatRoomDataSlice: ChatRoomDataSlice,
		RoomMessages: messagesSlice,
	},
	middleware: (getDefaultMiddleWare) => {return getDefaultMiddleWare({serializableCheck: false});}
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;