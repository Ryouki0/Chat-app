import react, { useEffect, useState } from 'react';
import { useAuthentication } from "../hooks/useAuthentication";
import AuthStack from './authStack';
import UserStack from './userStack';

import LoadingScreen from '../Components/LoadingScreen';
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

    return loading? <LoadingScreen /> : 
         (user? <>
            <UserStack /> 
         </> :
          <AuthStack />)
}
