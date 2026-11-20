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
  MessagesScreen,
  NotificationsScreen,
  ProfileScreen,
  ProjectDetailScreen,
  ProjectsScreen,
} from '../screens';
import { useNavigation } from './NavigationContext';
import { ScreenName } from './types';

const TAB_SCREENS: Array<{ name: ScreenName; label: string; icon: string }> = [
  { name: 'Home', label: 'Home', icon: '🏠' },
  { name: 'Projects', label: 'Projects', icon: '📂' },
  { name: 'Messages', label: 'Messages', icon: '💬' },
  { name: 'Profile', label: 'Profile', icon: '👤' },
];

interface AppNavigatorProps {
  isSplashVisible?: boolean;
}

const BOT_ALLOWED_SCREENS: ScreenName[] = ['Home', 'Projects'];

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
                <Text
                  style={[
                    styles.navIcon,
                    isActive && styles.navIconActive,
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.navText,
                    isActive && styles.navTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
