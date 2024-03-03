
import React, { useEffect } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useState } from 'react';
import { StyleProp} from 'react-native';
import Default_pfp from '../assets/Default_pfp.jpg';
import {Image, ImageStyle} from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { addImage } from '../state/slices/cachedImageSlice';


const storage = getStorage();

export default function StorageImage({imagePath, style}: React.PropsWithChildren<{
	imagePath: string,
	style: StyleProp<ImageStyle>,
}>) {

	const cachedImageState = useSelector((state:RootState) => {return state.cachedImageSlice.images;});
	const dispatch = useDispatch();
	let cache = null;
	if(imagePath !== ''){
		cachedImageState.forEach((image) => {
			if(image.name === imagePath){
				cache = image.base64;
			}
		});
	}
	
	const [base64, setBase64] = useState<string | null>(cache);
	
	
	useEffect(() => {
		async function getUrl() {
			console.log('inside getUrl for: ', imagePath);
			if(!imagePath){
				return null;
			}

			try {
				const imgRef = ref(storage, imagePath);
				const imgUrl = await getDownloadURL(imgRef);
				const result = await fetch(imgUrl);
				const blob =  await result.blob();
				const reader = new FileReader();
				reader.onload = () => {
					const base64String = (reader.result as string).split(',')[1];
					dispatch(addImage({name: imagePath, base64: base64String}));
					setBase64(base64String);
				};
				reader.readAsDataURL(blob);
			}catch(err){
				console.log('error in storage image: ', err);
			}
		}
		setBase64(cache);
		if(cache === null && imagePath !== undefined && imagePath !== ''){
			getUrl();
		}
	}, [imagePath]);

	return <>
		{base64 ? (
			<Image source={{uri: `data:image/jpeg;base64,${base64}`}} style={style}/>
		) : (
			<Image source={ Default_pfp } style={style} />
		)}
	</>;

}

