import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import createChatRoom from '../../utils/createChatRoom';
import StorageImage from '../StorageImage';
import { Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import DateDisplay from '../DateDisplay';
import LoadingScreen from '../LoadingScreen';
import { AntDesign } from '@expo/vector-icons';

const auth = getAuth();

interface UserWithMessage{
	User1: string,
	User2: string,
	lastMessage: {
		id: string,
		message: string,
		seen: boolean,
		time: Timestamp,
		user: string,
	},
	name: string,
	pfp: string,
	uid: string,
}

export default function DisplayUsers({navigation, allUsers}){
    
    const currentUser = auth.currentUser;

    const themeState = useSelector((state: RootState) => {return state.themeSlice.theme});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

    return (
        allUsers ? ( 
            allUsers.map((user: UserWithMessage) => {
                //console.log('user: ', user);
                
                return <TouchableOpacity key={user.uid} onPress={() => {
                    createChatRoom(currentUser.uid, user.uid, navigation);
                }} style={{flexDirection: 'row', alignItems: 'center'}}> 
                    <View  style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
                        <StorageImage imagePath={user.pfp} style={styles.image} />
                        <View>
                            <Text style={theme.primaryText}>
                                {user.name}
                            </Text>

                            {user.lastMessage.user === currentUser.uid ? (
                                <Text style={theme.secondaryText}>
                                    You: {user.lastMessage.message}{'  '}·{'  '}
                                    <DateDisplay time={user.lastMessage.time} style={theme.secondaryText}></DateDisplay>
                                </Text>   
                            ):(
                                <Text style={theme.secondaryText}>
                                    {user.lastMessage.message}{'  '}{user.lastMessage.time && '·'}{'  '}
                                    <DateDisplay time={user.lastMessage.time} style={theme.secondaryText}></DateDisplay>
                                </Text>
                            )}
                        </View>
                    </View>
                    {user.lastMessage.user === currentUser.uid && (
                            user.lastMessage.seen ? <StorageImage imagePath={user.pfp} style={[styles.image, 
                            {width: 20, height: 20, alignSelf: 'flex-end'}]}/> : (
                                <AntDesign name='checkcircle' color={theme.secondaryText.color} size={13}></AntDesign>
                            )
                        )
                    }
                </TouchableOpacity>
            })
        ) : (
            <LoadingScreen></LoadingScreen>
        )
    )
}

const styles = {
    image: {
		width: 60,
		height: 60,
		padding: 4,
		borderRadius: 300,
		marginLeft: 10,
		marginRight: 4,
		marginBottom: 2,
	},
}