import React, { useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { darkTheme, lightTheme } from '../constants/theme';
import { themeChange } from '../state/slices/themeSlice';

export default function ThemeChange() {
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme'? lightTheme : darkTheme;
	const dispatch = useDispatch();
	return <MaterialCommunityIcons name='theme-light-dark' 
		size={28}
		style={{marginRight: 10}}
		color={theme.primaryText.color}
		onPress={() => {
			dispatch(themeChange());
		}}
	/>;
}