import { Timestamp } from 'firebase/firestore';

export interface User{
    name: string,
    pfp: string,
    uid: string,
}

export interface userData{
    CreatedAt: Timestamp,
    Username: string,
    expoPushToken: string,
    mutedRooms?: string[],
    pfp: string,
    signedIn: boolean,
    uid: string,
}