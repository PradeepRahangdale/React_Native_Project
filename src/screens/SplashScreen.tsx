import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Exit fade & scale
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(0.92)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Subtle logo float
  const logoTranslateY = useRef(new Animated.Value(12)).current;

  // Pulse for loading indicator
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous subtle pulse on loading pill
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    // 3. Auto dismiss after 1.8 seconds
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 1800);

    return () => {
      pulseLoop.stop();
      clearTimeout(exitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExit = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" />

      {/* Main touchable area to allow immediate tap-to-skip */}
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleExit}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: contentOpacity,
              transform: [
                { scale: contentScale },
                { translateY: logoTranslateY },
              ],
            },
          ]}
        >
          {/* Minimalist Vector Brand Emblem */}
          <View style={styles.logoBadge}>
            <View style={styles.emblemContainer}>
              <View style={styles.emblemDiamond} />
              <View style={styles.emblemInnerCore} />
            </View>
          </View>

          {/* Clean Brand Typography */}
          <View style={styles.textContainer}>
            <Text style={styles.brandTitle}>APEX</Text>
            <Text style={styles.brandSubtitle}>WORKSPACE PLATFORM</Text>
          </View>

          {/* Minimal Loading Indicator */}
          <View style={styles.indicatorContainer}>
            <Animated.View
              style={[styles.indicatorPill, { opacity: pulseAnim }]}
            />
          </View>
        </Animated.View>

        {/* Clean Minimalist Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Apex Dynamics • Enterprise</Text>
          <Text style={styles.skipHintText}>Tap anywhere to skip</Text>
        </View>
      </TouchableOpacity>
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
    backgroundColor: '#4F46E5',
    zIndex: 9999,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  emblemContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emblemDiamond: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    transform: [{ rotate: '45deg' }],
  },
  emblemInnerCore: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  indicatorContainer: {
    marginTop: 36,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorPill: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  skipHintText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.3,
  },
});
