
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const db = getFirestore();

export default async function sendMessage(roomID: string, currentUserID: string, message: string){
    try{
        await updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: arrayUnion({
            message: message,
            time: new Date(),
            user: currentUserID,
            seen: false
            }
        )})

    }catch(err){
        console.log('error in sendMessage: ', err);
    }
}