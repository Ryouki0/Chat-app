import React, { Dispatch } from 'react';
import { styledMessage } from '../../../models/styledMessage';
import StorageImage from '../../StorageImage';
import { images } from '../../../constants/images';
import LastMessage from '../LastMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';

export default function ImageMessage({mess}: React.PropsWithChildren<{
    mess: styledMessage,
}>){
    
	return <>
		{mess.userChange ? (
			<LastMessage message={mess}></LastMessage>
		) : (
			<StorageImage imagePath={mess.message} style={[mess.extraStyles, images.imageMessage]}></StorageImage>)}
	</>;
}

