import React, { SetStateAction, useEffect, useState } from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { darkTheme, lightTheme } from '../../../constants/theme';
import { userData } from '../../../models/userData';
import { arrayUnion, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { store } from '../../../state/store';
import { setUserData, updateUserData } from '../../../state/slices/userDataSlice';
import { Emoji } from 'rn-emoji-picker/dist/interfaces';
import { EmojiCell } from 'rn-emoji-picker/dist/emojiCell';
import { TouchableOpacity } from 'react-native';


const db = getFirestore();

function getSettings(roomId: string, userData: userData){
	const isNotificationsOn = userData.mutedRooms?.includes(roomId);
	return {isNotificationsOn};
}

async function toggleNotifications(roomId: string, userData: userData){
	try{
		if(userData.mutedRooms?.includes(roomId)){
			const newMutedRooms = userData.mutedRooms.filter((room: string) => room !== roomId);
			await updateDoc(doc(db, 'Users', `${userData.uid}`), {mutedRooms: newMutedRooms});
			store.dispatch(updateUserData({element: 'mutedRooms', newValue: newMutedRooms}));
		}else{
			await updateDoc(doc(db,'Users', `${userData.uid}`), {mutedRooms: arrayUnion(roomId)});
			const newMutedRooms = [...userData.mutedRooms, roomId];
			store.dispatch(updateUserData({element: 'mutedRooms', newValue: newMutedRooms}));
		}
	}catch(err){
		console.log('error in toggleNotifications: ', err);
	}
    
}

export default React.memo(function({setEmojiPicker}: React.PropsWithChildren<{
    setEmojiPicker: React.Dispatch<SetStateAction<boolean>>
}>) {
	const userDataSlice = useSelector((state: RootState) => {return state.userDataSlice;});
	const roomId = useSelector((state: RootState) => {return state.ChatRoomDataSlice.roomId});
	const quickReaction = useSelector((state: RootState) => {return state.ChatRoomDataSlice.quickReaction});
	const [isNotificationsOn, setIsNotificationsOn] = useState<boolean>(getSettings(roomId, userDataSlice).isNotificationsOn);
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	console.log('userData mutedrooms: ', userDataSlice?.mutedRooms);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: '#939393',
			borderColor: themeState === 'lightTheme' ? '#141414' : '#c7c8c7',
			borderWidth: 1,
			marginRight: 20, 
			borderRadius: 10,
			position: 'absolute',
			zIndex: 10,
			right: 0,
		},
	});

	return <>
		<View style={styles.container}>
			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
				<Text style={[theme.primaryText, {margin: 10}]}>Mute this room</Text>
				<Switch onValueChange={() => {toggleNotifications(roomId, userDataSlice); 
					setIsNotificationsOn(!isNotificationsOn);}} value={isNotificationsOn}>
				</Switch>
			</View>
			<TouchableOpacity onPress={() => {setEmojiPicker(emojiState => !emojiState);}}>
				<View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between'}}>
					<Text style={[theme.primaryText, {margin: 10}]}>
                    Quick reaction
					</Text>
					<EmojiCell emoji={quickReaction} colSize={30} onPress={() => {}}></EmojiCell>
				</View>
			</TouchableOpacity>
		</View>
        
	</>;
});
