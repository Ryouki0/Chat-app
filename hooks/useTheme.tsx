import React, {useContext, createContext, useState} from 'react';
import { ViewStyle } from 'react-native';

export type Theme = {container: ViewStyle; text: {color: string, textBackgroundColor?: string}; toggleTheme: () => void; isDark: boolean;
text2: {color: string, fontSize?: number, fontWeight?: string}};


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
    text2: {
        color: '#B4B4B8',
        fontSize: 14,
        fontWeight: '400',
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
        text2: {
            color: 'black',
            fontSize: 14,
            fontWeight: '400',
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