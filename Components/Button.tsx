import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/commonStyles';
export default function Button(props){
    const title = props.title;
    
    return <View>
        <TouchableOpacity style={[styles.button, ]}>
            <Text style={{color: 'black'}}>{title}</Text>
        </TouchableOpacity>
    </View>
}