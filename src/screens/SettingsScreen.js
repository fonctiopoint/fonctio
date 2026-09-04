// src/screens/SettingsScreen.js
// Les réglages, dans la direction « Registre ».
//
// L'aperçu de la taille du texte est un vrai extrait de fiche, composé avec les
// styles réels : un « Aa » ne dit rien de ce que donnera une explication de six
// lignes, qui est ce qu'on lit vraiment dans cette app.
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegistre, FILET } from '../theme/registreStyles';
import { Fil, TeteDePage, Section, Paragraphe } from '../components/registre';
import { MONO, MONO_LEGER, T, V } from '../theme/registre';
import { useSettings } from '../utils/SettingsContext';

const TAILLES = [
  { id: 'small', label: 'Petite' },
  { id: 'normal', label: 'Normale' },
  { id: 'large', label: 'Grande' },
];

const AFFICHAGE = [
  { id: 'auto', label: 'Automatique', sub: 'Suit le réglage du téléphone', icone: 'contrast-outline' },
  { id: 'light', label: 'Clair', sub: 'Toujours sur fond papier', icone: 'sunny-outline' },
  { id: 'dark', label: 'Sombre', sub: 'Toujours sur fond nuit', icone: 'moon-outline' },
];

export default function SettingsScreen({ navigation }) {
  const ui0 = useRegistre();
  const { settings, updateSetting } = useSettings();
  const [enregistre, setEnregistre] = useState(false);

  const changer = (cle, valeur) => {
    updateSetting(cle, valeur);
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 1200);
  };

  const { th, t, inter, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <Fil
        ui={ui}
        titre="À propos"
        onRetour={() => navigation.goBack()}
        droite={enregistre ? (
          <View style={s.enregistre}>
            <Ionicons name="checkmark" size={13} color={C.action} />
            <Text style={[s.enregistreTexte, { color: C.action, fontSize: t(T.num) }]}>Enregistré</Text>
          </View>
        ) : null}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContenu} showsVerticalScrollIndicator={false}>
        <TeteDePage
          ui={ui}
          titre="Réglages"
          lede="Ils sont gardés sur votre téléphone, et nulle part ailleurs."
        />

        <View style={s.avantSection}><Section ui={ui} titre="Taille du texte" /></View>

        <View style={s.apercu}>
          <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>
            Jour de carence
          </Text>
          <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
            Applicable au premier jour de chaque arrêt (sauf accident de service, longue
            maladie, 3e arrêt pour la même pathologie dans les 12 mois).
          </Text>
        </View>

        <View style={s.choix}>
          {TAILLES.map(opt => {
            const actif = settings.fontSize === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[s.choixPart, actif && s.choixPartActive]}
                onPress={() => changer('fontSize', opt.id)}
                activeOpacity={0.7}
              >
                <Text style={[s.choixTexte, { fontSize: t(T.valeur) }, actif && s.choixTexteActif]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.avantSection}><Section ui={ui} titre="Affichage" /></View>
        {AFFICHAGE.map((opt, i) => {
          const actif = settings.darkMode === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[s.option, i === AFFICHAGE.length - 1 && s.ligneSansFilet]}
              onPress={() => changer('darkMode', opt.id)}
              activeOpacity={0.7}
            >
              <Ionicons name={opt.icone} size={20} color={actif ? C.valeur : th.textMuted} style={s.optionIcone} />
              <View style={s.optionTexte}>
                <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{opt.label}</Text>
                <Text style={[s.detail, s.optionSub, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
                  {opt.sub}
                </Text>
              </View>
              <View style={[s.coche, actif && { backgroundColor: C.valeur, borderColor: C.valeur }]}>
                {actif && <Ionicons name="checkmark" size={13} color={th.bgCard} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={s.avantSection}><Section ui={ui} titre="Accueil" /></View>
        <View style={[s.option, s.ligneSansFilet]}>
          <Ionicons name="megaphone-outline" size={20} color={th.textMuted} style={s.optionIcone} />
          <View style={s.optionTexte}>
            <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>
              Bandeau des nouveautés
            </Text>
            <Text style={[s.detail, s.optionSub, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
              Ce qui a changé dans les fiches, en haut de l'accueil.
            </Text>
          </View>
          <Switch
            value={settings.showNouveautes}
            onValueChange={(v) => changer('showNouveautes', v)}
            trackColor={{ false: F.rubrique, true: C.valeur }}
            thumbColor={th.bgCard}
          />
        </View>

        <Paragraphe ui={ui} style={s.note}>
          Fonctio ne crée aucun compte et n'envoie rien nulle part. Vos favoris, vos fiches
          récentes et ces réglages restent sur cet appareil.
        </Paragraphe>
      </ScrollView>
    </SafeAreaView>
  );
}

const propre = (th, F) => StyleSheet.create({
  avantSection: { marginTop: V.section },
  enregistre: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 6 },
  enregistreTexte: { fontFamily: MONO_LEGER, letterSpacing: 0.6, textTransform: 'uppercase' },

  // L'aperçu est un extrait de fiche véritable, avec les styles véritables.
  apercu: { paddingTop: V.ligne, paddingBottom: V.ligneBas },

  choix: {
    flexDirection: 'row',
    backgroundColor: th.bgWarm, borderRadius: 3,
    borderWidth: FILET, borderColor: F.rubrique, overflow: 'hidden',
  },
  choixPart: { flex: 1, alignItems: 'center', paddingVertical: 11 },
  choixPartActive: { backgroundColor: th.bgCard },
  choixTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.8 },
  choixTexteActif: { fontFamily: MONO, color: th.textPrimary },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: V.ligne, paddingBottom: V.ligneBas,
    borderBottomWidth: FILET, borderBottomColor: F.ligne,
  },
  optionIcone: { width: 22, textAlign: 'center' },
  optionTexte: { flex: 1 },
  optionSub: { marginTop: 4 },
  coche: {
    width: 22, height: 22, borderRadius: 11, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: FILET, borderColor: F.rubrique,
  },

  note: { marginTop: V.section, textAlign: 'center' },
});
