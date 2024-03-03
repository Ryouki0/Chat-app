import React, { useState } from 'react';
import StorageImage from '../../StorageImage';
import { Text } from 'react-native';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import {View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { AntDesign } from '@expo/vector-icons';


const db = getFirestore();
export default function ChatRoomHeader({params}){

	const themeState = useSelector((state:RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;

	const [otherUserPfp, setOtherUserPfp] = useState(null);
	const [otherUserName, setOtherUserName] = useState(null);
	useFocusEffect(
		React.useCallback(() => {
			async function getData(){
				try{
					const data = (await getDoc(doc(db,'Users', `${params.route.params.otherUserID}`))).data();
					setOtherUserName(data.Username);
					setOtherUserPfp(data.pfp);
					console.log('otherUserPfp in chatRoomHeader: ', data.pfp);
				}catch(err){
					console.log('error in chatroomheader: ', err);
				}
			}
			getData();
			return () => {
				setOtherUserName(null);
				setOtherUserPfp(null);
			};
		}, [params])
	);

	return <View style={{flexDirection: 'row'}}>
		<View style={{flexDirection: 'row', alignItems: 'center'}}>
			<AntDesign name='arrowleft' size={26} color={theme.primaryText.color} onPress={()=>{
				params.navigation.navigate('Chats');
			}}/>
			<StorageImage imagePath={otherUserPfp} style={{width: 50, height: 50, borderRadius: 70, marginRight: 10, marginLeft: 5}}></StorageImage>
			{otherUserName && <Text style={{color: theme.primaryText.color, fontSize: 17, }}>{otherUserName}</Text>}
		</View>
	</View>; 
    

}