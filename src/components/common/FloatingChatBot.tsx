import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { colors } from '../../constants';

interface BotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  bullets?: string[];
}

const QUICK_PROMPTS = [
  { label: '⚡ Priority Tasks', query: 'What are my priority tasks?' },
  { label: '📊 Sprint Velocity', query: 'Give me a summary of our sprint velocity.' },
  { label: '👥 Team Status', query: 'Who is active on the team today?' },
  { label: '💡 Help / Guide', query: 'How does this app work?' },
];

const INITIAL_MESSAGES: BotMessage[] = [
  {
    id: 'bot_init',
    sender: 'bot',
    text: "Hi there! 👋 I'm Nova, your AI assistant.\n\nHow can I help you with your workspace or projects today?",
    time: 'Now',
  },
];

interface FloatingChatBotProps {
  visible?: boolean;
}

export const FloatingChatBot: React.FC<FloatingChatBotProps> = ({
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Animations
  const animScale = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  // Pulse animation for the floating button when closed
  useEffect(() => {
    if (!visible) {
      return;
    }
    if (!isOpen) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
  }, [isOpen, pulseAnim, visible]);

  const toggleChat = () => {
    if (isOpen) {
      // Close pop-up
      Animated.parallel([
        Animated.timing(animScale, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(animOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(false);
      });
    } else {
      setIsOpen(true);
      // Open pop-up
      Animated.parallel([
        Animated.spring(animScale, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const generateBotReply = (userQuery: string): { text: string; bullets?: string[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('priority') || q.includes('task')) {
      return {
        text: 'Here are your highest priority tasks right now:',
        bullets: [
          '📱 Mobile App Redesign (85% completed - Due Nov 24)',
          '⚡ API Gateway Integration (60% completed - In Review)',
          '🔒 Security Audit & Compliance (40% completed - Attention)',
        ],
      };
    }

    if (q.includes('sprint') || q.includes('velocity')) {
      return {
        text: '📊 Sprint Health & Velocity Summary:',
        bullets: [
          '18 of 24 milestones achieved (75%)',
          'Currently 3 days ahead of schedule',
          'Task completion rate: 94.2%',
          'Workspace revenue run-rate: $28,450 (+22.4%)',
        ],
      };
    }

    if (q.includes('team') || q.includes('who') || q.includes('online')) {
      return {
        text: '👥 Team Availability:',
        bullets: [
          'Alice Smith (UI/UX) - Online (Uploaded tokens)',
          'Robert King (Backend) - Online (Deployed v1.4)',
          'Maya Lin (Data) - Offline (2h ago)',
          'Tom Nelson (QA) - Offline (Yesterday)',
        ],
      };
    }

    if (q.includes('help') || q.includes('guide') || q.includes('work')) {
      return {
        text: '💡 Quick Navigation Guide:',
        bullets: [
          'Home: High-level overview, sprint velocity & live search',
          'Projects: Manage all active workflows & view task checklists',
          'Messages: Direct chats with Alice, Robert, Maya & Tom',
          'Profile: Adjust preferences, biometrics & account options',
        ],
      };
    }

    return {
      text: `Thanks for asking! I'm tracking your workspace activity in real-time. Everything is running ahead of schedule with 75% sprint milestones completed.`,
    };
  };

  const handleSend = (queryToSend?: string) => {
    const text = (queryToSend || inputText).trim();
    if (!text) {
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: BotMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    scrollToBottom();

    // Trigger bot reply
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const reply = generateBotReply(text);
      const botMessage: BotMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        bullets: reply.bullets,
      };
      setMessages(prev => [...prev, botMessage]);
      scrollToBottom();
    }, 900);
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Pop-up Chat Window */}
      {isOpen && (
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          {/* Backdrop (tap to close) */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={toggleChat}
          />

          <Animated.View
            style={[
              styles.popupContainer,
              {
                opacity: animOpacity,
                transform: [{ scale: animScale }],
              },
            ]}
          >
            {/* Pop-up Header */}
            <View style={styles.popupHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.botAvatar}>
                  <Text style={styles.botAvatarIcon}>✨</Text>
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.botTitle}>Nova AI Support</Text>
                  <Text style={styles.botSubtitle}>Online • Instant Help</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={toggleChat}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages Scroll Area */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.msgRow,
                      isUser ? styles.msgRowUser : styles.msgRowBot,
                    ]}
                  >
                    {!isUser && (
                      <View style={styles.msgBotAvatar}>
                        <Text style={styles.msgBotAvatarIcon}>✨</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.bubble,
                        isUser ? styles.bubbleUser : styles.bubbleBot,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
                        ]}
                      >
                        {msg.text}
                      </Text>

                      {/* Bullets if any */}
                      {msg.bullets && msg.bullets.length > 0 && (
                        <View style={styles.bulletsBox}>
                          {msg.bullets.map((b, i) => (
                            <View key={i} style={styles.bulletItem}>
                              <Text style={styles.bulletDot}>•</Text>
                              <Text style={styles.bulletText}>{b}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <Text
                        style={[
                          styles.msgTime,
                          isUser ? styles.msgTimeUser : styles.msgTimeBot,
                        ]}
                      >
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <View style={styles.thinkingRow}>
                  <View style={styles.msgBotAvatar}>
                    <Text style={styles.msgBotAvatarIcon}>✨</Text>
                  </View>
                  <View style={styles.thinkingBubble}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Prompt Chips */}
            <View style={styles.promptBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.promptScroll}
              >
                {QUICK_PROMPTS.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={styles.promptChip}
                    onPress={() => handleSend(p.query)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.promptChipText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Composer */}
            <View style={styles.composer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask Nova a question..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  inputText.trim().length > 0 && styles.sendBtnActive,
                ]}
                onPress={() => handleSend()}
                disabled={inputText.trim().length === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      )}

      {/* Floating Corner Bot Button */}
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            bottom: Math.max(insets.bottom, 12) + 65,
            transform: [{ scale: isOpen ? 1 : pulseAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fabButton, isOpen && styles.fabButtonActive]}
          onPress={toggleChat}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>{isOpen ? '✕' : '✨'}</Text>
          {!isOpen && (
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>AI</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  popupContainer: {
    position: 'absolute',
    right: 16,
    left: 16,
    bottom: 85,
    height: 480,
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    zIndex: 10000,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  botAvatarIcon: {
    fontSize: 18,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  botTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  botSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  msgBotAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    marginTop: 2,
  },
  msgBotAvatarIcon: {
    fontSize: 12,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 3,
  },
  bubbleBot: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 3,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  bubbleTextBot: {
    color: colors.textPrimary,
  },
  bulletsBox: {
    marginTop: 6,
    gap: 3,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 5,
    marginTop: -1,
  },
  bulletText: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 16,
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  msgTimeBot: {
    color: colors.textMuted,
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thinkingBubble: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  promptBar: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  promptScroll: {
    paddingHorizontal: 12,
    gap: 6,
  },
  promptChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 70,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontSize: 13,
    fontWeight: '800',
  },
  fabWrapper: {
    position: 'absolute',
    right: 18,
    zIndex: 9998,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButtonActive: {
    backgroundColor: colors.textPrimary,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.white,
  },
  fabBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  fabBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
});
