
export interface lastMessage{
    extraStyles: [TextStyle], 
    id: string,
    message: string,
    seen: boolean,
    senderId: string,
    time: Timestamp,
    type?: string,
    userChange: boolean
}