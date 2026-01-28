import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

export default function ProfileScreen() {
    const { user, logout } = useAppwrite();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/sign-in'); // Ensure redirect happens
        } catch (error) {
            Alert.alert('Error', 'Failed to logout');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Link href="/settings" asChild>
                    <TouchableOpacity style={styles.settingsButton}>
                        <MaterialIcons name="settings" size={28} color={Theme.colors.text} />
                    </TouchableOpacity>
                </Link>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                    <ClayCard style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Docks</Text>
                    </ClayCard>
                    <ClayCard style={styles.statCard}>
                        <Text style={styles.statValue}>452</Text>
                        <Text style={styles.statLabel}>Cards</Text>
                    </ClayCard>
                </View>

                <View style={styles.spacer} />

                <ClayButton
                    title="Logout"
                    onPress={handleLogout}
                    variant="danger"
                />
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
    header: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: Theme.spacing.l,
    },
    settingsButton: {
        alignSelf: 'flex-end',
        padding: Theme.spacing.xs,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: Theme.colors.white,
        marginBottom: Theme.spacing.m,
        ...Theme.shadows.clay,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Theme.colors.white,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    email: {
        fontSize: 16,
        color: Theme.colors.textMuted,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.m,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: Theme.spacing.m,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Theme.spacing.l,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        color: Theme.colors.primary,
    },
    statLabel: {
        fontSize: 16,
        color: Theme.colors.textMuted,
    },
    spacer: {
        height: Theme.spacing.xl,
    },
});
