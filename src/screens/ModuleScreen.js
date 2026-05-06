// src/screens/ModuleScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { getModuleById } from '../data/fiches';

export default function ModuleScreen({ navigation, route }) {
  const { moduleId } = route.params;
  const module = getModuleById(moduleId);

  if (!module) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: module.color }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={module.color} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: module.color }]}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.8)" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerIcon}>{module.icon}</Text>
          <View>
            <Text style={styles.headerTitle}>{module.title}</Text>
            <Text style={styles.headerSub}>{module.fiches?.length || 0} fiches disponibles</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {module.fiches?.map((fiche, index) => (
          <TouchableOpacity
            key={fiche.id}
            style={styles.ficheCard}
            onPress={() => navigation.navigate('FicheDetail', {
              ficheId: fiche.id,
              moduleId: module.id,
              ficheIndex: index,
              ficheTotal: module.fiches.length,
              moduleTitle: module.title,
            })}
            activeOpacity={0.75}
          >
            <View style={styles.ficheNum}>
              <Text style={[styles.ficheNumText, { color: module.color }]}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.ficheInfo}>
              <Text style={styles.ficheTitre}>{fiche.titre}</Text>
              <Text style={styles.ficheResume} numberOfLines={2}>{fiche.resume}</Text>
              <View style={styles.chips}>
                {fiche.chips.slice(0, 3).map(chip => (
                  <View key={chip} style={[styles.chip, { backgroundColor: module.bgColor }]}>
                    <Text style={[styles.chipText, { color: module.color }]}>{chip}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.slateLight} />
          </TouchableOpacity>
        ))}

        {module.isPro && (
          <View style={styles.proCard}>
            <Text style={styles.proIcon}>🔒</Text>
            <Text style={styles.proTitle}>Module Pro</Text>
            <Text style={styles.proText}>Ce module est disponible dans la version Pro de Fonctio.</Text>
            <TouchableOpacity style={styles.proBtn} activeOpacity={0.8}>
              <Text style={styles.proBtnText}>Passer à Pro — 1,99€/mois</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md },
  backText: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { fontSize: 32 },
  headerTitle: { fontSize: Typography.xl, color: Colors.white, fontWeight: Typography.semibold },
  headerSub: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  scroll: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },

  ficheCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  ficheNum: { paddingTop: 2 },
  ficheNumText: { fontSize: 13, fontWeight: Typography.semibold, fontVariant: ['tabular-nums'] },
  ficheInfo: { flex: 1 },
  ficheTitre: { fontSize: Typography.base, fontWeight: Typography.medium, color: Colors.slate, marginBottom: 4 },
  ficheResume: { fontSize: Typography.sm, color: Colors.slateMid, lineHeight: 18, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: 10, fontWeight: Typography.medium },

  proCard: {
    backgroundColor: Colors.amberLight,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.amber,
    marginTop: Spacing.md,
  },
  proIcon: { fontSize: 32, marginBottom: 8 },
  proTitle: { fontSize: Typography.lg, fontWeight: Typography.semibold, color: Colors.slate, marginBottom: 4 },
  proText: { fontSize: Typography.sm, color: Colors.slateMid, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 20 },
  proBtn: {
    backgroundColor: Colors.amber,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
  },
  proBtnText: { fontSize: Typography.base, color: Colors.white, fontWeight: Typography.semibold },
});
