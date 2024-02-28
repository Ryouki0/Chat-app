import { Timestamp } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface Message {
    id: string,
    message: string,
    seen: boolean,
    time: Timestamp,
    senderId: string,
}