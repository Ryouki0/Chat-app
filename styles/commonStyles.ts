import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'center',
        elevation: 3, //android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: 'white',
    },
    
})

export default styles;