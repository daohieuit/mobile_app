import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayInput } from '../../components/ClayInput';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAppwrite();
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (error: any) {
            Alert.alert('Google Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            // Main layout will handle redirect based on user state
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Continue your learning journey.</Text>

                <View style={styles.form}>
                    <ClayInput
                        label="Email"
                        placeholder="abc@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <ClayInput
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Link href="/(auth)/forgot-password" asChild>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: Theme.spacing.xs }}>
                            <Text style={{ color: Theme.colors.primary, fontWeight: '600' }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </Link>

                    <View style={styles.spacer} />

                    <ClayButton
                        title={loading ? "Logging in..." : "Sign In"}
                        onPress={handleLogin}
                        disabled={loading}
                    />

                    <ClayButton
                        title="Sign in with Google"
                        variant="white"
                        onPress={handleGoogleLogin}
                        disabled={loading}
                        style={{ marginTop: Theme.spacing.s }}
                    />

                    <Link href="/(auth)/sign-up" asChild>
                        <ClayButton
                            title="Create Account"
                            variant="secondary"
                            onPress={() => { }}
                            style={{ marginTop: Theme.spacing.m }}
                        />
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Theme.spacing.l,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Theme.colors.text,
        textAlign: 'center',
        marginBottom: Theme.spacing.s,
    },
    subtitle: {
        fontSize: 18,
        color: Theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: Theme.spacing.xl,
    },
    form: {
        width: '100%',
    },
    spacer: {
        height: Theme.spacing.l,
    }
});
