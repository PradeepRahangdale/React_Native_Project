/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './constants';
import { AuthProvider } from './context';
import { AppNavigator, NavigationProvider } from './navigation';
import { SplashScreen } from './screens';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={
          isSplashVisible
            ? 'light-content'
            : isDarkMode
            ? 'light-content'
            : 'dark-content'
        }
      />
      <View style={styles.container}>
        <AuthProvider>
          <NavigationProvider initialScreen="Login">
            <AppNavigator isSplashVisible={isSplashVisible} />
          </NavigationProvider>
        </AuthProvider>

        {isSplashVisible && (
          <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
