import react, { useEffect, useState } from 'react';
import { useAuthentication } from "../hooks/useAuthentication";
import AuthStack from './authStack';
import UserStack from './userStack';
import { User } from 'firebase/auth';
import { Text } from 'react-native-elements';
export default function RootNavigation(){
    const user = useAuthentication();
    return user? <UserStack /> : <AuthStack />
}
