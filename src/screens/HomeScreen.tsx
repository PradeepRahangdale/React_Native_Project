import React, { useMemo, useState } from 'react';
import {
  Modal,
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

type FilterScope = 'all' | 'critical' | 'review' | 'done';

interface FocusTask {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  priorityCode: 'P1' | 'P2' | 'P3';
  priorityLabel: string;
  dueTime: string;
  assignee: string;
  done: boolean;
}

interface WorkstreamCard {
  id: string;
  title: string;
  category: string;
  progress: number;
  badge: string;
  badgeVariant: 'primary' | 'success' | 'accent' | 'error';
  team: string[];
  dueDate: string;
}

interface ActivityEvent {
  id: string;
  actor: string;
  actorInitials: string;
  action: string;
  target: string;
  timeAgo: string;
  type: 'deploy' | 'pr' | 'milestone';
}

const INITIAL_TASKS: FocusTask[] = [
  {
    id: 'tk-1',
    projectId: 'p1',
    projectTitle: 'Mobile App Redesign',
    title: 'Finalize design tokens & component props contract',
    priorityCode: 'P1',
    priorityLabel: 'Critical P1',
    dueTime: '11:30 AM',
    assignee: 'AS',
    done: true,
  },
  {
    id: 'tk-2',
    projectId: 'p2',
    projectTitle: 'Cloud Migration',
    title: 'Validate PostgreSQL replica failover & Redis replication',
    priorityCode: 'P1',
    priorityLabel: 'Critical P1',
    dueTime: '2:15 PM',
    assignee: 'JD',
    done: false,
  },
  {
    id: 'tk-3',
    projectId: 'p1',
    projectTitle: 'Mobile App Redesign',
    title: 'Audit accessibility contrast & touch targets across tabs',
    priorityCode: 'P2',
    priorityLabel: 'High P2',
    dueTime: '4:45 PM',
    assignee: 'RK',
    done: false,
  },
  {
    id: 'tk-4',
    projectId: 'p4',
    projectTitle: 'Payment Gateway',
    title: 'Stripe webhook signature validation & idempotency checks',
    priorityCode: 'P1',
    priorityLabel: 'Critical P1',
    dueTime: '5:30 PM',
    assignee: 'ML',
    done: false,
  },
  {
    id: 'tk-5',
    projectId: 'p3',
    projectTitle: 'Design System',
    title: 'Publish v2.4 component documentation & props guide',
    priorityCode: 'P3',
    priorityLabel: 'Normal P3',
    dueTime: 'Tomorrow',
    assignee: 'TN',
    done: false,
  },
];

const ACTIVE_WORKSTREAMS: WorkstreamCard[] = [
  {
    id: 'p1',
    title: 'Mobile App Redesign',
    category: 'Product Design',
    progress: 0.85,
    badge: 'Priority',
    badgeVariant: 'accent',
    team: ['JD', 'AS', 'RK'],
    dueDate: 'Nov 24',
  },
  {
    id: 'p2',
    title: 'Cloud Infrastructure & DB',
    category: 'Backend Architecture',
    progress: 0.65,
    badge: 'In Review',
    badgeVariant: 'primary',
    team: ['JD', 'ML'],
    dueDate: 'Nov 30',
  },
  {
    id: 'p4',
    title: 'Payment Gateway & Checkout',
    category: 'Financial Core',
    progress: 0.4,
    badge: 'Urgent',
    badgeVariant: 'error',
    team: ['JD', 'RK', 'TN'],
    dueDate: 'Dec 05',
  },
];

const RECENT_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    actor: 'Alice Smith',
    actorInitials: 'AS',
    action: 'approved & merged PR #182 into',
    target: 'release/v2.4',
    timeAgo: '12m ago',
    type: 'pr',
  },
  {
    id: 'act-2',
    actor: 'Robert King',
    actorInitials: 'RK',
    action: 'deployed staging build v2.4.1 to',
    target: 'us-east cluster',
    timeAgo: '45m ago',
    type: 'deploy',
  },
  {
    id: 'act-3',
    actor: 'Maya Lin',
    actorInitials: 'ML',
    action: 'created sprint milestone for',
    target: 'Q4 Architecture Review',
    timeAgo: '2h ago',
    type: 'milestone',
  },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<FocusTask[]>(INITIAL_TASKS);
  const [filterScope, setFilterScope] = useState<FilterScope>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Task Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Mobile App Redesign');
  const [newTaskPriority, setNewTaskPriority] = useState<'P1' | 'P2' | 'P3'>('P1');

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      return;
    }
    const newTask: FocusTask = {
      id: `tk-${Date.now()}`,
      projectId: 'p1',
      projectTitle: newTaskProject,
      title: newTaskTitle.trim(),
      priorityCode: newTaskPriority,
      priorityLabel:
        newTaskPriority === 'P1'
          ? 'Critical P1'
          : newTaskPriority === 'P2'
          ? 'High P2'
          : 'Normal P3',
      dueTime: '5:00 PM',
      assignee: user?.avatarInitials || 'JD',
      done: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsModalVisible(false);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (filterScope === 'critical') {
        return task.priorityCode === 'P1' && !task.done;
      }
      if (filterScope === 'review') {
        return task.priorityCode === 'P2' && !task.done;
      }
      if (filterScope === 'done') {
        return task.done;
      }
      return true;
    });
  }, [tasks, filterScope, searchQuery]);

  const pendingCount = useMemo(
    () => tasks.filter(t => !t.done).length,
    [tasks],
  );

  const completedCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. TOP EXECUTIVE HEADER                                    */}
        {/* ========================================================== */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileBadge}
            activeOpacity={0.8}
            onPress={() => navigate('Profile')}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.avatarInitials || 'JD'}
                </Text>
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.greetingContainer}>
              <View style={styles.workspacePill}>
                <Text style={styles.workspacePillText}>
                  {user?.organization || 'Apex Dynamics'} • Enterprise
                </Text>
              </View>
              <Text style={styles.greetingTitle}>
                {user?.name || 'John Doe'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActionGroup}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              activeOpacity={0.7}
              onPress={() => navigate('AIAssistant')}
            >
              <View style={styles.aiSparkleIconBox}>
                <Text style={styles.aiSparkleGlyph}>✦</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              activeOpacity={0.7}
              onPress={() => navigate('Notifications')}
            >
              <View style={styles.bellIconBox}>
                <View style={styles.bellDome} />
                <View style={styles.bellRim} />
                <View style={styles.bellClapper} />
              </View>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. EXECUTIVE HERO: SPRINT RUNWAY VELOCITY CARD              */}
        {/* ========================================================== */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowAccent} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.liveSprintPill}>
                <View style={styles.livePulseDot} />
                <Text style={styles.liveSprintText}>SPRINT 42</Text>
              </View>
              <View style={styles.releaseBadge}>
                <Text style={styles.releaseBadgeText}>3 DAYS REMAINING</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.roadmapBtn}
              activeOpacity={0.8}
              onPress={() => navigate('Projects')}
            >
              <Text style={styles.roadmapBtnText}>Roadmap</Text>
              <Text style={styles.roadmapBtnArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.velocityRow}>
              <Text style={styles.velocityBigNumber}>84.2%</Text>
              <View style={styles.velocityDetailCol}>
                <Text style={styles.velocityStatusLabel}>ON TRACK FOR GA</Text>
                <Text style={styles.velocitySubtext}>
                  18 of 22 milestones shipped
                </Text>
              </View>
            </View>

            {/* Segmented Progress Track */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressFill, styles.progressFillActive]} />
                <View style={[styles.progressFill, styles.progressFillReview]} />
              </View>
            </View>

            {/* Micro KPIs within Hero */}
            <View style={styles.heroMetricsGrid}>
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>48 pts</Text>
                <Text style={styles.heroMetricLabel}>Velocity</Text>
              </View>
              <View style={styles.heroMetricDivider} />
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>+18.4%</Text>
                <Text style={styles.heroMetricLabel}>Sprint Delta</Text>
              </View>
              <View style={styles.heroMetricDivider} />
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>0</Text>
                <Text style={styles.heroMetricLabel}>Blockers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. HIGH-UTILITY QUICK ACTIONS LAUNCHPAD                     */}
        {/* ========================================================== */}
        <View style={styles.launchpadContainer}>
          <TouchableOpacity
            style={styles.launchpadTile}
            activeOpacity={0.75}
            onPress={() => setIsModalVisible(true)}
          >
            <View style={[styles.tileIconBox, styles.tileBgPrimary]}>
              <Text style={styles.plusIconGlyph}>+</Text>
            </View>
            <Text style={styles.tileTitle}>New Task</Text>
            <Text style={styles.tileSubtitle}>Quick add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.launchpadTile}
            activeOpacity={0.75}
            onPress={() => navigate('Projects')}
          >
            <View style={[styles.tileIconBox, styles.tileBgCyan]}>
              <View style={styles.kanbanBoardGlyph}>
                <View style={styles.kanbanColLeft} />
                <View style={styles.kanbanColRight} />
              </View>
            </View>
            <Text style={styles.tileTitle}>Projects</Text>
            <Text style={styles.tileSubtitle}>12 active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.launchpadTile}
            activeOpacity={0.75}
            onPress={() => navigate('Analytics')}
          >
            <View style={[styles.tileIconBox, styles.tileBgEmerald]}>
              <View style={styles.chartBarGlyphContainer}>
                <View style={styles.chartBar1} />
                <View style={styles.chartBar2} />
                <View style={styles.chartBar3} />
              </View>
            </View>
            <Text style={styles.tileTitle}>Velocity</Text>
            <Text style={styles.tileSubtitle}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.launchpadTile}
            activeOpacity={0.75}
            onPress={() => navigate('AIAssistant')}
          >
            <View style={[styles.tileIconBox, styles.tileBgViolet]}>
              <Text style={styles.copilotSparkleGlyph}>✦</Text>
            </View>
            <Text style={styles.tileTitle}>Nova AI</Text>
            <Text style={styles.tileSubtitle}>Copilot</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 4. ACTIVE WORKSTREAMS (HORIZONTAL CAROUSEL)                 */}
        {/* ========================================================== */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Active Workstreams</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {ACTIVE_WORKSTREAMS.length}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('Projects')}
          >
            <Text style={styles.sectionLink}>View All ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workstreamScrollContent}
        >
          {ACTIVE_WORKSTREAMS.map(item => {
            const pct = Math.round(item.progress * 100);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.workstreamCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigate('ProjectDetail', {
                    id: item.id,
                    title: item.title,
                    subtitle: item.category,
                    progress: item.progress,
                    badge: item.badge,
                  })
                }
              >
                <View style={styles.workstreamCardTop}>
                  <Text style={styles.workstreamCategory}>
                    {item.category.toUpperCase()}
                  </Text>
                  <Badge label={item.badge} variant={item.badgeVariant} />
                </View>

                <Text style={styles.workstreamTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.workstreamProgressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressTextLabel}>Execution</Text>
                    <Text style={styles.progressTextPct}>{pct}%</Text>
                  </View>
                  <View style={styles.workstreamProgressBar}>
                    <View
                      style={[
                        styles.workstreamProgressFill,
                        item.badgeVariant === 'accent'
                          ? styles.fillAmber
                          : item.badgeVariant === 'error'
                          ? styles.fillRose
                          : styles.fillPrimary,
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.workstreamCardFooter}>
                  <View style={styles.avatarStack}>
                    {item.team.map((initials, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.stackAvatarCircle,
                          idx > 0 && styles.stackAvatarOverlap,
                        ]}
                      >
                        <Text style={styles.stackAvatarText}>{initials}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.dueDateBadge}>
                    <Text style={styles.dueDateText}>{item.dueDate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ========================================================== */}
        {/* 5. TODAY'S ACTION FOCUS (INTERACTIVE TASK HUB)              */}
        {/* ========================================================== */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Today&apos;s Focus</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                {pendingCount} remaining
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.sectionLink}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Quick Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <View style={styles.searchGlassIcon}>
              <View style={styles.glassCircle} />
              <View style={styles.glassHandle} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks, subsystems..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery !== '' && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.searchClearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Segmented Filter Scope Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterScope === 'all' && styles.filterPillActive,
            ]}
            onPress={() => setFilterScope('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                filterScope === 'all' && styles.filterPillTextActive,
              ]}
            >
              All ({tasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterScope === 'critical' && styles.filterPillActive,
            ]}
            onPress={() => setFilterScope('critical')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                filterScope === 'critical' && styles.filterPillTextActive,
              ]}
            >
              Critical P1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterScope === 'review' && styles.filterPillActive,
            ]}
            onPress={() => setFilterScope('review')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                filterScope === 'review' && styles.filterPillTextActive,
              ]}
            >
              High P2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterScope === 'done' && styles.filterPillActive,
            ]}
            onPress={() => setFilterScope('done')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                filterScope === 'done' && styles.filterPillTextActive,
              ]}
            >
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task Cards List */}
        <View style={styles.taskListContainer}>
          {filteredTasks.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>All Caught Up</Text>
              <Text style={styles.emptySubtitle}>
                No tasks match your active filter. Great job keeping the runway clear!
              </Text>
            </Card>
          ) : (
            filteredTasks.map(task => {
              const isP1 = task.priorityCode === 'P1';
              const isP2 = task.priorityCode === 'P2';

              return (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskCard, task.done && styles.taskCardDone]}
                  activeOpacity={0.85}
                  onPress={() => toggleTask(task.id)}
                >
                  <TouchableOpacity
                    style={[
                      styles.checkCircle,
                      task.done && styles.checkCircleChecked,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleTask(task.id)}
                  >
                    {task.done && <Text style={styles.checkCheckmark}>✓</Text>}
                  </TouchableOpacity>

                  <View style={styles.taskContentCol}>
                    <View style={styles.taskHeaderRow}>
                      <Text style={styles.taskProjectTag}>
                        {task.projectTitle.toUpperCase()}
                      </Text>
                      <View
                        style={[
                          styles.priorityBadge,
                          isP1
                            ? styles.badgeP1
                            : isP2
                            ? styles.badgeP2
                            : styles.badgeP3,
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityBadgeText,
                            isP1
                              ? styles.badgeTextP1
                              : isP2
                              ? styles.badgeTextP2
                              : styles.badgeTextP3,
                          ]}
                        >
                          {task.priorityLabel}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.taskTitleText,
                        task.done && styles.taskTitleTextDone,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <View style={styles.taskFooterRow}>
                      <View style={styles.taskAssigneeRow}>
                        <View style={styles.taskAssigneePill}>
                          <Text style={styles.taskAssigneeText}>
                            {task.assignee}
                          </Text>
                        </View>
                        <Text style={styles.taskDueText}>
                          Due {task.dueTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ========================================================== */}
        {/* 6. REALTIME TEAM ACTIVITY PULSE                             */}
        {/* ========================================================== */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Live Team Pulse</Text>
            <View style={styles.livePulseGreenDot} />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('Messages')}
          >
            <Text style={styles.sectionLink}>Open Chat ›</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.activityFeedCard}>
          {RECENT_ACTIVITIES.map((act, index) => {
            const isLast = index === RECENT_ACTIVITIES.length - 1;
            return (
              <View key={act.id} style={styles.activityRow}>
                <View style={styles.timelineCol}>
                  <View style={styles.activityAvatar}>
                    <Text style={styles.activityAvatarText}>
                      {act.actorInitials}
                    </Text>
                  </View>
                  {!isLast && <View style={styles.timelineTrackLine} />}
                </View>

                <View style={styles.activityBodyCol}>
                  <Text style={styles.activityText}>
                    <Text style={styles.activityActor}>{act.actor} </Text>
                    {act.action}{' '}
                    <Text style={styles.activityTarget}>{act.target}</Text>
                  </Text>
                  <Text style={styles.activityTime}>{act.timeAgo}</Text>
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>

      {/* ========================================================== */}
      {/* 7. QUICK TASK CREATION MODAL                                */}
      {/* ========================================================== */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Add Action Item</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Task Description</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Verify Stripe token authorization..."
                placeholderTextColor={colors.textMuted}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />

              <Text style={styles.inputLabel}>Target Workstream</Text>
              <View style={styles.modalRadioRow}>
                {['Mobile App Redesign', 'Cloud Infrastructure', 'Payment Gateway'].map(
                  name => {
                    const isSelected = newTaskProject === name;
                    return (
                      <TouchableOpacity
                        key={name}
                        style={[
                          styles.modalChoicePill,
                          isSelected && styles.modalChoicePillActive,
                        ]}
                        onPress={() => setNewTaskProject(name)}
                      >
                        <Text
                          style={[
                            styles.modalChoiceText,
                            isSelected && styles.modalChoiceTextActive,
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>

              <Text style={styles.inputLabel}>Priority Level</Text>
              <View style={styles.modalRadioRow}>
                {(['P1', 'P2', 'P3'] as const).map(p => {
                  const isSelected = newTaskPriority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityChoicePill,
                        isSelected && styles.priorityChoicePillActive,
                      ]}
                      onPress={() => setNewTaskPriority(p)}
                    >
                      <Text
                        style={[
                          styles.priorityChoiceText,
                          isSelected && styles.priorityChoiceTextActive,
                        ]}
                      >
                        {p === 'P1'
                          ? 'Critical P1'
                          : p === 'P2'
                          ? 'High P2'
                          : 'Normal P3'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                activeOpacity={0.85}
                onPress={handleCreateTask}
              >
                <Text style={styles.modalSubmitBtnText}>Create Focus Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    paddingHorizontal: 20,
  },

  // 1. Top Executive Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    gap: 2,
  },
  workspacePill: {
    alignSelf: 'flex-start',
  },
  workspacePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  aiSparkleIconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSparkleGlyph: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: '900',
  },
  bellIconBox: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDome: {
    width: 12,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.5,
    borderColor: '#334155',
    borderBottomWidth: 0,
  },
  bellRim: {
    width: 15,
    height: 2,
    backgroundColor: '#334155',
    borderRadius: 1,
  },
  bellClapper: {
    width: 4,
    height: 2,
    backgroundColor: '#334155',
    borderRadius: 1,
    marginTop: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },

  // 2. Executive Hero Velocity Card
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroGlowAccent: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveSprintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  liveSprintText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  releaseBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  releaseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
  roadmapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roadmapBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
  },
  roadmapBtnArrow: {
    fontSize: 15,
    fontWeight: '900',
    color: '#818CF8',
  },
  heroBody: {
    gap: 14,
  },
  velocityRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  velocityBigNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 44,
  },
  velocityDetailCol: {
    paddingBottom: 4,
    gap: 2,
  },
  velocityStatusLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.8,
  },
  velocitySubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  progressBarWrapper: {
    marginTop: 4,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressFillActive: {
    width: '74%',
    backgroundColor: '#4F46E5',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  progressFillReview: {
    width: '10%',
    backgroundColor: '#38BDF8',
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  heroMetricItem: {
    alignItems: 'center',
    gap: 2,
  },
  heroMetricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  heroMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },

  // 3. Quick Actions Launchpad
  launchpadContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  launchpadTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tileIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tileBgPrimary: {
    backgroundColor: '#EEF2FF',
  },
  tileBgCyan: {
    backgroundColor: '#ECFEFF',
  },
  tileBgEmerald: {
    backgroundColor: '#D1FAE5',
  },
  tileBgViolet: {
    backgroundColor: '#EDE9FE',
  },
  plusIconGlyph: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4F46E5',
    lineHeight: 24,
  },
  kanbanBoardGlyph: {
    flexDirection: 'row',
    gap: 2.5,
    height: 16,
  },
  kanbanColLeft: {
    width: 6,
    height: 16,
    backgroundColor: '#06B6D4',
    borderRadius: 2,
  },
  kanbanColRight: {
    width: 6,
    height: 11,
    backgroundColor: '#06B6D4',
    borderRadius: 2,
  },
  chartBarGlyphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2.5,
    height: 16,
  },
  chartBar1: {
    width: 4,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 1.5,
  },
  chartBar2: {
    width: 4,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 1.5,
  },
  chartBar3: {
    width: 4,
    height: 11,
    backgroundColor: '#10B981',
    borderRadius: 1.5,
  },
  copilotSparkleGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  tileSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // 4. Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // Workstream Carousel
  workstreamScrollContent: {
    paddingRight: 20,
    gap: 14,
    marginBottom: 28,
  },
  workstreamCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  workstreamCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workstreamCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  workstreamTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    height: 40,
    marginBottom: 12,
  },
  workstreamProgressSection: {
    marginBottom: 14,
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  progressTextPct: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  workstreamProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  workstreamProgressFill: {
    height: '100%',
    width: '80%',
    borderRadius: 3,
  },
  fillPrimary: {
    backgroundColor: '#4F46E5',
  },
  fillAmber: {
    backgroundColor: '#F59E0B',
  },
  fillRose: {
    backgroundColor: '#EF4444',
  },
  workstreamCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4F46E5',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackAvatarOverlap: {
    marginLeft: -8,
  },
  stackAvatarText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dueDateBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dueDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },

  // 5. Today's Action Hub
  pendingBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchGlassIcon: {
    width: 14,
    height: 14,
    position: 'relative',
  },
  glassCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  glassHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 5,
    height: 1.5,
    backgroundColor: '#94A3B8',
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  searchClearBtn: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  taskListContainer: {
    gap: 10,
    marginBottom: 28,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  taskCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
    opacity: 0.75,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginTop: -1,
  },
  taskContentCol: {
    flex: 1,
    gap: 4,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskProjectTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeP1: {
    backgroundColor: '#FEE2E2',
  },
  badgeP2: {
    backgroundColor: '#FEF3C7',
  },
  badgeP3: {
    backgroundColor: '#EEF2FF',
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  badgeTextP1: {
    color: '#EF4444',
  },
  badgeTextP2: {
    color: '#D97706',
  },
  badgeTextP3: {
    color: '#4F46E5',
  },
  taskTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  taskTitleTextDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  taskAssigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskAssigneePill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskAssigneeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4F46E5',
  },
  taskDueText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // 6. Live Pulse Feed
  livePulseGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activityFeedCard: {
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineCol: {
    alignItems: 'center',
    width: 28,
  },
  activityAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  timelineTrackLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 4,
  },
  activityBodyCol: {
    flex: 1,
    gap: 3,
    paddingBottom: 4,
  },
  activityText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  activityActor: {
    fontWeight: '700',
    color: '#0F172A',
  },
  activityTarget: {
    fontWeight: '700',
    color: '#4F46E5',
  },
  activityTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // 7. Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
  },
  modalBody: {
    gap: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
  },
  modalRadioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalChoicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalChoicePillActive: {
    backgroundColor: '#4F46E5',
  },
  modalChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  modalChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priorityChoicePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  priorityChoicePillActive: {
    backgroundColor: '#0F172A',
  },
  priorityChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  priorityChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalSubmitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
