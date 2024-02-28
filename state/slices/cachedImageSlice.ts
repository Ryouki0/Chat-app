import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface base64Images{
    images: [{
        name: string,
        base64: string,
    }]
}

const initialState: base64Images = {images: [{name: '', base64: ''}]};

const cachedImageSlice = createSlice({
	name: 'cachedImageSlice',
	initialState: initialState,
	reducers: {
		addImage: (state, action: PayloadAction<{name:string,base64:string}>) => {
			state.images.push(action.payload);
		}
	},
});

export const {addImage} = cachedImageSlice.actions;
export default cachedImageSlice.reducer;
