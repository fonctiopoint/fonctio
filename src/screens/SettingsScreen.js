// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, useTheme } from '../theme';
import { useSettings, FONT_SCALES } from '../utils/SettingsContext';

const FONT_OPTIONS = [
  { id: 'small',  label: 'Petite',  base: 11 },
  { id: 'normal', label: 'Normale', base: 14 },
  { id: 'large',  label: 'Grande',  base: 17 },
];

const DARK_OPTIONS = [
  { id: 'auto',  label: 'Automatique', sub: 'Suit les réglages du téléphone', icon: 'contrast-outline' },
  { id: 'light', label: 'Mode clair',  sub: 'Toujours en thème clair',         icon: 'sunny-outline' },
  { id: 'dark',  label: 'Mode sombre', sub: 'Toujours en thème sombre',        icon: 'moon-outline' },
];

export default function SettingsScreen({ navigation }) {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  const [flash, setFlash] = useState(false);

  const update = (key, val) => {
    updateSetting(key, val);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const previewSize = FONT_OPTIONS.find(f => f.id === settings.fontSize)?.base || 14;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <StatusBar barStyle={theme.statusBar} />

      <View style={[s.header, { backgroundColor: Colors.slate }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Réglages</Text>
        {flash && (
          <View style={s.flash}>
            <Ionicons name="checkmark" size={12} color={Colors.olive} />
            <Text style={s.flashText}>Enregistré</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Taille de police ── */}
        <Text style={[s.section, { color: theme.textMuted }]}>Taille de la police</Text>
        <View style={[s.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={s.preview}>
            <Text style={[s.previewText, { fontSize: previewSize, color: theme.textPrimary }]}>
              Aperçu — Droits des agents publics
            </Text>
            <Text style={[s.previewSub, { fontSize: previewSize - 3, color: theme.textMuted }]}>
              Exemple de texte secondaire
            </Text>
          </View>
          <View style={[s.sep, { backgroundColor: theme.border }]} />
          <View style={s.fontRow}>
            {FONT_OPTIONS.map((opt) => {
              const sel = settings.fontSize === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.fontBtn, { borderColor: sel ? Colors.terracotta : theme.border },
                    sel && { backgroundColor: Colors.terracotta }]}
                  onPress={() => update('fontSize', opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.fontA, { fontSize: opt.base - 2 }, sel ? { color: 'white' } : { color: theme.textMuted }]}>A</Text>
                  <Text style={[s.fontLabel, sel ? { color: 'rgba(255,255,255,0.9)' } : { color: theme.textMuted }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Mode sombre ── */}
        <Text style={[s.section, { color: theme.textMuted }]}>Mode d'affichage</Text>
        <View style={[s.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          {DARK_OPTIONS.map((opt, i) => {
            const sel = settings.darkMode === opt.id;
            return (
              <React.Fragment key={opt.id}>
                <TouchableOpacity style={s.optRow} onPress={() => update('darkMode', opt.id)} activeOpacity={0.75}>
                  <View style={[s.optIcon, sel ? { backgroundColor: Colors.terracotta } : { backgroundColor: theme.bgWarm }]}>
                    <Ionicons name={opt.icon} size={18} color={sel ? 'white' : theme.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.optLabel, { color: theme.textPrimary }]}>{opt.label}</Text>
                    <Text style={[s.optSub, { color: theme.textMuted }]}>{opt.sub}</Text>
                  </View>
                  <View style={[s.radio, { borderColor: sel ? Colors.terracotta : theme.border },
                    sel && { backgroundColor: Colors.terracotta }]}>
                    {sel && <View style={s.radioDot} />}
                  </View>
                </TouchableOpacity>
                {i < DARK_OPTIONS.length - 1 && <View style={[s.sep, { backgroundColor: theme.border, marginLeft: 58 }]} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* ── Affichage ── */}
        <Text style={[s.section, { color: theme.textMuted }]}>Affichage</Text>
        <View style={[s.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={s.switchRow}>
            <View style={[s.optIcon, { backgroundColor: Colors.skyLight }]}>
              <Ionicons name="megaphone-outline" size={18} color={Colors.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.optLabel, { color: theme.textPrimary }]}>Bannière Nouveautés</Text>
              <Text style={[s.optSub, { color: theme.textMuted }]}>Affiche les mises à jour sur l'accueil</Text>
            </View>
            <Switch
              value={settings.showNouveautes}
              onValueChange={(v) => update('showNouveautes', v)}
              trackColor={{ false: theme.border, true: Colors.terracotta }}
              thumbColor="white"
            />
          </View>
        </View>

        <Text style={[s.note, { color: theme.textMuted }]}>
          Les réglages sont sauvegardés localement sur votre appareil.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, paddingVertical: 14 },
  back: { padding: 4 },
  headerTitle: { fontSize: Typography.lg, color: 'white', fontWeight: '700', flex: 1 },
  flash: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.oliveLight, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  flashText: { fontSize: 11, color: Colors.olive, fontWeight: '600' },
  content: { padding: Spacing.xl, paddingBottom: 80, gap: 10 },
  section: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.07, marginTop: 6 },
  card: { borderRadius: Radius.lg, borderWidth: 0.5, overflow: 'hidden', ...Shadow.sm },
  sep: { height: 0.5 },
  preview: { padding: Spacing.lg, gap: 4 },
  previewText: { fontWeight: '500', lineHeight: 24 },
  previewSub: { lineHeight: 18 },
  fontRow: { flexDirection: 'row', padding: Spacing.md, gap: 8 },
  fontBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: Radius.md, borderWidth: 1.5, gap: 4 },
  fontA: { fontWeight: '700' },
  fontLabel: { fontSize: 11 },
  optRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  optIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optLabel: { fontSize: Typography.base },
  optSub: { fontSize: 11, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' },
  switchRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  note: { fontSize: 11, textAlign: 'center', lineHeight: 16, fontStyle: 'italic', paddingVertical: Spacing.sm },
});
