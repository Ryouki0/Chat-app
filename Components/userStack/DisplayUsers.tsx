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
import { images } from '../../constants/images';
const auth = getAuth();


export default function DisplayUsers({navigation, usersToDisplay}){
    
	const currentUser = auth.currentUser;
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	console.log('usersToDisplay:', usersToDisplay);
	return (
		usersToDisplay ? (
			usersToDisplay.map((user) => {
				console.log('user: ', user);
				return (
					<TouchableOpacity key={user.uid} onPress={() => {
						createChatRoom(currentUser.uid, user.uid, navigation);
					}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<StorageImage imagePath={user.pfp} style={images.pfp} />
							<Text style={theme.primaryText}>
								{user.name}
							</Text>
						</View>
					</TouchableOpacity>	
				);
			}
			) 
		) : (
			<></>
		)
	);
              
}

