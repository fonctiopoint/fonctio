// src/screens/ProfilScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, useTheme } from '../theme';

const SettingRow = ({ icon, label, sub, onPress, chevron = true, iconBg, theme }) => (
  <TouchableOpacity style={[styles.settingRow, { backgroundColor: theme.bgCard }]} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.settingIcon, { backgroundColor: iconBg || theme.bgWarm }]}>
      <Ionicons name={icon} size={17} color={iconBg ? 'white' : theme.textMuted} />
    </View>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{label}</Text>
      {sub && <Text style={[styles.settingSub, { color: theme.textMuted }]}>{sub}</Text>}
    </View>
    {chevron && <Ionicons name="chevron-forward" size={15} color={theme.textMuted} />}
  </TouchableOpacity>
);

export default function ProfilScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <StatusBar barStyle={theme.statusBar} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderRow}>
            <View>
              <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>À propos</Text>
              <Text style={[styles.pageSub, { color: theme.textMuted }]}>
                Fonctio<Text style={styles.dot}>.</Text> · Version 1.0.0
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.settingsBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.8}
            >
              <Ionicons name="settings-outline" size={18} color={theme.textSecondary} />
              <Text style={[styles.settingsBtnText, { color: theme.textSecondary }]}>Réglages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Carte auteur */}
        <View style={[styles.aboutCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.aboutHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>F.</Text>
            </View>
            <View style={styles.aboutHeaderText}>
              <Text style={[styles.aboutName, { color: theme.textPrimary }]}>Florian</Text>
              <Text style={[styles.aboutRole, { color: theme.textMuted }]}>
                Assistant de service social du personnel · FPE
              </Text>
              <View style={styles.creatorBadge}>
                <Ionicons name="code-slash-outline" size={11} color={Colors.terracotta} />
                <Text style={styles.creatorBadgeText}>Créateur de l'application</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.aboutBody, { color: theme.textSecondary }]}>
            Je suis assistant de service social du personnel au sein de deux ministères. Mon quotidien, c'est accompagner les agents publics dans leurs difficultés professionnelles, sociales et personnelles.
          </Text>
          <Text style={[styles.aboutBody, { color: theme.textSecondary, marginTop: 10 }]}>
            L'objectif de cette application est de permettre à chaque fonctionnaire d'avoir accès à une information claire et fiable, tout au long de sa carrière, dans toutes les situations.
          </Text>
          <Text style={[styles.aboutBody, { color: theme.textMuted, marginTop: 10, fontStyle: 'italic' }]}>
            Cette application vous informe mais ne doit pas se substituer à un accompagnement social par votre assistant de service social du personnel. Pour toute demande relative à votre vie personnelle et professionnelle, n'hésitez pas à le contacter.
          </Text>
        </View>

        {/* Don */}
        <View style={styles.donCard}>
          <View style={styles.donHeader}>
            <Text style={styles.donEmoji}>☕</Text>
            <View>
              <Text style={styles.donTitle}>Soutenir Fonctio<Text style={{ color: '#E8B88A' }}>.</Text></Text>
              <Text style={styles.donSub}>L'application est et restera 100 % gratuite</Text>
            </View>
          </View>
          <Text style={styles.donText}>
            Fonctio est développée et maintenue bénévolement. Si elle vous a été utile, vous pouvez soutenir son développement par un don libre.
          </Text>
          <TouchableOpacity style={styles.donBtn} activeOpacity={0.85} onPress={() => Linking.openURL('https://www.tipeee.com/fonctio')}>
            <Ionicons name="heart" size={16} color="white" />
            <Text style={styles.donBtnText}>Soutenir le projet — don libre</Text>
          </TouchableOpacity>
          <Text style={styles.donNote}>Aucun abonnement · Aucune publicité · Aucune obligation.</Text>
        </View>

        {/* Besoin d'aide */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Besoin d'aide ?</Text>
          <View style={[styles.contactCard, { borderColor: theme.border }]}>
            <View style={styles.contactIconBox}><Text style={styles.contactIconText}>🤝</Text></View>
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: Colors.olive }]}>Votre assistant de service social</Text>
              <Text style={[styles.contactBody, { color: theme.textSecondary }]}>
                Pour toute question personnelle, professionnelle ou sociale : accompagnement gratuit, confidentiel et sans jugement.
              </Text>
              <Text style={[styles.contactBody, { color: theme.textMuted, marginTop: 6, fontStyle: 'italic' }]}>
                Coordonnées disponibles sur l'intranet ou auprès du service RH.
              </Text>
            </View>
          </View>
        </View>

        {/* L'app */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>L'application</Text>
          <View style={[styles.settingsCard, { borderColor: theme.border }]}>
            <SettingRow icon="shield-checkmark-outline" label="Fiches vérifiées et sourcées" sub="Références vers Légifrance" onPress={() => {}} chevron={false} iconBg={Colors.olive} theme={theme} />
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            <SettingRow icon="refresh-outline" label="Mises à jour régulières" sub="Contenu actualisé avec la réglementation" onPress={() => {}} chevron={false} theme={theme} />
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            <SettingRow icon="lock-closed-outline" label="Aucune donnée collectée" sub="Pas de compte, pas de suivi" onPress={() => {}} chevron={false} theme={theme} />
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            <SettingRow icon="ban-outline" label="Sans publicité" sub="Fonctio n'affiche aucune publicité" onPress={() => {}} chevron={false} theme={theme} />
          </View>
        </View>

        {/* Ressources */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Ressources</Text>
          <View style={[styles.settingsCard, { borderColor: theme.border }]}>
            <SettingRow icon="open-outline" label="Légifrance" sub="Toutes nos sources vérifiables" onPress={() => Linking.openURL('https://www.legifrance.gouv.fr')} theme={theme} />
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            <SettingRow icon="globe-outline" label="Portail de la Fonction publique" onPress={() => Linking.openURL('https://www.fonction-publique.gouv.fr')} theme={theme} />
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: theme.textMuted }]}>
            Fonctio est une application informative. Les fiches ne constituent pas un conseil juridique. En cas de litige, consultez un juriste spécialisé ou votre assistant social du personnel.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: 100, gap: 20 },
  pageHeader: { marginBottom: 4 },
  pageHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: Typography.xxl, fontWeight: '700' },
  settingsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  settingsBtnText: { fontSize: 13, fontWeight: '500' },
  pageSub: { fontSize: Typography.sm, marginTop: 2 },
  dot: { color: Colors.terracotta },

  aboutCard: { borderRadius: Radius.lg, padding: Spacing.xl, borderWidth: 0.5, ...Shadow.sm },
  aboutHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: Spacing.lg },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.slate, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: Typography.xl, color: 'white', fontWeight: '700' },
  aboutHeaderText: { flex: 1 },
  aboutName: { fontSize: Typography.lg, fontWeight: '700' },
  aboutRole: { fontSize: Typography.xs, marginTop: 2, marginBottom: 6, lineHeight: 16 },
  creatorBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.terracottaLight, alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  creatorBadgeText: { fontSize: 11, color: Colors.terracotta, fontWeight: '500' },
  aboutBody: { fontSize: Typography.sm, lineHeight: 20 },

  donCard: { backgroundColor: Colors.terracotta, borderRadius: Radius.lg, padding: Spacing.xl, ...Shadow.md },
  donHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md },
  donEmoji: { fontSize: 28 },
  donTitle: { fontSize: Typography.lg, fontWeight: '700', color: 'white' },
  donSub: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  donText: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: Spacing.lg },
  donBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: Spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  donBtnText: { fontSize: Typography.base, color: 'white', fontWeight: '600' },
  donNote: { fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: Spacing.sm },

  section: { gap: 10 },
  sectionTitle: { fontSize: Typography.xs, fontWeight: '500', letterSpacing: 0.07, textTransform: 'uppercase' },

  contactCard: { backgroundColor: Colors.oliveLight, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 0.5 },
  contactIconBox: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.olive, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactIconText: { fontSize: 20 },
  contactText: { flex: 1 },
  contactTitle: { fontSize: Typography.base, fontWeight: '600', marginBottom: 6 },
  contactBody: { fontSize: Typography.sm, lineHeight: 19 },

  settingsCard: { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 0.5, ...Shadow.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  settingIcon: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: Typography.base },
  settingSub: { fontSize: 11, marginTop: 1 },
  separator: { height: 0.5, marginLeft: 58 },

  disclaimer: { paddingTop: Spacing.sm },
  disclaimerText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
