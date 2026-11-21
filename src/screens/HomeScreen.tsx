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

type DashboardTab = 'overview' | 'tasks' | 'team';

interface TodayTask {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  priority: 'P1' | 'P2' | 'P3';
  dueTime: string;
  done: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: string;
  online: boolean;
}

interface WorkstreamItem {
  id: string;
  title: string;
  discipline: string;
  time: string;
  priorityCode: 'P1' | 'P2' | 'P3' | 'DONE';
  badge: string;
  badgeVariant: 'primary' | 'success' | 'accent' | 'error';
  progress: number;
  leadInitials: string;
}

const CATEGORIES = [
  { id: 'All', label: 'All Tasks', count: 12 },
  { id: 'In Progress', label: 'In Progress', count: 4 },
  { id: 'Priority', label: 'High Priority', count: 3 },
  { id: 'Completed', label: 'Completed', count: 5 },
];

const INITIAL_TODAY_TASKS: TodayTask[] = [
  {
    id: 't1',
    title: 'Review Figma design tokens v2.4 spec',
    assignee: 'Alice Smith',
    assigneeInitials: 'AS',
    priority: 'P1',
    dueTime: '11:30 AM',
    done: true,
  },
  {
    id: 't2',
    title: 'Verify mTLS API Gateway endpoint routing',
    assignee: 'John Doe',
    assigneeInitials: 'JD',
    priority: 'P1',
    dueTime: '2:00 PM',
    done: false,
  },
  {
    id: 't3',
    title: 'Deploy staging v1.4 to test cluster',
    assignee: 'Robert King',
    assigneeInitials: 'RK',
    priority: 'P2',
    dueTime: '4:30 PM',
    done: false,
  },
  {
    id: 't4',
    title: 'Validate PostgreSQL replica failover latency',
    assignee: 'Maya Lin',
    assigneeInitials: 'ML',
    priority: 'P3',
    dueTime: 'Tomorrow',
    done: false,
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Smith',
    initials: 'AS',
    role: 'UI/UX Lead',
    status: 'Pushed design tokens',
    online: true,
  },
  {
    id: '2',
    name: 'Robert King',
    initials: 'RK',
    role: 'Backend Architect',
    status: 'Staging cluster green',
    online: true,
  },
  {
    id: '3',
    name: 'Maya Lin',
    initials: 'ML',
    role: 'Database Engineer',
    status: 'Indexing query plans',
    online: false,
  },
  {
    id: '4',
    name: 'Tom Nelson',
    initials: 'TN',
    role: 'QA Automation',
    status: 'Verified E2E suite',
    online: false,
  },
];

