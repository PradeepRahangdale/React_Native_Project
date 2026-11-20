import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  badge: string;
  unread: boolean;
  actionType: 'project' | 'chat' | 'analytics';
  targetParams?: any;
}

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Sprint Milestone Achieved',
      desc: 'Mobile App Redesign reached 85% completion mark.',
      time: '10m ago',
      badge: 'Sprint',
      unread: true,
      actionType: 'project',
      targetParams: {
        id: 'p1',
        title: 'Mobile App Redesign',
        subtitle: 'Design System & Component Spec v2.4',
        progress: 0.85,
        badge: 'Priority',
      },
    },
    {
      id: '2',
      title: 'New Pull Request Review',
      desc: 'Alice Smith requested review on Component Library tokens.',
      time: '1h ago',
      badge: 'GitHub',
      unread: true,
      actionType: 'chat',
      targetParams: {
        id: '1',
        name: 'Alice Smith',
        avatar: 'AS',
        online: true,
      },
    },
    {
      id: '3',
      title: 'Security Vulnerability Patched',
      desc: 'Automated dependency update completed successfully.',
      time: '5h ago',
      badge: 'Security',
      unread: false,
      actionType: 'project',
      targetParams: {
        id: 'p4',
        title: 'Security Compliance Audit',
        subtitle: 'SOC2 Type II validation & pentest checks',
        progress: 0.4,
        badge: 'Attention',
      },
    },
    {
      id: '4',
      title: 'Weekly Report Ready',
      desc: 'Your weekly workspace productivity summary is generated.',
      time: 'Yesterday',
      badge: 'Reports',
      unread: false,
      actionType: 'analytics',
    },
  ];

  const handleNotificationPress = (item: NotificationItem) => {
    switch (item.actionType) {
      case 'project':
        navigate('ProjectDetail', item.targetParams);
        break;
      case 'chat':
        navigate('ChatDetail', item.targetParams);
        break;
      case 'analytics':
        navigate('Analytics');
        break;
    }
  };

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
          title="Notifications"
          subtitle="Stay updated with real-time alerts and activity"
          backLabel="Back"
          showHome={true}
        />

        <View style={styles.list}>
          {notifications.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleNotificationPress(item)}
            >
              <Card
                style={[
                  styles.notifCard,
                  item.unread && styles.notifCardUnread,
                ]}
              >
                <View style={styles.notifHeader}>
                  <Badge
                    label={item.badge}
                    variant={item.unread ? 'primary' : 'accent'}
                  />
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
                <Text style={styles.notifDesc}>{item.desc}</Text>
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
  list: {
    gap: 12,
  },
  notifCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
    marginLeft: 8,
    fontWeight: '700',
  },
  notifDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
