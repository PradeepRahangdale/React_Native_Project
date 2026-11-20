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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic Time-of-Day Greeting (Human Design Touch)
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
        {/* Top Executive Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileMeta}
            activeOpacity={0.8}
            onPress={() => navigate('Profile')}
          >
            {/* Precision Avatar with Ring */}
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

          {/* Quick Header Actions */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.iconActionButton}
              activeOpacity={0.7}
              onPress={() => navigate('Notifications')}
            >
              {/* Clean Vector Bell Icon */}
              <View style={styles.vectorBellStem} />
              <View style={styles.vectorBellBody} />
              <View style={styles.vectorBellRinger} />
              {/* Unread Indicator */}
              <View style={styles.notificationCountPip}>
                <Text style={styles.notificationCountText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Command Search Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBarContainer,
              isFocused && styles.searchBarFocused,
            ]}
          >
            {/* Vector Search Glyph */}
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
          {!isSearching && (
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

        {/* Live Search Results View */}
        {isSearching ? (
          <View style={styles.searchResultsSection}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                Matches for &ldquo;{searchQuery}&rdquo;
              </Text>
              <Badge
                label={`${filteredWorkstreams.length} found`}
                variant={filteredWorkstreams.length > 0 ? 'primary' : 'accent'}
              />
            </View>

            {filteredWorkstreams.length === 0 ? (
              <Card style={styles.emptyResultsCard}>
                <View style={styles.emptyIconCircle}>
                  <View style={styles.searchCircleLarge} />
                  <View style={styles.searchHandleLarge} />
                </View>
                <Text style={styles.emptyTitle}>No matching workstreams</Text>
                <Text style={styles.emptySubtitle}>
                  Try keywords like &ldquo;Design&rdquo;, &ldquo;API&rdquo;,
                  &ldquo;Cluster&rdquo;, or &ldquo;Audit&rdquo;.
                </Text>
                <TouchableOpacity
                  style={styles.resetSearchBtn}
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetSearchBtnText}>Reset Query</Text>
                </TouchableOpacity>
              </Card>
            ) : (
              <View style={styles.resultsList}>
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
                        <View style={styles.priorityPill}>
                          <Text style={styles.priorityCodeText}>
                            {item.priorityCode}
                          </Text>
                        </View>
                        <View style={styles.cardHeaderInfo}>
                          <Text style={styles.workstreamTitle}>
                            {item.title}
                          </Text>
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
            )}
          </View>
        ) : (
          /* Main Dashboard Feed */
          <>
            {/* Executive Hero Pulse Card (Obsidian & Iris Glassmorphic) */}
            <TouchableOpacity
              style={styles.heroExecutiveCard}
              activeOpacity={0.9}
              onPress={() => navigate('Projects')}
            >
              {/* Ambient Sheen Layer */}
              <View style={styles.heroAuraBackdrop} />

              <View style={styles.heroTopMeta}>
                <View style={styles.heroLivePill}>
                  <View style={styles.livePulseGreen} />
                  <Text style={styles.heroLivePillText}>SPRINT 14 ACTIVE</Text>
                </View>
                <View style={styles.heroTimeRemainingPill}>
                  <Text style={styles.heroTimeText}>4 DAYS LEFT</Text>
                </View>
              </View>

              <Text style={styles.heroMainTitle}>Quarterly Launch Targets</Text>
              <Text style={styles.heroSubtitleText}>
                18 of 24 milestones achieved. Team is tracking 3 days ahead of schedule.
              </Text>

              {/* Segmented Milestone Progress Bar */}
              <View style={styles.heroProgressSection}>
                <View style={styles.segmentedTrack}>
                  <View style={styles.segmentQuarterActive} />
                  <View style={styles.segmentQuarterActive} />
                  <View style={styles.segmentQuarterActive} />
                  <View style={styles.segmentQuarterInactive} />
                </View>
                <View style={styles.heroProgressLabels}>
                  <Text style={styles.heroPercentText}>75% Completed</Text>
                  <Text style={styles.heroStageText}>Phase 3 of 4</Text>
                </View>
              </View>

              {/* Action Button Row */}
              <View style={styles.heroActionFooter}>
                <View style={styles.heroTeamAvatarStack}>
                  <View style={[styles.miniStackAvatar, styles.stack1]}>
                    <Text style={styles.miniStackText}>JD</Text>
                  </View>
                  <View style={[styles.miniStackAvatar, styles.stack2]}>
                    <Text style={styles.miniStackText}>AK</Text>
                  </View>
                  <View style={[styles.miniStackAvatar, styles.stack3]}>
                    <Text style={styles.miniStackText}>MR</Text>
                  </View>
                  <View style={[styles.miniStackAvatar, styles.stack4]}>
                    <Text style={styles.miniStackText}>+5</Text>
                  </View>
                </View>

                <View style={styles.heroCtaPill}>
                  <Text style={styles.heroCtaText}>View Roadmap</Text>
                  <Text style={styles.heroCtaArrow}>→</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 2026 Bento Grid Section */}
            <View style={styles.bentoSectionHeader}>
              <Text style={styles.bentoSectionTitle}>Workspace Intelligence</Text>
              <TouchableOpacity onPress={() => navigate('Analytics')}>
                <Text style={styles.bentoLinkText}>Telemetry ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bentoGrid}>
              {/* Bento Card 1: Velocity Sparkline */}
              <TouchableOpacity
                style={styles.bentoCardHalf}
                activeOpacity={0.85}
                onPress={() => navigate('Analytics')}
              >
                <View style={styles.bentoHeaderRow}>
                  <Text style={styles.bentoMicroCategory}>VELOCITY</Text>
                  <View style={styles.bentoLiveDot} />
                </View>
                <Text style={styles.bentoBigMetric}>+18.4%</Text>
                {/* Mini Vector Bar Chart */}
                <View style={styles.bentoChartContainer}>
                  <View style={[styles.bentoBar, styles.bBar1]} />
                  <View style={[styles.bentoBar, styles.bBar2]} />
                  <View style={[styles.bentoBar, styles.bBar3]} />
                  <View style={[styles.bentoBar, styles.bBar4]} />
                  <View style={[styles.bentoBar, styles.bBar5]} />
                </View>
                <Text style={styles.bentoSubText}>Weekly cadence</Text>
              </TouchableOpacity>

              {/* Bento Card 2: Active Matrix */}
              <TouchableOpacity
                style={styles.bentoCardHalf}
                activeOpacity={0.85}
                onPress={() => navigate('Projects')}
              >
                <View style={styles.bentoHeaderRow}>
                  <Text style={styles.bentoMicroCategory}>PROJECTS</Text>
                  <View style={[styles.bentoLiveDot, styles.dotCyan]} />
                </View>
                <Text style={styles.bentoBigMetric}>12 Active</Text>
                {/* Visual Pipeline Dots */}
                <View style={styles.pipelineDotRow}>
                  <View style={[styles.pipelineDot, styles.pipeComplete]} />
                  <View style={[styles.pipelineDot, styles.pipeComplete]} />
                  <View style={[styles.pipelineDot, styles.pipeComplete]} />
                  <View style={[styles.pipelineDot, styles.pipeActive]} />
                  <View style={[styles.pipelineDot, styles.pipePending]} />
                </View>
                <Text style={styles.bentoSubText}>2 pending review</Text>
              </TouchableOpacity>
            </View>

            {/* Bento Card 3: Nova Copilot Insight (Integrated, Not Redundant) */}
            <TouchableOpacity
              style={styles.bentoInsightCard}
              activeOpacity={0.85}
              onPress={() => navigate('AIAssistant')}
            >
              <View style={styles.insightHeaderRow}>
                <View style={styles.insightBadge}>
                  <Text style={styles.insightGlyph}>◈</Text>
                  <Text style={styles.insightBadgeText}>NOVA BRIEFING</Text>
                </View>
                <Text style={styles.insightTime}>Generated 10m ago</Text>
              </View>
              <Text style={styles.insightBodyText}>
                &ldquo;3 pull requests awaiting review in API Gateway. Database replicas are healthy with 0 failover alerts.&rdquo;
              </Text>
              <View style={styles.insightActionRow}>
                <Text style={styles.insightActionText}>Ask Nova Copilot</Text>
                <Text style={styles.insightActionChevron}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Active Workstreams Section */}
            <View style={styles.workstreamSectionHeader}>
              <View style={styles.workstreamHeaderLeft}>
                <Text style={styles.workstreamSectionTitle}>Active Workstreams</Text>
                <View style={styles.workstreamBadgeCount}>
                  <Text style={styles.workstreamBadgeText}>
                    {filteredWorkstreams.length}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigate('Projects')}>
                <Text style={styles.viewAllText}>View All ›</Text>
              </TouchableOpacity>
            </View>

            {/* Workstreams List */}
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
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  iconActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  // Vector Bell Icon
  vectorBellStem: {
    position: 'absolute',
    top: 10,
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
  // Search Bar
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
  // Vector Search Glyph
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
  // Filter Chips
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
  // Hero Executive Card
  heroExecutiveCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
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
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  heroTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
  heroTimeRemainingPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroTimeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  heroMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitleText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#94A3B8',
    marginBottom: 16,
  },
  heroProgressSection: {
    marginBottom: 18,
  },
  segmentedTrack: {
    flexDirection: 'row',
    height: 6,
    gap: 4,
    marginBottom: 8,
  },
  segmentQuarterActive: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  segmentQuarterInactive: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
  },
  heroProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  heroStageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  heroActionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroTeamAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniStackAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
    marginLeft: -6,
  },
  stack1: {
    backgroundColor: '#4F46E5',
    marginLeft: 0,
  },
  stack2: {
    backgroundColor: '#06B6D4',
  },
  stack3: {
    backgroundColor: '#F59E0B',
  },
  stack4: {
    backgroundColor: '#334155',
  },
  miniStackText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
  },
  heroCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  heroCtaArrow: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  // Bento Section
  bentoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bentoSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  bentoLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bentoCardHalf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoMicroCategory: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#64748B',
  },
  bentoLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  },
  dotCyan: {
    backgroundColor: '#06B6D4',
  },
  bentoBigMetric: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  bentoChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
    gap: 4,
    marginBottom: 6,
  },
  bentoBar: {
    flex: 1,
    borderRadius: 2,
  },
  bBar1: {
    height: 8,
    backgroundColor: '#EEF2FF',
  },
  bBar2: {
    height: 12,
    backgroundColor: '#C7D2FE',
  },
  bBar3: {
    height: 15,
    backgroundColor: '#818CF8',
  },
  bBar4: {
    height: 18,
    backgroundColor: '#6366F1',
  },
  bBar5: {
    height: 20,
    backgroundColor: '#4F46E5',
  },
  pipelineDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 6,
    marginBottom: 6,
  },
  pipelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pipeComplete: {
    backgroundColor: '#10B981',
  },
  pipeActive: {
    backgroundColor: '#06B6D4',
  },
  pipePending: {
    backgroundColor: '#E2E8F0',
  },
  bentoSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  // Bento Card 3: Nova Insight
  bentoInsightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightGlyph: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '900',
  },
  insightBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1.2,
  },
  insightTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  insightBodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 12,
  },
  insightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  insightActionChevron: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  // Active Workstreams
  workstreamSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  workstreamHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workstreamSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  workstreamBadgeCount: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  workstreamBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  viewAllText: {
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
  // Search Results State
  searchResultsSection: {
    marginTop: 8,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchResultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  resultsList: {
    gap: 12,
  },
  emptyResultsCard: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  searchCircleLarge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  searchHandleLarge: {
    width: 8,
    height: 3,
    backgroundColor: '#94A3B8',
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 12,
    right: 12,
    transform: [{ rotate: '45deg' }],
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: 260,
  },
  resetSearchBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetSearchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
