import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
    return (
        <KeyboardAvoidingView
            style={styles.safe}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="dark" />

            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* MAIN WHITE SCREEN (NOT A CARD) */}
                <View style={styles.screen}>

                    {/* Back Arrow */}
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>


                    {/* Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={require('../../assets/signup_img.png')}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Sign up</Text>
                    <Text style={styles.subtitle}>
                        Create an account or{'\n'}login to explore
                    </Text>

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#999"
                        style={styles.input}
                    />

                    {/* Password */}
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        style={styles.input}
                    />

                    {/* Button */}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Already a member? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F5F5F5', // light outer background
    },

    container: {
        flexGrow: 1,
    },

    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },

    backArrow: {
        fontSize: 22,
        color: '#000',
        marginBottom: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 30,
    },

    imageWrapper: {
        marginTop: 30,
        width: '100%',
        height: 220,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: "#0891AD",
    },

    image: {
        width: 409,
        height: 273,
        marginBottom: 50,
    },

    title: {
        marginTop: 20,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },

    subtitle: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        marginVertical: 10,
    },

    input: {
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 20,
        marginTop: 14,
    },

    button: {
        height: 50,
        backgroundColor: '#FF6A00',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    footerText: {
        color: '#888',
        fontSize: 14,
    },

    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },

    loginText: {
        color: '#FF6A00',
        fontWeight: 'bold',
        fontSize: 19,
    },
});
