import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingChatBot } from '../components';
import { colors } from '../constants';
import {
  AIAssistantScreen,
  AnalyticsScreen,
  ChatDetailScreen,
  HomeScreen,
  LoginScreen,
  MessagesScreen,
  NotificationsScreen,
  ProfileScreen,
  ProjectDetailScreen,
  ProjectsScreen,
  RegisterScreen,
} from '../screens';
import { useNavigation } from './NavigationContext';
import { ScreenName } from './types';

interface TabItem {
  name: ScreenName;
  label: string;
}

const TAB_SCREENS: TabItem[] = [
  { name: 'Home', label: 'Home' },
  { name: 'Projects', label: 'Projects' },
  { name: 'Messages', label: 'Messages' },
  { name: 'Profile', label: 'Profile' },
];

interface AppNavigatorProps {
  isSplashVisible?: boolean;
}

const BOT_ALLOWED_SCREENS: ScreenName[] = ['Home', 'Projects'];

// Vector Tab Icon Component (Zero Raw Emojis)
const TabVectorIcon: React.FC<{ name: ScreenName; isActive: boolean }> = ({
  name,
  isActive,
}) => {
  const tint = isActive ? '#4F46E5' : '#94A3B8';

  switch (name) {
    case 'Home':
      return (
        <View style={styles.iconHomeContainer}>
          <View
            style={[
              styles.iconHomeRoof,
              { borderBottomColor: tint },
            ]}
          />
          <View style={[styles.iconHomeBase, { backgroundColor: tint }]}>
            <View style={styles.iconHomeDoor} />
          </View>
        </View>
      );

    case 'Projects':
      return (
        <View style={styles.iconFolderContainer}>
          <View style={[styles.iconFolderTab, { backgroundColor: tint }]} />
          <View style={[styles.iconFolderBody, { backgroundColor: tint }]}>
            <View style={styles.iconFolderLine} />
          </View>
        </View>
      );

    case 'Messages':
      return (
        <View style={styles.iconChatContainer}>
          <View style={[styles.iconChatBubble, { backgroundColor: tint }]}>
            <View style={styles.iconChatDotsRow}>
              <View style={styles.iconChatDot} />
              <View style={styles.iconChatDot} />
              <View style={styles.iconChatDot} />
            </View>
          </View>
          <View
            style={[
              styles.iconChatTail,
              { borderTopColor: tint },
            ]}
          />
        </View>
      );

    case 'Profile':
      return (
        <View style={styles.iconUserContainer}>
          <View style={[styles.iconUserHead, { backgroundColor: tint }]} />
          <View style={[styles.iconUserBody, { backgroundColor: tint }]} />
        </View>
      );

    default:
      return null;
  }
};

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  isSplashVisible = false,
}) => {
  const insets = useSafeAreaInsets();
  const { currentScreen, navigate } = useNavigation();

  const isTabScreen = TAB_SCREENS.some(tab => tab.name === currentScreen);
  const shouldShowBot =
    !isSplashVisible && BOT_ALLOWED_SCREENS.includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'Projects':
        return <ProjectsScreen />;
      case 'ProjectDetail':
        return <ProjectDetailScreen />;
      case 'Messages':
        return <MessagesScreen />;
      case 'ChatDetail':
        return <ChatDetailScreen />;
      case 'AIAssistant':
        return <AIAssistantScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Analytics':
        return <AnalyticsScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'Home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Persistent Bottom Tab Bar on main tabs */}
      {isTabScreen && (
        <View
          style={[
            styles.bottomNav,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          {TAB_SCREENS.map(tab => {
            const isActive = currentScreen === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.navItem}
                onPress={() => navigate(tab.name)}
                activeOpacity={0.7}
              >
                <View style={styles.navIconBox}>
                  <TabVectorIcon name={tab.name} isActive={isActive} />
                </View>
                <Text
                  style={[
                    styles.navText,
                    isActive && styles.navTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activePillIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Floating Corner AI Chatbot Widget (visible on Home & Projects, hidden during Splash and in 1-on-1 Chat) */}
      {shouldShowBot && <FloatingChatBot />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    height: 48,
  },
  navIconBox: {
    width: 22,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  navTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  activePillIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#4F46E5',
  },
  // Vector Home Icon
  iconHomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 18,
  },
  iconHomeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  iconHomeBase: {
    width: 14,
    height: 9,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconHomeDoor: {
    width: 4,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  // Vector Folder Icon
  iconFolderContainer: {
    width: 20,
    height: 16,
    justifyContent: 'flex-end',
  },
  iconFolderTab: {
    position: 'absolute',
    top: 0,
    left: 1,
    width: 8,
    height: 5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  iconFolderBody: {
    width: 20,
    height: 12,
    borderRadius: 2.5,
    paddingHorizontal: 3,
    paddingTop: 3,
  },
  iconFolderLine: {
    width: 8,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  // Vector Chat Icon
  iconChatContainer: {
    width: 20,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconChatBubble: {
    width: 18,
    height: 13,
    borderRadius: 6.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconChatDotsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  iconChatDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  iconChatTail: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  // Vector User Icon
  iconUserContainer: {
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUserHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 1.5,
  },
  iconUserBody: {
    width: 16,
    height: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
