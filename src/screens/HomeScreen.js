// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Linking, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow, useTheme } from '../theme';
import { useSettings } from '../utils/SettingsContext';
import { MODULES, searchFiches, NOUVEAUTES, getFicheById } from '../data/fiches';
import {
  getFavoris, getRecent,
  isNouveautesDismissed, dismissNouveautes,
} from '../utils/storage';

const VERSANT_CHIPS = [
  { id: 'fpe', label: 'FPE', icon: '🏛️', color: Colors.terracotta },
  { id: 'fpt', label: 'FPT', icon: '🏙️', color: Colors.sky },
  { id: 'fph', label: 'FPH', icon: '🏥', color: Colors.olive },
];

const VERSANT_LABELS = {
  fpe: 'Fonction publique de l\'État',
  fpt: 'Fonction publique Territoriale',
  fph: 'Fonction publique Hospitalière',
};

// ── Carte fiche compacte (favoris / récents) ────────────────────────────────
const FicheChip = ({ ficheId, onPress }) => {
  const fiche = getFicheById(ficheId);
  const theme = useTheme();
  if (!fiche) return null;
  return (
    <TouchableOpacity style={[fchip.card, { borderLeftColor: fiche.moduleColor, backgroundColor: theme.bgCard }]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[fchip.titre, { color: fiche.moduleColor }]} numberOfLines={2}>{fiche.titre}</Text>
      <Text style={[fchip.cat, { color: theme.textMuted }]} numberOfLines={1}>{fiche.categorie}</Text>
    </TouchableOpacity>
  );
};
const fchip = StyleSheet.create({
  card: { borderRadius: Radius.md, padding: 10, borderLeftWidth: 3, width: 155, ...Shadow.sm },
  titre: { fontSize: 12, fontWeight: '600', lineHeight: 16, marginBottom: 3 },
  cat: { fontSize: 10 },
});

