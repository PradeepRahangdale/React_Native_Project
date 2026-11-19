import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BackHandler } from 'react-native';
import { NavigationContextType, ScreenName, ScreenParams } from './types';

interface HistoryItem {
  screen: ScreenName;
  params?: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{
  initialScreen?: ScreenName;
  children: React.ReactNode;
}> = ({ initialScreen = 'Home', children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { screen: initialScreen },
  ]);

  const currentItem = history[history.length - 1] || { screen: initialScreen };
  const currentScreen = currentItem.screen;
  const currentParams = currentItem.params;

  const navigate = useCallback(
    <T extends ScreenName>(screen: T, params?: ScreenParams[T]) => {
      setHistory(prev => {
        // Avoid duplicate consecutive entry
        if (prev[prev.length - 1]?.screen === screen && !params) {
          return prev;
        }
        return [...prev, { screen, params }];
      });
    },
    [],
  );

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      // If at root of history but on a sub-screen, return to Home
      if (prev[0]?.screen !== 'Home') {
        return [{ screen: 'Home' }];
      }
      return prev;
    });
  }, []);

  const goHome = useCallback(() => {
    setHistory([{ screen: 'Home' }]);
  }, []);

  const canGoBack = history.length > 1 || currentScreen !== 'Home';

  // Listen to Android hardware / gesture back button
  useEffect(() => {
    const onHardwareBackPress = () => {
      if (canGoBack) {
        goBack();
        return true; // Consumes event, stops app from exiting
      }
      return false; // Default Android back behavior on Home
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBackPress,
    );

    return () => subscription.remove();
  }, [canGoBack, goBack]);

  const value = useMemo(
    () => ({
      currentScreen,
      params: currentParams,
      navigate,
      goBack,
      goHome,
      canGoBack,
    }),
    [currentScreen, currentParams, navigate, goBack, goHome, canGoBack],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
