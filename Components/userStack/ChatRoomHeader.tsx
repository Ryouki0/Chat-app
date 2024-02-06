import React, { useContext, useEffect, useState } from 'react';
import StorageImage from '../StorageImage';
import { Text } from 'react-native';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import {View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../hooks/useTheme';
const db = getFirestore();
export default function ChatRoomHeader({params}){
    console.log('params: ', params.otherUserID);
    const theme = useContext(ThemeContext);
    const [otherUserPfp, setOtherUserPfp] = useState(null);
    const [otherUserName, setOtherUserName] = useState(null);
    useFocusEffect(
        React.useCallback(() => {
            async function getData(){
                try{
                    const data = (await getDoc(doc(db,'Users', `${params.otherUserID}`))).data();
                    setOtherUserName(data.Username);
                    setOtherUserPfp(data.pfp);
                }catch(err){
                    console.log('error in chatroomheader: ', err);
                }
            }
            getData();
            return () => {
                setOtherUserName(null);
                setOtherUserPfp(null);
            }
        }, [params])
    )

    return <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <StorageImage imagePath={otherUserPfp} style={{width: 50, height: 50, borderRadius: 70}}></StorageImage>

        {otherUserName ? (
            <Text style={{color: theme.text.color}}>{otherUserName}</Text>
        ) : (
            <></>
        )}
    </View>
}