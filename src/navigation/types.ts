export type ScreenName =
  | 'Home'
  | 'Projects'
  | 'ProjectDetail'
  | 'Messages'
  | 'ChatDetail'
  | 'AIAssistant'
  | 'Profile'
  | 'Analytics'
  | 'Notifications';

export interface ProjectDetailParams {
  id: string;
  title: string;
  subtitle?: string;
  progress?: number;
  badge?: string;
}

export interface ChatDetailParams {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

export type ScreenParams = {
  Home: undefined;
  Projects: undefined;
  ProjectDetail: ProjectDetailParams;
  Messages: undefined;
  ChatDetail: ChatDetailParams;
  AIAssistant: undefined;
  Profile: undefined;
  Analytics: undefined;
  Notifications: undefined;
};

export interface NavigationContextType {
  currentScreen: ScreenName;
  params?: any;
  navigate: <T extends ScreenName>(screen: T, params?: ScreenParams[T]) => void;
  goBack: () => void;
  goHome: () => void;
  canGoBack: boolean;
}
