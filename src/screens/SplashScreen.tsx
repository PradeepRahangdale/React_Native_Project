import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const STATUS_STAGES = [
  'Initializing workspace engine...',
  'Loading project matrices...',
  'Syncing Nova AI intelligence...',
  'Workspace ready',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [statusText, setStatusText] = useState(STATUS_STAGES[0]);

  // Animation values
  const containerScale = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Ambient glows
  const ambientGlowScale = useRef(new Animated.Value(0.6)).current;
  const ambientGlowOpacity = useRef(new Animated.Value(0)).current;

  // Logo animations
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  // Radar rings
  const ring1Scale = useRef(new Animated.Value(0.8)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.8)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;

  // Text and badges
  const textTranslateY = useRef(new Animated.Value(24)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Ambient atmospheric glow entrance
    Animated.parallel([
      Animated.timing(ambientGlowOpacity, {
        toValue: 0.85,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(ambientGlowScale, {
        toValue: 1.15,
        duration: 2200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Logo entrance with fluid spring physics
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 6.5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 3. Concentric radar pulse loop
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.parallel([
              Animated.timing(ring1Scale, {
                toValue: 1.6,
                duration: 1400,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(ring1Opacity, {
                  toValue: 0.6,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(ring1Opacity, {
                  toValue: 0,
                  duration: 1100,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.timing(ring1Scale, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(450),
            Animated.parallel([
              Animated.timing(ring2Scale, {
                toValue: 1.9,
                duration: 1400,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(ring2Opacity, {
                  toValue: 0.45,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(ring2Opacity, {
                  toValue: 0,
                  duration: 1100,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.timing(ring2Scale, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    });

    // 4. Title, subtitle & badge slide up
    Animated.sequence([
      Animated.delay(280),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. Progress bar track animation with status checkpoint updates
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1550,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    // Update status text checkpoints
    const t1 = setTimeout(() => setStatusText(STATUS_STAGES[1]), 700);
    const t2 = setTimeout(() => setStatusText(STATUS_STAGES[2]), 1300);
    const t3 = setTimeout(() => setStatusText(STATUS_STAGES[3]), 1850);

    // 6. Cinematic zoom & fade transition to main app
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(exitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerExit = () => {
    Animated.parallel([
      Animated.timing(containerScale, {
        toValue: 1.06,
        duration: 420,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, width * 0.62],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Atmospheric Ambient Glow Orbs */}
      <Animated.View
        style={[
          styles.glowOrbPrimary,
          {
            opacity: ambientGlowOpacity,
            transform: [{ scale: ambientGlowScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowOrbSecondary,
          {
            opacity: ambientGlowOpacity,
            transform: [{ scale: ambientGlowScale }],
          },
        ]}
      />
      <View style={styles.gridOverlay} />

      {/* Tap to skip */}
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={triggerExit}
      >
        {/* Center Content */}
        <View style={styles.centerSection}>
          {/* Emblem & Radar Stage */}
          <View style={styles.emblemContainer}>
            {/* Concentric Radar Pulse Rings */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: ring1Opacity,
                  transform: [{ scale: ring1Scale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseRingOuter,
                {
                  opacity: ring2Opacity,
                  transform: [{ scale: ring2Scale }],
                },
              ]}
            />

            {/* Geometric High-Tech Brand Icon */}
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }, { rotate: spin }],
                },
              ]}
            >
              {/* Outer Diamond Shield */}
              <View style={styles.outerDiamond}>
                {/* Inner Glowing Core */}
                <View style={styles.innerDiamond}>
                  <View style={styles.monogramBox}>
                    <Text style={styles.monogramSymbol}>◈</Text>
                  </View>
                </View>
              </View>

              {/* Orbiting Sparkle Satellite */}
              <View style={styles.satelliteSparkle}>
                <Text style={styles.satelliteText}>✦</Text>
              </View>
            </Animated.View>
          </View>

          {/* Brand Typography */}
          <Animated.View
            style={[
              styles.textBlock,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            {/* Mini Category Pill */}
            <View style={styles.miniPill}>
              <View style={styles.pillLiveDot} />
              <Text style={styles.miniPillText}>WORKSPACE INTELLIGENCE</Text>
            </View>

            {/* App Title */}
            <View style={styles.titleRow}>
              <Text style={styles.titleMain}>MY</Text>
              <Text style={styles.titleAccent}>APP</Text>
              <View style={styles.titlePeriod} />
            </View>

            {/* Tagline */}
            <Text style={styles.taglineText}>
              Autonomous Collaboration &amp; Project OS
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Loading Progress & Footer */}
        <Animated.View
          style={[styles.bottomSection, { opacity: progressOpacity }]}
        >
          {/* Dynamic Progress Capsule Bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            >
              <View style={styles.progressGlowHead} />
            </Animated.View>
          </View>

          {/* Changing Status Text */}
          <Text style={styles.statusLabel}>{statusText}</Text>

          {/* Version & Build */}
          <View style={styles.versionRow}>
            <Text style={styles.versionText}>PRO RELEASE 2.4.0</Text>
            <Text style={styles.versionDivider}>•</Text>
            <Text style={styles.versionSecurity}>AI-ENCRYPTED</Text>
          </View>
        </Animated.View>
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
    backgroundColor: '#070B19', // Ultra-deep obsidian cosmic navy
    zIndex: 99999,
    elevation: 99999,
    overflow: 'hidden',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    zIndex: 10,
  },
  // Ambient Lighting Orbs
  glowOrbPrimary: {
    position: 'absolute',
    top: '22%',
    left: width * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(79, 70, 229, 0.32)', // Indigo core
  },
  glowOrbSecondary: {
    position: 'absolute',
    top: '30%',
    left: width * 0.5 - 110,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(6, 182, 212, 0.22)', // Electric cyan glow
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  emblemContainer: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.85)',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.5)',
  },
  logoWrapper: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerDiamond: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: '#1E1B4B',
    borderWidth: 2,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 16,
    transform: [{ rotate: '45deg' }],
  },
  innerDiamond: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monogramBox: {
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  monogramSymbol: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '900',
    textShadowColor: 'rgba(56, 189, 248, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  satelliteSparkle: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#06B6D4',
    borderWidth: 2,
    borderColor: '#070B19',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  satelliteText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  miniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.45)',
    marginBottom: 14,
  },
  pillLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  titleMain: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  titleAccent: {
    fontSize: 38,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 2,
  },
  titlePeriod: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 13,
    color: 'rgba(226, 232, 240, 0.72)',
    fontWeight: '500',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  progressTrack: {
    width: width * 0.62,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    position: 'relative',
  },
  progressGlowHead: {
    position: 'absolute',
    right: 0,
    top: -2,
    bottom: -2,
    width: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusLabel: {
    fontSize: 11,
    color: 'rgba(203, 213, 225, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(148, 163, 184, 0.5)',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  versionDivider: {
    color: 'rgba(148, 163, 184, 0.4)',
    fontSize: 10,
  },
  versionSecurity: {
    fontSize: 10,
    color: 'rgba(56, 189, 248, 0.65)',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
