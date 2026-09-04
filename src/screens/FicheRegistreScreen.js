// src/screens/FicheRegistreScreen.js
// ─────────────────────────────────────────────────────────────────────────────
// Présentation « Registre » d'une fiche. Voir src/theme/registre.js pour les
// règles du système, src/theme/registreStyles.js pour la feuille commune,
// src/components/registre.js pour les blocs partagés, et src/data/synthese.js
// pour la surcouche éditoriale.
//
// C'est la présentation de TOUTES les fiches depuis le 02/09/2026. Elle a été
// construite puis jugée sur l'appareil sur la seule fiche du congé maladie
// ordinaire — la plus longue du jeu de données, donc le pire cas — avant d'être
// généralisée aux 43. L'écran précédent (FicheDetailScreen.js, cartes et
// accordéons) a été supprimé ; il est dans l'historique git si besoin.
//
// Deux points de vigilance si on y touche :
//   — les titres de section sont COLLANTS : ils doivent rester des enfants
//     directs du ScrollView, et leurs index sont relevés au fil de la
//     construction du tableau `enfants`. Envelopper un titre dans une View
//     casse le collage et décale tous les index suivants.
//   — le CONTENU de la fiche n'est ni tronqué ni replié. Seule la notice de
//     veille juridique se replie : elle est posée par-dessus la fiche, elle
//     n'en fait pas partie, et dépliée elle occupait deux écrans avant le
//     premier droit.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegistre, FILET } from '../theme/registreStyles';
import {
  Fil, TeteDePage, Section, BlocFilet, Paragraphe, Numerote, Action,
} from '../components/registre';
import { SERIF, MONO_LEGER, T } from '../theme/registre';
import { getFicheById, MODULES } from '../data/fiches';
import { getMajsForFiche } from '../data/veille';
import { getSynthese } from '../data/synthese';
import { VersantContext } from '../navigation/VersantContext';
import { addFavori, removeFavori, isFavori, addRecent } from '../utils/storage';
import { partagerFiche } from '../utils/partageFiche';

const VERSANT_LONG = {
  fpe: "fonction publique d'État",
  fpt: 'fonction publique territoriale',
  fph: 'fonction publique hospitalière',
};
const VERSANT_COURT = { fpe: 'FPE', fpt: 'FPT', fph: 'FPH' };

const formatDateFr = (iso) => {
  if (!iso) return '';
  const [a, m, j] = iso.split('-');
  return j && m && a ? `${j}/${m}/${a}` : iso;
};

const deuxChiffres = (n) => String(n).padStart(2, '0');

// La référence qui clôt une explication passe en chasse fixe, sous
// l'explication. On ne coupe que si « Source : » ouvre bien la DERNIÈRE phrase
// — d'où le plafond de longueur : au-delà, ce qui suit est du texte de lecture
// qu'il serait faux de composer comme une référence. En cas de doute on ne
// coupe pas : la phrase reste alors dans l'explication, elle n'est jamais
// perdue.
const LONGUEUR_MAX_REFERENCE = 110;

const couperSource = (detail) => {
  if (!detail) return { texte: detail, reference: null };
  const i = Math.max(detail.lastIndexOf('Source : '), detail.lastIndexOf('Sources : '));
  if (i < 0) return { texte: detail, reference: null };
  const reference = detail.slice(detail.indexOf(':', i) + 1).trim().replace(/\.$/, '');
  if (reference.length > LONGUEUR_MAX_REFERENCE) return { texte: detail, reference: null };
  return { texte: detail.slice(0, i).trim(), reference };
};

// Au-delà de cette longueur, la valeur ne tient plus à droite du libellé sur un
// écran de téléphone : elle passe sous lui. Elle n'est jamais tronquée.
// 22 et non 24 : « Aucune — allocations CAF » tenait tout juste sur cet écran
// et débordait sur un plus étroit. Se tromper vers le bas ne coûte qu'une
// valeur passée à la ligne ; se tromper vers le haut coupe le texte.
const SEUIL_VALEUR_LONGUE = 22;

const pourCeVersant = (liste, versant) =>
  (liste || []).filter(x => !x || typeof x !== 'object' || !x.versants || x.versants.includes(versant));

