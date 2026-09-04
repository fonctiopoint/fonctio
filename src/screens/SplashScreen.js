// src/screens/SplashScreen.js
//
// Ce splash prend le relais du splash NATIF, qu'Android affiche pendant le
// démarrage. Les deux montrent le MÊME mot-symbole (assets/logo-splash.png),
// à la même taille et au même endroit, pour que le passage de l'un à l'autre
// ne se voie pas.
//
// Le défaut corrigé : le splash natif dessinait « Fonctio » sur environ 32 %
// de la largeur, en serif, puis ce fichier le redessinait en sans-serif gras
// à 64 dp, soit près de 56 %. Le mot semblait apparaître tout petit avant de
// grossir d'un coup.
//
// LA LARGEUR EST FIXE, EN DP, et c'est volontaire. Depuis le SDK 57, le splash
// natif d'Android passe par l'API SplashScreen d'Android 12 : elle dessine le
// logo à une largeur en dp, `imageWidth` du greffon expo-splash-screen dans
// app.json, et non plus à une fraction de l'écran. Une fraction ici et une
// largeur fixe là-bas se seraient séparées sur tout écran de largeur autre que
// celle de référence — exactement le défaut qu'on avait corrigé.
//
// DONC : LARGEUR_LOGO et `imageWidth` doivent rester égales. Toucher l'une sans
// l'autre fait réapparaître le saut de taille au démarrage.
//
// Le logo reste centré sur l'écran ; le bloc ligne + accroche + badge est
// positionné en absolu SOUS lui, pour ne pas le décaler.
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';

// La largeur d'écran ne sert plus qu'à étaler le bloc du dessous sur toute la
// page : le logo, lui, a une taille fixe.
const { width: LARGEUR_ECRAN } = Dimensions.get('window');
// Doit rester égal à `imageWidth` du greffon expo-splash-screen, dans app.json.
// C'est le côté du CARRÉ, pas la largeur du mot : voir ci-dessous.
const LARGEUR_LOGO = 320;
// logo-splash.png est désormais un carré transparent, le mot centré dedans.
// L'API SplashScreen d'Android 12 masque l'icône du splash DANS UN CERCLE et
// rogne tout ce qui dépasse : un mot-symbole de rapport 4,8:1 dessiné à pleine
// largeur y perdait son « F » et son point. Le mot occupe donc PART_MOT du côté
// du carré, calé pour tenir dans le cercle sûr des deux tiers.
// Les trois valeurs sont imprimées par scratchpad/faire_logo_splash.py.
const PART_MOT = 0.62;
const RAPPORT_MOT = 4.8124;
const LARGEUR_MOT = LARGEUR_LOGO * PART_MOT;
const HAUTEUR_MOT = LARGEUR_MOT / RAPPORT_MOT;
// Hauteur de vide sous le mot, à l'intérieur du carré. Le bloc du dessous est
// ancré au bas du CARRÉ : sans cette remontée, l'accroche tomberait 139 dp trop
// bas, à la distance du bord de l'image et non du bas du mot.
const VIDE_SOUS_LE_MOT = Math.round((LARGEUR_LOGO - HAUTEUR_MOT) / 2);

export default function SplashScreen({ onReady }) {
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity  = useRef(new Animated.Value(1)).current;
  const lineScale    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Le logo n'est plus animé à l'entrée : il est déjà à l'écran, hérité du
      // splash natif. L'animer reviendrait à le faire disparaître puis
      // réapparaître, ce qui est précisément ce qu'on cherche à supprimer.
      Animated.delay(120),
      // 1. Ligne qui s'étire depuis le centre (scaleX part du centre en RN)
      Animated.timing(lineScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      // 2. Accroche + badge
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      // 3. Sortie
      Animated.timing(exitOpacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(() => onReady?.());
  }, []);

  return (
    <Animated.View style={[s.container, { opacity: exitOpacity }]}>
      {/* Cercles décoratifs */}
      <View style={[s.circle, s.circle1]} />
      <View style={[s.circle, s.circle2]} />

      {/* Le logo, seul élément centré : il doit tomber exactement là où le
          splash natif le laissait. */}
      <View style={s.centre}>
        <Image
          source={require('../../assets/logo-splash.png')}
          style={s.logo}
          resizeMode="contain"
          fadeDuration={0}
        />

        {/* Tout le reste est suspendu sous le logo, sans influer sur sa position */}
        <View style={s.dessous} pointerEvents="none">
          <View style={s.lineContainer}>
            <Animated.View style={[s.line, { transform: [{ scaleX: lineScale }] }]} />
          </View>

          <Animated.Text style={[s.tagline, { opacity: tagOpacity }]}>
            Pour une carrière plus claire
          </Animated.Text>

          <Animated.View style={[s.badge, { opacity: badgeOpacity }]}>
            <Text style={s.badgeText}>Droits des agents publics</Text>
          </Animated.View>
        </View>
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
  centre: {
    width: LARGEUR_LOGO,
    height: LARGEUR_LOGO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LARGEUR_LOGO,
    height: LARGEUR_LOGO,
  },
  // Ancré sous le logo, et volontairement plus large que lui pour que
  // l'accroche ne soit pas coupée.
  dessous: {
    position: 'absolute',
    top: '100%',
    marginTop: -VIDE_SOUS_LE_MOT,
    width: LARGEUR_ECRAN,
    left: (LARGEUR_LOGO - LARGEUR_ECRAN) / 2,
    alignItems: 'center',
  },
  lineContainer: {
    width: 56,
    height: 2,
    marginTop: 18,
    marginBottom: 16,
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
