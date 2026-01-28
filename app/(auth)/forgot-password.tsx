import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayInput } from '../../components/ClayInput';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

type RecoveryStep = 'email' | 'otp' | 'password';

export default function ForgotPasswordScreen() {
    const [step, setStep] = useState<RecoveryStep>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { sendRecoveryOtp, verifyRecoveryOtp, updatePassword } = useAppwrite();
    const router = useRouter();

    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        setLoading(true);
        try {
            const result = await sendRecoveryOtp(email);
            setUserId(result.userId);
            setStep('otp');
            Alert.alert('Success', 'OTP has been sent to your email.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }
        setLoading(true);
        try {
            await verifyRecoveryOtp(userId, otp);
            setStep('password');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid OTP code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(newPassword);
            Alert.alert('Success', 'Password has been reset successfully. You are now logged in.', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>Enter your email to receive a recovery code.</Text>
                        <ClayInput
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <View style={styles.spacer} />
                        <ClayButton
                            title={loading ? "Sending..." : "Send Code"}
                            onPress={handleSendOtp}
                            disabled={loading}
                        />
                        <ClayButton
                            title="Back to Login"
                            variant="white"
                            onPress={() => router.back()}
                            style={{ marginTop: Theme.spacing.s }}
                        />
                    </>
                );
            case 'otp':
                return (
                    <>
                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>
                        <ClayInput
                            label="OTP Code"
                            placeholder="123456"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                        />
                        <View style={styles.spacer} />
                        <ClayButton
                            title={loading ? "Verifying..." : "Verify Code"}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        />
                        <ClayButton
                            title="Resend Code"
                            variant="white"
                            onPress={handleSendOtp}
                            disabled={loading}
                            style={{ marginTop: Theme.spacing.s }}
                        />
                    </>
                );
            case 'password':
                return (
                    <>
                        <Text style={styles.title}>New Password</Text>
                        <Text style={styles.subtitle}>Create a new secure password for your account.</Text>
                        <ClayInput
                            label="New Password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <ClayInput
                            label="Confirm New Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                        <View style={styles.spacer} />
                        <ClayButton
                            title={loading ? "Resetting..." : "Reset Password"}
                            onPress={handleResetPassword}
                            disabled={loading}
                        />
                    </>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formCard}>
                    {renderStep()}
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
    formCard: {
        width: '100%',
        backgroundColor: Theme.colors.white,
        padding: Theme.spacing.l,
        borderRadius: Theme.borderRadius.l,
        ...Theme.shadows.clay,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Theme.colors.text,
        textAlign: 'center',
        marginBottom: Theme.spacing.s,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: Theme.spacing.xl,
    },
    spacer: {
        height: Theme.spacing.l,
    }
});
