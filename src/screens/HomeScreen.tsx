import React, { useState } from 'react';
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
import { useNavigation } from '../navigation';

interface QuickAction {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  bgColor: string;
  target: 'Analytics' | 'Projects' | 'AIAssistant';
}

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  badge: string;
  badgeVariant: 'primary' | 'success' | 'accent' | 'error';
  progress: number;
}

const CATEGORIES = ['All', 'In Progress', 'Priority', 'Completed'];

const SUGGESTIONS = ['Redesign', 'Nova AI', 'API', 'Database', 'Security'];

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    icon: '📊',
    title: 'Analytics',
    subtitle: '+18.2% this week',
    bgColor: colors.primaryLight,
    target: 'Analytics',
  },
  {
    id: '2',
    icon: '📁',
    title: 'Projects',
    subtitle: '12 active tasks',
    bgColor: colors.secondaryLight,
    target: 'Projects',
  },
  {
    id: '3',
    icon: '💳',
    title: 'Finances',
    subtitle: '$8,420.50 balance',
    bgColor: colors.accentLight,
    target: 'Analytics',
  },
  {
    id: '4',
    icon: '👥',
    title: 'Team',
    subtitle: '6 online now',
    bgColor: colors.successLight,
    target: 'Projects',
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Mobile App Redesign',
    subtitle: 'Design System & Component Library',
    time: '25m ago',
    badge: 'Priority',
    badgeVariant: 'accent',
    progress: 0.85,
  },
  {
    id: '2',
    title: 'API Gateway Integration',
    subtitle: 'Authentication & Endpoint Routing',
    time: '2h ago',
    badge: 'In Review',
    badgeVariant: 'primary',
    progress: 0.6,
  },
  {
    id: '3',
    title: 'Database Migration',
    subtitle: 'PostgreSQL clustering & replicas',
    time: 'Yesterday',
    badge: 'Completed',
    badgeVariant: 'success',
    progress: 1.0,
  },
  {
    id: '4',
    title: 'Security Audit & Compliance',
    subtitle: 'SOC2 Type II validation checks',
    time: '2 days ago',
    badge: 'Attention',
    badgeVariant: 'error',
    progress: 0.4,
  },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFocused, setIsFocused] = useState(false);

  const isSearching = searchQuery.trim().length > 0;

  // Filter activities by search query and category
  const filteredActivities = ACTIVITIES.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Completed' && item.badge === 'Completed') ||
      (selectedCategory === 'Priority' &&
        (item.badge === 'Priority' || item.badge === 'Attention')) ||
      (selectedCategory === 'In Progress' &&
        (item.badge === 'In Review' || item.badge === 'Priority'));

    return matchesSearch && matchesCategory;
  });

  // Filter quick actions if searching
  const filteredQuickActions = QUICK_ACTIONS.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalSearchResults =
    filteredActivities.length + filteredQuickActions.length;

  const topPadding =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight || 0) + 12
      : insets.top + 12;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding,
            paddingBottom: insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            activeOpacity={0.8}
            onPress={() => navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
              <View style={styles.onlineStatus} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingTitle}>Welcome back,</Text>
              <Text style={styles.greetingName}>John Doe 👋</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => navigate('Notifications')}
          >
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchContainer,
              isFocused && styles.searchContainerFocused,
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search projects, tasks, or tools..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {isSearching && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.7}
              onPress={() => navigate('Projects')}
            >
              <Text style={styles.filterButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Search Suggestions */}
          {!isSearching && (
            <View style={styles.suggestionRow}>
              <Text style={styles.suggestionLabel}>Recent:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionScroll}
              >
                {SUGGESTIONS.map(term => (
                  <TouchableOpacity
                    key={term}
                    style={styles.suggestionChip}
                    onPress={() => setSearchQuery(term)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionChipText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Live Search Results View */}
        {isSearching ? (
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                Results for &ldquo;{searchQuery}&rdquo;
              </Text>
              <Badge
                label={`${totalSearchResults} found`}
                variant={totalSearchResults > 0 ? 'primary' : 'accent'}
              />
            </View>

            {/* Empty State when 0 results */}
            {totalSearchResults === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No matching items found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching with different terms like &ldquo;App&rdquo;,
                  &ldquo;API&rdquo;, &ldquo;Database&rdquo;, or
                  &ldquo;Security&rdquo;.
                </Text>
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearSearchBtnText}>Clear Search</Text>
                </TouchableOpacity>
              </Card>
            ) : (
              <>
                {/* Matching Quick Actions */}
                {filteredQuickActions.length > 0 && (
                  <View style={styles.matchingSection}>
                    <Text style={styles.matchingSectionTitle}>
                      Matching Actions &amp; Tools
                    </Text>
                    <View style={styles.matchingActionsList}>
                      {filteredQuickActions.map(action => (
                        <TouchableOpacity
                          key={action.id}
                          style={styles.matchingActionCard}
                          onPress={() => navigate(action.target)}
                          activeOpacity={0.8}
                        >
                          <View
                            style={[
                              styles.matchingActionIcon,
                              { backgroundColor: action.bgColor },
                            ]}
                          >
                            <Text style={styles.gridIcon}>{action.icon}</Text>
                          </View>
                          <View style={styles.matchingActionInfo}>
                            <Text style={styles.matchingActionTitle}>
                              {action.title}
                            </Text>
                            <Text style={styles.matchingActionSubtitle}>
                              {action.subtitle}
                            </Text>
                          </View>
                          <Text style={styles.chevronIcon}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Matching Activities & Projects */}
                {filteredActivities.length > 0 && (
                  <View style={styles.matchingSection}>
                    <Text style={styles.matchingSectionTitle}>
                      Matching Projects ({filteredActivities.length})
                    </Text>
                    <View style={styles.activityList}>
                      {filteredActivities.map(activity => (
                        <TouchableOpacity
                          key={activity.id}
                          activeOpacity={0.85}
                          onPress={() =>
                            navigate('ProjectDetail', {
                              id: activity.id,
                              title: activity.title,
                              subtitle: activity.subtitle,
                              progress: activity.progress,
                              badge: activity.badge,
                            })
                          }
                        >
                          <Card style={styles.activityCard}>
                            <View style={styles.activityHeader}>
                              <View style={styles.activityInfo}>
                                <Text style={styles.activityTitle}>
                                  {activity.title}
                                </Text>
                                <Text style={styles.activitySubtitle}>
                                  {activity.subtitle}
                                </Text>
                              </View>
                              <Badge
                                label={activity.badge}
                                variant={activity.badgeVariant}
                              />
                            </View>

                            <View style={styles.activityFooter}>
                              <View style={styles.activityProgressTrack}>
                                <View
                                  style={[
                                    styles.activityProgressFill,
                                    {
                                      width: `${Math.round(
                                        activity.progress * 100,
                                      )}%`,
                                      backgroundColor:
                                        activity.progress === 1.0
                                          ? colors.success
                                          : colors.primary,
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.activityTime}>
                                {activity.time}
                              </Text>
                            </View>
                          </Card>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          /* Normal Dashboard Flow when not searching */
          <>
            {/* Hero Featured Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>⚡ Sprint Velocity</Text>
              </View>
              <Text style={styles.heroTitle}>Quarterly Launch Targets</Text>
              <Text style={styles.heroSubtitle}>
                18 of 24 milestones achieved. You are 3 days ahead of schedule!
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarTrack}>
                  <View style={styles.heroProgressFill} />
                </View>
                <Text style={styles.progressText}>75% Completed</Text>
              </View>

              <TouchableOpacity
                style={styles.heroButton}
                activeOpacity={0.85}
                onPress={() => navigate('Projects')}
              >
                <Text style={styles.heroButtonText}>
                  View Project Roadmap →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <TouchableOpacity onPress={() => navigate('Analytics')}>
                <Text style={styles.sectionLink}>See Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {QUICK_ACTIONS.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItemTouch}
                  activeOpacity={0.85}
                  onPress={() => navigate(item.target)}
                >
                  <Card style={styles.gridItem}>
                    <View
                      style={[
                        styles.gridIconContainer,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      <Text style={styles.gridIcon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.gridTitle}>{item.title}</Text>
                    <Text style={styles.gridSubtitle}>{item.subtitle}</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            {/* Categories / Filter Pills */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => navigate('Projects')}>
                <Text style={styles.sectionLink}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map(category => {
                const isSelected = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Activity List */}
            <View style={styles.activityList}>
              {filteredActivities.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigate('ProjectDetail', {
                      id: activity.id,
                      title: activity.title,
                      subtitle: activity.subtitle,
                      progress: activity.progress,
                      badge: activity.badge,
                    })
                  }
                >
                  <Card style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>
                          {activity.title}
                        </Text>
                        <Text style={styles.activitySubtitle}>
                          {activity.subtitle}
                        </Text>
                      </View>
                      <Badge
                        label={activity.badge}
                        variant={activity.badgeVariant}
                      />
                    </View>

                    <View style={styles.activityFooter}>
                      <View style={styles.activityProgressTrack}>
                        <View
                          style={[
                            styles.activityProgressFill,
                            {
                              width: `${Math.round(
                                activity.progress * 100,
                              )}%`,
                              backgroundColor:
                                activity.progress === 1.0
                                  ? colors.success
                                  : colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.activityTime}>{activity.time}</Text>
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchContainerFocused: {
    borderColor: colors.primary,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },
  filterButton: {
    paddingLeft: 8,
  },
  filterButtonText: {
    fontSize: 16,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  suggestionLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    marginRight: 8,
  },
  suggestionScroll: {
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  suggestionChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  searchResultsContainer: {
    marginBottom: 20,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  clearSearchBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearSearchBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  matchingSection: {
    marginBottom: 18,
  },
  matchingSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  matchingActionsList: {
    gap: 8,
  },
  matchingActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  matchingActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchingActionInfo: {
    flex: 1,
  },
  matchingActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  matchingActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chevronIcon: {
    fontSize: 20,
    color: colors.textMuted,
    marginLeft: 8,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  heroProgressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  progressText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  heroButton: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItemTouch: {
    width: '48%',
    marginBottom: 14,
  },
  gridItem: {
    padding: 14,
  },
  gridIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIcon: {
    fontSize: 20,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    marginBottom: 10,
    padding: 14,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
    paddingRight: 10,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 14,
  },
  activityProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
