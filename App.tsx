import 'react-native-gesture-handler';
import React, {useContext, createContext} from 'react';
import './config/firebaseConfig';
import { Text, useColorScheme } from 'react-native';
import RootNavigation from './navigation';
import { ThemeProvider } from './hooks/useTheme';
(window.navigator as any).userAgent = "ReactNative"; //firestore db error without this https://github.com/firebase/firebase-js-sdk/issues/7962
export default function App(){
    
    return <>
    <ThemeProvider>
         <RootNavigation />
    </ThemeProvider>
    </> 
    
}