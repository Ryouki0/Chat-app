import React, { Dispatch } from 'react';
import { styledMessage } from '../../../models/styledMessage';
import StorageImage from '../../StorageImage';
import { images } from '../../../constants/images';
import LastMessage from '../LastMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';

export default function ImageMessage({mess, length, idx,}: React.PropsWithChildren<{
    mess: styledMessage,
    length: number,
    idx: number,
}>){
    const chatRoomData = useSelector((state: RootState) => {return state.ChatRoomDataSlice});
    const currentUserId = chatRoomData.currentUserId;
    const otherUserPfp = chatRoomData.otherUserPfp;
    const setTappedMessage = chatRoomData.setTappedMessage;
    return <>
    {length === idx + 1 ? (
        <LastMessage message={mess} currentUserID={currentUserId} otherUserPfp={otherUserPfp} setTappedMessage={setTappedMessage}></LastMessage>
    ) : (mess.userChange ? (
        <LastMessage message={mess} currentUserID={currentUserId} otherUserPfp={otherUserPfp} setTappedMessage={setTappedMessage}></LastMessage>
    ) : (
    <StorageImage imagePath={mess.message} style={[mess.extraStyles, images.imageMessage]}></StorageImage>))}
    </>
}

