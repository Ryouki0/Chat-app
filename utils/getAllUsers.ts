

import { collection, getDocs, getFirestore } from 'firebase/firestore';
import getLastMessages from './getLastMessages';

const db = getFirestore();
export default async function getAllUsers(){
	return new Promise(async (resolve, reject) => {
		try{
			const allUsers = [];
			const querySnapshot = await getDocs(collection(db, 'Users'));
			querySnapshot.forEach((doc) => {
			//console.log(doc.data().Username);
				allUsers.push({
					name: doc.data().Username,
					pfp: doc.data().pfp,
					uid: doc.id,
				});
			});
			//console.log('allUsers: ', allUsers);
			const lastMessages = await getLastMessages(allUsers);
			resolve(lastMessages);
		}catch(err){
			reject(err);
		}
	});
}