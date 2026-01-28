import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';

const QUESTIONS = [
    { question: 'What is "Cat" in Spanish?', options: ['Perro', 'Gato', 'Mesa', 'Silla'], answer: 'Gato' },
    { question: 'What is "Hello" in Spanish?', options: ['Adiós', 'Hola', 'Gracias', 'Por favor'], answer: 'Hola' },
];

export default function QuizScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    const currentQuestion = QUESTIONS[currentIndex];

    const handleAnswer = (option: string) => {
        if (option === currentQuestion.answer) {
            setScore(prev => prev + 1);
            Alert.alert('Correct!', 'Good job!');
        } else {
            Alert.alert('Wrong', `The correct answer was ${currentQuestion.answer}`);
        }

        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            Alert.alert('Quiz Complete', `You scored ${score + (option === currentQuestion.answer ? 1 : 0)} / ${QUESTIONS.length}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Quiz', headerTransparent: true, headerTintColor: Theme.colors.text }} />

            <ClayCard style={styles.questionCard}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </ClayCard>

            <View style={styles.options}>
                {currentQuestion.options.map((option, index) => (
                    <ClayButton
                        key={index}
                        title={option}
                        onPress={() => handleAnswer(option)}
                        variant="white"
                        style={styles.optionBtn}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: Theme.spacing.l,
        paddingTop: 100,
    },
    questionCard: {
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
        padding: Theme.spacing.xl,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    options: {
        gap: Theme.spacing.m,
    },
    optionBtn: {
        // Custom style if needed
    }
});
