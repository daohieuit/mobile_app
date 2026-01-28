import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Theme } from '../constants/Theme';

interface ClayInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
}

export const ClayInput = ({
    value,
    onChangeText,
    placeholder,
    label,
    secureTextEntry,
    keyboardType,
    error
}: ClayInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.container, error ? styles.errorBorder : null]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    style={styles.input}
                    placeholderTextColor={Theme.colors.textMuted}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                    >
                        <AntDesign
                            name={isPasswordVisible ? 'eye-invisible' : 'eye'}
                            size={24}
                            color={Theme.colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Theme.spacing.m,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.xs,
        marginLeft: Theme.spacing.s,
    },
    container: {
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.borderRadius.l,
        paddingHorizontal: Theme.spacing.m,
        // Remove paddingVertical and handle height via TextInput and icon container
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    input: {
        fontSize: 16,
        color: Theme.colors.text,
        height: 52, // Slightly taller for comfortable typing
        flex: 1,
    },
    iconContainer: {
        padding: Theme.spacing.s,
    },
    errorBorder: {
        borderColor: Theme.colors.danger,
    },
    errorText: {
        color: Theme.colors.danger,
        fontSize: 14,
        marginLeft: Theme.spacing.s,
        marginTop: 2,
    }
});
