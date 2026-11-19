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

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Alice Smith',
    avatar: 'AS',
    lastMessage: 'The revised Figma tokens are ready for review!',
    time: '12m ago',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Robert King',
    avatar: 'RK',
    lastMessage: 'Deployed staging v1.4 to test cluster.',
    time: '45m ago',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Maya Lin',
    avatar: 'ML',
    lastMessage: 'Can you check the database indexing query plan?',
    time: '2h ago',
    unread: 1,
    online: false,
  },
  {
    id: '4',
    name: 'Tom Nelson',
    avatar: 'TN',
    lastMessage: 'Approved the pull request for screen transitions.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
];

export const MessagesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase()),
  );

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
          title="Messages"
          subtitle="Direct team chats and workspace discussions"
          backLabel="Back"
        />

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Pinned AI Assistant Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('AIAssistant')}
          style={styles.aiCardWrapper}
        >
          <Card style={styles.aiCard}>
            <View style={styles.aiAvatarBox}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarIcon}>✨</Text>
              </View>
              <View style={styles.aiOnlineDot} />
            </View>

            <View style={styles.chatContent}>
              <View style={styles.chatTopRow}>
                <View style={styles.aiTitleRow}>
                  <Text style={styles.aiName}>Nova AI Assistant</Text>
                  <Badge label="Copilot" variant="primary" />
                </View>
                <Text style={styles.aiStatusText}>Always Active</Text>
              </View>
              <Text style={styles.aiMessage} numberOfLines={1}>
                Ask about velocity, priority tasks, or project planning...
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Conversations List */}
        <View style={styles.list}>
          {filtered.map(chat => (
            <TouchableOpacity
              key={chat.id}
              activeOpacity={0.8}
              onPress={() =>
                navigate('ChatDetail', {
                  id: chat.id,
                  name: chat.name,
                  avatar: chat.avatar,
                  online: chat.online,
                })
              }
            >
              <Card style={styles.chatCard}>
                <View style={styles.avatarBox}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{chat.avatar}</Text>
                  </View>
                  {chat.online && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.chatContent}>
                  <View style={styles.chatTopRow}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                  </View>
                  <View style={styles.chatBottomRow}>
                    <Text
                      style={[
                        styles.chatMessage,
                        chat.unread > 0 && styles.chatMessageUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {chat.lastMessage}
                    </Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
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
  list: {
    gap: 10,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
  },
  avatarBox: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineDot: {
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
  chatContent: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chatTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  chatMessageUnread: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  aiCardWrapper: {
    marginBottom: 16,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1.5,
  },
  aiAvatarBox: {
    position: 'relative',
    marginRight: 12,
  },
  aiAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  aiAvatarIcon: {
    fontSize: 20,
  },
  aiOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: colors.white,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  aiStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  aiMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
