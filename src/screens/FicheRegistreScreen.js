// src/screens/FicheRegistreScreen.js
// ─────────────────────────────────────────────────────────────────────────────
// Présentation « Registre » d'une fiche. Voir src/theme/registre.js pour les
// sept règles du système, et src/data/synthese.js pour la surcouche éditoriale.
//
// Cet écran n'est pour l'instant branché que sur la fiche du congé maladie
// ordinaire — la plus longue du jeu de données, donc le pire cas. La liste des
// fiches concernées est tenue dans FicheDetailScreen.js.
//
// Trois points de vigilance si on y touche :
//   — les étiquettes de rubrique sont COLLANTES : elles doivent rester des
//     enfants directs du ScrollView, et leurs index sont relevés au fil de la
//     construction du tableau `enfants`. Envelopper une rubrique dans une View
//     casse le collage et décale tous les index suivants.
//   — les blocs élémentaires (Ligne, Rubrique…) sont définis au niveau du
//     module, pas dans le composant : un composant redéfini à chaque rendu est
//     un type neuf pour React, qui démonte puis remonte tout son sous-arbre.
//   — aucun texte n'est tronqué ni replié. C'est la règle 6, et c'est ce qui
//     distingue cette direction de la précédente.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import {
  SERIF, MONO, LECTURE, FILET_VERSANT, FILET_ATTENTION, filets, T, INTERLIGNE, V,
} from '../theme/registre';
import { getFicheById, MODULES } from '../data/fiches';
import { getMajsForFiche } from '../data/veille';
import { getSynthese, tonDuDroit } from '../data/synthese';
import { VersantContext } from '../navigation/AppNavigator';
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

// Règle 7 : la référence qui clôt une explication passe en chasse fixe, sous
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

const pourCeVersant = (liste, versant) =>
  (liste || []).filter(x => !x || typeof x !== 'object' || !x.versants || x.versants.includes(versant));

// ── Les blocs élémentaires ──────────────────────────────────────────────────
// Tous reçoivent `ui` = { s, t, inter, th } : la feuille de style construite
// pour le thème courant, l'échelle typographique et les interlignes.

const Ligne = ({ ui, label, valeur, detail, ton, derniere }) => {
  const { s, t, inter, th } = ui;
  const { texte, reference } = couperSource(detail);
  const teinte = LECTURE[ton] || th.textSecondary;
  return (
    <View style={[s.ligne, derniere && s.ligneSansFilet]}>
      <View style={s.ligneHaut}>
        <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{label}</Text>
        {!!valeur && (
          <Text style={[s.valeur, { color: teinte, fontSize: t(T.valeur) }]}>{valeur}</Text>
        )}
      </View>
      {!!texte && (
        <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>{texte}</Text>
      )}
      {!!reference && (
        <Text style={[s.reference, { fontSize: t(T.source), lineHeight: t(T.source) * 1.5 }]}>{reference}</Text>
      )}
    </View>
  );
};

