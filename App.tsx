
import 'react-native-gesture-handler';
import React, {useContext, createContext, useState, useEffect} from 'react';
import './config/firebaseConfig';
import RootNavigation from './navigation';
import { RootState, store } from './state/store';
import {Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {persistor} from './state/store';
// if(__DEV__) {
//     import("./ReactotronConfig")
// }
(window.navigator as any).userAgent = "ReactNative"; //firestore db error without this https://github.com/firebase/firebase-js-sdk/issues/7962
export default function App(){
   
    return <>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
                <RootNavigation />
        </PersistGate>
    </Provider>
    
    </> 
    
}