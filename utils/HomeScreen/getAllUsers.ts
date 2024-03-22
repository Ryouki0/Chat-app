

import { collection, getDocs, getFirestore } from 'firebase/firestore';

import { User } from '../../models/userData';
const db = getFirestore();
export default async function getAllUsers(){
	return new Promise(async (resolve, reject) => {
		try{
			const allUsers: User[] = []; 
			const querySnapshot = await getDocs(collection(db, 'Users'));
			querySnapshot.forEach((doc) => {
			//console.log(doc.data().Username);
				allUsers.push({
					name: doc.data().Username,
					pfp: doc.data().pfp,
					uid: doc.id,
				});
			});
			resolve(allUsers);
		}catch(err){
			reject(err);
		}
	});
}