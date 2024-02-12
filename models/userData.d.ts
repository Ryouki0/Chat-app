import { Timestamp } from "firebase/firestore";

export default interface UserData{
    CreatedAt: Timestamp,
    PrivateChatRooms: [
        {
            chatRoomId: string,
            lastMessage: {
                message: string,
                time: Timestamp,
                user: string,
                seen?: boolean,
            },
            otherUser: string,
        },
    ],
    Username: string,
    expoPushToken: string,
    pfp: string,
    uid: string,
}