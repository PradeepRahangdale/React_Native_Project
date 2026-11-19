import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
  reaction?: string;
}

const INITIAL_MESSAGES_MAP: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'other',
      text: 'Hey John! I just uploaded the revised Figma tokens for our mobile workspace.',
      time: '10:30 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Awesome, Alice! Are the primary and secondary color palettes updated?',
      time: '10:32 AM',
    },
    {
      id: 'm3',
      sender: 'other',
      text: 'Yes! Both indigo and cyan variants are verified for WCAG AA accessibility.',
      time: '10:35 AM',
      reaction: '🔥',
    },
    {
      id: 'm4',
      sender: 'other',
      text: 'The revised Figma tokens are ready for review!',
      time: '10:48 AM',
    },
  ],
  '2': [
    {
      id: 'm1',
      sender: 'user',
      text: 'Hi Robert, how is the staging deployment going?',
      time: '9:15 AM',
    },
    {
      id: 'm2',
      sender: 'other',
      text: 'Deployed staging v1.4 to test cluster.',
      time: '9:20 AM',
      reaction: '🚀',
    },
    {
      id: 'm3',
      sender: 'other',
      text: 'All health checks are green and latency is under 45ms.',
      time: '9:21 AM',
    },
  ],
  '3': [
    {
      id: 'm1',
      sender: 'other',
      text: 'Can you check the database indexing query plan?',
      time: '8:45 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Looking into the slow query logs right now Maya.',
      time: '8:50 AM',
    },
  ],
};

const BOT_REPLIES = [
  'Sounds great! I will update the ticket right away.',
  'Got it, reviewing the changes now.',
  'Thanks for the quick update! That looks solid.',
  'Perfect, let me sync with the rest of the team.',
  'On it! I will ping you once the verification finishes.',
];

export const ChatDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { params, goBack } = useNavigation();
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const contactId = params?.id || '1';
  const contactName = params?.name || 'Alice Smith';
  const contactAvatar = params?.avatar || 'AS';
  const isOnline = params?.online ?? true;

  const [messages, setMessages] = useState<Message[]>(
    INITIAL_MESSAGES_MAP[contactId] || [
      {
        id: 'init1',
        sender: 'other',
        text: `Hey John! Glad to connect with you.`,
        time: '10:00 AM',
      },
    ],
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: timeString,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    scrollToBottom();

    // Trigger simulated reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomReply =
        BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'other',
        text: randomReply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, botMsg]);
      scrollToBottom();
    }, 1200);
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? { ...m, reaction: m.reaction === emoji ? undefined : emoji }
          : m,
      ),
    );
    setSelectedMessageId(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>

        {/* Contact info */}
        <View style={styles.contactContainer}>
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contactAvatar}</Text>
            </View>
            {isOnline && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contactName}</Text>
            <Text style={styles.contactStatus}>
              {isTyping ? 'typing...' : isOnline ? 'Online now' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Quick Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Thread */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>Today</Text>
        </View>

        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowOther,
              ]}
            >
              {!isUser && (
                <View style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarText}>{contactAvatar}</Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={() => setSelectedMessageId(msg.id)}
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.messageTextUser : styles.messageTextOther,
                  ]}
                >
                  {msg.text}
                </Text>

                <View style={styles.metaRow}>
                  <Text
                    style={[
                      styles.timeText,
                      isUser ? styles.timeTextUser : styles.timeTextOther,
                    ]}
                  >
                    {msg.time}
                  </Text>
                  {isUser && <Text style={styles.readCheck}>✓✓</Text>}
                </View>

                {/* Reaction badge */}
                {msg.reaction && (
                  <View style={styles.reactionBadge}>
                    <Text style={styles.reactionText}>{msg.reaction}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <View style={styles.typingRow}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>{contactAvatar}</Text>
            </View>
            <View style={styles.typingBubble}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
            <Text style={styles.typingLabel}>{contactName} is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Reaction Bar when message is long-pressed */}
      {selectedMessageId && (
        <View style={styles.reactionPickerBar}>
          <Text style={styles.reactionPickerTitle}>React:</Text>
          {['❤️', '👍', '🔥', '🚀', '👏'].map(emoji => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionPickerBtn}
              onPress={() => handleAddReaction(selectedMessageId, emoji)}
            >
              <Text style={styles.reactionPickerEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.reactionCloseBtn}
            onPress={() => setSelectedMessageId(null)}
          >
            <Text style={styles.reactionCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Composer Bar */}
      <View
        style={[
          styles.composerContainer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            inputText.trim().length > 0 && styles.sendBtnActive,
          ]}
          onPress={handleSend}
          disabled={inputText.trim().length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backChevron: {
    fontSize: 26,
    lineHeight: 26,
    color: colors.textPrimary,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -3,
    marginLeft: -2,
  },
  contactContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  contactDetails: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  contactStatus: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  messageAvatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: colors.white,
  },
  messageTextOther: {
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeTextUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextOther: {
    color: colors.textMuted,
  },
  readCheck: {
    fontSize: 10,
    color: colors.secondaryLight,
    fontWeight: '700',
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -10,
    right: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionText: {
    fontSize: 11,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  typingLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  reactionPickerBar: {
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    gap: 12,
  },
  reactionPickerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  reactionPickerBtn: {
    padding: 2,
  },
  reactionPickerEmoji: {
    fontSize: 20,
  },
  reactionCloseBtn: {
    paddingLeft: 6,
  },
  reactionCloseText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachBtn: {
    padding: 8,
    marginRight: 6,
  },
  attachIcon: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
  sendIcon: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
