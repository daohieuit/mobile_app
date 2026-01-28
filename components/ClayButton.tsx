
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Theme } from '../constants/Theme';
import { ClayCard } from './ClayCard';

interface ClayButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'cta' | 'danger' | 'white';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ClayButton = ({ onPress, title, variant = 'primary', style, textStyle, disabled }: ClayButtonProps) => {
    const scale = useSharedValue(1);

    const getBackgroundColor = () => {
        if (disabled) return '#E5E7EB'; // Slate-200
        switch (variant) {
            case 'secondary': return Theme.colors.secondary;
            case 'cta': return Theme.colors.cta;
            case 'danger': return Theme.colors.danger;
            case 'white': return Theme.colors.white;
            default: return Theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#9CA3AF'; // Slate-400
        if (variant === 'secondary' || variant === 'white') return Theme.colors.text;
        return Theme.colors.white;
    };

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[styles.wrapper, containerStyle, style]}
        >
            <ClayCard
                style={[
                    styles.container,
                    { backgroundColor: getBackgroundColor() }
                ]}
            >
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            </ClayCard>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: Theme.spacing.s,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.m,
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});
