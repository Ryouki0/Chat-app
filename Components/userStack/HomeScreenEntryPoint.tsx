import { useFocusEffect } from '@react-navigation/native';
import { User, getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, or, orderBy, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { store } from '../../state/store';
import { setUserData } from '../../state/slices/userDataSlice';
import { UserData } from '../../models/UserData';
import { ActivityIndicator, View } from 'react-native';
import getChatHistory from '../../utils/HomeScreen/getChatHistory';
import { setChatRoomQueryState } from '../../state/slices/chatRoomHistorySlice';
const db = getFirestore();
const auth = getAuth();
export default function HomeScreenEntryPoint({route, navigation}){
    const [loadingUserData, setLoadingUserData] = useState(true);
    useFocusEffect(
        React.useCallback(() => {
            const getUserData = async () => 
            {
                const userData = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data() as UserData;
                store.dispatch(setUserData(userData));
                setLoadingUserData(false);
            }
            getUserData();
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            const dispatchChatHistory = async () => {
                console.log('dispatchChatChistory');
                const userName = store.getState().userDataSlice.Username;
                const chatHistoryQuery = query(collection(db, 'PrivateChatRooms'), 
		            or(
                        where('User1.Username', '==', userName), 
			            where('User2.Username', '==', userName),
		            ), 
                    orderBy('lastMessage.serverTime', 'desc'));
	            store.dispatch(setChatRoomQueryState(chatHistoryQuery));
                await getChatHistory();
                navigation.navigate('Chats');
            }
            if(!loadingUserData){
                dispatchChatHistory();
            }
        }, [loadingUserData])
    )

    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={50}></ActivityIndicator>
    </View>
}