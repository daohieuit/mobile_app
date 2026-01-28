import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';

const MOCK_PAIRS = [
    { id: '1a', text: 'Hola', matchId: '1' },
    { id: '1b', text: 'Hello', matchId: '1' },
    { id: '2a', text: 'Gato', matchId: '2' },
    { id: '2b', text: 'Cat', matchId: '2' },
    { id: '3a', text: 'Perro', matchId: '3' },
    { id: '3b', text: 'Dog', matchId: '3' },
].sort(() => Math.random() - 0.5);

export default function MatchingScreen() {
    const [selected, setSelected] = useState<string[]>([]);
    const [matched, setMatched] = useState<string[]>([]);

    const handlePress = (id: string, matchId: string) => {
        if (selected.includes(id) || matched.includes(matchId)) return;

        const newSelected = [...selected, id];

        if (newSelected.length === 2) {
            setSelected(newSelected);

            const firstId = newSelected[0];
            const secondId = newSelected[1];

            const firstCard = MOCK_PAIRS.find(c => c.id === firstId);
            const secondCard = MOCK_PAIRS.find(c => c.id === secondId);

            if (firstCard?.matchId === secondCard?.matchId) {
                setMatched([...matched, firstCard!.matchId]);
                setSelected([]);
            } else {
                setTimeout(() => setSelected([]), 1000);
            }
        } else {
            setSelected(newSelected);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Matching', headerTransparent: true, headerTintColor: Theme.colors.text }} />

            <View style={styles.grid}>
                {MOCK_PAIRS.map((card) => {
                    const isSelected = selected.includes(card.id);
                    const isMatched = matched.includes(card.matchId);

                    return (
                        <Pressable
                            key={card.id}
                            onPress={() => handlePress(card.id, card.matchId)}
                            style={styles.cardWrapper}
                        >
                            <ClayCard
                                style={[
                                    styles.card,
                                    isSelected && styles.selectedCard,
                                    isMatched && styles.matchedCard
                                ]}
                                variant={isSelected ? 'primary' : 'white'}
                            >
                                <Text style={[
                                    styles.cardText,
                                    isSelected && styles.selectedText
                                ]}>
                                    {isMatched ? '✔️' : card.text}
                                </Text>
                            </ClayCard>
                        </Pressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        paddingTop: 80,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: Theme.spacing.s,
        justifyContent: 'center',
    },
    cardWrapper: {
        width: '45%',
        aspectRatio: 1,
        margin: '2.5%',
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.s,
    },
    selectedCard: {
        transform: [{ scale: 0.95 }],
    },
    matchedCard: {
        opacity: 0.5,
        backgroundColor: '#A7F3D0', // Green-200
    },
    cardText: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    selectedText: {
        color: Theme.colors.white,
    }
});
