import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo pop-in animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Title & tagline fade-in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 3. Subtle pulsing indicator
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
    });

    // 4. Smooth exit after 2.4s
    const timer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2400);

    return () => clearTimeout(timer);
  }, [containerOpacity, logoOpacity, logoScale, onFinish, pulseAnim, textOpacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Main Branding */}
      <View style={styles.centerContent}>
        {/* Animated Emblem */}
        <Animated.View
          style={[
            styles.emblemWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View style={styles.emblemCore}>
            <Text style={styles.emblemIcon}>⚡</Text>
          </View>
        </Animated.View>

        {/* Animated App Name & Slogan */}
        <Animated.View
          style={[styles.textContainer, { opacity: textOpacity }]}
        >
          <Text style={styles.appName}>MyApp</Text>
          <Text style={styles.appTagline}>
            Workspace &amp; Project Intelligence
          </Text>
        </Animated.View>
      </View>

      {/* Footer Info */}
      <Animated.View
        style={[styles.footerContainer, { opacity: textOpacity }]}
      >
        <View style={styles.loadingDotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.versionText}>v0.0.1 • Fast &amp; Reliable</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A', // Deep slate navy background
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    zIndex: 99999,
    elevation: 99999,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  pulseRing: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
  },
  emblemCore: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  emblemIcon: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingDotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
    borderRadius: 4,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
