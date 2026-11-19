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
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  badge: string;
  badgeVariant: 'primary' | 'success' | 'accent' | 'error';
  team: string[];
  dueDate: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'p1',
    title: 'Mobile App Redesign',
    description: 'Revamping navigation, component architecture, and design tokens.',
    category: 'Design',
    progress: 0.85,
    badge: 'Priority',
    badgeVariant: 'accent',
    team: ['JD', 'AS', 'RK'],
    dueDate: 'Nov 24',
  },
  {
    id: 'p2',
    title: 'Cloud Migration & Cluster Setup',
    description: 'PostgreSQL clustering, Redis caching, and automated backups.',
    category: 'Backend',
    progress: 0.65,
    badge: 'In Review',
    badgeVariant: 'primary',
    team: ['JD', 'ML'],
    dueDate: 'Nov 30',
  },
  {
    id: 'p3',
    title: 'Design System Documentation',
    description: 'Component showcase, props table, and token guidance.',
    category: 'Design',
    progress: 1.0,
    badge: 'Completed',
    badgeVariant: 'success',
    team: ['AS', 'TN'],
    dueDate: 'Nov 12',
  },
  {
    id: 'p4',
    title: 'Payment Gateway Integration',
    description: 'Stripe checkout flow, recurring subscriptions, and invoices.',
    category: 'Finance',
    progress: 0.4,
    badge: 'Urgent',
    badgeVariant: 'error',
    team: ['JD', 'RK', 'TN'],
    dueDate: 'Dec 05',
  },
];

export const ProjectsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredProjects = PROJECTS_DATA.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Completed' && p.progress === 1.0) ||
      (selectedFilter === 'In Progress' && p.progress < 1.0);
    return matchesSearch && matchesFilter;
  });

  const topPadding =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight || 0) + 16
      : insets.top + 16;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPadding,
            paddingBottom: insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back and Home navigation */}
        <ScreenHeader
          title="Projects"
          subtitle="Manage your ongoing workflows and team tasks"
          backLabel="Back"
          rightAction={
            <TouchableOpacity style={styles.newBtn} activeOpacity={0.8}>
              <Text style={styles.newBtnText}>+ New</Text>
            </TouchableOpacity>
          }
        />

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {['All', 'In Progress', 'Completed'].map(filter => {
            const active = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Projects List */}
        <View style={styles.list}>
          {filteredProjects.map(project => (
            <TouchableOpacity
              key={project.id}
              activeOpacity={0.85}
              onPress={() =>
                navigate('ProjectDetail', {
                  id: project.id,
                  title: project.title,
                  subtitle: project.description,
                  progress: project.progress,
                  badge: project.badge,
                })
              }
            >
              <Card style={styles.projectCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardCategory}>{project.category}</Text>
                    <Text style={styles.cardTitle}>{project.title}</Text>
                  </View>
                  <Badge
                    label={project.badge}
                    variant={project.badgeVariant}
                  />
                </View>

                <Text style={styles.cardDesc}>{project.description}</Text>

                {/* Progress bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.round(project.progress * 100)}%`,
                          backgroundColor:
                            project.progress === 1.0
                              ? colors.success
                              : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {Math.round(project.progress * 100)}%
                  </Text>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.teamAvatars}>
                    {project.team.map((member, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.teamAvatar,
                          idx > 0 && styles.teamAvatarOverlap,
                        ]}
                      >
                        <Text style={styles.teamAvatarText}>{member}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.dueDateText}>Due {project.dueDate}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  newBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  list: {
    gap: 14,
  },
  projectCard: {
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleBox: {
    flex: 1,
    paddingRight: 8,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  teamAvatars: {
    flexDirection: 'row',
  },
  teamAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAvatarOverlap: {
    marginLeft: -8,
  },
  teamAvatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  dueDateText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
