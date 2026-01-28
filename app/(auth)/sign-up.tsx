import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayInput } from '../../components/ClayInput';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

export default function SignUp() {
    const [step, setStep] = useState<'info' | 'otp'>('info');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const { startOtpRegistration, finishOtpRegistration } = useAppwrite();
    const router = useRouter();

    const handleStartRegistration = async () => {
        if (!email || !password || !name) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const result = await startOtpRegistration(email);
            setUserId(result.userId);
            setStep('otp');
            Alert.alert('Success', 'Verification code sent to your email.');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinishRegistration = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }

        setLoading(true);
        try {
            await finishOtpRegistration(userId, otp, name, password);
            Alert.alert('Success', 'Account created and verified successfully!');
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Verification Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{step === 'info' ? 'Join EduClay' : 'Verify Email'}</Text>
                <Text style={styles.subtitle}>
                    {step === 'info'
                        ? 'Start learning with 3D flashcards today.'
                        : `Enter the code sent to ${email}`}
                </Text>

                <View style={styles.form}>
                    {step === 'info' ? (
                        <>
                            <ClayInput
                                label="Name"
                                placeholder="Your Name"
                                value={name}
                                onChangeText={setName}
                            />
                            <ClayInput
                                label="Email"
                                placeholder="hello@example.com"
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
                            <ClayInput
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />

                            <View style={styles.spacer} />

                            <ClayButton
                                title={loading ? "Sending Code..." : "Sign Up"}
                                onPress={handleStartRegistration}
                                disabled={loading}
                            />

                            <Link href="/(auth)/sign-in" asChild>
                                <ClayButton
                                    title="Already have an account? Sign In"
                                    variant="secondary"
                                    onPress={() => { }}
                                    style={{ marginTop: Theme.spacing.m }}
                                />
                            </Link>
                        </>
                    ) : (
                        <>
                            <ClayInput
                                label="OTP Code"
                                placeholder="123456"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                            />

                            <View style={styles.spacer} />

                            <ClayButton
                                title={loading ? "Verifying..." : "Verify & Complete"}
                                onPress={handleFinishRegistration}
                                disabled={loading}
                            />

                            <ClayButton
                                title="Back to Info"
                                variant="secondary"
                                onPress={() => setStep('info')}
                                disabled={loading}
                                style={{ marginTop: Theme.spacing.m }}
                            />
                        </>
                    )}
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
