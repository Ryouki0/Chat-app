import React from 'react';
import { UseDispatch, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { increment, decrement} from '../state/slices/testSlice';
import { Button, View, Text } from 'react-native';
export default function Counter(){
	const value = useSelector((state: RootState) => {return state?.testSlice.value;});
	const dispatch = useDispatch();
	return <View>
		<Button title='test counter' onPress={() => dispatch(increment())}></Button>
		<Text style={{color: 'red'}}>{value}</Text>
	</View>;
}