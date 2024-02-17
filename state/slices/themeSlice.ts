import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState{
    theme: 'lightTheme' | 'darkTheme';
}  


const initialState: ThemeState = {theme : 'lightTheme'};

const themeSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        themeChange: (state) => {
            state.theme === 'lightTheme' ? state.theme = 'darkTheme' : state.theme ='lightTheme';
        }
    }
})

export const {themeChange} = themeSlice.actions;

export default themeSlice.reducer;