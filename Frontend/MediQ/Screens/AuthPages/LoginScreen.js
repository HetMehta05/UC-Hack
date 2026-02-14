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
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = "http://10.241.63.8:8000";

export default function LoginScreen({ navigation }) {
    const [remember, setRemember] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Validation Error", "All fields are required");
            return;
        }



        try {
            const response = await fetch(`${BASE_URL}/api/users/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),

            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login response:", data);
                Alert.alert("Success", "Login Successful", [
                    {
                        text: "OK",
                        onPress: () => navigation.replace("home"),
                    },
                ]);
            } else {
                Alert.alert("Login Failed", "Invalid email or password");
            }
        } catch (error) {
            Alert.alert("Network Error", error.message);
        }
    };

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

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>

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
                        placeholder="Username"
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />


                    {/* Password */}
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Feature coming soon!")}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
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

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupText}>Sign up</Text>
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
        overflow: 'hidden',
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
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 30,
    },
    footerText: {
        color: '#888',
        fontSize: 14,
    },
    signupText: {
        color: '#FF6A00',
        fontWeight: 'bold',
        fontSize: 19,
    },
});