const Rubrique = ({ ui, titre, compte }) => {
  const { s, t } = ui;
  return (
    <View style={s.rubrique}>
      <Text style={[s.rubriqueTitre, { fontSize: t(T.oeil) }]}>{titre}</Text>
      {compte != null && <Text style={[s.rubriqueCompte, { fontSize: t(T.num) }]}>{compte}</Text>}
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

// ─────────────────────────────────────────────────────────────────────────────

export default function FicheRegistreScreen({ navigation, route }) {
  const { ficheId, ficheIndex, ficheTotal, moduleTitle } = route.params || {};
  const fiche = getFicheById(ficheId);
  const { versant } = useContext(VersantContext);
  const [favori, setFavori] = useState(false);

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
  const s = feuille(theme, F);
  const ui = { s, t, inter, th: theme };

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
  // Les index des étiquettes collantes sont relevés au fil de l'eau : c'est le
  // seul moyen de les garder justes quand une rubrique est absente.
  const enfants = [];
  const collants = [];
  const pousser = (noeud) => { enfants.push(noeud); };
  const poserRubrique = (titre, compte) => {
    collants.push(enfants.length);
    enfants.push(<Rubrique key={`rub-${titre}`} ui={ui} titre={titre} compte={compte} />);
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
              <Text style={[s.syntheseN, { color: LECTURE[c.ton] || theme.textPrimary, fontSize: t(T.chiffre) }]}>
                {c.n}
              </Text>
              <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>{c.c}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Veille juridique — un texte paru que la fiche ne reflète pas encore.
  if (majs?.length) {
    const enAttente = majs.filter(m => !m.integre);
    const couleur = enAttente.length ? FILET_ATTENTION : FILET_VERSANT;
    const titreBloc = enAttente.length
      ? `${enAttente.length} évolution${enAttente.length > 1 ? 's' : ''} à connaître`
      : `À jour au ${formatDateFr(majs[0].vigueur || majs[0].date)}`;
    pousser(
      <BlocFilet key="veille" ui={ui} couleur={couleur} titre={titreBloc}>
        {majs.map(maj => (
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
                <Text style={[s.reference, { color: FILET_ATTENTION, fontSize: t(T.source) }]}>
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
                maj.source?.url && { color: FILET_VERSANT },
              ]}>
                {maj.source?.texte}{maj.source?.url ? '  ↗' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </BlocFilet>
    );
  }

  // Ce que vous percevez.
  if (droits.length) {
    poserRubrique('Ce que vous percevez', droits.length);
    droits.forEach((d, i) => pousser(
      <Ligne
        key={`droit-${i}`}
        ui={ui}
        label={d.label}
        valeur={d.valeur}
        detail={d.detail}
        ton={tonDuDroit(ficheId, d.label)}
        derniere={i === droits.length - 1}
      />
    ));
    // La légende du code de lecture n'apparaît que si une teinte est réellement
    // employée sur cette fiche : sinon elle explique une chose qu'on ne voit pas.
    const tons = new Set(droits.map(d => tonDuDroit(ficheId, d.label)));
    if (tons.has('baisse') || tons.has('tient')) {
      pousser(
        <View key="code" style={s.code}>
          {tons.has('baisse') && (
            <View style={s.codeCase}>
              <View style={[s.codePastille, { backgroundColor: LECTURE.baisse }]} />
              <Text style={[s.codeTexte, { fontSize: t(T.num) }]}>dégressif</Text>
            </View>
          )}
          {tons.has('tient') && (
            <View style={s.codeCase}>
              <View style={[s.codePastille, { backgroundColor: LECTURE.tient }]} />
              <Text style={[s.codeTexte, { fontSize: t(T.num) }]}>maintenu</Text>
            </View>
          )}
        </View>
      );
    }
  }

  // La note du versant de l'agent.
  if (versantNote) {
    pousser(
      <BlocFilet key="versant" ui={ui} couleur={FILET_VERSANT}
                 titre={`Pour vous — ${VERSANT_LONG[versant] || versant}`}>
        <Paragraphe ui={ui}>{versantNote}</Paragraphe>
      </BlocFilet>
    );
  }

  // Le tableau, quand la fiche en porte un.
  const tableau = fiche.tableaux?.[versant]
    || fiche[`tableau${versant.charAt(0).toUpperCase()}${versant.slice(1)}`]
    || (fiche.tableau && (!fiche.tableau.versants || fiche.tableau.versants.includes(versant)) ? fiche.tableau : null);

  if (tableau) {
    poserRubrique(tableau.titre || 'Le tableau', null);
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

  // La démarche.
  if (etapes.length) {
    poserRubrique('La démarche', etapes.length);
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

  // Les points d'attention.
  if (pieges.length) {
    pousser(
      <BlocFilet key="attention" ui={ui} couleur={FILET_ATTENTION} titre="Points d'attention">
        {pieges.map((p, i) => (
          <Paragraphe key={i} ui={ui} style={i > 0 && s.paragrapheSuivant}>
            {typeof p === 'object' ? p.texte : p}
          </Paragraphe>
        ))}
      </BlocFilet>
    );
  }

  // Les recours.
  if (fiche.recours) {
    poserRubrique('Vos recours', null);
    pousser(
      <Ligne
        key="recours"
        ui={ui}
        label={synthese?.recours?.label || "Si l'administration refuse"}
        valeur={synthese?.recours?.valeur}
        detail={fiche.recours}
        ton="neutre"
        derniere
      />
    );
  }

  // Le simulateur, quand la fiche en a un.
  if (simulerParams) {
    pousser(
      <TouchableOpacity
        key="simuler"
        style={s.action}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('SimulateurTabs', { screen: 'SimulateurMain', params: simulerParams })}
      >
        <View style={s.actionTexte}>
          <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>Simuler ce congé</Text>
          <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
            Projeter vos revenus sur toute la durée.
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    );
  }

  // L'accompagnement social.
  pousser(
    <View key="aide" style={s.aide}>
      <Text style={[s.rubriqueTitre, { fontSize: t(T.oeil) }]}>Se faire accompagner</Text>
      <Text style={[s.detail, s.aideTexte, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
        Pour toute question relative à votre vie personnelle ou professionnelle, vous pouvez
        contacter votre assistant de service social du personnel. Cet accompagnement est
        gratuit, confidentiel et sans jugement. Ses coordonnées figurent sur l'intranet de
        votre administration ou auprès de votre service RH.
      </Text>
    </View>
  );

  // Les sources, en pied.
  if (fiche.sources?.length) {
    pousser(
      <View key="sources" style={s.sources}>
        {fiche.sources.map((src, i) => (
          <Text key={i} style={[s.reference, { fontSize: t(T.source), lineHeight: t(T.source) * 1.8 }]}>
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
              color={favori ? FILET_ATTENTION : theme.textMuted}
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
// La maquette validée les dessinait à 1 px CSS.
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
  filVersant: { fontFamily: MONO, color: th.textMuted, letterSpacing: 1.1, marginRight: 4 },
  filBtn: { padding: 6 },

  scroll: { flex: 1 },
  scrollContenu: { paddingHorizontal: V.zone, paddingBottom: 90 },

  // ── Tête ──────────────────────────────────────────────────────────────────
  tete: { paddingTop: 4 },
  moduleRang: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  moduleGauche: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  moduleFilet: { width: 18, height: 2 },
  moduleNom: { fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', flexShrink: 1 },
  moduleRangNum: { fontFamily: MONO, color: th.textMuted, letterSpacing: 0.6 },

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

  // ── Étiquette de rubrique, collante au défilement ─────────────────────────
  rubrique: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    marginTop: V.rubrique, paddingTop: 6, paddingBottom: 5,
    backgroundColor: th.bg,
    borderBottomWidth: FILET, borderBottomColor: F.rubrique,
  },
  rubriqueTitre: {
    fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase',
    color: th.textMuted, flexShrink: 1,
  },
  rubriqueCompte: { fontFamily: MONO, color: th.textMuted },

  // ── La ligne à deux niveaux ───────────────────────────────────────────────
  ligne: {
    paddingTop: V.ligne, paddingBottom: V.ligneBas,
    borderBottomWidth: FILET, borderBottomColor: F.ligne,
  },
  ligneSansFilet: { borderBottomWidth: 0 },
  ligneHaut: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 },
  label: { fontWeight: '600', color: th.textPrimary, flexShrink: 1 },
  valeur: { fontFamily: MONO, fontWeight: '500', flexShrink: 0 },
  detail: { color: th.textSecondary, marginTop: 6 },
  reference: { fontFamily: MONO, color: th.textMuted, marginTop: 4 },

  paragrapheSuivant: { marginTop: 10 },

  // ── Blocs à filet latéral ─────────────────────────────────────────────────
  blocFilet: { marginTop: V.bloc, paddingLeft: 13, borderLeftWidth: 2 },
  blocFiletTitre: { fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },

  maj: { marginTop: 10 },
  majTitre: { fontWeight: '600', color: th.textPrimary },
  majMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // ── Le code de lecture ────────────────────────────────────────────────────
  code: { flexDirection: 'row', gap: 16, marginTop: 13 },
  codeCase: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  codePastille: { width: 6, height: 6, borderRadius: 3 },
  codeTexte: { color: th.textMuted },

  // ── Étapes ────────────────────────────────────────────────────────────────
  etapeHaut: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  etapeNum: { fontFamily: MONO, color: th.textMuted, flexShrink: 0 },
  etapeTitre: { fontWeight: '600', color: th.textPrimary, flexShrink: 1 },
  etapeDetail: { paddingLeft: 27 },

  // ── Tableau ───────────────────────────────────────────────────────────────
  tableau: { marginTop: 4 },
  tableauLigne: { flexDirection: 'row', borderBottomWidth: FILET, borderBottomColor: F.ligne },
  tableauTete: { borderBottomColor: F.rubrique },
  tableauEntete: {
    fontFamily: MONO, color: th.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', paddingVertical: 9, paddingRight: 8,
  },
  tableauCellule: { fontFamily: MONO, color: th.textSecondary, paddingVertical: 11, paddingRight: 8 },
  tableauCelluleTete: { color: th.textPrimary, fontWeight: '600', paddingVertical: 11, paddingRight: 8 },

  // ── Pied ──────────────────────────────────────────────────────────────────
  action: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginTop: V.rubrique, paddingTop: 14, paddingBottom: 14,
    borderTopWidth: FILET, borderTopColor: F.rubrique,
    borderBottomWidth: FILET, borderBottomColor: F.rubrique,
  },
  actionTexte: { flex: 1 },

  aide: { marginTop: V.rubrique },
  aideTexte: { marginTop: 8 },

  sources: { marginTop: V.rubrique, paddingTop: 14, borderTopWidth: FILET, borderTopColor: F.rubrique },

  nav: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: V.rubrique, paddingTop: 14,
    borderTopWidth: FILET, borderTopColor: F.rubrique,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  navTexte: { fontFamily: MONO, color: th.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },

  mentions: { fontFamily: MONO, color: th.textMuted, marginTop: 22, textAlign: 'center' },
});
