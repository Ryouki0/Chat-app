

import react from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

const db = getFirestore();
export default async function getAllUsers(auth: Auth){
    return new Promise(async (resolve, reject) => {
        const allUsers = [];
        const querySnapshot = await getDocs(collection(db, 'Users'));
        querySnapshot.forEach((doc) => {
            //console.log(doc.data().Username);
            allUsers.push({
                name: doc.data().Username,
                pfp: doc.data().pfp,
                uid: doc.id,
            })
        })
        resolve(allUsers);
    })
}