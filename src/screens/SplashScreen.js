// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onReady }) {
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const logoY        = useRef(new Animated.Value(20)).current;
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity  = useRef(new Animated.Value(1)).current;

  const lineScale    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo monte + apparaît
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(logoY, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
      ]),
      // 2. Ligne qui s'étire depuis le centre (scaleX fonctionne depuis le centre en RN)
      Animated.timing(lineScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      // 3. Tagline + badge
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      // 4. Sortie
      Animated.timing(exitOpacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(() => onReady?.());
  }, []);

  return (
    <Animated.View style={[s.container, { opacity: exitOpacity }]}>
      {/* Cercles décoratifs */}
      <View style={[s.circle, s.circle1]} />
      <View style={[s.circle, s.circle2]} />

      <View style={s.center}>
        {/* Logo */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ translateY: logoY }] }}>
          <Text style={s.logo}>
            Fonctio<Text style={s.dot}>.</Text>
          </Text>
        </Animated.View>


        <View style={s.lineContainer}>
          <Animated.View style={[s.line, { transform: [{ scaleX: lineScale }] }]} />
        </View>

        {/* Tagline */}
        <Animated.Text style={[s.tagline, { opacity: tagOpacity }]}>
          Pour une carrière plus claire
        </Animated.Text>

        {/* Badge */}
        <Animated.View style={[s.badge, { opacity: badgeOpacity }]}>
          <Text style={s.badgeText}>Droits des agents publics</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circle1: {
    width: 420, height: 420,
    top: -80, right: -100,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  circle2: {
    width: 300, height: 300,
    bottom: -60, left: -80,
    backgroundColor: 'rgba(232,184,138,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(232,184,138,0.08)',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -2,
    textAlign: 'center',
  },
  dot: {
    color: '#E8B88A',
  },
  lineContainer: {
    width: 56,
    height: 2,
    marginTop: 18,
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  line: {
    height: '100%',
    width: '100%',
    backgroundColor: '#E8B88A',
    borderRadius: 1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 24,
  },
  badge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
