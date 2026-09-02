// src/screens/FicheRegistreScreen.js
// ─────────────────────────────────────────────────────────────────────────────
// Présentation « Registre » d'une fiche. Voir src/theme/registre.js pour les
// règles du système, et src/data/synthese.js pour la surcouche éditoriale.
//
// Cet écran n'est pour l'instant branché que sur la fiche du congé maladie
// ordinaire — la plus longue du jeu de données, donc le pire cas. La liste des
// fiches concernées est tenue dans FicheDetailScreen.js.
//
// Trois points de vigilance si on y touche :
//   — les titres de section sont COLLANTS : ils doivent rester des enfants
//     directs du ScrollView, et leurs index sont relevés au fil de la
//     construction du tableau `enfants`. Envelopper un titre dans une View
//     casse le collage et décale tous les index suivants. Leur écart supérieur
//     ne peut pas non plus être une marge : React Native fige le titre AVEC sa
//     marge, et le contenu défile alors visiblement dans cet interstice. D'où
//     l'intercalaire poussé juste avant.
//   — les blocs élémentaires (Ligne, Section…) sont définis au niveau du
//     module, pas dans le composant : un composant redéfini à chaque rendu est
//     un type neuf pour React, qui démonte puis remonte tout son sous-arbre.
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
import { useTheme } from '../theme';
import {
  SERIF, MONO, MONO_LEGER, couleurs, filets, T, INTERLIGNE, V,
} from '../theme/registre';
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
const SEUIL_VALEUR_LONGUE = 24;

const pourCeVersant = (liste, versant) =>
  (liste || []).filter(x => !x || typeof x !== 'object' || !x.versants || x.versants.includes(versant));

// ── Les blocs élémentaires ──────────────────────────────────────────────────
// Tous reçoivent `ui` = { s, t, inter, th, C } : la feuille de style construite
// pour le thème courant, l'échelle typographique, les interlignes et les
// couleurs de rôle.

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

// Le titre de section est l'outil principal de découpage de la fiche : filet
// franc, serif, et beaucoup d'air au-dessus. Il reste collé en haut de l'écran
// tant qu'on parcourt sa section, ce qui dit en permanence où l'on se trouve.
const Section = ({ ui, titre, compte }) => {
  const { s, t } = ui;
  return (
    <View style={s.section}>
      <Text style={[s.sectionTitre, { fontSize: t(T.section), lineHeight: t(T.section) * 1.25 }]}>
        {titre}
      </Text>
      {compte != null && <Text style={[s.sectionCompte, { fontSize: t(T.num) }]}>{compte}</Text>}
    </View>
  );
};

const BlocFilet = ({ ui, couleur, titre, children }) => {
  const { s, t } = ui;
  return (
    <View style={[s.blocFilet, { borderLeftColor: couleur }]}>
      <Text style={[s.blocFiletTitre, { color: couleur, fontSize: t(T.oeil) }]}>{titre}</Text>
      {children}
    </View>
  );
};

const Paragraphe = ({ ui, style, children }) => {
  const { s, t, inter } = ui;
  return (
    <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }, style]}>
      {children}
    </Text>
  );
};

// Les deux blocs d'action sont les seuls objets de la fiche à porter un fond.
// C'est délibéré : ils ne se lisent pas, ils se font, et rien d'autre dans la
// page n'a de contenant qui pourrait les banaliser.
const Action = ({ ui, titre, texte, onPress }) => {
  const { s, t, inter, C } = ui;
  const contenu = (
    <>
      <View style={s.actionTexte}>
        <Text style={[s.actionTitre, { fontSize: t(T.action), lineHeight: t(T.action) * 1.25 }]}>
          {titre}
        </Text>
        <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
          {texte}
        </Text>
      </View>
      {!!onPress && <Ionicons name="arrow-forward" size={18} color={C.action} />}
    </>
  );
  return onPress
    ? (
      <TouchableOpacity style={[s.action, { borderLeftColor: C.action }]} onPress={onPress} activeOpacity={0.7}>
        {contenu}
      </TouchableOpacity>
    )
    : <View style={[s.action, { borderLeftColor: C.action }]}>{contenu}</View>;
};

