import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card } from '../components';
import { colors } from '../constants';
import { useAuth } from '../context';
import { useNavigation } from '../navigation';

type FilterScope = 'all' | 'priority' | 'review' | 'completed';

interface FocusTask {
  id: string;
  projectId: string;
  title: string;
  subsystem: string;
  priorityCode: 'P1' | 'P2' | 'P3';
  priorityLabel: string;
  dueTime: string;
  assignee: string;
  done: boolean;
}

interface QuickActionPrompt {
  id: string;
  label: string;
  query: string;
  target: 'AIAssistant' | 'Projects' | 'Analytics' | 'Messages';
}

const INITIAL_FOCUS_TASKS: FocusTask[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Review Figma Design Tokens v2.4',
    subsystem: 'Design System & Component Architecture',
    priorityCode: 'P1',
    priorityLabel: 'Critical',
    dueTime: '11:30 AM',
    assignee: 'AS',
    done: false,
  },
  {
    id: 't2',
    projectId: 'p2',
    title: 'Verify mTLS API Gateway Endpoint Routing',
    subsystem: 'Security & Auth Proxy Cluster',
    priorityCode: 'P1',
    priorityLabel: 'Urgent',
    dueTime: '2:15 PM',
    assignee: 'JD',
    done: false,
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Deploy Staging v1.4 to Test Cluster',
    subsystem: 'Kubernetes Ingress & Container Pods',
    priorityCode: 'P2',
    priorityLabel: 'High',
    dueTime: '4:45 PM',
    assignee: 'RK',
    done: true,
  },
  {
    id: 't4',
    projectId: 'p4',
    title: 'Validate PostgreSQL Replica Failover Latency',
    subsystem: 'Distributed Database Sharding',
    priorityCode: 'P3',
    priorityLabel: 'Normal',
    dueTime: 'Tomorrow',
    assignee: 'ML',
    done: false,
  },
];

