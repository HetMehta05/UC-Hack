import React, { useState } from 'react';
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
    Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [remember, setRemember] = useState(false);

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
                <View style={styles.screen}>

                    {/* Back Arrow */}
                    <Text style={styles.backArrow}>←</Text>

                    {/* Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={require('../../assets/signup_img.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.subtitle}>
                        Login to access your account
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

                    {/* Forgot Password */}
                    <Text style={styles.forgotText}>Forgot Password?</Text>

                    {/* Button */}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    {/* Remember Me */}
                    <Pressable
                        style={styles.rememberRow}
                        onPress={() => setRemember(!remember)}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                remember && styles.checkboxChecked,
                            ]}
                        >
                            {remember && (
                                <Ionicons
                                    name="checkmark"
                                    size={14}
                                    color="#FFFFFF"
                                />
                            )}
                        </View>

                        <Text style={styles.rememberText}>Remember me</Text>
                    </Pressable>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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

    forgotText: {
        textAlign: 'right',
        color: '#888',
        fontSize: 13,
        marginTop: 8,
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

    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#FF6A00',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    checkboxChecked: {
        backgroundColor: '#FF6A00',
    },

    rememberText: {
        fontSize: 13,
        color: '#555',
    },
});
