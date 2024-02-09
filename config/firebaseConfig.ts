
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import  Constants  from "expo-constants";
const firebaseConfig = {
        apiKey: Constants.expoConfig.extra.firebaseApiKey,
        authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
        databaseURL: Constants.expoConfig.extra.firebaseDatabaseUrl,
        projectId: Constants.expoConfig.extra.firebaseProjectId,
        storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
        messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
        appId: Constants.expoConfig.extra.firebaseAppId,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export default app;