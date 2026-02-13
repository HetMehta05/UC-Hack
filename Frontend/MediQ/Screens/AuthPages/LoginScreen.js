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

const BASE_URL = "http://192.168.1.6:8000";


export default function LoginScreen({ navigation }) {
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("All fields required");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login response:", data);
                Alert.alert("Login Successful", "", [
                    {
                        text: "OK",
                        onPress: () => navigation.replace("home"),
                    },
                ]);
            } else {
                Alert.alert("Invalid Credentials");
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

                    <View style={styles.imageWrapper}>
                        <Image
                            source={require('../../assets/signup_img.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.subtitle}>
                        Login to access your account
                    </Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />

                    <Text style={styles.forgotText}>Forgot Password?</Text>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>  {/* Added onPress */}
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

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
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 10,
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
