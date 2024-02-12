import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

export async function sendPushNotification(token: string, title: string, message: string) {
	await fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=AAAAHnxOnW8:APA91bEPggeQ1KZwaY0A2kIWjDGGyGW0trrqSd9inhdy8bZ5YG62KWShL-8Q3o3Oq6mLm5_4OhAdnFnvm4YALI-h5qSSeEVoQE9CTgwxmzAIu98cnZSxEzZgivwxxKcpyj12Sk_uJVsj`,
  },
  body: JSON.stringify({
    to: token,
    priority: 'normal',
    data: {
      experienceId: '@ryouki0/expotest2',
      scopeKey: '@ryouki0/expotest2',
      title: title,
      message: message,
    },
  }),
})
}  

export async function registerForPushNotificationsAsync() {
	let token;
	console.log('inside registerForPushNotification.................................................................');
	if (Platform.OS === 'android') {
		console.log('Platform.OS ============== ANDROID================================');
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}
  
	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		console.log('FINAL STATUS:             ', finalStatus);
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getDevicePushTokenAsync()).data;;
		console.log('TOKEN:                  ',token);
	} else {
		alert('Must use physical device for Push Notifications');
	}
	return token;
}