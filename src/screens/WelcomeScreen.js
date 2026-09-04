// src/screens/WelcomeScreen.js
// Le choix du versant, au premier lancement.
//
// C'est le seul écran qui reste sur le fond ardoise : il prend le relais du
// splash, qui a ce fond-là, et le mot-symbole ne bouge pas d'un pixel entre les
// deux. L'app s'ouvre ensuite sur son fond clair — la nuit puis le jour, plutôt
// qu'un écran clair qui clignote à la place d'un écran sombre.
//
// Sur ce fond, l'encre et les filets du thème ne s'appliquent pas : ils sont
// posés ici en dur, avec la même grammaire que le reste — serif pour le titre,
// chasse fixe pour les sigles, un filet entre deux lignes, aucune carte.
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SERIF, MONO, MONO_LEGER, T, V, INTERLIGNE } from '../theme/registre';
import { ICONE_VERSANT } from '../theme/icones';

const FOND = Colors.slate;
const ENCRE = '#F2EFE9';
const ENCRE_2 = 'rgba(242,239,233,0.62)';
const ENCRE_3 = 'rgba(242,239,233,0.40)';
const FILET = 'rgba(242,239,233,0.14)';
const ACCENT = '#E8B88A';   // le point du mot-symbole, déjà dans le splash

const VERSANTS = [
  {
    id: 'fpe',
    label: "Fonction publique de l'État",
    court: 'FPE',
    desc: 'Ministères, établissements publics nationaux, préfectures…',
  },
  {
    id: 'fpt',
    label: 'Fonction publique territoriale',
    court: 'FPT',
    desc: 'Communes, départements, régions, intercommunalités…',
  },
  {
    id: 'fph',
    label: 'Fonction publique hospitalière',
    court: 'FPH',
    desc: 'Hôpitaux, EHPAD, centres de soins publics…',
  },
];

export default function WelcomeScreen({ onVersantSelected }) {
  const [choisi, setChoisi] = useState(null);
  const opacite = useRef(new Animated.Value(1)).current;

  const valider = () => {
    if (!choisi) return;
    Animated.timing(opacite, { toValue: 0, duration: 400, useNativeDriver: true })
      .start(() => onVersantSelected(choisi));
  };

  return (
    <Animated.View style={[s.fond, { opacity: opacite }]}>
      <StatusBar barStyle="light-content" backgroundColor={FOND} />
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

        <View style={s.haut}>
          <Text style={s.marque}>Fonctio<Text style={s.point}>.</Text></Text>
          <Text style={s.accroche}>Pour une carrière plus claire</Text>
        </View>

        <View style={s.milieu}>
          <Text style={s.oeil}>Vous appartenez à</Text>
          {VERSANTS.map((v, i) => {
            const actif = choisi === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[s.ligne, i === VERSANTS.length - 1 && s.ligneSansFilet]}
                onPress={() => setChoisi(v.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={ICONE_VERSANT[v.id]}
                  size={22}
                  color={actif ? ACCENT : ENCRE_3}
                  style={s.icone}
                />
                <View style={s.texte}>
                  <View style={s.titreRang}>
                    <Text style={[s.label, actif && s.labelActif]}>{v.label}</Text>
                    <Text style={[s.court, actif && s.courtActif]}>{v.court}</Text>
                  </View>
                  <Text style={s.desc}>{v.desc}</Text>
                </View>
                <View style={[s.coche, actif && s.cocheActive]}>
                  {actif && <Ionicons name="checkmark" size={14} color={FOND} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.bas}>
          <TouchableOpacity
            style={[s.bouton, choisi ? s.boutonActif : s.boutonEteint]}
            onPress={valider}
            activeOpacity={0.85}
            disabled={!choisi}
          >
            <Text style={[s.boutonTexte, choisi && s.boutonTexteActif]}>
              {choisi ? 'Accéder' : 'Choisissez votre versant'}
            </Text>
          </TouchableOpacity>
          <Text style={s.note}>
            Vous pourrez en changer à tout moment depuis l'accueil.
          </Text>
        </View>

      </SafeAreaView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  fond: { flex: 1, backgroundColor: FOND },
  safe: { flex: 1, paddingHorizontal: V.zone, justifyContent: 'space-between' },

  haut: { paddingTop: 48, alignItems: 'center' },
  marque: { fontFamily: SERIF, fontSize: 52, color: ENCRE, letterSpacing: -0.5 },
  point: { color: ACCENT },
  accroche: { fontSize: T.lede, color: ENCRE_3, marginTop: 8 },

  milieu: { flex: 1, justifyContent: 'center' },
  oeil: {
    fontSize: T.oeil, fontWeight: '700', letterSpacing: 1.4,
    textTransform: 'uppercase', color: ENCRE_3, marginBottom: 6,
  },

  ligne: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: FILET,
  },
  ligneSansFilet: { borderBottomWidth: 0 },
  // Alignée sur la PREMIÈRE ligne du libellé, pas au centre de la rangée : les
  // descriptions font deux ou trois lignes selon le versant, et une icône
  // centrée se retrouvait plus bas d'une rangée à l'autre.
  icone: { width: 24, textAlign: 'center', marginTop: 1 },
  texte: { flex: 1 },
  titreRang: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  label: { fontSize: T.label, fontWeight: '600', color: ENCRE_2, flex: 1 },
  labelActif: { color: ENCRE },
  court: { fontFamily: MONO_LEGER, fontSize: T.num, color: ENCRE_3, letterSpacing: 1.4 },
  courtActif: { fontFamily: MONO, color: ACCENT },
  desc: { fontSize: T.detail, color: ENCRE_3, lineHeight: T.detail * INTERLIGNE, marginTop: 5 },

  coche: {
    width: 22, height: 22, borderRadius: 11, flexShrink: 0, marginTop: 1,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: FILET,
  },
  cocheActive: { backgroundColor: ACCENT, borderColor: ACCENT },

  bas: { paddingBottom: 24 },
  bouton: { borderRadius: 4, paddingVertical: 17, alignItems: 'center' },
  boutonEteint: { backgroundColor: 'rgba(242,239,233,0.07)' },
  boutonActif: { backgroundColor: ACCENT },
  boutonTexte: { fontFamily: SERIF, fontSize: T.action, color: ENCRE_3 },
  boutonTexteActif: { color: FOND },
  note: { fontSize: T.source, color: ENCRE_3, textAlign: 'center', marginTop: 12 },
});
