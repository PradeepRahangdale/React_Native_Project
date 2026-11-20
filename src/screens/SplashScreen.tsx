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

const BOOT_STAGES = [
  'INITIALIZING SYSTEM ARCHITECTURE...',
  'ORCHESTRATING WORKSPACE MATRICES...',
  'SYNCHRONIZING ENTERPRISE CORES...',
  'WORKSPACE READY',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [stageIndex, setStageIndex] = useState(0);

  // Master container exit transitions
  const containerScale = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Ambient Lighting & Aura
  const auraScale = useRef(new Animated.Value(0.8)).current;
  const auraOpacity = useRef(new Animated.Value(0)).current;

  // Central Architectural Monolith Entrance & Float
  const centerpieceEntrance = useRef(new Animated.Value(0)).current;
  const levitateAnim = useRef(new Animated.Value(0)).current;
  const prismPulse = useRef(new Animated.Value(1)).current;

  // Floating Glass Blades / Precision Tiles
  const tileFloatLeft = useRef(new Animated.Value(0)).current;
  const tileFloatRight = useRef(new Animated.Value(0)).current;

  // Typography & Brand Reveal
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(16)).current;

  // Precision Hairline Progress
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Soft Ambient Aura Glow Entrance
    Animated.parallel([
      Animated.timing(auraOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(auraScale, {
        toValue: 1.15,
        duration: 2400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Central Monolith Spring Pop-in
    Animated.spring(centerpieceEntrance, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      // 3. Ultra-Smooth Harmonic Levitation
      Animated.loop(
        Animated.sequence([
          Animated.timing(levitateAnim, {
            toValue: -8,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(levitateAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Subtle Prismatic Core Breathing Pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(prismPulse, {
            toValue: 1.08,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(prismPulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Tile Left Drift
      Animated.loop(
        Animated.sequence([
          Animated.timing(tileFloatLeft, {
            toValue: -6,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tileFloatLeft, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Tile Right Drift
      Animated.loop(
        Animated.sequence([
          Animated.timing(tileFloatRight, {
            toValue: 6,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tileFloatRight, {
            toValue: 0,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // 4. Brand Typography Fade & Rise
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(brandTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. Hairline Progress Bar
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1750,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const t1 = setTimeout(() => setStageIndex(1), 600);
    const t2 = setTimeout(() => setStageIndex(2), 1250);
    const t3 = setTimeout(() => setStageIndex(3), 1800);

    // 6. Fluid Cinematic Exit
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
        toValue: 1.04,
        duration: 360,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, width * 0.72],
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

      {/* Atmospheric Soft Lighting Accents (Luxury Dark Obsidian & Royal Iris) */}
      <Animated.View
        style={[
          styles.ambientOrbPrimary,
          {
            opacity: auraOpacity,
            transform: [{ scale: auraScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientOrbSecondary,
          {
            opacity: auraOpacity,
            transform: [{ scale: auraScale }],
          },
        ]}
      />
      <View style={styles.topVignetteGradient} />

      {/* Tap-to-skip interactive wrapper */}
      <TouchableOpacity
        style={styles.contentWrapper}
        activeOpacity={1}
        onPress={triggerExit}
      >
        {/* Top Architecture Pill */}
        <View style={styles.topMetaContainer}>
          <View style={styles.specimenBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.specimenText}>WORKSPACE INTELLIGENCE</Text>
          </View>
        </View>

        {/* Center Architectural Illustration Stage */}
        <View style={styles.stageContainer}>
          <Animated.View
            style={[
              styles.architecturalStage,
              {
                opacity: centerpieceEntrance,
                transform: [
                  { scale: centerpieceEntrance },
                  { translateY: levitateAnim },
                ],
              },
            ]}
          >
            {/* Precision Coordinate Guides */}
            <Text style={styles.gridCrossTopLeft}>+</Text>
            <Text style={styles.gridCrossTopRight}>+</Text>
            <Text style={styles.gridCrossBottomLeft}>+</Text>
            <Text style={styles.gridCrossBottomRight}>+</Text>

            {/* Subtle Ethereal Platform Base */}
            <View style={styles.platformHaloRing}>
              <View style={styles.platformInnerCore} />
            </View>

            {/* Hairline Orbital Rings */}
            <View style={styles.orbitOuterRing}>
              <View style={styles.satelliteNode} />
            </View>
            <View style={styles.orbitInnerRing} />

            {/* Left Precision Frosted Glass Tile: Velocity & Analytics */}
            <Animated.View
              style={[
                styles.glassTileLeft,
                { transform: [{ translateY: tileFloatLeft }] },
              ]}
            >
              <View style={styles.tileHeaderRow}>
                <View style={styles.tileHeaderDot} />
                <Text style={styles.tileCategoryText}>VELOCITY</Text>
              </View>
              {/* Mini Precision Vector Chart Bars */}
              <View style={styles.chartBarsContainer}>
                <View style={[styles.chartBar, styles.bar1]} />
                <View style={[styles.chartBar, styles.bar2]} />
                <View style={[styles.chartBar, styles.bar3]} />
                <View style={[styles.chartBar, styles.bar4]} />
              </View>
              <Text style={styles.tileValueText}>+38.4%</Text>
            </Animated.View>

            {/* Right Precision Frosted Glass Tile: Quantum Security & Sync */}
            <Animated.View
              style={[
                styles.glassTileRight,
                { transform: [{ translateY: tileFloatRight }] },
              ]}
            >
              <View style={styles.tileHeaderRow}>
                <View style={[styles.tileHeaderDot, styles.dotSuccess]} />
                <Text style={styles.tileCategoryText}>ENCRYPTED</Text>
              </View>
              {/* Clean Vector Polyline Trend / Sparkline */}
              <View style={styles.sparklineContainer}>
                <View style={styles.sparklineSegmentA} />
                <View style={styles.sparklineSegmentB} />
                <View style={styles.sparklineSegmentC} />
                <View style={styles.sparklineHead} />
              </View>
              <Text style={styles.tileStatusText}>99.98% UPTIME</Text>
            </Animated.View>

            {/* Central Precision Glass Prism Monolith */}
            <View style={styles.monolithContainer}>
              {/* Outer Frosted Glass Facet Diamond */}
              <View style={styles.monolithGlassFacet}>
                {/* Mid Diamond Bezel */}
                <View style={styles.monolithMidBezel}>
                  {/* Inner Obsidian Core with Radial Pulse */}
                  <Animated.View
                    style={[
                      styles.monolithInnerObsidian,
                      { transform: [{ scale: prismPulse }] },
                    ]}
                  >
                    <View style={styles.coreGlowAura} />
                    {/* Bespoke Geometric Monogram / Emblem */}
                    <Text style={styles.coreEmblemText}>◈</Text>
                  </Animated.View>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Brand Identity Block */}
        <Animated.View
          style={[
            styles.brandBlock,
            {
              opacity: brandOpacity,
              transform: [{ translateY: brandTranslateY }],
            },
          ]}
        >
          {/* Main Title with Refined Tracking */}
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitlePrimary}>MY</Text>
            <Text style={styles.brandTitleAccent}>APP</Text>
            <View style={styles.brandTitleDot} />
          </View>

          {/* Luxury Tagline */}
          <Text style={styles.brandSubtitle}>
            Autonomous Workspace &amp; Project Intelligence
          </Text>
        </Animated.View>

        {/* Bottom Precision Hairline Progress & Telemetry */}
        <Animated.View
          style={[styles.bottomControlBar, { opacity: progressOpacity }]}
        >
          {/* Hairline Progress Track */}
          <View style={styles.hairlineTrack}>
            <Animated.View
              style={[styles.hairlineFill, { width: progressWidth }]}
            >
              <View style={styles.leadingLightHead} />
            </Animated.View>
          </View>

          {/* Live Telemetry Status */}
          <View style={styles.telemetryRow}>
            <Text style={styles.telemetryStatusText}>
              {BOOT_STAGES[stageIndex]}
            </Text>
            <Text style={styles.telemetryVersionText}>REL 2.4.0</Text>
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
    backgroundColor: '#06080F', // Ultra-luxurious velvet obsidian noir
    zIndex: 99999,
    elevation: 99999,
    overflow: 'hidden',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  topVignetteGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.015)',
  },
  // Ambient Lighting Orbs
  ambientOrbPrimary: {
    position: 'absolute',
    top: '18%',
    left: width * 0.5 - 130,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(99, 102, 241, 0.16)', // Royal iris
  },
  ambientOrbSecondary: {
    position: 'absolute',
    top: '26%',
    left: width * 0.5 - 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(56, 189, 248, 0.10)', // Ice cerulean
  },
  // Top Specimen Metadata
  topMetaContainer: {
    alignItems: 'center',
  },
  specimenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  specimenText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  // Center Architectural Stage
  stageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  architecturalStage: {
    width: 280,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // Subtle Floor Platform
  platformHaloRing: {
    position: 'absolute',
    bottom: 12,
    width: 190,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformInnerCore: {
    width: 110,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  // Precision Orbital Rings
  orbitOuterRing: {
    position: 'absolute',
    width: 220,
    height: 130,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  satelliteNode: {
    position: 'absolute',
    top: 6,
    right: 48,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
  orbitInnerRing: {
    position: 'absolute',
    width: 170,
    height: 96,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.20)',
    borderStyle: 'dashed',
  },
  // Coordinate Crosshairs
  gridCrossTopLeft: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.18)',
    fontWeight: '300',
  },
  gridCrossTopRight: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.18)',
    fontWeight: '300',
  },
  gridCrossBottomLeft: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.18)',
    fontWeight: '300',
  },
  gridCrossBottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.18)',
    fontWeight: '300',
  },
  // Left Glass Tile (Velocity Engine)
  glassTileLeft: {
    position: 'absolute',
    top: 24,
    left: -4,
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  tileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tileHeaderDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6366F1',
  },
  tileCategoryText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 18,
    marginBottom: 4,
  },
  chartBar: {
    width: 4,
    borderRadius: 2,
  },
  bar1: {
    height: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.45)',
  },
  bar2: {
    height: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.75)',
  },
  bar3: {
    height: 15,
    backgroundColor: '#818CF8',
  },
  bar4: {
    height: 18,
    backgroundColor: '#38BDF8',
  },
  tileValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  // Right Glass Tile (Security Matrix)
  glassTileRight: {
    position: 'absolute',
    bottom: 34,
    right: -8,
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  dotSuccess: {
    backgroundColor: '#10B981',
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 14,
    gap: 2,
    marginBottom: 4,
  },
  sparklineSegmentA: {
    width: 8,
    height: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    transform: [{ rotate: '15deg' }],
  },
  sparklineSegmentB: {
    width: 10,
    height: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.7)',
    transform: [{ rotate: '-25deg' }],
  },
  sparklineSegmentC: {
    width: 12,
    height: 2,
    backgroundColor: '#10B981',
    transform: [{ rotate: '30deg' }],
  },
  sparklineHead: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34D399',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
  },
  tileStatusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#34D399',
  },
  // Central Monolith Prism
  monolithContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  monolithGlassFacet: {
    width: 96,
    height: 96,
    borderRadius: 24,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  monolithMidBezel: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#0F1528',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monolithInnerObsidian: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#070A14',
    borderWidth: 1,
    borderColor: '#818CF8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coreGlowAura: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.35)',
  },
  coreEmblemText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    transform: [{ rotate: '-45deg' }], // Counteract diamond rotation for clean upright alignment
    textShadowColor: 'rgba(129, 140, 248, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  // Brand Identity Block
  brandBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandTitlePrimary: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#FFFFFF',
  },
  brandTitleAccent: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 6,
    color: '#818CF8',
  },
  brandTitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginLeft: 4,
    marginBottom: 16,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.8,
    textAlign: 'center',
    maxWidth: 280,
  },
  // Hairline Bottom Telemetry & Progress
  bottomControlBar: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  hairlineTrack: {
    width: '72%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1,
    overflow: 'visible',
    position: 'relative',
  },
  hairlineFill: {
    height: 2,
    backgroundColor: '#6366F1',
    borderRadius: 1,
    position: 'relative',
  },
  leadingLightHead: {
    position: 'absolute',
    right: 0,
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '72%',
  },
  telemetryStatusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255, 255, 255, 0.40)',
  },
  telemetryVersionText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.25)',
  },
});