// ─────────────────────────────────────────────────────────────────────────────

export default function FicheRegistreScreen({ navigation, route }) {
  const { ficheId, ficheIndex, ficheTotal, moduleTitle } = route.params || {};
  const fiche = getFicheById(ficheId);
  const { versant } = useContext(VersantContext);
  const [favori, setFavori] = useState(false);
  const [veilleOuverte, setVeilleOuverte] = useState(false);

  useEffect(() => {
    if (!fiche) return;
    addRecent(ficheId);
    isFavori(ficheId).then(setFavori);
  }, [ficheId]);

  const theme = useTheme();
  const { fs } = theme;

  // Dernier hook passé — la sortie anticipée est sûre à partir d'ici.
  if (!fiche) return null;

  // fs() arrondit à l'entier, ce qui écraserait les demi-points de l'échelle
  // (11,5 · 12,5 · 8,5). On récupère donc le facteur lui-même et on l'applique
  // sans arrondir : React Native accepte les tailles fractionnaires.
  const echelle = fs(1000) / 1000;
  const t = (base) => base * echelle;
  const inter = (base) => base * echelle * INTERLIGNE;

  const F = filets(theme.isDark);
  const C = couleurs(theme.isDark);
  const s = feuille(theme, F);
  const ui = { s, t, inter, th: theme, C };

  const module = fiche.moduleColor;
  const synthese = getSynthese(ficheId);
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
  // moyen de les garder justes quand une section est absente.
  const enfants = [];
  const collants = [];
  const pousser = (noeud) => { enfants.push(noeud); };
  const poserSection = (titre, compte) => {
    enfants.push(<View key={`esp-${titre}`} style={s.espaceSection} />);
    collants.push(enfants.length);
    enfants.push(<Section key={`sec-${titre}`} ui={ui} titre={titre} compte={compte} />);
  };

  // Tête : bandeau de module, titre, résumé, public concerné, trois chiffres.
  pousser(
    <View key="tete" style={s.tete}>
      <View style={s.moduleRang}>
        <View style={s.moduleGauche}>
          <View style={[s.moduleFilet, { backgroundColor: module }]} />
          <Text style={[s.moduleNom, { color: module, fontSize: t(T.oeil) }]}>
            {moduleTitle || fiche.categorie}
          </Text>
        </View>
        {hasPosition && (
          <Text style={[s.moduleRangNum, { fontSize: t(T.num) }]}>
            {deuxChiffres(ficheIndex + 1)} / {deuxChiffres(ficheTotal)}
          </Text>
        )}
      </View>

      <Text style={[s.titre, { fontSize: t(T.titre), lineHeight: t(T.titre) * 1.14 }]}>{fiche.titre}</Text>
      <Text style={[s.lede, { fontSize: t(T.lede), lineHeight: inter(T.lede) }]}>{fiche.resume}</Text>

      {!!fiche.ciblePublic && (
        <View style={s.concerne}>
          <Text style={[s.concerneOeil, { fontSize: t(T.oeil) }]}>Concerne</Text>
          <Text style={[s.concerneTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
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
    </View>
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
              <Ionicons
                name={veilleOuverte ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={teinte}
              />
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

  // ── Ce que vous percevez ──────────────────────────────────────────────────
  if (droits.length) {
    poserSection('Ce que vous percevez', droits.length);
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
    poserSection(tableau.titre || 'Récapitulatif', null);
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
    poserSection('La démarche', etapes.length);
    etapes.forEach((e, i) => pousser(
      <View key={`etape-${i}`} style={[s.ligne, i === etapes.length - 1 && s.ligneSansFilet]}>
        <View style={s.etapeHaut}>
          <Text style={[s.etapeNum, { fontSize: t(T.valeur) }]}>{deuxChiffres(i + 1)}</Text>
          <Text style={[s.etapeTitre, { fontSize: t(T.etapeTitre), lineHeight: t(T.etapeTitre) * 1.3 }]}>
            {e.titre}
          </Text>
        </View>
        <Text style={[s.detail, s.etapeDetail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
          {e.texte}
        </Text>
      </View>
    ));
  }

  // Les points d'attention closent la démarche : ce sont les faux pas de cette
  // procédure, pas une rubrique séparée.
  if (pieges.length) {
    pousser(
      <BlocFilet key="attention" ui={ui} couleur={C.attention} titre="Points d'attention">
        {pieges.map((p, i) => (
          <Paragraphe key={i} ui={ui} style={i > 0 && s.paragrapheSuivant}>
            {typeof p === 'object' ? p.texte : p}
          </Paragraphe>
        ))}
      </BlocFilet>
    );
  }

  // ── Vos recours ───────────────────────────────────────────────────────────
  if (fiche.recours) {
    poserSection('Vos recours', null);
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
  poserSection('Aller plus loin', null);
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
    poserSection('Sources', fiche.sources.length);
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
          <Ionicons name="chevron-back" size={14} color={theme.textMuted} />
          <Text style={[s.navTexte, { fontSize: t(T.num) }]}>Précédente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.navBtn, { opacity: ficheIndex < ficheTotal - 1 ? 1 : 0.25 }]}
          disabled={ficheIndex >= ficheTotal - 1}
          onPress={() => allerVers(1)}
          activeOpacity={0.7}
        >
          <Text style={[s.navTexte, { fontSize: t(T.num) }]}>Suivante</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
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
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      <View style={s.fil}>
        <TouchableOpacity style={s.filRetour} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={15} color={theme.textMuted} />
          <Text style={[s.filTexte, { fontSize: t(T.fil) }]} numberOfLines={1}>
            {moduleTitle || fiche.categorie}
          </Text>
        </TouchableOpacity>
        <View style={s.filDroite}>
          <Text style={[s.filVersant, { fontSize: t(T.num) }]}>{VERSANT_COURT[versant] || versant}</Text>
          <TouchableOpacity onPress={toggleFavori} style={s.filBtn} activeOpacity={0.7}>
            <Ionicons
              name={favori ? 'star' : 'star-outline'}
              size={17}
              color={favori ? C.attention : theme.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => partagerFiche(fiche, versant)} style={s.filBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={17} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

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
// La feuille de style dépend du thème : elle est donc construite à chaque
// rendu. Le coût est celui d'un objet littéral, négligeable devant le texte à
// composer.
//
// Les filets font 1 dp, pas StyleSheet.hairlineWidth : sur un écran à forte
// densité, un filet d'un seul pixel physique teinté à 7 % devient invisible.
// ─────────────────────────────────────────────────────────────────────────────
const FILET = 1;

const feuille = (th, F) => StyleSheet.create({
  safe: { flex: 1 },

  fil: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingLeft: V.zone - 4, paddingRight: V.zone - 6, paddingTop: 4, paddingBottom: 8,
  },
  filRetour: { flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1, paddingVertical: 4 },
  filTexte: { color: th.textMuted, flexShrink: 1 },
  filDroite: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  filVersant: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 1.1, marginRight: 4 },
  filBtn: { padding: 6 },

  scroll: { flex: 1 },
  scrollContenu: { paddingHorizontal: V.zone, paddingBottom: 90 },

  // ── Tête ──────────────────────────────────────────────────────────────────
  tete: { paddingTop: 4 },
  moduleRang: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  moduleGauche: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  moduleFilet: { width: 18, height: 2 },
  moduleNom: { fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', flexShrink: 1 },
  moduleRangNum: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.6 },

  titre: { fontFamily: SERIF, color: th.textPrimary, marginBottom: 11 },
  lede: { color: th.textSecondary, marginBottom: 16 },

  concerne: { marginBottom: 16 },
  concerneOeil: {
    fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase',
    color: th.textMuted, marginBottom: 5,
  },
  concerneTexte: { color: th.textSecondary },

  synthese: {
    flexDirection: 'row', gap: 22, paddingTop: 15, paddingBottom: 16,
    borderTopWidth: FILET, borderBottomWidth: FILET, borderColor: F.rubrique,
  },
  syntheseCase: { flexShrink: 1 },
  syntheseN: { fontFamily: SERIF },
  syntheseC: { color: th.textMuted, marginTop: 6 },

  // ── Titre de section, collant au défilement ───────────────────────────────
  espaceSection: { height: V.section },
  section: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingTop: 13, paddingBottom: 11,
    backgroundColor: th.bg,
    borderTopWidth: 2, borderTopColor: F.section,
  },
  // flex: 1 et non flexShrink: 1 — avec une police embarquée, Android mesure
  // parfois le texte avec la police de repli et un titre rétrécissable finit
  // rogné (« Aller plus » au lieu de « Aller plus loin »). En flex: 1 il occupe
  // la place disponible et passe à la ligne au lieu d'être coupé.
  sectionTitre: { fontFamily: SERIF, color: th.textPrimary, flex: 1 },
  sectionCompte: { fontFamily: MONO_LEGER, color: th.textMuted, marginLeft: 12 },

  // ── La ligne à deux niveaux ───────────────────────────────────────────────
  ligne: {
    paddingTop: V.ligne, paddingBottom: V.ligneBas,
    borderBottomWidth: FILET, borderBottomColor: F.ligne,
  },
  ligneSansFilet: { borderBottomWidth: 0 },
  ligneHaut: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 },
  label: { fontWeight: '600', color: th.textPrimary, flexShrink: 1 },
  valeur: { fontFamily: MONO, flexShrink: 0 },
  valeurDessous: { marginTop: 5 },
  detail: { color: th.textSecondary, marginTop: 6 },
  reference: { fontFamily: MONO_LEGER, color: th.textMuted, marginTop: 4 },

  paragrapheSuivant: { marginTop: 10 },

  // ── Blocs à filet latéral ─────────────────────────────────────────────────
  blocFilet: { marginTop: V.bloc, paddingLeft: 13, borderLeftWidth: 2 },
  blocFiletTitre: { fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },

  veille: { marginTop: 24 },
  veilleTete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 2 },
  veilleTitre: { marginBottom: 0, flexShrink: 1 },

  maj: { marginTop: 10 },
  majTitre: { fontWeight: '600', color: th.textPrimary },
  majMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // ── Étapes ────────────────────────────────────────────────────────────────
  etapeHaut: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  etapeNum: { fontFamily: MONO_LEGER, color: th.textMuted, flexShrink: 0 },
  etapeTitre: { fontWeight: '600', color: th.textPrimary, flexShrink: 1 },
  etapeDetail: { paddingLeft: 27 },

  // ── Tableau ───────────────────────────────────────────────────────────────
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

  // ── Actions ───────────────────────────────────────────────────────────────
  action: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: th.bgWarm, borderLeftWidth: 3,
    paddingVertical: 15, paddingHorizontal: 15,
    marginTop: 12,
  },
  actionTexte: { flex: 1 },
  actionTitre: { fontFamily: SERIF, color: th.textPrimary, marginBottom: 2 },

  // ── Pied ──────────────────────────────────────────────────────────────────
  sources: { marginTop: 4 },
  // Sans cet écart, une source qui passe à la ligne se confond avec la suivante.
  source: { marginTop: 5 },

  nav: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: V.section, paddingTop: 14,
    borderTopWidth: FILET, borderTopColor: F.rubrique,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  navTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },

  mentions: { color: th.textMuted, marginTop: 24, textAlign: 'center' },
});