const QUICK_PROMPTS: QuickActionPrompt[] = [
  { id: '1', label: '✦ My Blockers', query: 'Show all my current blockers', target: 'AIAssistant' },
  { id: '2', label: '✦ Sprint Velocity', query: 'What is our sprint velocity?', target: 'Analytics' },
  { id: '3', label: '✦ Team Status', query: 'Who is active on the team today?', target: 'Messages' },
  { id: '4', label: '+ New Task', query: 'Create new project deliverable', target: 'Projects' },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState<FilterScope>('all');
  const [tasks, setTasks] = useState<FocusTask[]>(INITIAL_FOCUS_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic Time-of-Day Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }, []);

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  };

  const completedCount = tasks.filter(t => t.done).length;
  const remainingCount = tasks.length - completedCount;

  // Filter tasks by active scope
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subsystem.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) {
        return false;
      }
      if (activeFilter === 'all') {
        return true;
      }
      if (activeFilter === 'priority') {
        return task.priorityCode === 'P1' && !task.done;
      }
      if (activeFilter === 'review') {
        return task.priorityCode === 'P2' && !task.done;
      }
      if (activeFilter === 'completed') {
        return task.done;
      }
      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  const topPadding =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight || 0) + 12
      : insets.top + 12;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Atmospheric Ambient Glow Orbs */}
      <View style={styles.ambientGlowTopLeft} />
      <View style={styles.ambientGlowTopRight} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Architectural Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.workspacePill}
            activeOpacity={0.8}
            onPress={() => navigate('Profile')}
          >
            <View style={styles.workspaceDot} />
            <Text style={styles.workspaceName}>APEX DYNAMICS</Text>
            <Text style={styles.workspaceChevron}>▾</Text>
          </TouchableOpacity>

          <View style={styles.topBarActions}>
            <TouchableOpacity
              style={styles.omniActionBtn}
              activeOpacity={0.7}
              onPress={() => navigate('AIAssistant')}
            >
              <Text style={styles.omniGlyph}>◈</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.7}
              onPress={() => navigate('Notifications')}
            >
              <View style={styles.vectorBellStem} />
              <View style={styles.vectorBellBody} />
              <View style={styles.vectorBellRinger} />
              <View style={styles.notificationPip}>
                <Text style={styles.notificationPipText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileAvatarButton}
              activeOpacity={0.8}
              onPress={() => navigate('Profile')}
            >
              <Text style={styles.profileAvatarText}>
                {user?.avatarInitials || 'JD'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Executive Greeting & Time */}
        <View style={styles.greetingSection}>
          <Text style={styles.dateLabelText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).toUpperCase()} • SPRINT 14 ACTIVE
          </Text>
          <Text style={styles.greetingTitle}>
            {greeting}, {user?.name?.split(' ')[0] || 'John'}
          </Text>
        </View>

        {/* Raycast-Inspired Omni-Command Bar */}
        <View style={styles.omniBarWrapper}>
          <View
            style={[
              styles.omniBarContainer,
              isFocused && styles.omniBarFocused,
            ]}
          >
            <View style={styles.searchIconGlyph}>
              <View style={styles.searchCircle} />
              <View style={styles.searchHandle} />
            </View>

            <TextInput
              style={styles.omniInput}
              placeholder="Search tasks, matrices, or ask Nova Copilot..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cmdKeyPill}>
                <Text style={styles.cmdKeyText}>⌘K</Text>
              </View>
            )}
          </View>

          {/* Prompt Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptScroll}
          >
            {QUICK_PROMPTS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.promptChip}
                onPress={() => navigate(p.target)}
                activeOpacity={0.7}
              >
                <Text style={styles.promptChipText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* High-Density KPI Horizon (Horizontal Data Stream) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiHorizonScroll}
        >
          {/* Tile 1: Sprint Velocity Gauge */}
          <TouchableOpacity
            style={styles.kpiTile}
            activeOpacity={0.85}
            onPress={() => navigate('Analytics')}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiCategory}>SPRINT VELOCITY</Text>
              <View style={styles.kpiLiveDotGreen} />
            </View>
            <View style={styles.kpiMetricRow}>
              <Text style={styles.kpiBigNumber}>78.4%</Text>
              <Text style={styles.kpiDeltaPositive}>+18.2%</Text>
            </View>
            {/* Vector Sparkline Bars */}
            <View style={styles.sparklineTrack}>
              <View style={[styles.sparkBar, { height: 8 }]} />
              <View style={[styles.sparkBar, { height: 12 }]} />
              <View style={[styles.sparkBar, { height: 16 }]} />
              <View style={[styles.sparkBar, { height: 22, backgroundColor: '#38BDF8' }]} />
              <View style={[styles.sparkBar, { height: 26, backgroundColor: '#818CF8' }]} />
            </View>
            <Text style={styles.kpiSubCaption}>3 days ahead of release</Text>
          </TouchableOpacity>

          {/* Tile 2: Active Matrices */}
          <TouchableOpacity
            style={styles.kpiTile}
            activeOpacity={0.85}
            onPress={() => navigate('Projects')}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiCategory}>WORKSTREAM STATUS</Text>
              <View style={[styles.kpiLiveDotGreen, styles.dotCyan]} />
            </View>
            <View style={styles.kpiMetricRow}>
              <Text style={styles.kpiBigNumber}>18 / 24</Text>
              <Text style={styles.kpiUnitLabel}>Done</Text>
            </View>
            <View style={styles.kpiSegmentBar}>
              <View style={[styles.kpiSegment, styles.segComplete]} />
              <View style={[styles.kpiSegment, styles.segComplete]} />
              <View style={[styles.kpiSegment, styles.segComplete]} />
              <View style={[styles.kpiSegment, styles.segPending]} />
            </View>
            <Text style={styles.kpiSubCaption}>4 milestones in flight</Text>
          </TouchableOpacity>

          {/* Tile 3: Team Presence */}
          <TouchableOpacity
            style={styles.kpiTile}
            activeOpacity={0.85}
            onPress={() => navigate('Messages')}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiCategory}>TEAM PRESENCE</Text>
              <View style={styles.kpiLiveDotGreen} />
            </View>
            <View style={styles.kpiMetricRow}>
              <Text style={styles.kpiBigNumber}>4 / 6</Text>
              <Text style={styles.kpiUnitLabel}>Active</Text>
            </View>
            <View style={styles.teamAvatarRow}>
              <View style={[styles.kpiAvatar, styles.av1]}>
                <Text style={styles.kpiAvatarText}>JD</Text>
              </View>
              <View style={[styles.kpiAvatar, styles.av2]}>
                <Text style={styles.kpiAvatarText}>AS</Text>
              </View>
              <View style={[styles.kpiAvatar, styles.av3]}>
                <Text style={styles.kpiAvatarText}>RK</Text>
              </View>
              <View style={[styles.kpiAvatar, styles.av4]}>
                <Text style={styles.kpiAvatarText}>+2</Text>
              </View>
            </View>
            <Text style={styles.kpiSubCaption}>Alice pushed v2.4 spec</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Contextual Nova AI Intelligence Briefing */}
        <TouchableOpacity
          style={styles.briefingCard}
          activeOpacity={0.85}
          onPress={() => navigate('AIAssistant')}
        >
          <View style={styles.briefingHeader}>
            <View style={styles.briefingBadge}>
              <Text style={styles.briefingGlyph}>◈</Text>
              <Text style={styles.briefingBadgeText}>NOVA REALTIME INTEL</Text>
            </View>
            <Text style={styles.briefingTime}>Synced 6m ago</Text>
          </View>
          <Text style={styles.briefingBody}>
            &ldquo;Staging latency dropped by 18ms on test cluster. 2 critical pull requests awaiting Lead review before 4:00 PM release sync.&rdquo;
          </Text>
          <View style={styles.briefingFooter}>
            <Text style={styles.briefingActionText}>Review in Copilot</Text>
            <Text style={styles.briefingActionArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Linear-Style Actionable Daily Kanban Feed */}
        <View style={styles.feedSectionHeader}>
          <View style={styles.feedTitleGroup}>
            <Text style={styles.feedSectionTitle}>My Focus Today</Text>
            <View style={styles.feedCountBadge}>
              <Text style={styles.feedCountText}>{remainingCount} pending</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigate('Projects')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewBacklogText}>Backlog ›</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips for Daily Focus */}
        <View style={styles.scopeFilterRow}>
          {(
            [
              { id: 'all', label: 'All Tasks' },
              { id: 'priority', label: 'Critical P1' },
              { id: 'review', label: 'In Review' },
              { id: 'completed', label: 'Completed' },
            ] as const
          ).map(tab => {
            const active = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.scopeFilterPill,
                  active && styles.scopeFilterPillActive,
                ]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.scopeFilterText,
                    active && styles.scopeFilterTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Interactive Tasks List */}
        <View style={styles.tasksFeedList}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyTaskState}>
              <Text style={styles.emptyTaskText}>No tasks matching filter.</Text>
            </View>
          ) : (
            filteredTasks.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.taskItemCard,
                  item.done && styles.taskItemCardDone,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  navigate('ProjectDetail', {
                    id: item.projectId,
                    title: item.title,
                    subtitle: item.subsystem,
                    progress: item.done ? 1.0 : 0.65,
                    badge: item.priorityLabel,
                  })
                }
              >
                {/* Status Toggle Box */}
                <TouchableOpacity
                  style={[
                    styles.taskRadioBox,
                    item.done && styles.taskRadioBoxDone,
                  ]}
                  onPress={() => handleToggleTask(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {item.done && <Text style={styles.taskCheckmark}>✓</Text>}
                </TouchableOpacity>

                <View style={styles.taskContentCol}>
                  <Text
                    style={[
                      styles.taskItemTitle,
                      item.done && styles.taskItemTitleDone,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.taskItemSub}>{item.subsystem}</Text>

                  <View style={styles.taskFooterMeta}>
                    <View
                      style={[
                        styles.priorityIndicator,
                        item.priorityCode === 'P1' && styles.p1Indicator,
                        item.priorityCode === 'P2' && styles.p2Indicator,
                      ]}
                    >
                      <Text style={styles.priorityIndicatorText}>
                        {item.priorityCode} • {item.priorityLabel}
                      </Text>
                    </View>

                    <Text style={styles.taskDueStamp}>Due {item.dueTime}</Text>

                    <View style={styles.assigneeAvatarMini}>
                      <Text style={styles.assigneeAvatarText}>
                        {item.assignee}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.taskItemChevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* 4-Way Fast Action Dock (Thumb-Zone Ergonomics) */}
        <View style={styles.actionDockSection}>
          <Text style={styles.actionDockLabel}>FAST COMMANDS</Text>
          <View style={styles.actionDockRow}>
            <TouchableOpacity
              style={styles.actionDockBtn}
              activeOpacity={0.8}
              onPress={() => navigate('Projects')}
            >
              <Text style={styles.dockBtnIcon}>📁</Text>
              <Text style={styles.dockBtnText}>Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionDockBtn}
              activeOpacity={0.8}
              onPress={() => navigate('Analytics')}
            >
              <Text style={styles.dockBtnIcon}>📊</Text>
              <Text style={styles.dockBtnText}>Telemetry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionDockBtn}
              activeOpacity={0.8}
              onPress={() => navigate('Messages')}
            >
              <Text style={styles.dockBtnIcon}>💬</Text>
              <Text style={styles.dockBtnText}>Team Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionDockBtn, styles.dockBtnHighlight]}
              activeOpacity={0.8}
              onPress={() => navigate('AIAssistant')}
            >
              <Text style={styles.dockBtnIcon}>◈</Text>
              <Text style={styles.dockBtnHighlightText}>Copilot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070A13', // Deep Velvet Obsidian Noir (Linear / Raycast standard)
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  // Ambient Glow Accents
  ambientGlowTopLeft: {
    position: 'absolute',
    top: 0,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(99, 102, 241, 0.12)', // Royal iris glow
  },
  ambientGlowTopRight: {
    position: 'absolute',
    top: 60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(56, 189, 248, 0.08)', // Ice cerulean glow
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  workspaceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  workspaceName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#E2E8F0',
  },
  workspaceChevron: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  omniActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  omniGlyph: {
    fontSize: 15,
    color: '#818CF8',
    fontWeight: '900',
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  vectorBellStem: {
    position: 'absolute',
    top: 9,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E2E8F0',
  },
  vectorBellBody: {
    width: 13,
    height: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  vectorBellRinger: {
    width: 5,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 1,
  },
  notificationPip: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#EF4444',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#070A13',
  },
  notificationPipText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileAvatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1B4B',
    borderWidth: 1.5,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#818CF8',
  },
  // Greeting Section
  greetingSection: {
    marginBottom: 18,
  },
  dateLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  // Omni Command Bar
  omniBarWrapper: {
    marginBottom: 20,
  },
  omniBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  omniBarFocused: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  searchIconGlyph: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    width: 5,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 1,
    position: 'absolute',
    bottom: 2,
    right: 1,
    transform: [{ rotate: '45deg' }],
  },
  omniInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#F8FAFC',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
  },
  cmdKeyPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cmdKeyText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  promptScroll: {
    paddingTop: 10,
    gap: 8,
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  // High-Density KPI Horizon
  kpiHorizonScroll: {
    gap: 12,
    marginBottom: 20,
    paddingRight: 12,
  },
  kpiTile: {
    width: 160,
    backgroundColor: '#0F1528',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiCategory: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#64748B',
  },
  kpiLiveDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  dotCyan: {
    backgroundColor: '#38BDF8',
  },
  kpiMetricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  kpiBigNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  kpiDeltaPositive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  kpiUnitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  sparklineTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 4,
    marginBottom: 8,
  },
  sparkBar: {
    flex: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.4)',
    borderRadius: 2,
  },
  kpiSegmentBar: {
    flexDirection: 'row',
    height: 5,
    gap: 3,
    marginBottom: 12,
    marginTop: 6,
  },
  kpiSegment: {
    flex: 1,
    borderRadius: 2.5,
  },
  segComplete: {
    backgroundColor: '#38BDF8',
  },
  segPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    marginBottom: 8,
  },
  kpiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F1528',
    marginLeft: -6,
  },
  av1: {
    backgroundColor: '#4F46E5',
    marginLeft: 0,
  },
  av2: {
    backgroundColor: '#06B6D4',
  },
  av3: {
    backgroundColor: '#F59E0B',
  },
  av4: {
    backgroundColor: '#334155',
  },
  kpiAvatarText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  kpiSubCaption: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  // Briefing Card
  briefingCard: {
    backgroundColor: 'rgba(15, 21, 40, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  briefingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  briefingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  briefingGlyph: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '900',
  },
  briefingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 1.2,
  },
  briefingTime: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  briefingBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#CBD5E1',
    fontWeight: '500',
    marginBottom: 10,
  },
  briefingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  briefingActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  briefingActionArrow: {
    fontSize: 13,
    fontWeight: '900',
    color: '#38BDF8',
  },
  // Feed Section Header
  feedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  feedCountBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  feedCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818CF8',
  },
  viewBacklogText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
  },
  // Scope Filter Row
  scopeFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  scopeFilterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  scopeFilterPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  scopeFilterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  scopeFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  // Tasks List
  tasksFeedList: {
    gap: 10,
    marginBottom: 24,
  },
  emptyTaskState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTaskText: {
    fontSize: 13,
    color: '#64748B',
  },
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1528',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  taskItemCardDone: {
    opacity: 0.5,
    backgroundColor: 'rgba(15, 21, 40, 0.4)',
  },
  taskRadioBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskRadioBoxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskCheckmark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  taskContentCol: {
    flex: 1,
  },
  taskItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 3,
  },
  taskItemTitleDone: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  taskItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  taskFooterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  p1Indicator: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  p2Indicator: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  priorityIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  taskDueStamp: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  assigneeAvatarMini: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assigneeAvatarText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#818CF8',
  },
  taskItemChevron: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.25)',
    fontWeight: '700',
  },
  // Fast Command Dock
  actionDockSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  actionDockLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#64748B',
    marginBottom: 10,
  },
  actionDockRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionDockBtn: {
    flex: 1,
    backgroundColor: '#0F1528',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  dockBtnHighlight: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
  },
  dockBtnIcon: {
    fontSize: 15,
  },
  dockBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dockBtnHighlightText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818CF8',
  },
});
