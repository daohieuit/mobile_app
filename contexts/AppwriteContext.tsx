import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ID, Models, OAuthProvider, Permission, Role } from 'react-native-appwrite';
import { account, databases } from '../lib/appwrite';
import { COLLECTIONS, DATABASE_ID } from '../lib/database.config';

interface AppwriteContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updatePassword: (password: string, oldPassword?: string) => Promise<void>;
    sendRecoveryOtp: (email: string) => Promise<{ userId: string }>;
    verifyRecoveryOtp: (userId: string, otp: string) => Promise<void>;
    startOtpRegistration: (email: string) => Promise<{ userId: string }>;
    finishOtpRegistration: (userId: string, otp: string, name: string, password: string) => Promise<void>;
}

const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

export const AppwriteProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const syncUserDoc = async (current: Models.User<Models.Preferences>) => {
        try {
            // Check if user document already exists
            try {
                await databases.getDocument(
                    DATABASE_ID,
                    COLLECTIONS.USERS,
                    current.$id
                );
            } catch (error: any) {
                // If not found (404), create it
                if (error.code === 404) {
                    await databases.createDocument(
                        DATABASE_ID,
                        COLLECTIONS.USERS,
                        current.$id, // Use Auth ID as Document ID
                        {
                            userId: current.$id,
                            displayName: current.name || current.email.split('@')[0],
                            userEmail: current.email,
                            totalDocks: 0,
                            totalVocabularies: 0,
                            currentStreak: 0,
                            longestStreak: 0,
                        },
                        [
                            Permission.read(Role.user(current.$id)),
                            Permission.update(Role.user(current.$id)),
                            Permission.delete(Role.user(current.$id)),
                        ]
                    );
                    console.log('✅ User document created in database');
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('❌ Failed to sync user doc:', error);
        }
    };

    const checkUser = async () => {
        try {
            const current = await account.get();
            setUser(current);
            // Sync on check to handle existing auth users without docs
            await syncUserDoc(current);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Attempt to clear any existing session first
            try { await account.deleteSession('current'); } catch (e) { }

            await account.createEmailPasswordSession(email, password);
            await checkUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
            if (!deepLink.hostname) {
                deepLink.hostname = 'localhost';
            }
            const scheme = `${deepLink.protocol}//`;

            const loginUrl = await account.createOAuth2Token(
                OAuthProvider.Google,
                `${deepLink}`,
                `${deepLink}`
            );

            const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

            if (result.type !== 'success') throw new Error('Login canceled');

            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');

            if (!secret || !userId) throw new Error('Failed to login with Google');

            // Attempt to clear any existing session first
            try { await account.deleteSession('current'); } catch (e) { }

            await account.createSession(userId, secret);
            await checkUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const updatePassword = async (password: string, oldPassword?: string) => {
        try {
            await account.updatePassword(password, oldPassword);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    const sendRecoveryOtp = async (email: string) => {
        try {
            const sessionToken = await account.createEmailToken(ID.unique(), email);
            return { userId: sessionToken.userId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verifyRecoveryOtp = async (userId: string, otp: string) => {
        try {
            // Attempt to clear any existing session first
            try { await account.deleteSession('current'); } catch (e) { }

            await account.createSession(userId, otp);
            await checkUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const startOtpRegistration = async (email: string) => {
        try {
            // This sends the OTP. If user doesn't exist, it creates a placeholder
            const token = await account.createEmailToken(ID.unique(), email);
            return { userId: token.userId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const finishOtpRegistration = async (userId: string, otp: string, name: string, password: string) => {
        try {
            // Attempt to clear any existing session first
            try { await account.deleteSession('current'); } catch (e) { }

            // 1. Create session with OTP (This marks email as verified)
            await account.createSession(userId, otp);

            // 2. Set the Name
            await account.updateName(name);

            // 3. Set the Password (Since session is active and no password exists yet)
            await account.updatePassword(password);

            // 4. Refresh local user state
            await checkUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <AppwriteContext.Provider value={{
            user,
            loading,
            login,
            loginWithGoogle,
            register,
            logout,
            updatePassword,
            sendRecoveryOtp,
            verifyRecoveryOtp,
            startOtpRegistration,
            finishOtpRegistration
        }}>
            {children}
        </AppwriteContext.Provider>
    );
};

export const useAppwrite = () => {
    const context = useContext(AppwriteContext);
    if (!context) {
        throw new Error('useAppwrite must be used within an AppwriteProvider');
    }
    return context;
};
