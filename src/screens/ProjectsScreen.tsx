import React, { useState } from 'react';
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

const MEMBER_MAP: Record<string, { id: string; name: string; avatar: string; online: boolean }> = {
  AS: { id: '1', name: 'Alice Smith', avatar: 'AS', online: true },
  RK: { id: '2', name: 'Robert King', avatar: 'RK', online: true },
  ML: { id: '3', name: 'Maya Lin', avatar: 'ML', online: false },
  TN: { id: '4', name: 'Tom Nelson', avatar: 'TN', online: false },
};

export const ProjectsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Modal State for New Project Creation
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newDesc, setNewDesc] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Completed' && p.progress === 1.0) ||
      (selectedFilter === 'In Progress' && p.progress < 1.0);
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (!newTitle.trim()) {
      return;
    }

    const createdProject: Project = {
      id: `p_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Dynamic project created by user.',
      category: newCategory,
      progress: 0.1,
      badge: 'New',
      badgeVariant: 'primary',
      team: ['JD'],
      dueDate: 'Dec 15',
    };

    setProjects(prev => [createdProject, ...prev]);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');

    // Seamless navigation directly into the newly created project detail view
    navigate('ProjectDetail', {
      id: createdProject.id,
      title: createdProject.title,
      subtitle: createdProject.description,
      progress: createdProject.progress,
      badge: createdProject.badge,
    });
  };

  const handleMemberPress = (memberInitials: string) => {
    if (memberInitials === 'JD') {
      navigate('Profile');
      return;
    }
    const member = MEMBER_MAP[memberInitials];
    if (member) {
      navigate('ChatDetail', member);
    }
  };

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
            <TouchableOpacity
              style={styles.newBtn}
              activeOpacity={0.8}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.newBtnText}>+ New</Text>
            </TouchableOpacity>
          }
        />

        {/* Search Bar */}
        <View style={styles.searchBar}>
          {/* Vector Search Glyph */}
          <View style={styles.searchIconGlyph}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects by title or scope..."
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

                {/* Card Footer with Clickable Team Avatars */}
                <View style={styles.cardFooter}>
                  <View style={styles.teamAvatars}>
                    {project.team.map((member, idx) => (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        onPress={() => handleMemberPress(member)}
                        style={[
                          styles.teamAvatar,
                          idx > 0 && styles.teamAvatarOverlap,
                        ]}
                      >
                        <Text style={styles.teamAvatarText}>{member}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.dueDateText}>Due {project.dueDate}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* New Project Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Register New Project</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.modalLabel}>Project Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Real-Time Telemetry Pipeline"
                placeholderTextColor="#94A3B8"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.categoryPillsRow}>
                {['Engineering', 'Design', 'Backend', 'Security'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      newCategory === cat && styles.categoryPillActive,
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        newCategory === cat && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Description / Scope</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Key deliverables, timelines, and team ownership..."
                placeholderTextColor="#94A3B8"
                value={newDesc}
                onChangeText={setNewDesc}
                multiline={true}
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.submitProjectBtn}
                onPress={handleCreateProject}
                activeOpacity={0.85}
              >
                <Text style={styles.submitProjectBtnText}>
                  Create &amp; Open Project ›
                </Text>
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  newBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  newBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 46,
  },
  searchIconGlyph: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: 'relative',
  },
  searchCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#64748B',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    width: 5,
    height: 1.5,
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
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  list: {
    gap: 16,
  },
  projectCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleBox: {
    flex: 1,
    marginRight: 8,
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
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
    gap: 10,
    marginBottom: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 38,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  teamAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontWeight: '700',
    color: '#94A3B8',
  },
  modalForm: {
    gap: 12,
  },
  modalLabel: {
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
    height: 46,
    fontSize: 14,
    color: '#0F172A',
  },
  modalTextArea: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  categoryPillActive: {
    backgroundColor: '#4F46E5',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  submitProjectBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitProjectBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
