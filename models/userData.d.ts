import { Timestamp } from 'firebase/firestore';

export interface user{
    name: string,
    pfp: string,
    uid: string,
}

export interface UserData{
    CreatedAt: Timestamp,
    Username: string,
    expoPushToken: string,
    mutedRooms?: string[],
    pfp: string,
    signedIn: boolean,
    uid: string,
}