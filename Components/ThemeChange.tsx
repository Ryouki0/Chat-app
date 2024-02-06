import React, { useContext } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ThemeChange() {
	const theme = useContext(ThemeContext);
	return <MaterialCommunityIcons name='theme-light-dark' 
		size={28}
		style={{marginRight: 10}}
		color={theme.text.color}
		onPress={() => {theme.toggleTheme();}}
	/>;
}