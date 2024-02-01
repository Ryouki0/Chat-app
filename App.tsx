
import react from 'react';
import './config/firebaseConfig';
import RootNavigation from './navigation';
(window.navigator as any).userAgent = "ReactNative"; //firestore db error without this https://github.com/firebase/firebase-js-sdk/issues/7962
export default function App(){
    return (
        <RootNavigation />
    )
}