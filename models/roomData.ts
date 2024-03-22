import { Emoji } from "rn-emoji-picker/dist/interfaces";
import { Message } from "./message";

export interface RoomData{
    User1: {
        pfp: string,
        Username: string,
        uid: string,
    },
    User2: {
        pfp: string,
        Username: string,
        uid: string,
    },
    lastMessage: Message,
    quickReaction: Emoji,
}