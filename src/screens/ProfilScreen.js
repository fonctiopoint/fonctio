// src/screens/ProfilScreen.js
// « À propos », dans la direction « Registre ».
//
// Le numéro de version est lu dans app.json, et non recopié : il affichait
// encore 1.0.0 alors que l'app en était à 1.2.0.
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegistre, FILET } from '../theme/registreStyles';
import { TeteDePage, Section, Paragraphe, Numerote, Action } from '../components/registre';
import { SERIF, MONO_LEGER, T, V } from '../theme/registre';
import app from '../../app.json';

const VERSION = app?.expo?.version || '';

// Ce que l'app garantit. Ce ne sont pas des liens : ce sont des engagements, et
// les lire suffit.
const GARANTIES = [
  { icone: 'shield-checkmark-outline', titre: 'Fiches vérifiées et sourcées', texte: 'Chaque fiche cite les textes dont elle sort, renvoyés à Légifrance.' },
  { icone: 'refresh-outline', titre: 'Tenues à jour', texte: "Un texte qui paraît est signalé sur les fiches qu'il concerne, avant même leur réécriture." },
  { icone: 'lock-closed-outline', titre: 'Aucune donnée collectée', texte: 'Pas de compte, pas de suivi, pas de statistiques. Rien ne quitte votre téléphone.' },
  { icone: 'ban-outline', titre: 'Sans publicité', texte: "Aucune publicité, aucun partenariat, aucun contenu sponsorisé." },
];

const RESSOURCES = [
  { titre: 'Légifrance', texte: 'Les textes eux-mêmes, en accès libre.', url: 'https://www.legifrance.gouv.fr' },
  { titre: 'Portail de la Fonction publique', texte: 'Les publications de la DGAFP.', url: 'https://www.fonction-publique.gouv.fr' },
];

export default function ProfilScreen({ navigation }) {
  const ui0 = useRegistre();
  const { th, t, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <View style={s.fil}>
        <View style={s.filRetour}>
          <Text style={[s.filVersant, { fontSize: t(T.num) }]}>VERSION {VERSION}</Text>
        </View>
        <TouchableOpacity
          style={s.reglages}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={17} color={th.textMuted} />
          <Text style={[s.reglagesTexte, { fontSize: t(T.num) }]}>Réglages</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContenu} showsVerticalScrollIndicator={false}>
        <TeteDePage
          ui={ui}
          titre="À propos"
          lede="Fonctio est écrite par un assistant de service social du personnel, pour les agents qu'il accompagne."
        />

        <View style={s.avantSection}><Section ui={ui} titre="Qui écrit ces fiches" /></View>

        <View style={s.auteur}>
          <View style={s.pastille}>
            <Text style={s.pastilleTexte}>F.</Text>
          </View>
          <View style={s.auteurTexte}>
            <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>Florian</Text>
            <Text style={[s.reference, { fontSize: t(T.source), lineHeight: t(T.source) * 1.5 }]}>
              Assistant de service social du personnel · FPE
            </Text>
          </View>
        </View>

        <Paragraphe ui={ui}>
          Je suis assistant de service social du personnel au sein de deux ministères. Mon
          quotidien, c'est accompagner les agents publics dans leurs difficultés
          professionnelles, sociales et personnelles.
        </Paragraphe>
        <Paragraphe ui={ui} style={s.suite}>
          L'objectif de cette application est de permettre à chaque fonctionnaire d'avoir
          accès à une information claire et fiable, tout au long de sa carrière, dans toutes
          les situations.
        </Paragraphe>

        <View style={s.avantSection}><Section ui={ui} titre="Ce que l'app garantit" compte={GARANTIES.length} /></View>
        {GARANTIES.map((g, i) => (
          <Numerote
            key={g.titre}
            ui={ui}
            style={[s.ligne, i === GARANTIES.length - 1 && s.ligneSansFilet]}
            icone={g.icone}
            couleurIcone={C.action}
            titre={g.titre}
            texte={g.texte}
          />
        ))}

        <View style={s.avantSection}><Section ui={ui} titre="Aller plus loin" /></View>
        <Action
          ui={ui}
          titre="Soutenir Fonctio"
          texte={"L'application est développée et maintenue bénévolement, et restera gratuite. "
            + "Aucun abonnement, aucune publicité, aucune obligation."}
          onPress={() => Linking.openURL('https://www.tipeee.com/fonctio')}
        />
        <Action
          ui={ui}
          titre="Se faire accompagner"
          texte={"Votre assistant de service social du personnel répond à toute question, "
            + "personnelle ou professionnelle. Gratuit, confidentiel, sans lien avec votre "
            + "hiérarchie. Ses coordonnées sont sur l'intranet de votre administration ou "
            + "auprès de votre service RH."}
        />

        <View style={s.avantSection}><Section ui={ui} titre="Ressources" compte={RESSOURCES.length} /></View>
        {RESSOURCES.map((r, i) => (
          <Numerote
            key={r.url}
            ui={ui}
            style={[s.ligne, i === RESSOURCES.length - 1 && s.ligneSansFilet]}
            icone="open-outline"
            couleurIcone={C.versant}
            titre={r.titre}
            texte={r.texte}
            fleche
            onPress={() => Linking.openURL(r.url)}
          />
        ))}

        <Text style={[s.mentions, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}>
          Fonctio est une application informative. Les fiches ne constituent pas un conseil
          juridique. En cas de litige, consultez un juriste spécialisé ou votre assistant de
          service social du personnel.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const propre = (th, F) => StyleSheet.create({
  avantSection: { marginTop: V.section },
  reglages: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
  reglagesTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },

  auteur: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: V.ligne, paddingBottom: V.ligneBas },
  pastille: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: FILET, borderColor: F.rubrique, backgroundColor: th.bgWarm,
  },
  pastilleTexte: { fontFamily: SERIF, fontSize: 19, color: th.textPrimary },
  auteurTexte: { flex: 1 },

  suite: { marginTop: 12 },
});
