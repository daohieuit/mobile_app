import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';

const MOCK_DOCKS = [
    { id: '1', title: 'Spanish Basics', terms: 20 },
    { id: '2', title: 'React Native APIs', terms: 15 },
    { id: '3', title: 'World Capitals', terms: 35 },
    { id: '4', title: 'Periodic Table', terms: 118 },
    { id: '5', title: 'Biology 101', terms: 24 },
];

export default function DocksScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.headerTitle}>My Docks</Text>
            <FlatList
                data={MOCK_DOCKS}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <ClayCard style={styles.card}>
                        <View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardSubtitle}>{item.terms} terms</Text>
                        </View>
                        <View style={styles.iconPlaceholder}>
                            <Text style={{ fontSize: 24 }}>📚</Text>
                        </View>
                    </ClayCard>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Theme.colors.text,
        padding: Theme.spacing.l,
        paddingBottom: Theme.spacing.s,
    },
    listContent: {
        padding: Theme.spacing.l,
        paddingBottom: 100,
    },
    card: {
        marginBottom: Theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Theme.spacing.l,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    cardSubtitle: {
        marginTop: 4,
        color: Theme.colors.textMuted,
    },
    iconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Theme.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
