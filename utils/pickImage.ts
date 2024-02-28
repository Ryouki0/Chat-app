import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import uuid from 'react-native-uuid';

const storage = getStorage();

export const pickImage = async (allowsEditing: boolean) => {
    try{
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: allowsEditing,
            quality: 1,
        });
        console.log('result:', result.assets[0].mimeType);
        const mimeType = result.assets[0].mimeType;
        const refId = uuid.v4();
        const  storageRef = ref(storage, `${refId}`);
        
        const fetchUri = await fetch(result.assets[0].uri);
        const blob = await fetchUri.blob();

        const metadata = {contentType: mimeType};
        await uploadBytesResumable(storageRef, blob, metadata).then((snapShot) => {
            console.log('snapshot: ', snapShot.state);
        });
        return refId;
    }catch(err){
        console.log('error in pickimage', err);
    }
}