// src/screens/SplashScreen.js
//
// Ce splash prend le relais du splash NATIF (assets/splash.png), qu'Expo
// affiche pendant le démarrage. Les deux montrent désormais le MÊME
// mot-symbole (assets/logo-splash.png), à la même taille et au même endroit,
// pour que le passage de l'un à l'autre ne se voie pas.
//
// Le défaut corrigé : le splash natif dessinait « Fonctio » sur environ 32 %
// de la largeur, en serif, puis ce fichier le redessinait en sans-serif gras
// à 64 dp, soit près de 56 %. Le mot semblait apparaître tout petit avant de
// grossir d'un coup.
//
// Deux invariants à respecter si l'on retouche l'un des deux étages :
//   · LARGEUR_LOGO doit rester égale à la fraction de largeur occupée par le
//     mot-symbole dans splash.png (voir scratchpad/faire_splash.py) ;
//   · le logo doit rester centré sur l'écran. « resizeMode: contain » rend le
//     carré source à W×W centré : ce qui est au centre du carré tombe au
//     centre de l'écran. Le bloc ligne + accroche + badge est donc positionné
//     en absolu SOUS le logo, pour ne pas décaler celui-ci.
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: LARGEUR_ECRAN, height: HAUTEUR_ECRAN } = Dimensions.get('window');
// « contain » met le carré source à l'échelle du PLUS PETIT côté de l'écran :
// c'est donc ce côté qui commande la taille apparente du mot-symbole. En
// portrait c'est la largeur, mais l'écran de couverture d'un pliant est
// presque carré et un passage en paysage inverserait le rapport.
const COTE_DE_REFERENCE = Math.min(LARGEUR_ECRAN, HAUTEUR_ECRAN);
const LARGEUR_LOGO = Math.round(COTE_DE_REFERENCE * 0.56);
const RAPPORT_LOGO = 5.1765;              // largeur / hauteur de logo-splash.png
const HAUTEUR_LOGO = Math.round(LARGEUR_LOGO / RAPPORT_LOGO);

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
    height: HAUTEUR_LOGO,
    alignItems: 'center',
  },
  logo: {
    width: LARGEUR_LOGO,
    height: HAUTEUR_LOGO,
  },
  // Ancré sous le logo, et volontairement plus large que lui pour que
  // l'accroche ne soit pas coupée.
  dessous: {
    position: 'absolute',
    top: '100%',
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
