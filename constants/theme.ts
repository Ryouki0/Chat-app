import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
    container: {
        backgroundColor:'white',
        flex: 1,
        alignItems: 'center',
    },
    primaryText: {
        color: 'black',
    },
    secondaryText: {
        color: '#494848',
        fontSize: 14,
    }
})

export const darkTheme = StyleSheet.create({
    container: {
        backgroundColor:'#141414',
        flex: 1,
        alignItems: 'center',
    },

    primaryText: {
        color: 'white',
    },
    secondaryText: {
        color: '#909090',
        fontSize: 14,
    }
})
