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
  'Connecting Nova AI companion...',
  'Syncing project matrices...',
  'Workspace ready',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [statusText, setStatusText] = useState(STATUS_STAGES[0]);

  // Transitions
  const containerScale = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Ambient glow
  const ambientScale = useRef(new Animated.Value(0.7)).current;
  const ambientOpacity = useRef(new Animated.Value(0)).current;

  // Mascot & Illustration levitation
  const mascotEntrance = useRef(new Animated.Value(0)).current;
  const levitateAnim = useRef(new Animated.Value(0)).current;
  const cardFloat1 = useRef(new Animated.Value(0)).current;
  const cardFloat2 = useRef(new Animated.Value(0)).current;

  // Bot Eye Blink
  const eyeBlink = useRef(new Animated.Value(1)).current;

  // Text & Progress
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Ambient Lighting Entrance
    Animated.parallel([
      Animated.timing(ambientOpacity, {
        toValue: 0.9,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(ambientScale, {
        toValue: 1.2,
        duration: 2200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Mascot & Illustration Pop-in
    Animated.spring(mascotEntrance, {
      toValue: 1,
      tension: 45,
      friction: 6.5,
      useNativeDriver: true,
    }).start(() => {
      // 3. Continuous Gentle Levitation Loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(levitateAnim, {
            toValue: -10,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(levitateAnim, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Floating card offsets
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardFloat1, {
            toValue: 8,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(cardFloat1, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(cardFloat2, {
            toValue: -8,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(cardFloat2, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Mascot Eye Blink Loop
      Animated.loop(
        Animated.sequence([
          Animated.delay(1800),
          Animated.timing(eyeBlink, {
            toValue: 0.1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(eyeBlink, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // 4. Text & Branding reveal
    Animated.sequence([
      Animated.delay(350),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. Progress Bar & Checkpoints
    Animated.sequence([
      Animated.delay(450),
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const t1 = setTimeout(() => setStatusText(STATUS_STAGES[1]), 700);
    const t2 = setTimeout(() => setStatusText(STATUS_STAGES[2]), 1300);
    const t3 = setTimeout(() => setStatusText(STATUS_STAGES[3]), 1850);

    // 6. Smooth exit after 2.5s
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, 2500);

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
        toValue: 1.05,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, width * 0.65],
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

      {/* Atmospheric Glow Spheres */}
      <Animated.View
        style={[
          styles.ambientGlowPrimary,
          {
            opacity: ambientOpacity,
            transform: [{ scale: ambientScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientGlowSecondary,
          {
            opacity: ambientOpacity,
            transform: [{ scale: ambientScale }],
          },
        ]}
      />

      {/* Tap to skip */}
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={triggerExit}
      >
        {/* Center Illustration Scene */}
        <View style={styles.illustrationSection}>
          <Animated.View
            style={[
              styles.illustrationStage,
              {
                opacity: mascotEntrance,
                transform: [
                  { scale: mascotEntrance },
                  { translateY: levitateAnim },
                ],
              },
            ]}
          >
            {/* Holographic Glowing Base Ring */}
            <View style={styles.holoBaseRing}>
              <View style={styles.holoInnerPulse} />
            </View>

            {/* Floating Workspace UI Card 1 (Top-Left: Analytics) */}
            <Animated.View
              style={[
                styles.floatingCard1,
                { transform: [{ translateY: cardFloat1 }] },
              ]}
            >
              <Text style={styles.cardIcon}>📊</Text>
              <View>
                <Text style={styles.cardTitle}>Velocity</Text>
                <Text style={styles.cardValue}>+94.2%</Text>
              </View>
            </Animated.View>

            {/* Floating Workspace UI Card 2 (Top-Right: AI Copilot) */}
            <Animated.View
              style={[
                styles.floatingCard2,
                { transform: [{ translateY: cardFloat2 }] },
              ]}
            >
              <View style={styles.aiCardHeader}>
                <Text style={styles.sparkleIcon}>✨</Text>
                <View style={styles.activeDot} />
              </View>
              <Text style={styles.aiBadgeText}>Nova AI</Text>
            </Animated.View>

            {/* Floating Workspace UI Card 3 (Bottom-Right: Tasks Done) */}
            <Animated.View
              style={[
                styles.floatingCard3,
                { transform: [{ translateY: cardFloat1 }] },
              ]}
            >
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.taskText}>18 / 24 Done</Text>
            </Animated.View>

            {/* Floating Sparkles */}
            <Text style={styles.sparkle1}>✦</Text>
            <Text style={styles.sparkle2}>★</Text>
            <Text style={styles.sparkle3}>✧</Text>

            {/* Vector Character Mascot (Nova Tech Companion) */}
            <View style={styles.mascotWrapper}>
              {/* Antennae */}
              <View style={styles.antennaeRow}>
                <View style={styles.antennaStem} />
                <View style={styles.antennaTip} />
              </View>

              {/* Robot Head */}
              <View style={styles.robotHead}>
                {/* Glossy Curved Visor */}
                <View style={styles.robotVisor}>
                  {/* Glowing LED Eyes */}
                  <Animated.View
                    style={[
                      styles.eyeRow,
                      { transform: [{ scaleY: eyeBlink }] },
                    ]}
                  >
                    <View style={styles.eyeLuminous} />
                    <View style={styles.mouthSmile} />
                    <View style={styles.eyeLuminous} />
                  </Animated.View>
                </View>
                {/* Ear Sensors */}
                <View style={styles.earLeft} />
                <View style={styles.earRight} />
              </View>

              {/* Robot Body / Chassis */}
              <View style={styles.robotBody}>
                {/* Center Core Reactor */}
                <View style={styles.reactorCore}>
                  <Text style={styles.coreLightning}>⚡</Text>
                </View>

                {/* Floating Robot Hands */}
                <View style={styles.handLeft} />
                <View style={styles.handRight} />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Brand Information */}
        <Animated.View
          style={[
            styles.brandBlock,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          {/* Category Chip */}
          <View style={styles.chipPill}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.chipText}>SMART WORKSPACE OS</Text>
          </View>

          {/* App Title */}
          <View style={styles.titleRow}>
            <Text style={styles.titleMain}>MY</Text>
            <Text style={styles.titleAccent}>APP</Text>
            <View style={styles.titleDot} />
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Intelligent Project Management &amp; Team Velocity
          </Text>
        </Animated.View>

        {/* Bottom Loading Bar & Status */}
        <Animated.View
          style={[styles.bottomSection, { opacity: progressOpacity }]}
        >
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            >
              <View style={styles.progressGlow} />
            </Animated.View>
          </View>

          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.buildLabel}>V2.4 • FAST &amp; SECURE</Text>
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
    backgroundColor: '#070B19', // Deep cosmic navy
    zIndex: 99999,
    elevation: 99999,
    overflow: 'hidden',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 44,
  },
  ambientGlowPrimary: {
    position: 'absolute',
    top: '20%',
    left: width * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(79, 70, 229, 0.35)', // Vibrant indigo
  },
  ambientGlowSecondary: {
    position: 'absolute',
    top: '32%',
    left: width * 0.5 - 110,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(6, 182, 212, 0.25)', // Neon cyan
  },
  illustrationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustrationStage: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  holoBaseRing: {
    position: 'absolute',
    bottom: 14,
    width: 170,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.65)',
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  holoInnerPulse: {
    width: 110,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.35)',
  },
  // Floating Cards
  floatingCard1: {
    position: 'absolute',
    top: 15,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#6366F1',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
    zIndex: 10,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A5B4FC',
  },
  cardValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#38BDF8',
  },
  floatingCard2: {
    position: 'absolute',
    top: 25,
    right: 5,
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    zIndex: 10,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sparkleIcon: {
    fontSize: 15,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingCard3: {
    position: 'absolute',
    bottom: 50,
    right: -10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 6,
    zIndex: 10,
  },
  checkIcon: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '900',
  },
  taskText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },
  sparkle1: {
    position: 'absolute',
    top: 5,
    left: '46%',
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '900',
  },
  sparkle2: {
    position: 'absolute',
    bottom: 85,
    left: 10,
    color: '#F59E0B',
    fontSize: 14,
  },
  sparkle3: {
    position: 'absolute',
    top: 85,
    right: -8,
    color: '#A5B4FC',
    fontSize: 12,
  },
  // Mascot Illustration
  mascotWrapper: {
    alignItems: 'center',
    zIndex: 5,
  },
  antennaeRow: {
    alignItems: 'center',
    marginBottom: -2,
  },
  antennaTip: {
    position: 'absolute',
    top: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  antennaStem: {
    width: 3,
    height: 12,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  robotHead: {
    width: 86,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1E1B4B',
    borderWidth: 2.5,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  robotVisor: {
    width: 66,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#070B19',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 44,
    paddingHorizontal: 4,
  },
  eyeLuminous: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  mouthSmile: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.8)',
  },
  earLeft: {
    position: 'absolute',
    left: -7,
    width: 8,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  earRight: {
    position: 'absolute',
    right: -7,
    width: 8,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  robotBody: {
    width: 72,
    height: 54,
    borderRadius: 22,
    backgroundColor: '#1E1B4B',
    borderWidth: 2,
    borderColor: '#4F46E5',
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  reactorCore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  coreLightning: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  handLeft: {
    position: 'absolute',
    left: -9,
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  handRight: {
    position: 'absolute',
    right: -9,
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  // Typography Block
  brandBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -8,
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.45)',
    marginBottom: 10,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
    letterSpacing: 1.4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  titleMain: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 2,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(226, 232, 240, 0.72)',
    fontWeight: '500',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  progressTrack: {
    width: width * 0.65,
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
  progressGlow: {
    position: 'absolute',
    right: 0,
    top: -2,
    bottom: -2,
    width: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(203, 213, 225, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  buildLabel: {
    fontSize: 9,
    color: 'rgba(148, 163, 184, 0.45)',
    fontWeight: '700',
    letterSpacing: 1.4,
  },
});
