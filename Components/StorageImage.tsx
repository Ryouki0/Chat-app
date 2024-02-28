
import React, { useEffect } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useState } from 'react';
import { StyleProp, View, ViewStyle} from 'react-native';
import Default_pfp from '../assets/Default_pfp.jpg';
import {Image, ImageStyle} from 'expo-image';
import CachedImage from 'expo-cached-image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { addImage } from '../state/slices/cachedImageSlice';
import { beginAsyncEvent } from 'react-native/Libraries/Performance/Systrace';


const storage = getStorage();

export default function({imagePath, style}: React.PropsWithChildren<{
	imagePath: string,
	style: StyleProp<ImageStyle>,
}>) {
	//console.log('params: ', imagePath);

	const cachedImageState = useSelector((state:RootState) => {return state.cachedImageSlice.images});
	const dispatch = useDispatch();
	let cache = null;
	if(imagePath !== ''){
		cachedImageState.forEach((image) => {
			if(image.name === imagePath){
				cache = image.base64;
				//console.log('got cache for', image.name);
			}
			//console.log('image.name::::::::::::::::', image.name, 'typeof base64: ', typeof(image.base64));
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
				}
				reader.readAsDataURL(blob);

			}catch(err){
				console.log('error in storage image: ', err);
			}
		}
		//console.log('cache inside useEffect: ', typeof(cache), 'imagepath inside useEffect: ', imagePath);
		setBase64(cache);
		if(!cache && imagePath){
			getUrl();
		}
		//console.log('inside useEffect in storageimage');
	}, [imagePath]);

	return <>
	{base64 ? (
		<Image source={{uri: `data:image/jpeg;base64,${base64}`}} style={style}/>
	) : (
		<Image source={ Default_pfp } style={style} />
	)}
	</>;

}

