import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const notifications = [
    {
      id: '1',
      title: 'Sprint Milestone Achieved',
      desc: 'Mobile App Redesign reached 85% completion mark.',
      time: '10m ago',
      badge: 'Sprint',
      unread: true,
    },
    {
      id: '2',
      title: 'New Pull Request Review',
      desc: 'Alice Smith requested review on Component Library tokens.',
      time: '1h ago',
      badge: 'GitHub',
      unread: true,
    },
    {
      id: '3',
      title: 'Security Vulnerability Patched',
      desc: 'Automated dependency update completed successfully.',
      time: '5h ago',
      badge: 'Security',
      unread: false,
    },
    {
      id: '4',
      title: 'Weekly Report Ready',
      desc: 'Your weekly workspace productivity summary is generated.',
      time: 'Yesterday',
      badge: 'Reports',
      unread: false,
    },
  ];

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
            <Card
              key={item.id}
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
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifDesc}>{item.desc}</Text>
            </Card>
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
  backBtn: {
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    marginBottom: 20,
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
  list: {
    gap: 12,
  },
  notifCard: {
    padding: 16,
    marginBottom: 10,
  },
  notifCardUnread: {
    borderColor: colors.primary,
    borderWidth: 1.5,
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
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notifDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
