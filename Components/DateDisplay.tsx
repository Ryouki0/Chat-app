import React from 'react';
import {Text} from 'react-native';
const allMonths = ['Jan','Feb','Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DateDisplay({time, style, year=false, months=true, days=true, hours=true, minutes=true}) {
	if(!time){
		console.log('no time');
		return null;
	}
	return <Text style={{...style}}>
		{year? (new Date(time.seconds*1000).getFullYear().toString()) : (<></>)}
		{months ? (allMonths[new Date(time.seconds*1000).getMonth()]) : (<></>)} {days ? (new Date(time.seconds*1000).getDate()
			.toString()) : (<></>)} {hours ? (new Date(time.seconds*1000).getHours().toString()) : (<></>)}: 
		{minutes? (new Date(time.seconds*1000).getMinutes() < 10 ? (
			0 + new Date(time.seconds*1000).getMinutes().toString()
		) : (new Date(time.seconds*1000).getMinutes().toString())) : (<></>)} 
	</Text>;
}
