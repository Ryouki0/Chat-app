import react, { useEffect, useState } from 'react';
import { useAuthentication } from "../hooks/useAuthentication";
import AuthStack from './authStack';
import UserStack from './userStack';
import { User } from 'firebase/auth';
import { Text } from 'react-native-elements';
export default function RootNavigation(){
    const user = useAuthentication();           //user null by default, undefined if not logged in
    const [loading, setLoading] = useState<Boolean>(true);
    useEffect(()=>{
        async function isLoading(){
            if(user !== null){
                setLoading(false);
            }
        }
        isLoading();
    }, [user])

    return loading? <Text 
        style={{position: 'absolute', alignSelf: 'center', fontSize: 30}}>loading...
    </Text> : (
         user? <UserStack /> : <AuthStack />)
}
