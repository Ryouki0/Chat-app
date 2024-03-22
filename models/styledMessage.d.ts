import { Timestamp } from "firebase/firestore"

export interface styledMessage{
    extraStyles: [TextStyle], 
    id: string,
    message: string,
    seen: boolean,
    senderId: string,
    time: Timestamp,
    serverTime: Timestamp,
    type?: string,
    userChange: boolean
}