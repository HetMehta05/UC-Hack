import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
} from 'react-native';

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('SignUp');
        }, 2000);
    }, []);


    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Logo */}
            <Image
                source={require("../assets/splash_icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

export default SplashScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // match brand color
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 628,
        height: 628,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6A00',
    },
    tagline: {
        marginTop: 8,
        fontSize: 14,
        color: '#777',
    },
});
