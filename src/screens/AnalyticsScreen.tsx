import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';

export const AnalyticsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const metrics = [
    { title: 'Total Revenue', value: '$28,450', change: '+22.4%', up: true },
    { title: 'Active Sprints', value: '6', change: '+2 new', up: true },
    { title: 'Task Velocity', value: '94.2%', change: '+3.1%', up: true },
    { title: 'Blocked Tasks', value: '2', change: '-4 this week', up: false },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back and Home navigation */}
        <ScreenHeader
          title="Workspace Analytics"
          subtitle="Performance metrics, delivery velocity, and key milestones"
          backLabel="Back"
          showHome={true}
        />

        {/* Metrics Grid */}
        <View style={styles.grid}>
          {metrics.map(m => (
            <Card key={m.title} style={styles.metricCard}>
              <Text style={styles.metricTitle}>{m.title}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Badge
                label={m.change}
                variant={m.up ? 'success' : 'accent'}
              />
            </Card>
          ))}
        </View>

        {/* Weekly Productivity Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Productivity</Text>
        </View>
        <Card style={styles.chartCard}>
          <View style={styles.barsContainer}>
            {[
              { day: 'Mon', h: 60 },
              { day: 'Tue', h: 85 },
              { day: 'Wed', h: 100 },
              { day: 'Thu', h: 75 },
              { day: 'Fri', h: 90 },
              { day: 'Sat', h: 40 },
              { day: 'Sun', h: 30 },
            ].map(item => (
              <View key={item.day} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { height: `${item.h}%` }]}
                  />
                </View>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  backBtn: {
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    padding: 14,
    marginBottom: 14,
  },
  metricTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chartCard: {
    padding: 16,
    marginBottom: 20,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    width: 14,
    backgroundColor: colors.borderLight,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 7,
  },
  dayText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
