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
import { Badge, Card, ScreenHeader } from '../components';
import { colors } from '../constants';
import { useNavigation } from '../navigation';

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  highlights?: string[];
}

const QUICK_PROMPTS = [
  { label: '⚡ Priority Tasks', query: 'What are my priority tasks right now?' },
  { label: '📊 Sprint Summary', query: 'Give me a summary of our sprint velocity.' },
  { label: '👥 Team Status', query: 'Who is active on the team today?' },
  { label: '💡 Project Planning', query: 'How should I plan our next project milestone?' },
];

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: 'ai_welcome',
    sender: 'assistant',
    text: "Hello John! 👋 I'm Nova, your AI Workspace Intelligence Copilot.\n\nI can help you monitor project velocity, summarize team activity, prioritize tasks, and draft deliverables.\n\nWhat would you like to work on today?",
    time: 'Just now',
    highlights: ['Sprint Velocity: 75%', 'Active Projects: 4', 'On-Time: 99.4%'],
  },
];

export const AIAssistantScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const generateAIResponse = (userQuery: string): { text: string; highlights?: string[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('priority') || q.includes('task')) {
      return {
        text: 'Here are your top active workspace priorities:\n\n1. 📱 Mobile App Redesign (85% completed)\n   • Due Nov 24 • Owned by John & Alice\n\n2. ⚡ API Gateway Integration (60% completed)\n   • In Review • Managed with Robert\n\n3. 🔒 Security Audit & Compliance (40% completed)\n   • Attention Needed • SOC2 validation\n\nWould you like me to open one of these project cards for you?',
        highlights: ['1 Critical Deadline', '2 In Progress'],
      };
    }

    if (q.includes('sprint') || q.includes('velocity') || q.includes('summary')) {
      return {
        text: '📊 Sprint Velocity & Health Analysis:\n\n• Progress: 18 of 24 milestones completed (75%)\n• Timeline: Currently 3 days ahead of target release\n• Team Productivity: 94.2% task completion rate\n• Revenue Run-Rate: $28,450 (+22.4% this cycle)\n\nRecommendation: You have room to pull forward the Database Migration sign-off!',
        highlights: ['3 Days Ahead', '75% Complete', 'Revenue: $28.4k'],
      };
    }

    if (q.includes('team') || q.includes('who') || q.includes('online')) {
      return {
        text: '👥 Team Availability & Recent Activity:\n\n• Alice Smith (UI/UX) - Online now\n  ↳ Pushed revised design tokens 12m ago\n\n• Robert King (Backend) - Online now\n  ↳ Deployed staging v1.4 to test cluster\n\n• Maya Lin (Data) - Offline\n  ↳ Working on PostgreSQL replica indexing\n\n• Tom Nelson (QA) - Offline\n  ↳ Verified component library PR yesterday',
        highlights: ['2 Online Now', '2 Active Collaborations'],
      };
    }

    if (q.includes('plan') || q.includes('new') || q.includes('milestone')) {
      return {
        text: "💡 Recommended 4-Phase Project Framework:\n\n1. Scope Definition: Feature requirements & user stories\n2. Design System: Tokens, wireframes & component specs\n3. Engineering Sprint: API routing & database schemas\n4. Review & QA: Unit test coverage & staging deploy\n\nYou can use the '+ New' button in the Projects tab anytime to register this project!",
      };
    }

    // Default intelligent conversational reply
    return {
      text: `I've analyzed your query regarding "${userQuery}".\n\nYour workspace is performing at high velocity (75% sprint milestone completion). All systems, test clusters, and team communication channels are operating normally.\n\nLet me know if you'd like me to draft a project deliverable or check specific metrics!`,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) {
      return;
    }

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: timeString,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    scrollToBottom();

    // Trigger AI thinking animation and response
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const aiReply = generateAIResponse(text);
      const assistantMsg: AIMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: aiReply.text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        highlights: aiReply.highlights,
      };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToBottom();
    }, 1100);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        {/* Navigation & Header */}
        <ScreenHeader
          title="Nova AI Assistant"
          subtitle="Workspace Intelligence & Real-time Copilot"
          backLabel="Back"
          showHome={true}
          rightAction={
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Clear</Text>
            </TouchableOpacity>
          }
        />

        {/* Chat Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAssistant,
                ]}
              >
                {!isUser && (
                  <View style={styles.assistantAvatar}>
                    <Text style={styles.assistantAvatarText}>✨</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleAssistant,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.assistantTagRow}>
                      <Text style={styles.assistantTagName}>Nova AI</Text>
                      <Badge label="Copilot" variant="primary" />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.messageTextUser : styles.messageTextAssistant,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Highlights pills with smart navigation */}
                  {msg.highlights && msg.highlights.length > 0 && (
                    <View style={styles.highlightsContainer}>
                      {msg.highlights.map(h => {
                        let action: (() => void) | null = null;
                        if (
                          h.toLowerCase().includes('project') ||
                          h.toLowerCase().includes('deadline')
                        ) {
                          action = () => navigate('Projects');
                        } else if (
                          h.toLowerCase().includes('velocity') ||
                          h.toLowerCase().includes('revenue') ||
                          h.toLowerCase().includes('complete')
                        ) {
                          action = () => navigate('Analytics');
                        } else if (
                          h.toLowerCase().includes('online') ||
                          h.toLowerCase().includes('collaborat')
                        ) {
                          action = () => navigate('Messages');
                        }

                        if (action) {
                          return (
                            <TouchableOpacity
                              key={h}
                              style={styles.highlightPillActive}
                              onPress={action}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.highlightTextActive}>
                                {h} ›
                              </Text>
                            </TouchableOpacity>
                          );
                        }

                        return (
                          <View key={h} style={styles.highlightPill}>
                            <Text style={styles.highlightText}>{h}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <Text
                    style={[
                      styles.timeText,
                      isUser ? styles.timeTextUser : styles.timeTextAssistant,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* AI Thinking Indicator */}
          {isThinking && (
            <View style={styles.thinkingRow}>
              <View style={styles.assistantAvatar}>
                <Text style={styles.assistantAvatarText}>✨</Text>
              </View>
              <Card style={styles.thinkingCard}>
                <View style={styles.thinkingDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <Text style={styles.thinkingText}>Nova is analyzing workspace data...</Text>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <View style={styles.promptBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptScroll}
          >
            {QUICK_PROMPTS.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.promptChip}
                onPress={() => handleSend(item.query)}
                activeOpacity={0.7}
              >
                <Text style={styles.promptChipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Input Composer */}
        <View style={styles.composer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Nova about tasks, velocity, or team..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={400}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resetBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  resetBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assistantAvatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  assistantTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  assistantTagName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: colors.white,
  },
  messageTextAssistant: {
    color: colors.textPrimary,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  highlightPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  highlightPillActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  highlightTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timeTextUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextAssistant: {
    color: colors.textMuted,
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thinkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  thinkingDots: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  thinkingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  promptBar: {
    marginBottom: 10,
  },
  promptScroll: {
    gap: 8,
  },
  promptChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 90,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