// ── Carte module ────────────────────────────────────────────────────────────
const ModuleCard = ({ module, onPress, highlight = false, theme }) => {
  if (highlight) {
    return (
      <TouchableOpacity style={[styles.moduleCardHighlight, { borderColor: module.color + '55' }]} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.moduleHighlightHeader, { backgroundColor: module.color }]}>
          <Text style={styles.moduleHighlightEmoji}>{module.icon}</Text>
          <View style={styles.moduleHighlightBadge}>
            <Text style={styles.moduleHighlightBadgeText}>Votre interlocuteur social</Text>
          </View>
        </View>
        <View style={[styles.moduleHighlightBody, { backgroundColor: theme.bgCard, borderTopWidth: 0 }]}>
          <Text style={[styles.moduleHighlightTitle, { color: theme.textPrimary }]}>{module.title}</Text>
          <Text style={[styles.moduleHighlightDesc, { color: theme.textMuted }]}>{module.description}</Text>
          <View style={styles.moduleHighlightFooter}>
            <Text style={[styles.moduleHighlightCount, { color: module.color }]}>
              {module.fiches?.length || 0} fiche{module.fiches?.length > 1 ? 's' : ''}
            </Text>
            <View style={[styles.moduleHighlightBtn, { backgroundColor: module.color }]}>
              <Text style={styles.moduleHighlightBtnText}>Consulter →</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.moduleCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
      onPress={onPress} activeOpacity={0.75}
    >
      <View style={[styles.moduleIcon, { backgroundColor: module.bgColor }]}>
        <Text style={styles.moduleIconText}>{module.icon}</Text>
      </View>
      <View style={styles.moduleInfo}>
        <Text style={[styles.moduleName, { color: theme.textPrimary }]}>{module.title}</Text>
        <Text style={[styles.moduleDesc, { color: theme.textMuted }]} numberOfLines={1}>{module.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={[styles.moduleCount, { color: module.color }]}>{module.fiches?.length || 0} fiches</Text>
          {module.updatedAt && <Text style={[styles.moduleUpdated, { color: theme.textMuted }]}>· Màj {module.updatedAt}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
    </TouchableOpacity>
  );
};

// ── Écran principal ─────────────────────────────────────────────────────────
export default function HomeScreen({ navigation, versant, setVersant }) {
  const theme = useTheme();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [nouveautesVisible, setNouveautesVisible] = useState(false);
  const [favoris, setFavoris] = useState([]);
  const [recents, setRecents] = useState([]);

  // Charger l'état persisté au focus
  useFocusEffect(useCallback(() => {
    let mounted = true;
    (async () => {
      const [dismissed, favs, recs] = await Promise.all([
        isNouveautesDismissed(NOUVEAUTES.version),
        getFavoris(),
        getRecent(),
      ]);
      if (!mounted) return;
      const bannerOk = NOUVEAUTES.active && !dismissed && (settings.showNouveautes !== false);
      setNouveautesVisible(bannerOk);
      setFavoris(favs);
      setRecents(recs);
    })();
    return () => { mounted = false; };
  }, [settings.showNouveautes]));    

  const handleDismissNouveautes = async () => {
    await dismissNouveautes(NOUVEAUTES.version);
    setNouveautesVisible(false);
  };

  const filteredModules = MODULES.filter(m => !m.versants || m.versants.includes(versant));
  const regularModules = filteredModules;

  // Depuis la refonte d'août 2026, l'assistant de service social n'est plus un
  // module à lui seul : c'est une fiche du module « Vos interlocuteurs ». On
  // conserve sa mise en avant — c'est le point d'entrée humain de l'app, et
  // souvent la personne qui la recommande.
  const assFiche = getFicheById('role-ass');
  const assCard = assFiche && {
    icon: '🤝',
    color: Colors.olive,
    bgColor: Colors.oliveLight,
    title: 'L\'assistant de service social',
    description: 'Confidentiel, gratuit, indépendant de votre hiérarchie. Il vous accompagne sur toute difficulté, personnelle comme professionnelle.',
    fiches: [assFiche],
  };
  const searchResults = searchQuery.length >= 2 ? searchFiches(searchQuery) : [];
  const isSearching = searchQuery.length >= 2;

  const openFiche = (ficheId) => navigation.navigate('FicheDetail', { ficheId });
  const openModule = (moduleId) => navigation.navigate('Module', { moduleId });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.slate }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.slate} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Fonctio<Text style={styles.dot}>.</Text></Text>
          <Text style={styles.tagline}>Pour une carrière plus claire</Text>
        </View>

        {/* Recherche */}
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Ionicons name="search" size={15} color="rgba(255,255,255,0.45)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une fiche, un droit…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={15} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sélecteur versant */}
        {!isSearching && (
          <View style={styles.versantRow}>
            {VERSANT_CHIPS.map(v => (
              <TouchableOpacity
                key={v.id}
                style={[styles.versantBtn, versant === v.id && { backgroundColor: v.color, borderColor: v.color }]}
                onPress={() => setVersant(v.id)} activeOpacity={0.8}
              >
                <Text style={styles.versantIcon}>{v.icon}</Text>
                <Text style={[styles.versantLabel, versant === v.id && { color: 'white' }]}>{v.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── RECHERCHE ───────────────────────────────────────── */}
        {isSearching ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} pour « {searchQuery} »
            </Text>
            {searchResults.length === 0 ? (
              <View style={[styles.emptySearch, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <Text style={styles.emptySearchIcon}>🔍</Text>
                <Text style={[styles.emptySearchTitle, { color: theme.textPrimary }]}>Aucun résultat</Text>
                <Text style={[styles.emptySearchSub, { color: theme.textMuted }]}>
                  Essayez : CLM, CMO, CITIS, contractuel, reclassement, PSC…
                </Text>
              </View>
            ) : searchResults.map(fiche => (
              <TouchableOpacity
                key={fiche.id}
                style={[styles.searchResult, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                onPress={() => openFiche(fiche.id)} activeOpacity={0.75}
              >
                <View style={[styles.searchResultBar, { backgroundColor: fiche.moduleColor }]} />
                <View style={styles.searchResultInfo}>
                  <Text style={[styles.searchResultCat, { color: theme.textMuted }]}>{fiche.moduleTitle}</Text>
                  <Text style={[styles.searchResultTitle, { color: theme.textPrimary }]}>{fiche.titre}</Text>
                  <Text style={[styles.searchResultResume, { color: theme.textSecondary }]} numberOfLines={2}>{fiche.resume}</Text>
                  <View style={styles.searchChips}>
                    {fiche.chips.slice(0, 2).map(chip => (
                      <View key={chip} style={[styles.searchChip, { backgroundColor: fiche.moduleColor + '22' }]}>
                        <Text style={[styles.searchChipText, { color: fiche.moduleColor }]}>{chip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={15} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {/* ── FAVORIS ──────────────────────────────────────── */}
            {favoris.length > 0 && (
              <View>
                <View style={styles.sectionRow}>
                  <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>⭐ Mes favoris</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('FavorisList', { favoris })}>
                    <Text style={[styles.sectionLink, { color: Colors.sky }]}>Voir tout</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.ficheChipRow}>
                    {favoris.slice(0, 6).map(id => (
                      <FicheChip key={id} ficheId={id} onPress={() => openFiche(id)} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* ── RÉCENTS ──────────────────────────────────────── */}
            {recents.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>🕐 Consultées récemment</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.ficheChipRow}>
                    {recents.map(id => (
                      <FicheChip key={id} ficheId={id} onPress={() => openFiche(id)} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* ── DON ──────────────────────────────────────────── */}
            <TouchableOpacity
              style={styles.donBanner} activeOpacity={0.85}
              onPress={() => Linking.openURL('https://www.tipeee.com/fonctio')}
            >
              <View style={styles.donLeft}>
                <Text style={styles.donEmoji}>☕</Text>
                <View>
                  <Text style={styles.donTitle}>Fonctio est 100 % gratuit</Text>
                  <Text style={[styles.donSub, { color: theme.textMuted }]}>Soutenir le projet sur Tipeee</Text>
                </View>
              </View>
              <Ionicons name="heart" size={16} color={Colors.terracotta} />
            </TouchableOpacity>

            {/* ── NOUVEAUTÉS (persistant) ───────────────────────── */}
            {nouveautesVisible && (
              <View style={[styles.nouveautesBanner, { backgroundColor: theme.bgCard, borderColor: Colors.sky + '44' }]}>
                <View style={styles.nouveautesHeader}>
                  <View style={styles.nouveautesLeft}>
                    <View style={styles.nouveautesBadge}>
                      <Text style={styles.nouveautesBadgeText}>{NOUVEAUTES.version}</Text>
                    </View>
                    <View>
                      <Text style={[styles.nouveautesTitle, { color: theme.textPrimary }]}>{NOUVEAUTES.titre}</Text>
                      <Text style={[styles.nouveautesDate, { color: theme.textMuted }]}>{NOUVEAUTES.date}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={handleDismissNouveautes} style={styles.nouveautesClose}>
                    <Ionicons name="close" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
                {NOUVEAUTES.lignes.map((ligne, i) => (
                  <Text key={i} style={[styles.nouveautesLigne, { color: theme.textSecondary }]}>{ligne}</Text>
                ))}
              </View>
            )}

            {/* ── ASSISTANT SOCIAL — carte mise en valeur ────────── */}
            {assCard && (
              <ModuleCard module={assCard} onPress={() => openFiche('role-ass')} highlight theme={theme} />
            )}

            {/* ── ALERTE RÉFORME ────────────────────────────────── */}
            <TouchableOpacity
              style={styles.banner} activeOpacity={0.85}
              onPress={() => openModule('contractuels')}
            >
              <Text style={styles.bannerEmoji}>⚡</Text>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Réforme CMO — mars 2025</Text>
                <Text style={[styles.bannerSub, { color: theme.textMuted }]}>Primes au prorata du traitement (90 % puis 50 %)</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.amber} />
            </TouchableOpacity>

            {/* ── MODULES ──────────────────────────────────────── */}
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              {VERSANT_LABELS[versant]}
            </Text>
            {regularModules.map(module => (
              <ModuleCard key={module.id} module={module} onPress={() => openModule(module.id)} theme={theme} />
            ))}

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textMuted }]}>Fiches vérifiées et sourcées · Légifrance</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    backgroundColor: Colors.slate,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerTop: {},
  title: { fontSize: 30, color: Colors.white, fontWeight: '700', letterSpacing: -0.5 },
  dot: { color: '#E8B88A' },
  tagline: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: 'transparent',
  },
  searchBarFocused: { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.12)' },
  searchInput: { flex: 1, fontSize: Typography.sm, color: 'white' },

  versantRow: { flexDirection: 'row', gap: 8 },
  versantBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 8, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'transparent',
  },
  versantIcon: { fontSize: 13 },
  versantLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100, gap: 12 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Typography.xs, fontWeight: '500', letterSpacing: 0.07, textTransform: 'uppercase' },
  sectionLink: { fontSize: 12 },

  // Fiches horizontales
  ficheChipRow: { flexDirection: 'row', gap: 8, paddingBottom: 4, paddingTop: 2 },

  // Recherche
  emptySearch: { borderRadius: Radius.lg, padding: Spacing.xxl, alignItems: 'center', borderWidth: 0.5 },
  emptySearchIcon: { fontSize: 36, marginBottom: 10 },
  emptySearchTitle: { fontSize: Typography.md, fontWeight: '600', marginBottom: 4 },
  emptySearchSub: { fontSize: Typography.sm, textAlign: 'center', lineHeight: 18 },
  searchResult: { borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5 },
  searchResultBar: { width: 3, height: 44, borderRadius: 2, flexShrink: 0 },
  searchResultInfo: { flex: 1 },
  searchResultCat: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.05, marginBottom: 2 },
  searchResultTitle: { fontSize: Typography.base, fontWeight: '600', marginBottom: 3 },
  searchResultResume: { fontSize: Typography.sm, lineHeight: 17, marginBottom: 6 },
  searchChips: { flexDirection: 'row', gap: 5 },
  searchChip: { borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  searchChipText: { fontSize: 10, fontWeight: '500' },

  // Don
  donBanner: {
    backgroundColor: Colors.terracottaLight, borderRadius: Radius.md, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(196,103,58,0.2)',
  },
  donLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  donEmoji: { fontSize: 18 },
  donTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.terracottaDark },
  donSub: { fontSize: 11, marginTop: 1 },

  // Nouveautés
  nouveautesBanner: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderLeftWidth: 3, borderLeftColor: Colors.sky, gap: 5 },
  nouveautesHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 },
  nouveautesLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nouveautesBadge: { backgroundColor: Colors.sky, borderRadius: Radius.sm, paddingHorizontal: 7, paddingVertical: 3 },
  nouveautesBadgeText: { fontSize: 10, color: 'white', fontWeight: '700' },
  nouveautesTitle: { fontSize: Typography.sm, fontWeight: '600' },
  nouveautesDate: { fontSize: 11, marginTop: 1 },
  nouveautesClose: { padding: 2 },
  nouveautesLigne: { fontSize: 12, lineHeight: 18 },

  // Module ASS mis en valeur
  moduleCardHighlight: {
    borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, ...Shadow.md,
  },
  moduleHighlightHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
  },
  moduleHighlightEmoji: { fontSize: 28 },
  moduleHighlightBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  moduleHighlightBadgeText: { fontSize: 11, color: 'white', fontWeight: '500' },
  moduleHighlightBody: { padding: Spacing.lg },
  moduleHighlightTitle: { fontSize: Typography.lg, fontWeight: '700', marginBottom: 4 },
  moduleHighlightDesc: { fontSize: Typography.sm, lineHeight: 18, marginBottom: Spacing.md },
  moduleHighlightFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moduleHighlightCount: { fontSize: Typography.sm, fontWeight: '500' },
  moduleHighlightBtn: { borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 7 },
  moduleHighlightBtnText: { fontSize: 12, color: 'white', fontWeight: '600' },

  // Module standard
  moduleCard: { borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, ...Shadow.sm },
  moduleIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  moduleIconText: { fontSize: 20 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: Typography.base, fontWeight: '600', marginBottom: 2 },
  moduleDesc: { fontSize: 11, lineHeight: 15, marginBottom: 3 },
  moduleCount: { fontSize: 11, fontWeight: '500' },
  moduleUpdated: { fontSize: 10 },

  // Bannière réforme
  banner: {
    backgroundColor: Colors.amberLight, borderRadius: Radius.md, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderLeftWidth: 3, borderLeftColor: Colors.amber,
  },
  bannerEmoji: { fontSize: 16 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.terracottaDark },
  bannerSub: { fontSize: 11, marginTop: 1 },

  footer: { alignItems: 'center', paddingVertical: Spacing.md },
  footerText: { fontSize: 11 },
});
