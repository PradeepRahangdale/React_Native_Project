import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

export const AnalyticsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const [selectedDay, setSelectedDay] = useState('Wed');

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$28,450',
      change: '+22.4%',
      up: true,
      sub: 'Annual recurring run-rate',
      target: null,
    },
    {
      title: 'Active Sprints',
      value: '6',
      change: '+2 new',
      up: true,
      sub: 'Across 4 engineering squads',
      target: 'Projects' as const,
    },
    {
      title: 'Task Velocity',
      value: '94.2%',
      change: '+3.1%',
      up: true,
      sub: 'Milestones on schedule',
      target: 'Projects' as const,
    },
    {
      title: 'Blocked Tasks',
      value: '2',
      change: '-4 this week',
      up: false,
      sub: 'Under review by Leads',
      target: 'Projects' as const,
    },
  ];

  const weeklyData = [
    { day: 'Mon', h: 60, hours: '6.5 hrs', tasks: '8 tasks done' },
    { day: 'Tue', h: 85, hours: '8.2 hrs', tasks: '12 tasks done' },
    { day: 'Wed', h: 100, hours: '9.0 hrs', tasks: '15 tasks done' },
    { day: 'Thu', h: 75, hours: '7.8 hrs', tasks: '10 tasks done' },
    { day: 'Fri', h: 90, hours: '8.5 hrs', tasks: '14 tasks done' },
    { day: 'Sat', h: 40, hours: '3.5 hrs', tasks: '4 tasks done' },
    { day: 'Sun', h: 30, hours: '2.0 hrs', tasks: '2 tasks done' },
  ];

  const currentDayStats = weeklyData.find(d => d.day === selectedDay) || weeklyData[2];

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
          {metrics.map(m => {
            const Component = m.target ? TouchableOpacity : View;
            return (
              <Component
                key={m.title}
                style={styles.gridItemWrapper}
                activeOpacity={m.target ? 0.8 : 1}
                onPress={() => m.target && navigate(m.target)}
              >
                <Card style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Text style={styles.metricTitle}>{m.title}</Text>
                    {m.target && <Text style={styles.cardChevron}>›</Text>}
                  </View>
                  <Text style={styles.metricValue}>{m.value}</Text>
                  <Badge
                    label={m.change}
                    variant={m.up ? 'success' : 'accent'}
                  />
                  <Text style={styles.metricSub}>{m.sub}</Text>
                </Card>
              </Component>
            );
          })}
        </View>

        {/* Weekly Productivity Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Productivity</Text>
          <Text style={styles.selectedDayBadge}>{currentDayStats.hours}</Text>
        </View>

        <Card style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <View>
              <Text style={styles.chartSubLabel}>{selectedDay}&rsquo;s Output</Text>
              <Text style={styles.chartTasksDone}>{currentDayStats.tasks}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewProjectsBtn}
              onPress={() => navigate('Projects')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewProjectsBtnText}>Inspect Tasks ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.barsContainer}>
            {weeklyData.map(item => {
              const isSelected = selectedDay === item.day;
              return (
                <TouchableOpacity
                  key={item.day}
                  style={styles.barColumn}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(item.day)}
                >
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${item.h}%` },
                        isSelected && styles.barFillSelected,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Action Link to AI Assistant */}
        <TouchableOpacity
          style={styles.aiActionCard}
          activeOpacity={0.85}
          onPress={() => navigate('AIAssistant')}
        >
          <View style={styles.aiActionHeader}>
            <View style={styles.aiBadgePill}>
              <Text style={styles.aiBadgeGlyph}>◈</Text>
              <Text style={styles.aiBadgeText}>NOVA INSIGHTS</Text>
            </View>
            <Text style={styles.aiActionChevron}>→</Text>
          </View>
          <Text style={styles.aiActionTitle}>
            Want deeper automated delivery forecasts?
          </Text>
          <Text style={styles.aiActionSubtitle}>
            Ask Nova Copilot to generate automated milestone projections and workload balance recommendations.
          </Text>
        </TouchableOpacity>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gridItemWrapper: {
    width: '48%',
  },
  metricCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  cardChevron: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '800',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  selectedDayBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chartCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  chartSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  chartTasksDone: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  viewProjectsBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewProjectsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
    width: 14,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: '#818CF8',
    borderRadius: 7,
  },
  barFillSelected: {
    backgroundColor: '#4F46E5',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dayTextSelected: {
    color: colors.primary,
    fontWeight: '800',
  },
  // AI Action Card
  aiActionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  aiActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  aiBadgeGlyph: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '900',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 1,
  },
  aiActionChevron: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  aiActionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiActionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
