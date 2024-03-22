import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import StorageImage from '../StorageImage';
import { images } from '../../constants/images';
import { Room } from '../../models/room';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import { getAuth } from 'firebase/auth';
import DateDisplay from '../DateDisplay';
import { AntDesign } from '@expo/vector-icons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
const auth = getAuth();

export default function DisplayChatHistory({chatHistory, navigation}: React.PropsWithChildren<{
	chatHistory: Room[],
	navigation: any,
}>){

	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState ==='lightTheme' ? lightTheme : darkTheme;

	return <>
		{chatHistory ? (
			chatHistory.map((room: Room) => {
				return !room.lastMessage ? (<></>) : (
					<TouchableOpacity key={room.otherUser.uid} 
						style={{
							alignItems: 'center', flexDirection: 'row',
						}}
						onPress={() => {
							console.log('roomdata when navigating: ', room.otherUser.Username, room.chatRoomId);
							navigation.navigate('ChatRoomEntryPoint', {
								currentUserId: auth.currentUser.uid,
								otherUserId: room.otherUser.uid,
								roomId: room.chatRoomId,
								otherUserPfp: room.otherUser.pfp});
						}}>
						<View style={{alignItems: 'center', flexDirection: 'row', flex: 1}}>
							<StorageImage imagePath={room.otherUser.pfp} style={images.pfp}></StorageImage>
							<View>
								<Text style={theme.primaryText}>
									{room.otherUser.Username}
								</Text>
								{room.lastMessage.senderId === auth.currentUser.uid ? (
									<Text style={theme.secondaryText}>
										{room.lastMessage.message.length > 15 ? (
											<Text style={theme.secondaryText}>
                                        You: {room.lastMessage.message.slice(0, 15)}{'... • '}
											</Text>
										) : (
											<Text style={theme.secondaryText}>
                                        You: {room.lastMessage.message}{' • '}
											</Text>
										)}
										<DateDisplay time={room.lastMessage.time} style={{...theme.secondaryText}} ></DateDisplay>
									</Text>
								) : (
									<Text style={theme.secondaryText}>
										{room.lastMessage.message.length > 18 ? (
											<>
												{room.lastMessage.seen ? (
													<Text style={theme.secondaryText}>
														{room.lastMessage.message.slice(0,18)}{'... • '}
													</Text>
												) : (
													<Text style={[theme.secondaryText, {fontWeight: 'bold'}]}>
														{room.lastMessage.message.slice(0,18)}{'... • '}
													</Text>
												)}
											</>
										) : (
											<>
												{room.lastMessage.seen ? (
													<Text style={theme.secondaryText}>
														{room.lastMessage.message}{' • '}
													</Text>
												) : (
													<Text style={[theme.secondaryText, {fontWeight: 'bold'}]}>
														{room.lastMessage.message}{' • '}
													</Text>
												)}
											</>
										)}
										<DateDisplay time={room.lastMessage.time} style={{...theme.secondaryText}} ></DateDisplay>
									</Text>
								)} 
							</View>
						</View>
						{room.lastMessage.senderId === auth.currentUser.uid ? (
							room.lastMessage.seen ? (
								<StorageImage imagePath={room.otherUser.pfp} style={[images.pfp, {width: 13, height: 13}]} />
							) : (
								<AntDesign name='checkcircle' color={theme.secondaryText.color} size={13} style={{paddingBottom: -20, paddingRight: 5}}></AntDesign>
							)
						) : (<></>)}
					</TouchableOpacity>);
			})
		) : (<Text style={[theme.primaryText, {fontSize: 17, alignSelf: 'center'}]}>No Chat history yet</Text>)}
        
	</>;
    
}