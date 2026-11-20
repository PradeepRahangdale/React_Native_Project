import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

export const ProjectDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { params, navigate } = useNavigation();

  const title = params?.title || 'Project Overview';
  const subtitle = params?.subtitle || 'Detailed workspace analysis and tasks.';
  const progress = params?.progress ?? 0.75;
  const badge = params?.badge || 'In Progress';

  const [tasks, setTasks] = useState([
    { id: '1', name: 'Define scope & feature specification', done: true },
    { id: '2', name: 'Build mobile screens & navigation state', done: true },
    { id: '3', name: 'Integrate backend authentication & API', done: false },
    { id: '4', name: 'End-to-end integration & UX review', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back & Home Navigation Header */}
        <ScreenHeader backLabel="Back" showHome={true} />

        {/* Header Details */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Badge label={badge} variant="primary" />
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressCardHeader}>
            <Text style={styles.cardHeading}>Overall Progress</Text>
            <Text style={styles.percentText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {tasks.filter(t => t.done).length} of {tasks.length} core
            deliverables finished
          </Text>
        </Card>

        {/* Team Members */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Team</Text>
        </View>
        <Card style={styles.teamCard}>
          <TouchableOpacity
            style={styles.memberRow}
            activeOpacity={0.7}
            onPress={() => navigate('Profile')}
          >
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitials}>JD</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>John Doe</Text>
              <Text style={styles.memberRole}>Lead Engineer (You)</Text>
            </View>
            <Badge label="Owner" variant="accent" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.memberRow}
            activeOpacity={0.7}
            onPress={() =>
              navigate('ChatDetail', {
                id: '1',
                name: 'Alice Smith',
                avatar: 'AS',
                online: true,
              })
            }
          >
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitials}>AS</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Alice Smith</Text>
              <Text style={styles.memberRole}>UI/UX Designer</Text>
            </View>
            <Badge label="Chat ›" variant="success" />
          </TouchableOpacity>
        </Card>

        {/* Tasks Checklist */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Milestones & Tasks</Text>
        </View>
        <View style={styles.taskList}>
          {tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              activeOpacity={0.8}
              onPress={() => toggleTask(task.id)}
            >
              <Card style={styles.taskCard}>
                <View
                  style={[
                    styles.checkbox,
                    task.done && styles.checkboxActive,
                  ]}
                >
                  {task.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.taskName,
                    task.done && styles.taskNameDone,
                  ]}
                >
                  {task.name}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Project Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project Workflows</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigate('Messages')}
          >
            <Text style={styles.actionCardIcon}>💬</Text>
            <Text style={styles.actionCardTitle}>Team Chat</Text>
            <Text style={styles.actionCardSub}>Open channel ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigate('AIAssistant')}
          >
            <Text style={styles.actionCardIcon}>✨</Text>
            <Text style={styles.actionCardTitle}>Nova Copilot</Text>
            <Text style={styles.actionCardSub}>Plan tasks ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigate('Analytics')}
          >
            <Text style={styles.actionCardIcon}>📊</Text>
            <Text style={styles.actionCardTitle}>Analytics</Text>
            <Text style={styles.actionCardSub}>Velocity ›</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  progressCard: {
    padding: 16,
    marginBottom: 20,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  teamCard: {
    padding: 16,
    marginBottom: 20,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  taskList: {
    gap: 10,
    marginBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  taskName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  taskNameDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionCardSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
});
