// src/screens/WelcomeScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../theme';

const VERSANTS = [
  {
    id: 'fpe',
    label: 'Fonction publique de l\'État',
    short: 'FPE',
    icon: '🏛️',
    desc: 'Ministères, établissements publics nationaux, préfectures…',
    color: Colors.terracotta,
  },
  {
    id: 'fpt',
    label: 'Fonction publique Territoriale',
    short: 'FPT',
    icon: '🏙️',
    desc: 'Communes, départements, régions, intercommunalités…',
    color: Colors.sky,
  },
  {
    id: 'fph',
    label: 'Fonction publique Hospitalière',
    short: 'FPH',
    icon: '🏥',
    desc: 'Hôpitaux, EHPAD, centres de soins publics…',
    color: Colors.olive,
  },
];

export default function WelcomeScreen({ onVersantSelected }) {
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleConfirm = () => {
    if (!selected) return;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onVersantSelected(selected);
    });
  };

  const selectedVersant = VERSANTS.find(v => v.id === selected);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.slate} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Logo centré */}
        <View style={styles.top}>
          <Text style={styles.logo}>
            Fonctio<Text style={styles.dot}>.</Text>
          </Text>
          <Text style={styles.tagline}>Pour une carrière plus claire</Text>
        </View>

        {/* Sélecteur versant */}
        <View style={styles.middle}>
          <Text style={styles.selectorTitle}>Vous appartenez à…</Text>
          <View style={styles.versantList}>
            {VERSANTS.map(v => {
              const isSelected = selected === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[
                    styles.versantCard,
                    isSelected && { borderColor: v.color, borderWidth: 2, backgroundColor: v.color + '18' },
                  ]}
                  onPress={() => setSelected(v.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.versantIcon}>{v.icon}</Text>
                  <View style={styles.versantInfo}>
                    <Text style={[styles.versantLabel, isSelected && { color: v.color }]}>
                      {v.label}
                    </Text>
                    <Text style={styles.versantDesc}>{v.desc}</Text>
                  </View>
                  <View style={[
                    styles.versantRadio,
                    isSelected && { backgroundColor: v.color, borderColor: v.color },
                  ]}>
                    {isSelected && <View style={styles.versantRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bouton Accéder */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              selected ? { backgroundColor: selectedVersant?.color } : styles.confirmBtnDisabled,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.85}
            disabled={!selected}
          >
            <Text style={styles.confirmText}>
              {selected ? `Accéder` : 'Choisissez votre versant'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.bottomNote}>
            Vous pourrez changer de versant à tout moment depuis l'accueil.
          </Text>
        </View>

      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },

  top: {
    paddingTop: Spacing.xxxl,
    alignItems: 'center',
  },
  logo: {
    fontSize: 58,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -2,
    textAlign: 'center',
  },
  dot: { color: '#E8B88A' },
  tagline: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 6,
  },

  middle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  selectorTitle: {
    fontSize: Typography.xs,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.08,
    marginBottom: Spacing.md,
  },
  versantList: { gap: 12 },
  versantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  versantIcon: { fontSize: 26 },
  versantInfo: { flex: 1 },
  versantLabel: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: 'white',
    marginBottom: 3,
  },
  versantDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 16,
  },
  versantRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  versantRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'white',
  },

  bottom: { paddingBottom: Spacing.xl },
  confirmBtn: {
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confirmBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  confirmText: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.2,
  },
  bottomNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
});
