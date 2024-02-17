import { createSlice, configureStore, } from '@reduxjs/toolkit'
import testSlice from './slices/testSlice';
import themeSlice from './slices/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };

const persistTestSlice = persistReducer(persistConfig, testSlice,);
const persistThemeSlice = persistReducer(persistConfig, themeSlice);
export const store = configureStore({
    reducer: {
        testSlice: persistTestSlice,
        themeSlice: persistThemeSlice,
    },
    middleware: (getDefaultMiddleWare) => {return getDefaultMiddleWare({serializableCheck: false})}
})
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;