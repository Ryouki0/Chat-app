
import React, { useEffect } from 'react';
import { useState } from 'react';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import sendMessage from '../utils/sendMessage';
import getStyles from '../utils/getStyles';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import LastMessage from './LastMessage';

const db = getFirestore();

export default function ChatRoom({route, navigation}) {

    const roomID = route.params.roomID;
    const currentUserID = route.params.currentUserID;
    const otherUserID = route.params.otherUserID;

    const [messToSend, setMessToSend] = useState(null);
    const [messages, setMessages] = useState(null);
    const [otherUserPfp, setOtherUserPfp] = useState(null);
    useFocusEffect(
        React.useCallback(() => {
            const observer = onSnapshot(doc(db, 'PrivateChatRooms', `${roomID}`), () => {getMessages()});

            async function getPfp() {
                const pfp = (await getDoc(doc(db, 'Users', `${otherUserID}`))).data().pfp;
                setOtherUserPfp(pfp);
            }

            async function getMessages() {
                const messages = (await getDoc(doc(db, 'PrivateChatRooms', `${roomID}`))).data().Messages;
                setMessages(getStyles(currentUserID, messages));
                console.log('getMessages');
            }
        getMessages();
        getPfp();
        return () => observer();
        }, [otherUserID])
    )
        
    

    console.log(roomID, 'currentID: ', currentUserID, 'otherUserID', otherUserID);
    return <>
    <ScrollView>
        {messages ? (
            messages.map((mess, idx: number) => {
                console.log('mess: ', mess);
                return <>
                    {messages.length === idx + 1 ? (
                        <LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp}></LastMessage>
                    ) : (
                        mess.userChange ? (
                            <LastMessage message={mess} currentUserID={currentUserID} otherUserPfp={otherUserPfp}></LastMessage>
                        ) : (
                            <Text style={[mess.extraStyles]} key={idx} >{mess.message}</Text>
                        )
                    )}
                </>
            })
        ) : (<></>)}
    </ScrollView>

        <Input value={messToSend} placeholder='Type something...' onChangeText={(text) => {
            setMessToSend(text)}} onSubmitEditing={() => {
                sendMessage(roomID, currentUserID, messToSend)
            }}></Input>
    </>
}

const styles = StyleSheet.create({
    right: {
        alignSelf:'flex-end', 
        borderWidth: 1, 
        padding: 10, 
        marginBottom: 2, 
        borderColor: '#3b3b3b',
        borderRadius: 30,
        marginRight: 20,
        maxWidth: 275,
        color: 'white',
        backgroundColor: '#3b3b3b',
    },
    left: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        marginBottom: 2, 
        padding: 10, 
        borderRadius: 30, 
        maxWidth: 275,
        borderColor: '#3b3b3b',
        color: 'black',
        marginLeft: 44,
    }
})