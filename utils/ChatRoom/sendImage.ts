
import { pickImage } from '../pickImage';
import sendMessage from './sendMessage';

export default async function sendImage(roomId: string, currentUserId: string, otherUserId: string) {
	try{
		const refId = await pickImage(true);
		await sendMessage(roomId, currentUserId, otherUserId, refId, 'image');
	}catch(err){
		console.log('error in sendImage: ', err);
	}
   
}