// La ligne à deux niveaux, propre à la fiche : elle sait couper la référence
// qui clôt une explication et faire passer une valeur trop longue sous son
// libellé.
const Ligne = ({ ui, label, valeur, detail, derniere }) => {
  const { s, t, inter, C } = ui;
  const { texte, reference } = couperSource(detail);
  const dessous = (valeur || '').length > SEUIL_VALEUR_LONGUE;
  return (
    <View style={[s.ligne, derniere && s.ligneSansFilet]}>
      <View style={s.ligneHaut}>
        <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{label}</Text>
        {!!valeur && !dessous && (
          <Text style={[s.valeur, { color: C.valeur, fontSize: t(T.valeur) }]}>{valeur}</Text>
        )}
      </View>
      {!!valeur && dessous && (
        <Text style={[s.valeur, s.valeurDessous, { color: C.valeur, fontSize: t(T.valeur) }]}>{valeur}</Text>
      )}
      {!!texte && (
        <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>{texte}</Text>
      )}
      {!!reference && (
        <Text style={[s.reference, { fontSize: t(T.source), lineHeight: t(T.source) * 1.5 }]}>{reference}</Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function FicheRegistreScreen({ navigation, route }) {
  const { ficheId, ficheIndex, ficheTotal, moduleTitle } = route.params || {};
  const fiche = getFicheById(ficheId);
  const { versant } = useContext(VersantContext);
  const [favori, setFavori] = useState(false);
  const [veilleOuverte, setVeilleOuverte] = useState(false);
  const ui0 = useRegistre();

  useEffect(() => {
    if (!fiche) return;
    addRecent(ficheId);
    isFavori(ficheId).then(setFavori);
  }, [ficheId]);

  // Dernier hook passé — la sortie anticipée est sûre à partir d'ici.
  if (!fiche) return null;

  const { th, t, inter, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  const module = fiche.moduleColor;
  const synthese = getSynthese(ficheId, versant);
  const droits = (fiche.droits || []).filter(d => !d.versants || d.versants.includes(versant));
  const etapes = pourCeVersant(fiche.etapes, versant);
  const pieges = pourCeVersant(fiche.pieges, versant);
  const versantNote = fiche.versantNotes?.[versant];
  const majs = getMajsForFiche(ficheId, versant);
  const hasPosition = ficheIndex !== undefined && ficheTotal !== undefined;

  const toggleFavori = async () => {
    if (favori) { await removeFavori(ficheId); setFavori(false); }
    else { await addFavori(ficheId); setFavori(true); }
  };

  const FICHE_TO_REGIME = {
    cmo: { statut: 'titulaire', regime: 'cmo' },
    clm: { statut: 'titulaire', regime: 'clm' },
    cld: { statut: 'titulaire', regime: 'cld' },
    tpt: { statut: 'titulaire', regime: 'tpt' },
    'at-service': { statut: 'titulaire', regime: 'citis' },
    'cmo-contractuels': { statut: 'contractuel', regime: 'cmo_c' },
    cgm: { statut: 'contractuel', regime: 'cgm' },
    'at-contractuels': { statut: 'contractuel', regime: 'at_c' },
  };
  const simulerParams = FICHE_TO_REGIME[ficheId];

  const allerVers = (delta) => {
    const mod = MODULES.find(m => m.fiches?.some(f => f.id === ficheId));
    if (!mod) return;
    const cible = mod.fiches[ficheIndex + delta];
    if (!cible) return;
    navigation.replace('FicheDetail', {
      ficheId: cible.id, moduleId: mod.id,
      ficheIndex: ficheIndex + delta, ficheTotal, moduleTitle,
    });
  };

  // ── Construction du défilement ────────────────────────────────────────────
  // Les index des titres collants sont relevés au fil de l'eau : c'est le seul
  // moyen de les garder justes quand une section est absente. L'écart au-dessus
  // d'un titre est un intercalaire, jamais une marge : React Native fige le
  // titre AVEC sa marge, et le contenu défilerait visiblement dans cet espace.
  const enfants = [];
  const collants = [];
  const pousser = (noeud) => { enfants.push(noeud); };
  const poserSection = (titre) => {
    enfants.push(<View key={`esp-${titre}`} style={s.espaceSection} />);
    collants.push(enfants.length);
    enfants.push(<Section key={`sec-${titre}`} ui={ui} titre={titre} />);
  };

  // Tête : bandeau de module, titre, résumé, public concerné, trois chiffres.
  pousser(
    <TeteDePage
      key="tete"
      ui={ui}
      module={moduleTitle || fiche.categorie}
      couleurModule={module}
      rang={hasPosition ? `${deuxChiffres(ficheIndex + 1)} / ${deuxChiffres(ficheTotal)}` : null}
      titre={fiche.titre}
      lede={fiche.resume}
      enfants={
        <>
          {!!fiche.ciblePublic && (
            <View style={s.concerne}>
              <Text style={[s.oeil, { fontSize: t(T.oeil), marginBottom: 5 }]}>Concerne</Text>
              <Text style={[s.detail, s.concerneTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
                {fiche.ciblePublic}
              </Text>
            </View>
          )}
          {!!synthese?.chiffres?.length && (
            <View style={s.synthese}>
              {synthese.chiffres.map((c, i) => (
                <View key={i} style={s.syntheseCase}>
                  <Text style={[s.syntheseN, { color: C.valeur, fontSize: t(T.chiffre) }]}>{c.n}</Text>
                  <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>{c.c}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      }
    />
  );

  // Veille juridique — un texte paru que la fiche ne reflète pas encore.
  // Repliée par défaut quand elle annonce quelque chose : son résumé fait
  // plusieurs centaines de mots et n'a pas à s'interposer entre le lecteur et
  // la fiche. Le titre de l'évolution, lui, reste toujours visible.
  if (majs?.length) {
    const enAttente = majs.filter(m => !m.integre);
    const alerte = enAttente.length > 0;
    const teinte = alerte ? C.attention : C.versant;
    const titreBloc = alerte
      ? `${enAttente.length} évolution${enAttente.length > 1 ? 's' : ''} à connaître`
      : `À jour au ${formatDateFr(majs[0].vigueur || majs[0].date)}`;
    pousser(
      <View key="veille" style={[s.blocFilet, s.veille, { borderLeftColor: teinte }]}>
        <TouchableOpacity onPress={() => setVeilleOuverte(o => !o)} activeOpacity={0.7} disabled={!alerte}>
          <View style={s.veilleTete}>
            <Text style={[s.blocFiletTitre, s.veilleTitre, { color: teinte, fontSize: t(T.oeil) }]}>
              {titreBloc}
            </Text>
            {alerte && (
              <Ionicons name={veilleOuverte ? 'chevron-up' : 'chevron-down'} size={14} color={teinte} />
            )}
          </View>
        </TouchableOpacity>

        {alerte && !veilleOuverte && (
          <Paragraphe ui={ui}>
            {enAttente[0].titre} — le texte ci-dessous ne l'intègre pas encore.
          </Paragraphe>
        )}

        {(veilleOuverte || !alerte) && majs.map(maj => (
          <View key={maj.id} style={s.maj}>
            <Text style={[s.majTitre, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{maj.titre}</Text>
            <Paragraphe ui={ui}>{maj.resume}</Paragraphe>
            <View style={s.majMeta}>
              {!!maj.vigueur && (
                <Text style={[s.reference, { fontSize: t(T.source) }]}>
                  En vigueur le {formatDateFr(maj.vigueur)}
                </Text>
              )}
              {!!maj.rectificatif && (
                <Text style={[s.reference, { color: C.attention, fontSize: t(T.source) }]}>
                  Rectificatif du {formatDateFr(maj.rectificatif)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              disabled={!maj.source?.url}
              onPress={() => maj.source?.url && Linking.openURL(maj.source.url)}
              activeOpacity={0.7}
            >
              <Text style={[
                s.reference,
                { fontSize: t(T.source), lineHeight: t(T.source) * 1.6 },
                maj.source?.url && { color: C.versant },
              ]}>
                {maj.source?.texte}{maj.source?.url ? '  ↗' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  // ── Les droits ────────────────────────────────────────────────────────────
  // Le libellé par défaut suppose des montants. Il est faux sur les fiches qui
  // décrivent des garanties ou un rôle : synthese.js le surcharge alors.
  if (droits.length) {
    poserSection(synthese?.droits?.label || 'Ce que vous percevez');
    droits.forEach((d, i) => pousser(
      <Ligne
        key={`droit-${i}`}
        ui={ui}
        label={d.label}
        valeur={d.valeur}
        detail={d.detail}
        derniere={i === droits.length - 1}
      />
    ));
    // La note du versant clôt la section : elle ne vaut que pour les droits
    // qu'on vient de lire.
    if (versantNote) {
      pousser(
        <BlocFilet key="versant" ui={ui} couleur={C.versant}
                   titre={`Pour vous — ${VERSANT_LONG[versant] || versant}`}>
          <Paragraphe ui={ui}>{versantNote}</Paragraphe>
        </BlocFilet>
      );
    }
  }

  // ── Récapitulatif ─────────────────────────────────────────────────────────
  const tableau = fiche.tableaux?.[versant]
    || fiche[`tableau${versant.charAt(0).toUpperCase()}${versant.slice(1)}`]
    || (fiche.tableau && (!fiche.tableau.versants || fiche.tableau.versants.includes(versant)) ? fiche.tableau : null);

  if (tableau) {
    poserSection(tableau.titre || 'Récapitulatif');
    pousser(
      <View key="tableau" style={s.tableau}>
        <View style={[s.tableauLigne, s.tableauTete]}>
          {tableau.colonnes.map((col, i) => (
            <Text
              key={i}
              style={[s.tableauEntete, { flex: col.flex || 1, fontSize: t(T.oeil) }]}
              adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={2}
            >
              {col.label}
            </Text>
          ))}
        </View>
        {tableau.lignes.map((ligne, i) => (
          <View key={i} style={[s.tableauLigne, i === tableau.lignes.length - 1 && s.ligneSansFilet]}>
            {ligne.map((cell, j) => (
              <Text
                key={j}
                style={[
                  j === 0 ? s.tableauCelluleTete : s.tableauCellule,
                  { flex: tableau.colonnes[j]?.flex || 1, fontSize: t(T.valeur) },
                ]}
                adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={3}
              >
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  }

  // ── La démarche ───────────────────────────────────────────────────────────
  if (etapes.length) {
    poserSection('La démarche');
    etapes.forEach((e, i) => pousser(
      <Numerote
        key={`etape-${i}`}
        ui={ui}
        style={[s.ligne, i === etapes.length - 1 && s.ligneSansFilet]}
        num={deuxChiffres(i + 1)}
        titre={e.titre}
        texte={e.texte}
      />
    ));
  }

  // Les points d'attention closent la démarche : ce sont les faux pas de cette
  // procédure, pas une rubrique séparée. Numérotés, parce qu'une suite de
  // paragraphes sans repère se lit comme un pavé.
  if (pieges.length) {
    pousser(
      <BlocFilet key="attention" ui={ui} couleur={C.attention}
                 titre="Points d'attention">
        {pieges.map((p, i) => (
          <View key={i} style={[s.point, i > 0 && s.pointSuivant]}>
            <Text style={[s.pointNum, { color: C.attention, fontSize: t(T.valeur) }]}>
              {deuxChiffres(i + 1)}
            </Text>
            <Text style={[s.detail, s.pointTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
              {typeof p === 'object' ? p.texte : p}
            </Text>
          </View>
        ))}
      </BlocFilet>
    );
  }

  // ── Vos recours ───────────────────────────────────────────────────────────
  if (fiche.recours) {
    poserSection('Vos recours');
    pousser(
      <Ligne
        key="recours"
        ui={ui}
        label={synthese?.recours?.label || "Si l'administration refuse"}
        valeur={synthese?.recours?.valeur}
        detail={fiche.recours}
        derniere
      />
    );
  }

  // ── Aller plus loin ───────────────────────────────────────────────────────
  poserSection('Aller plus loin');
  if (simulerParams) {
    pousser(
      <Action
        key="simuler"
        ui={ui}
        titre="Simuler ce congé"
        texte="Projeter vos revenus mois par mois, sur toute la durée du congé."
        onPress={() => navigation.navigate('SimulateurTabs', { screen: 'SimulateurMain', params: simulerParams })}
      />
    );
  }
  pousser(
    <Action
      key="aide"
      ui={ui}
      titre="Se faire accompagner"
      texte={"Votre assistant de service social du personnel répond à toute question, "
        + "personnelle ou professionnelle. Gratuit, confidentiel, sans lien avec votre "
        + "hiérarchie. Ses coordonnées sont sur l'intranet de votre administration ou "
        + "auprès de votre service RH."}
    />
  );

  // ── Sources ───────────────────────────────────────────────────────────────
  if (fiche.sources?.length) {
    poserSection('Sources');
    pousser(
      <View key="sources" style={s.sources}>
        {fiche.sources.map((src, i) => (
          <Text
            key={i}
            style={[s.reference, i > 0 && s.source, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}
          >
            {src.texte}
          </Text>
        ))}
      </View>
    );
  }

  // Fiche précédente / suivante.
  if (hasPosition) {
    pousser(
      <View key="nav" style={s.nav}>
        <TouchableOpacity
          style={[s.navBtn, { opacity: ficheIndex > 0 ? 1 : 0.25 }]}
          disabled={ficheIndex <= 0}
          onPress={() => allerVers(-1)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={14} color={th.textMuted} />
          <Text style={[s.navTexte, { fontSize: t(T.num) }]}>Précédente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.navBtn, { opacity: ficheIndex < ficheTotal - 1 ? 1 : 0.25 }]}
          disabled={ficheIndex >= ficheTotal - 1}
          onPress={() => allerVers(1)}
          activeOpacity={0.7}
        >
          <Text style={[s.navTexte, { fontSize: t(T.num) }]}>Suivante</Text>
          <Ionicons name="chevron-forward" size={14} color={th.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  pousser(
    <Text key="mentions" style={[s.mentions, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}>
      Fiche informative. Elle ne remplace pas un accompagnement par votre assistant de
      service social du personnel ni un conseil juridique.
    </Text>
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <Fil
        ui={ui}
        titre={moduleTitle || fiche.categorie}
        onRetour={() => navigation.goBack()}
        versant={VERSANT_COURT[versant] || versant}
        droite={
          <>
            <TouchableOpacity onPress={toggleFavori} style={s.filBtn} activeOpacity={0.7}>
              <Ionicons
                name={favori ? 'star' : 'star-outline'}
                size={17}
                color={favori ? C.attention : th.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => partagerFiche(fiche, versant)} style={s.filBtn} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={17} color={th.textMuted} />
            </TouchableOpacity>
          </>
        }
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
// Ce qui n'appartient qu'à la fiche. Tout le reste vient de la feuille commune,
// dans src/theme/registreStyles.js.
// ─────────────────────────────────────────────────────────────────────────────
const propre = (th, F) => StyleSheet.create({
  concerne: {},
  concerneTexte: { marginTop: 0 },

  // Trois colonnes égales, et non trois blocs alignés à gauche : sans flex, les
  // chiffres se tassaient dans le tiers gauche de la bande.
  //
  // L'écart au-dessus est porté ici, et non sous « Concerne », parce que la
  // bande n'existe pas sur toutes les fiches : sinon une fiche sans chiffres
  // ouvrait sur 56 dp de blanc avant sa première section.
  synthese: {
    flexDirection: 'row', gap: 16, marginTop: 16, paddingTop: 15, paddingBottom: 16,
    borderTopWidth: FILET, borderBottomWidth: FILET, borderColor: F.rubrique,
  },
  // Chaque chiffre est CENTRÉ dans son tiers. Alignés à gauche, ils paraissaient
  // mal répartis : les trois nombres n'ont pas la même largeur, et « 48 h »
  // laissait un vide au bord droit.
  syntheseCase: { flex: 1, alignItems: 'center' },
  syntheseN: { fontFamily: SERIF, textAlign: 'center' },
  syntheseC: { color: th.textMuted, marginTop: 7, textAlign: 'center' },

  veille: { marginTop: 24 },
  veilleTete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 2 },
  veilleTitre: { marginBottom: 0, flexShrink: 1 },
  maj: { marginTop: 10 },
  majTitre: { fontWeight: '600', color: th.textPrimary },
  majMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  point: { flexDirection: 'row', gap: 10, alignItems: 'baseline' },
  pointSuivant: { marginTop: 16 },
  pointNum: { fontFamily: MONO_LEGER, flexShrink: 0 },
  pointTexte: { flex: 1, marginTop: 0 },

  tableau: { marginTop: 4 },
  tableauLigne: { flexDirection: 'row', borderBottomWidth: FILET, borderBottomColor: F.ligne },
  tableauTete: { borderBottomColor: F.rubrique },
  tableauEntete: {
    fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', paddingVertical: 9, paddingRight: 8,
  },
  // Pas de chasse fixe ici : « Maintenu » et « Délibération » y débordent de
  // leur colonne, et React Native, qui ne césure pas, les rompt au milieu d'un
  // mot. La chasse fixe reste aux valeurs courtes.
  tableauCellule: { color: th.textSecondary, paddingVertical: 11, paddingRight: 8 },
  tableauCelluleTete: { color: th.textPrimary, fontWeight: '600', paddingVertical: 11, paddingRight: 8 },

  sources: { marginTop: 4 },
  // Sans cet écart, une source qui passe à la ligne se confond avec la suivante.
  source: { marginTop: 5 },
});
