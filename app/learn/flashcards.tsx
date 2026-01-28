import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';

const MOCK_CARDS = [
    { id: '1', term: 'Hola', definition: 'Hello' },
    { id: '2', term: 'Gato', definition: 'Cat' },
    { id: '3', term: 'Perro', definition: 'Dog' },
];

export default function FlashcardsScreen() {
    const { id } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipRotation = useSharedValue(0);

    const currentCard = MOCK_CARDS[currentIndex];

    const handleFlip = () => {
        if (isFlipped) {
            flipRotation.value = withTiming(0);
        } else {
            flipRotation.value = withTiming(180);
        }
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < MOCK_CARDS.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            flipRotation.value = 0; // Reset
        } else {
            alert("Lesson Complete!");
        }
    };

    const frontStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${flipRotation.value}deg` }],
            opacity: interpolate(flipRotation.value, [0, 90], [1, 0], Extrapolate.CLAMP),
        };
    });

    const backStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${flipRotation.value - 180}deg` }],
            opacity: interpolate(flipRotation.value, [90, 180], [0, 1], Extrapolate.CLAMP),
        };
    });

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Flashcards', headerTransparent: true, headerTintColor: Theme.colors.text }} />

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Card {currentIndex + 1} / {MOCK_CARDS.length}</Text>
            </View>

            <View style={styles.cardContainer}>
                <Pressable onPress={handleFlip} style={styles.cardWrapper}>
                    <Animated.View style={[styles.cardFace, frontStyle]}>
                        <ClayCard style={styles.fixedCard}>
                            <Text style={styles.termText}>{currentCard?.term}</Text>
                            <Text style={styles.instruction}>Tap to Flip</Text>
                        </ClayCard>
                    </Animated.View>

                    <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
                        <ClayCard style={styles.fixedCard}>
                            <Text style={styles.definitionText}>{currentCard?.definition}</Text>
                            <Text style={styles.instruction}>Tap to Flip Back</Text>
                        </ClayCard>
                    </Animated.View>
                </Pressable>
            </View>

            <View style={styles.controls}>
                <ClayButton
                    title="Got it"
                    onPress={handleNext}
                    variant="cta"
                    style={styles.controlBtn}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: Theme.spacing.l,
    },
    progressContainer: {
        alignItems: 'center',
        marginVertical: Theme.spacing.xl,
    },
    progressText: {
        fontSize: 18,
        fontWeight: '600',
        color: Theme.colors.textMuted,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardWrapper: {
        width: '100%',
        aspectRatio: 0.8,
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
    },
    cardBack: {
        // Rotation handled in animated style, but needs styling
    },
    fixedCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.xl,
    },
    termText: {
        fontSize: 48,
        fontWeight: '800',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    definitionText: {
        fontSize: 32,
        fontWeight: '600',
        color: Theme.colors.primary,
        textAlign: 'center',
    },
    instruction: {
        position: 'absolute',
        bottom: Theme.spacing.l,
        color: Theme.colors.textMuted,
        fontSize: 14,
    },
    controls: {
        paddingVertical: Theme.spacing.l,
    },
    controlBtn: {
        width: '100%',
    }
});
