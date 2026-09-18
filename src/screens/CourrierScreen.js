// src/screens/CourrierScreen.js
// ─────────────────────────────────────────────────────────────────────────────
// Un modèle de courrier, prêt à partir. Même direction « Registre » que la
// fiche dont il vient : voir src/theme/registre.js et src/components/registre.js.
//
// Deux points de vigilance si on y touche :
//   — L'EXPORT NE PASSE QUE PAR DES API DU CŒUR DE REACT NATIVE (Linking et
//     Share). C'est délibéré : un module natif — presse-papiers, composeur de
//     courriel, partage de fichier — imposerait une nouvelle build du binaire,
//     et la fonctionnalité ne pourrait plus partir en mise à jour OTA. Tant
//     qu'on s'en tient à Linking et Share, elle atteint les agents déjà
//     équipés, sans passer par le magasin.
//   — mailto: transporte le courrier dans une URL. Les messageries tolèrent
//     mal les très longs corps, et l'encodage des accents double la taille.
//     D'où le second bouton : si la messagerie ne s'ouvre pas, « Envoyer
//     autrement » passe par la feuille de partage, qui n'a pas cette limite.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useContext } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, Linking, Share, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistre, FILET } from '../theme/registreStyles';
import {
  Fil, TeteDePage, Section, BlocFilet, Paragraphe, Action, couperSource,
} from '../components/registre';
import { MONO_LEGER, T } from '../theme/registre';
import { getFicheById } from '../data/fiches';
import { courriersDeLaFiche, MOTIF_ZONE } from '../data/courriers';
import { VersantContext } from '../navigation/VersantContext';

const VERSANT_COURT = { fpe: 'FPE', fpt: 'FPT', fph: 'FPH' };

const deuxChiffres = (n) => String(n).padStart(2, '0');

