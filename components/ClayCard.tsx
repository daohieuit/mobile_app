
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';

interface ClayCardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'primary' | 'white';
}

export const ClayCard = ({ children, style, variant = 'white' }: ClayCardProps) => {
    const backgroundColor = variant === 'primary' ? Theme.colors.primary : Theme.colors.white;

    // For "Primary" variant (Active), use a slightly darker border/shadow to create depth
    // For "White" variant (Standard), use standard styles

    return (
        <View style={[styles.container, { backgroundColor }, style]}>
            <View style={styles.innerHighlight} pointerEvents="none" />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.m,
        borderRadius: Theme.borderRadius.l,
        ...Theme.shadows.clay,
        position: 'relative',
        overflow: 'hidden', // Ensures inner highlight respects border radius
    },
    innerHighlight: {
        // Simulates the "Clay" top-left highlight
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderTopLeftRadius: Theme.borderRadius.l,
        borderTopRightRadius: Theme.borderRadius.l,
        transform: [{ scaleX: 1.2 }], // Slight stretch to soften edges if needed, but simple block is fine
    }
});
