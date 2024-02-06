import React, {useContext, createContext, useState} from 'react';
import { ViewStyle } from 'react-native';

export type Theme = {container: ViewStyle; text: {color: string, textBackgroundColor?: string}; toggleTheme: () => void; isDark: boolean;};


export const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }
    
    let theme: Theme;

    if(isDarkMode){
        theme = {
            container: {
                flex: 1,
                backgroundColor: '#141414',
                alignItems: 'center',
                justifyContent: 'center',
        },
    text: {
        color: 'white',
    }, 
    toggleTheme: toggleTheme,
    isDark: true,
}

    }else{
        theme = {
            container: {
                flex: 1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
        },
        text: {
            color: 'black',
            textBackgroundColor: '#636363',
        },
        toggleTheme: toggleTheme,
        isDark: false,   
    }
    }

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}  