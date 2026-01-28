import { HelloWave } from '@/components/hello-wave';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayButton } from '../../components/ClayButton';
import { ClayCard } from '../../components/ClayCard';
import { Theme } from '../../constants/Theme';
import { useAppwrite } from '../../contexts/AppwriteContext';

export default function HomeScreen() {
  const { user } = useAppwrite();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user?.name || 'Friend'}! <HelloWave /></Text>
          <Text style={styles.subGreeting}>Ready to learn?</Text>
        </View>

        <ClayCard style={styles.streakCard} variant="white">
          <Text style={styles.streakTitle}>Daily Streak</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakNumber}>🔥 5</Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
        </ClayCard>

        <Text style={styles.sectionTitle}>Recent Docks</Text>

        {/* Dummy Data for Visuals */}
        <ClayCard style={styles.dockCard}>
          <Text style={styles.dockTitle}>Spanish Basics</Text>
          <Text style={styles.dockSubtitle}>20 terms • Last studied 2h ago</Text>
          <ClayButton
            title="Study"
            onPress={() => router.push('/learn/flashcards')}
            variant="cta"
            style={{ marginTop: Theme.spacing.s }}
            textStyle={{ fontSize: 14 }}
          />
        </ClayCard>

        <ClayCard style={styles.dockCard}>
          <Text style={styles.dockTitle}>React Native APIs</Text>
          <Text style={styles.dockSubtitle}>15 terms • Last studied yesterday</Text>
          <ClayButton
            title="Study"
            onPress={() => router.push('/learn/quiz')}
            variant="cta"
            style={{ marginTop: Theme.spacing.s }}
            textStyle={{ fontSize: 14 }}
          />
        </ClayCard>

      </ScrollView>

      <ClayButton
        title="+"
        onPress={() => { }}
        style={styles.fab}
        textStyle={{ fontSize: 32, lineHeight: 36 }}
      />
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
    paddingBottom: 100, // For FAB and TabBar
  },
  header: {
    marginBottom: Theme.spacing.l,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subGreeting: {
    fontSize: 18,
    color: Theme.colors.textMuted,
  },
  streakCard: {
    marginBottom: Theme.spacing.l,
    alignItems: 'center',
    paddingVertical: Theme.spacing.l,
    backgroundColor: '#FEF3C7', // Light yellow overrides
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#D97706',
  },
  streakLabel: {
    fontSize: 18,
    color: '#D97706',
    marginLeft: Theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.m,
  },
  dockCard: {
    marginBottom: Theme.spacing.m,
  },
  dockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  dockSubtitle: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.l,
    bottom: 90, // Above TabBar
    width: 64,
    height: 64,
    borderRadius: 32,
    zIndex: 100,
  }
});
