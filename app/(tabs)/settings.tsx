import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayInput } from '../../components/ClayInput';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

export default function SettingsScreen() {
    const { user, updatePassword } = useAppwrite();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    // Standard Appwrite check: Users with a password have a passwordUpdate timestamp
    const isStandardUser = user && user.passwordUpdate && user.passwordUpdate !== "";
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(newPassword, currentPassword);
            Alert.alert('Success', 'Password updated successfully');
            setShowPasswordForm(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Settings', headerShown: true, headerTitleAlign: 'center' }} />
            <ScrollView contentContainerStyle={styles.content}>
                {!showPasswordForm ? (
                    <View style={styles.menu}>
                        {isStandardUser && (
                            <>
                                <ClayButton
                                    title="Change Password"
                                    variant="secondary"
                                    onPress={() => setShowPasswordForm(true)}
                                />
                            </>
                        )}
                        {!isStandardUser && (
                            <Text style={styles.infoText}>You are logged in with Google/OAuth. Profile management is handled by your provider.</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>Change Password</Text>
                        <ClayInput
                            label="Current Password"
                            placeholder="Type your current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                        />
                        <ClayInput
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <ClayInput
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <View style={styles.buttonRow}>
                            <ClayButton
                                title="Cancel"
                                variant="secondary"
                                onPress={() => setShowPasswordForm(false)}
                                style={styles.halfButton}
                            />
                            <ClayButton
                                title={loading ? "Updating..." : "Update"}
                                onPress={handleUpdatePassword}
                                disabled={loading}
                                style={styles.halfButton}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    content: {
        padding: Theme.spacing.l,
    },
    menu: {
        width: '100%',
    },
    form: {
        width: '100%',
        backgroundColor: Theme.colors.white,
        padding: Theme.spacing.l,
        borderRadius: Theme.borderRadius.l,
        ...Theme.shadows.clay,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.l,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Theme.spacing.m,
        marginTop: Theme.spacing.l,
    },
    halfButton: {
        flex: 1,
    },
    infoText: {
        fontSize: 16,
        color: Theme.colors.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
    }
});