// Le corps du courrier, zones à compléter mises en évidence. Un seul <Text>
// englobant : c'est lui qui porte l'interligne, et des <Text> imbriqués
// héritent de sa mise en page sans casser le fil du paragraphe.
//
// On ne teste PAS la zone avec MOTIF_ZONE.test() : l'expression est globale,
// donc à état, et un test sur deux renverrait faux.
const Corps = ({ ui, texte }) => {
  const { s, t, inter, C } = ui;
  const morceaux = texte.split(MOTIF_ZONE);
  return (
    <Text style={[s.corps, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
      {morceaux.map((p, i) => (
        p.startsWith('[') && p.endsWith(']')
          ? <Text key={i} style={[s.zone, { color: C.valeur }]}>{p}</Text>
          : <Text key={i}>{p}</Text>
      ))}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function CourrierScreen({ navigation, route }) {
  const { ficheId, courrierIndex = 0, moduleTitle } = route.params || {};
  const { versant } = useContext(VersantContext);
  const ui0 = useRegistre();

  const fiche = getFicheById(ficheId);
  const courriers = courriersDeLaFiche(ficheId, versant);
  const courrier = courriers[courrierIndex];

  if (!fiche || !courrier) return null;

  const { th, t, inter, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  const ouvrirMessagerie = async () => {
    const url = `mailto:?subject=${encodeURIComponent(courrier.objet)}`
      + `&body=${encodeURIComponent(courrier.corps)}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      // Pas de messagerie configurée, ou corps trop long pour elle. On ne perd
      // pas le courrier : la feuille de partage reste ouverte à l'agent.
      Alert.alert(
        'Messagerie indisponible',
        "Aucune application de messagerie n'a pu être ouverte sur cet appareil. "
        + "Utilisez « Envoyer autrement » : vous pourrez y choisir votre messagerie "
        + 'ou copier le texte.',
        [{ text: 'Fermer' }],
      );
    }
  };

  const envoyerAutrement = async () => {
    try {
      await Share.share({
        message: `Objet : ${courrier.objet}\n\n${courrier.corps}`,
        title: courrier.objet,
      });
    } catch (e) {
      // L'agent a fermé la feuille de partage : rien à signaler.
    }
  };

  // ── Construction du défilement ────────────────────────────────────────────
  // Mêmes règles que la fiche : les titres de section sont collants, donc
  // enfants directs du ScrollView, et leurs index sont relevés au fil de l'eau.
  const enfants = [];
  const collants = [];
  const pousser = (noeud) => { enfants.push(noeud); };
  const poserSection = (titre) => {
    enfants.push(<View key={`esp-${titre}`} style={s.espaceSection} />);
    collants.push(enfants.length);
    enfants.push(<Section key={`sec-${titre}`} ui={ui} titre={titre} />);
  };

  pousser(
    <TeteDePage
      key="tete"
      ui={ui}
      module="Modèle de courrier"
      couleurModule={C.action}
      rang={courriers.length > 1
        ? `${deuxChiffres(courrierIndex + 1)} / ${deuxChiffres(courriers.length)}`
        : null}
      titre={courrier.titre}
      lede={`À adapter à votre situation, puis à envoyer depuis votre messagerie. `
        + `Les passages en couleur sont à compléter.`}
    />
  );

  // ── À qui l'adresser ──────────────────────────────────────────────────────
  poserSection("À qui l'adresser");
  pousser(<Paragraphe key="aqui" ui={ui} style={s.premierParagraphe}>{courrier.aQui}</Paragraphe>);

  // ── Le courrier ───────────────────────────────────────────────────────────
  poserSection('Le courrier');
  pousser(
    <View key="objet" style={s.objet}>
      <Text style={[s.oeil, { fontSize: t(T.oeil) }]}>Objet du message</Text>
      <Text style={[s.objetTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
        {courrier.objet}
      </Text>
    </View>
  );
  pousser(
    <View key="corps" style={s.feuille}>
      <Corps ui={ui} texte={courrier.corps} />
    </View>
  );

  // ── Avant d'envoyer ───────────────────────────────────────────────────────
  // Ces rappels s'adressent à l'agent et ne partent jamais dans le courrier.
  // Leur référence de texte est démotée comme ailleurs dans l'app.
  pousser(
    <BlocFilet key="rappels" ui={ui} couleur={C.attention} titre="Avant d'envoyer">
      {courrier.rappels.map((r, i) => {
        const { texte, reference } = couperSource(r);
        return (
          <View key={i} style={[s.point, i > 0 && s.pointSuivant]}>
            <Text style={[s.pointNum, { color: C.attention, fontSize: t(T.valeur) }]}>
              {deuxChiffres(i + 1)}
            </Text>
            <View style={s.pointCorps}>
              <Text style={[s.detail, s.pointTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
                {texte}
              </Text>
              {!!reference && (
                <Text style={[s.reference, { fontSize: t(T.source), lineHeight: t(T.source) * 1.5 }]}>
                  {reference}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </BlocFilet>
  );

  // ── Envoyer ───────────────────────────────────────────────────────────────
  poserSection('Envoyer');
  pousser(
    <Action
      key="mail"
      ui={ui}
      titre="Ouvrir dans ma messagerie"
      texte="Le courrier s'ouvre dans votre application de messagerie, objet et texte déjà remplis. Vous le complétez et l'envoyez depuis votre propre adresse."
      onPress={ouvrirMessagerie}
    />
  );
  pousser(
    <Action
      key="partage"
      ui={ui}
      titre="Envoyer autrement"
      texte="Si votre messagerie ne s'ouvre pas, ou pour transmettre le texte à quelqu'un d'autre — votre assistant de service social, par exemple."
      onPress={envoyerAutrement}
    />
  );

  pousser(
    <Text key="mentions" style={[s.mentions, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}>
      Modèle informatif, à adapter à votre situation. Il ne remplace pas un accompagnement par
      votre assistant de service social du personnel ni un conseil juridique.
    </Text>
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <Fil
        ui={ui}
        titre={fiche.titre}
        onRetour={() => navigation.goBack()}
        versant={VERSANT_COURT[versant] || versant}
      />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContenu}
        stickyHeaderIndices={collants}
        showsVerticalScrollIndicator={false}
      >
        {enfants}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ce qui n'appartient qu'au courrier. Tout le reste vient de la feuille commune.
// ─────────────────────────────────────────────────────────────────────────────
const propre = (th, F) => StyleSheet.create({
  premierParagraphe: { marginTop: 14 },

  objet: { marginTop: 16 },
  objetTexte: { color: th.textPrimary, fontWeight: '600', marginTop: 6 },

  // La feuille : le courrier est un objet à part dans l'écran, pas un
  // paragraphe de plus. Un filet l'encadre — c'est ce qui se lit comme « ceci
  // est le texte qui partira », par opposition aux conseils qui l'entourent.
  feuille: {
    marginTop: 16, padding: 16,
    borderWidth: FILET, borderColor: F.rubrique,
  },
  corps: { color: th.textSecondary },
  // Les zones à compléter passent en chasse fixe : elles ne se lisent pas comme
  // la phrase qui les porte, elles se repèrent.
  zone: { fontFamily: MONO_LEGER },

  point: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  pointSuivant: { marginTop: 16 },
  pointNum: { fontFamily: MONO_LEGER, flexShrink: 0 },
  pointCorps: { flex: 1 },
  pointTexte: { marginTop: 0 },
});
