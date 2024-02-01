
import React, { useEffect } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useState } from 'react';
import { Image, View} from 'react-native';
import Default_pfp from '../assets/Default_pfp.jpg';

const storage = getStorage();

export default function StorageImage({ imagePath = null, style}){
	//console.log('params: ', imagePath);
	const [imageUrl, setImageUrl ] = useState(null);

	useEffect(() => {
		async function getUrl() {

			if(imagePath === null || imagePath === undefined || imagePath === ''){
				return -1;
			}

			try {
				const imgRef = ref(storage, imagePath);
				const imgUrl = await getDownloadURL(imgRef);
				//console.log('imgURL: ', imgUrl);
				setImageUrl(imgUrl);
			}catch(err){
				console.log('error in storage image: ', err);
			}
		}
		getUrl();
		console.log('inside useEffect in storageimage');
	}, [imagePath]);

	return <View>
		{imageUrl ? (
			<Image source={{uri: imageUrl}} style={style} />
		) : (
			<Image source={ Default_pfp } style={style}></Image>
		)}
	</View>;

}