const WORKSTREAMS: WorkstreamItem[] = [
  {
    id: '1',
    title: 'Mobile App Redesign',
    discipline: 'Design System & Component Spec v2.4',
    time: '25m ago',
    priorityCode: 'P1',
    badge: 'In Progress',
    badgeVariant: 'accent',
    progress: 0.85,
    leadInitials: 'JD',
  },
  {
    id: '2',
    title: 'API Gateway Integration',
    discipline: 'mTLS Authentication & Endpoint Routing',
    time: '2h ago',
    priorityCode: 'P2',
    badge: 'In Review',
    badgeVariant: 'primary',
    progress: 0.6,
    leadInitials: 'AK',
  },
  {
    id: '3',
    title: 'Distributed Database Cluster',
    discipline: 'PostgreSQL read replicas & failover sync',
    time: 'Yesterday',
    priorityCode: 'DONE',
    badge: 'Completed',
    badgeVariant: 'success',
    progress: 1.0,
    leadInitials: 'MR',
  },
  {
    id: '4',
    title: 'Security Compliance Audit',
    discipline: 'SOC2 Type II validation & pentest checks',
    time: '2d ago',
    priorityCode: 'P1',
    badge: 'Attention',
    badgeVariant: 'error',
    progress: 0.4,
    leadInitials: 'SL',
  },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>(INITIAL_TODAY_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const isSearching = searchQuery.trim().length > 0;

  // Toggle tasks in local checklist
  const handleToggleTask = (taskId: string) => {
    setTodayTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  };

  const completedCount = todayTasks.filter(t => t.done).length;

  // Filter activities by query and category
  const filteredWorkstreams = useMemo(() => {
    return WORKSTREAMS.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Completed' && item.badge === 'Completed') ||
        (selectedCategory === 'Priority' &&
          (item.priorityCode === 'P1' || item.badge === 'Attention')) ||
        (selectedCategory === 'In Progress' &&
          (item.badge === 'In Review' || item.badge === 'In Progress'));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const topPadding =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight || 0) + 14
      : insets.top + 14;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

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
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileMeta}
            activeOpacity={0.8}
            onPress={() => navigate('Profile')}
          >
            {/* Precision Avatar */}
            <View style={styles.avatarRing}>
              <View style={styles.avatarCore}>
                <Text style={styles.avatarInitials}>
                  {user?.avatarInitials || 'JD'}
                </Text>
              </View>
              <View style={styles.onlinePulseBadge} />
            </View>

            {/* Greeting & Date */}
            <View style={styles.greetingGroup}>
              <View style={styles.dateLabelRow}>
                <Text style={styles.dateLabelText}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  }).toUpperCase()}
                </Text>
                <View style={styles.microDivider} />
                <Text style={styles.roleLabelText}>
                  {user?.role?.split(' ')[0]?.toUpperCase() || 'LEAD'}
                </Text>
              </View>
              <Text style={styles.greetingTitle}>
                {greeting}, {user?.name?.split(' ')[0] || 'John'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Quick Actions (Notifications & AI) */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerAIPill}
              activeOpacity={0.8}
              onPress={() => navigate('AIAssistant')}
            >
              <Text style={styles.headerAIGlyph}>◈</Text>
              <Text style={styles.headerAIText}>Copilot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionButton}
              activeOpacity={0.7}
              onPress={() => navigate('Notifications')}
            >
              <View style={styles.vectorBellStem} />
              <View style={styles.vectorBellBody} />
              <View style={styles.vectorBellRinger} />
              <View style={styles.notificationCountPip}>
                <Text style={styles.notificationCountText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard View Switcher Segment */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentTab,
              activeTab === 'overview' && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab('overview')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === 'overview' && styles.segmentTabTextActive,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentTab,
              activeTab === 'tasks' && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab('tasks')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === 'tasks' && styles.segmentTabTextActive,
              ]}
            >
              Priorities ({todayTasks.length - completedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentTab,
              activeTab === 'team' && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab('team')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === 'team' && styles.segmentTabTextActive,
              ]}
            >
              Team Pulse
            </Text>
          </TouchableOpacity>
        </View>

        {/* Command Search Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBarContainer,
              isFocused && styles.searchBarFocused,
            ]}
          >
            <View style={styles.searchIconGlyph}>
              <View style={styles.searchCircle} />
              <View style={styles.searchHandle} />
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search projects, tasks, or docs..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {isSearching ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cmdKeyPill}>
                <Text style={styles.cmdKeyText}>⌘K</Text>
              </View>
            )}
          </View>

          {/* Quick Search Chips */}
          {!isSearching && activeTab === 'overview' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipScroll}
            >
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                    <View
                      style={[
                        styles.filterChipCount,
                        isSelected && styles.filterChipCountActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipCountText,
                          isSelected && styles.filterChipCountTextActive,
                        ]}
                      >
                        {cat.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* TAB CONTENT 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Command Center Executive Hero Card */}
            <View style={styles.heroCommandCard}>
              <View style={styles.heroAuraBackdrop} />

              <View style={styles.heroTopMeta}>
                <View style={styles.heroLivePill}>
                  <View style={styles.livePulseGreen} />
                  <Text style={styles.heroLivePillText}>SPRINT 14 • ACTIVE</Text>
                </View>
                <Text style={styles.heroDaysAheadPill}>3 DAYS AHEAD</Text>
              </View>

              {/* Progress Gauge & Title */}
              <View style={styles.heroMetricsCluster}>
                <View style={styles.heroGaugeCircle}>
                  <Text style={styles.heroGaugePercent}>78%</Text>
                  <Text style={styles.heroGaugeLabel}>ON TRACK</Text>
                </View>

                <View style={styles.heroTitlesContainer}>
                  <Text style={styles.heroMainTitle}>Q4 Launch Velocity</Text>
                  <Text style={styles.heroSubtitleText}>
                    18 of 24 milestones achieved with zero blockers.
                  </Text>
                </View>
              </View>

              {/* Segmented Timeline Bar */}
              <View style={styles.segmentedTrack}>
                <View style={styles.segmentActive} />
                <View style={styles.segmentActive} />
                <View style={styles.segmentActive} />
                <View style={styles.segmentInactive} />
              </View>

              {/* Quick Actions Row */}
              <View style={styles.heroActionFooter}>
                <TouchableOpacity
                  style={styles.heroActionPill}
                  onPress={() => navigate('Projects')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroActionPillText}>Projects ›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.heroActionPill}
                  onPress={() => navigate('Analytics')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroActionPillText}>Analytics ›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.heroActionPill, styles.heroActionPillHighlight]}
                  onPress={() => navigate('AIAssistant')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroActionHighlightText}>Ask Nova ◈</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick 4-Way Launchpad Matrix */}
            <View style={styles.launchpadGrid}>
              <TouchableOpacity
                style={styles.launchpadCard}
                activeOpacity={0.85}
                onPress={() => navigate('Projects')}
              >
                <View style={[styles.launchpadIconBox, styles.iconBoxBlue]}>
                  <View style={styles.vectorFolderIcon} />
                </View>
                <Text style={styles.launchpadTitle}>Projects</Text>
                <Text style={styles.launchpadSub}>12 Active</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.launchpadCard}
                activeOpacity={0.85}
                onPress={() => navigate('Analytics')}
              >
                <View style={[styles.launchpadIconBox, styles.iconBoxIndigo]}>
                  <View style={styles.vectorChartIcon}>
                    <View style={styles.vBar1} />
                    <View style={styles.vBar2} />
                    <View style={styles.vBar3} />
                  </View>
                </View>
                <Text style={styles.launchpadTitle}>Analytics</Text>
                <Text style={styles.launchpadSub}>+18.4% Pace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.launchpadCard}
                activeOpacity={0.85}
                onPress={() => navigate('Messages')}
              >
                <View style={[styles.launchpadIconBox, styles.iconBoxCyan]}>
                  <View style={styles.vectorChatIcon} />
                </View>
                <Text style={styles.launchpadTitle}>Messages</Text>
                <Text style={styles.launchpadSub}>2 Unread</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.launchpadCard}
                activeOpacity={0.85}
                onPress={() => navigate('AIAssistant')}
              >
                <View style={[styles.launchpadIconBox, styles.iconBoxPurple]}>
                  <Text style={styles.vectorAIGlyph}>◈</Text>
                </View>
                <Text style={styles.launchpadTitle}>Nova Copilot</Text>
                <Text style={styles.launchpadSub}>Live Intel</Text>
              </TouchableOpacity>
            </View>

            {/* Nova AI Dynamic Intelligence Capsule */}
            <TouchableOpacity
              style={styles.copilotBriefingCard}
              activeOpacity={0.85}
              onPress={() => navigate('AIAssistant')}
            >
              <View style={styles.copilotHeaderRow}>
                <View style={styles.copilotBadge}>
                  <Text style={styles.copilotGlyph}>◈</Text>
                  <Text style={styles.copilotBadgeText}>NOVA BRIEFING</Text>
                </View>
                <Text style={styles.copilotTimeText}>Generated 12m ago</Text>
              </View>
              <Text style={styles.copilotBodyText}>
                &ldquo;All health checks across staging v1.4 are green. Staging latency dropped by 18ms. 3 PRs ready for sign-off.&rdquo;
              </Text>
              <View style={styles.copilotActionRow}>
                <Text style={styles.copilotActionText}>Open Copilot Discussion</Text>
                <Text style={styles.copilotActionChevron}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Active Workstreams Section */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Active Workstreams</Text>
                <View style={styles.badgeCountPill}>
                  <Text style={styles.badgeCountText}>
                    {filteredWorkstreams.length}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigate('Projects')}>
                <Text style={styles.sectionActionText}>View All ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.workstreamsList}>
              {filteredWorkstreams.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigate('ProjectDetail', {
                      id: item.id,
                      title: item.title,
                      subtitle: item.discipline,
                      progress: item.progress,
                      badge: item.badge,
                    })
                  }
                >
                  <Card style={styles.workstreamCard}>
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.priorityPill,
                          item.priorityCode === 'P1' && styles.priorityP1,
                          item.priorityCode === 'P2' && styles.priorityP2,
                          item.priorityCode === 'DONE' && styles.priorityDone,
                        ]}
                      >
                        <Text style={styles.priorityCodeText}>
                          {item.priorityCode}
                        </Text>
                      </View>
                      <View style={styles.cardHeaderInfo}>
                        <Text style={styles.workstreamTitle}>{item.title}</Text>
                        <Text style={styles.workstreamDiscipline}>
                          {item.discipline}
                        </Text>
                      </View>
                      <Badge label={item.badge} variant={item.badgeVariant} />
                    </View>

                    <View style={styles.cardBottomRow}>
                      <View style={styles.progressTrackBar}>
                        <View
                          style={[
                            styles.progressFillBar,
                            {
                              width: `${Math.round(item.progress * 100)}%`,
                              backgroundColor:
                                item.progress === 1.0
                                  ? colors.success
                                  : colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.cardMetaRow}>
                        <View style={styles.leadAvatarMini}>
                          <Text style={styles.leadAvatarMiniText}>
                            {item.leadInitials}
                          </Text>
                        </View>
                        <Text style={styles.cardTimeText}>{item.time}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* TAB CONTENT 2: PRIORITIES CHECKLIST */}
        {activeTab === 'tasks' && (
          <View style={styles.tasksTabContainer}>
            <View style={styles.checklistSummaryBox}>
              <View>
                <Text style={styles.summaryTitle}>Daily Focus Checklist</Text>
                <Text style={styles.summarySubtitle}>
                  {completedCount} of {todayTasks.length} tasks completed today
                </Text>
              </View>
              <View style={styles.summaryPercentBadge}>
                <Text style={styles.summaryPercentText}>
                  {Math.round((completedCount / todayTasks.length) * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.tasksListGroup}>
              {todayTasks.map(task => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskItemCard, task.done && styles.taskItemCardDone]}
                  activeOpacity={0.8}
                  onPress={() => handleToggleTask(task.id)}
                >
                  <View
                    style={[
                      styles.taskCheckbox,
                      task.done && styles.taskCheckboxActive,
                    ]}
                  >
                    {task.done && <Text style={styles.checkmarkGlyph}>✓</Text>}
                  </View>

                  <View style={styles.taskInfoCol}>
                    <Text
                      style={[
                        styles.taskTitleText,
                        task.done && styles.taskTitleTextDone,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <View style={styles.taskMetaRow}>
                      <View
                        style={[
                          styles.taskPriorityPill,
                          task.priority === 'P1' && styles.priorityP1,
                          task.priority === 'P2' && styles.priorityP2,
                        ]}
                      >
                        <Text style={styles.taskPriorityText}>
                          {task.priority}
                        </Text>
                      </View>
                      <Text style={styles.taskDueText}>Due {task.dueTime}</Text>
                      <View style={styles.taskAssigneeBadge}>
                        <Text style={styles.taskAssigneeText}>
                          {task.assigneeInitials}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.openAllProjectsBtn}
              activeOpacity={0.85}
              onPress={() => navigate('Projects')}
            >
              <Text style={styles.openAllProjectsText}>
                Open Full Project Backlog ›
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB CONTENT 3: TEAM PULSE */}
        {activeTab === 'team' && (
          <View style={styles.teamTabContainer}>
            <View style={styles.teamSummaryHeader}>
              <Text style={styles.summaryTitle}>Live Team Availability</Text>
              <Text style={styles.summarySubtitle}>
                2 members online • Synchronized with workspace
              </Text>
            </View>

            <View style={styles.teamListGroup}>
              {TEAM_MEMBERS.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.teamCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigate('ChatDetail', {
                      id: member.id,
                      name: member.name,
                      avatar: member.initials,
                      online: member.online,
                    })
                  }
                >
                  <View style={styles.teamAvatarBox}>
                    <View style={styles.teamAvatarCore}>
                      <Text style={styles.teamAvatarInitials}>
                        {member.initials}
                      </Text>
                    </View>
                    {member.online && <View style={styles.onlineDotGreen} />}
                  </View>

                  <View style={styles.teamInfoCol}>
                    <View style={styles.teamNameRow}>
                      <Text style={styles.teamMemberName}>{member.name}</Text>
                      <Text style={styles.teamMemberRole}>{member.role}</Text>
                    </View>
                    <Text style={styles.teamMemberStatus} numberOfLines={1}>
                      {member.status}
                    </Text>
                  </View>

                  <View style={styles.chatActionBtn}>
                    <Text style={styles.chatActionBtnText}>Chat ›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.openMessagesBtn}
              activeOpacity={0.85}
              onPress={() => navigate('Messages')}
            >
              <Text style={styles.openMessagesText}>
                Go to Team Channels ›
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  // Top Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCore: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  onlinePulseBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingGroup: {
    justifyContent: 'center',
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dateLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  microDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  roleLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAIPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 5,
  },
  headerAIGlyph: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '900',
  },
  headerAIText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  iconActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  vectorBellStem: {
    position: 'absolute',
    top: 9,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#475569',
  },
  vectorBellBody: {
    width: 14,
    height: 13,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: '#475569',
    marginTop: 2,
  },
  vectorBellRinger: {
    width: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#475569',
    marginTop: 1,
  },
  notificationCountPip: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Segmented Tab Switcher
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    fontWeight: '800',
    color: '#0F172A',
  },
  // Command Search Bar
  searchSection: {
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchBarFocused: {
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.12,
    shadowRadius: 8,
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
    borderWidth: 2,
    borderColor: '#64748B',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    width: 5,
    height: 2,
    backgroundColor: '#64748B',
    borderRadius: 1,
    position: 'absolute',
    bottom: 2,
    right: 1,
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  cmdKeyPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cmdKeyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipScroll: {
    paddingTop: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipCount: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterChipCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipCountTextActive: {
    color: '#FFFFFF',
  },
  // Hero Command Card
  heroCommandCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  heroAuraBackdrop: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  heroTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  livePulseGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroLivePillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#E2E8F0',
  },
  heroDaysAheadPill: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroMetricsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  },
  heroGaugeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGaugePercent: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroGaugeLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 0.8,
  },
  heroTitlesContainer: {
    flex: 1,
  },
  heroMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroSubtitleText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#94A3B8',
  },
  segmentedTrack: {
    flexDirection: 'row',
    height: 5,
    gap: 4,
    marginBottom: 16,
  },
  segmentActive: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 2.5,
  },
  segmentInactive: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2.5,
  },
  heroActionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroActionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heroActionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  heroActionPillHighlight: {
    backgroundColor: '#4F46E5',
  },
  heroActionHighlightText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Launchpad Grid (4 Shortcuts)
  launchpadGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  launchpadCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  launchpadIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBoxBlue: {
    backgroundColor: '#EFF6FF',
  },
  iconBoxIndigo: {
    backgroundColor: '#EEF2FF',
  },
  iconBoxCyan: {
    backgroundColor: '#ECFEFF',
  },
  iconBoxPurple: {
    backgroundColor: '#F5F3FF',
  },
  vectorFolderIcon: {
    width: 16,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  vectorChartIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 14,
  },
  vBar1: {
    width: 3,
    height: 7,
    backgroundColor: '#6366F1',
    borderRadius: 1,
  },
  vBar2: {
    width: 3,
    height: 11,
    backgroundColor: '#4F46E5',
    borderRadius: 1,
  },
  vBar3: {
    width: 3,
    height: 14,
    backgroundColor: '#4338CA',
    borderRadius: 1,
  },
  vectorChatIcon: {
    width: 15,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  vectorAIGlyph: {
    fontSize: 16,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  launchpadTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  launchpadSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  // Nova Copilot Briefing Card
  copilotBriefingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  copilotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  copilotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copilotGlyph: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '900',
  },
  copilotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1.2,
  },
  copilotTimeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  copilotBodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 10,
  },
  copilotActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copilotActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  copilotActionChevron: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  badgeCountPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  workstreamsList: {
    gap: 12,
  },
  workstreamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  priorityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityP1: {
    backgroundColor: '#FEE2E2',
  },
  priorityP2: {
    backgroundColor: '#FEF3C7',
  },
  priorityDone: {
    backgroundColor: '#D1FAE5',
  },
  priorityCodeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  workstreamTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  workstreamDiscipline: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  cardBottomRow: {
    gap: 10,
  },
  progressTrackBar: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillBar: {
    height: 4,
    borderRadius: 2,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadAvatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leadAvatarMiniText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#475569',
  },
  cardTimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // TAB 2: Tasks Checklist
  tasksTabContainer: {
    gap: 14,
  },
  checklistSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryPercentBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryPercentText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  tasksListGroup: {
    gap: 10,
  },
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  taskItemCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  taskCheckboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmarkGlyph: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  taskInfoCol: {
    flex: 1,
  },
  taskTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    marginBottom: 6,
  },
  taskTitleTextDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskPriorityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskPriorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0F172A',
  },
  taskDueText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  taskAssigneeBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskAssigneeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4F46E5',
  },
  openAllProjectsBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  openAllProjectsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // TAB 3: Team Pulse
  teamTabContainer: {
    gap: 14,
  },
  teamSummaryHeader: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
  },
  teamListGroup: {
    gap: 10,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  teamAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  teamAvatarCore: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAvatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  onlineDotGreen: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  teamInfoCol: {
    flex: 1,
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  teamMemberRole: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  teamMemberStatus: {
    fontSize: 12,
    color: '#94A3B8',
  },
  chatActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  openMessagesBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  openMessagesText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
