
export interface Room{
    lastMessage: {
        id: string,
        message: string,
        seen: boolean,
        senderId: string,
        time: Timestamp,
    },
    otherUser: {
        Username: string,
        pfp: string,
        uid: string,
    },
    chatRoomId: string,
}
