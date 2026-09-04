// src/theme/registreStyles.js
// ─────────────────────────────────────────────────────────────────────────────
// La feuille de style COMMUNE de la direction « Registre », et le petit crochet
// qui la fournit.
//
// Elle a été extraite de FicheRegistreScreen le 02/09/2026, au moment
// d'habiller le deuxième écran : le fil d'Ariane, la tête de page, la ligne à
// deux niveaux et les blocs à filet sont les mêmes partout, et une deuxième
// copie aurait divergé de la première à la première correction.
//
// Chaque écran fait ensuite :
//     const ui = useRegistre();
//     const s = { ...ui.s, ...propre(ui.th, ui.F) };
// et passe `ui` aux composants de src/components/registre.js.
// ─────────────────────────────────────────────────────────────────────────────
import { StyleSheet } from 'react-native';
import { useTheme } from './index';
import { SERIF, MONO, MONO_LEGER, couleurs, filets, T, INTERLIGNE, V } from './registre';

// Les filets font 1 dp, pas StyleSheet.hairlineWidth : sur un écran à forte
// densité, un filet d'un seul pixel physique teinté à 7 % devient invisible.
export const FILET = 1;

export function useRegistre() {
  const th = useTheme();

  // fs() arrondit à l'entier, ce qui écraserait les demi-points de l'échelle
  // (11,5 · 12,5 · 8,5). On récupère donc le facteur lui-même et on l'applique
  // sans arrondir : React Native accepte les tailles fractionnaires.
  const echelle = th.fs(1000) / 1000;
  const t = (base) => base * echelle;
  const inter = (base) => base * echelle * INTERLIGNE;

  const F = filets(th.isDark);
  const C = couleurs(th.isDark);
  const s = commun(th, F);
  return { th, t, inter, F, C, s };
}

const commun = (th, F) => StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContenu: { paddingHorizontal: V.zone, paddingBottom: 90 },

  // ── Fil d'Ariane ──────────────────────────────────────────────────────────
  fil: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingLeft: V.zone - 4, paddingRight: V.zone - 6, paddingTop: 4, paddingBottom: 8,
  },
  filRetour: { flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1, paddingVertical: 4 },
  filTexte: { color: th.textMuted, flexShrink: 1 },
  filDroite: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  filVersant: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 1.1, marginRight: 4 },
  filBtn: { padding: 6 },

  // ── Tête de page ──────────────────────────────────────────────────────────
  tete: { paddingTop: 4 },
  moduleRang: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  moduleGauche: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  moduleFilet: { width: 18, height: 2 },
  moduleNom: { fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', flexShrink: 1 },
  moduleRangNum: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.6 },

  titre: { fontFamily: SERIF, color: th.textPrimary, marginBottom: 11 },
  lede: { color: th.textSecondary, marginBottom: 16 },

  oeil: {
    fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', color: th.textMuted,
  },

  // ── Titre de section ──────────────────────────────────────────────────────
  // Une BANDE, et non un simple filet : les sections d'une même page se
  // ressemblaient trop et se lisaient comme un seul flot. La bande sort des
  // marges de la page — marge négative puis rembourrage égal — pour toucher les
  // deux bords de l'écran : c'est ce débord qui la fait lire comme une coupure
  // et non comme un paragraphe de plus.
  //
  // Son fond sert aussi au collage : le titre reste opaque quand le contenu
  // défile dessous.
  espaceSection: { height: V.section },
  section: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 13, paddingBottom: 13,
    marginHorizontal: -V.zone, paddingHorizontal: V.zone,
    backgroundColor: th.bgWarm,
    borderTopWidth: FILET, borderTopColor: F.rubrique,
    borderBottomWidth: FILET, borderBottomColor: F.rubrique,
  },
  // flex: 1 et non flexShrink: 1 — avec une police embarquée, Android mesure
  // parfois le texte avec la police de repli et un titre rétrécissable finit
  // rogné (« Aller plus » au lieu de « Aller plus loin »).
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

  // ── Blocs à filet latéral ─────────────────────────────────────────────────
  blocFilet: { marginTop: V.bloc, paddingLeft: 13, borderLeftWidth: 2 },
  blocFiletTete: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  blocFiletTitre: {
    fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase',
    marginBottom: 6, flexShrink: 1,
  },

  // ── Une entrée numérotée : étape, point d'attention, fiche d'un module ────
  numerote: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  numeroteNum: { fontFamily: MONO_LEGER, color: th.textMuted, flexShrink: 0 },
  // Le titre est enfermé dans une boîte à flex: 1, et ne porte lui-même aucun
  // flex. Deux essais avant celui-ci : `flexShrink: 1` collait le chevron à la
  // fin du titre au lieu de le ranger au bord droit ; `flex: 1` posé sur le
  // Text laissait un titre long déborder de l'écran sans passer à la ligne.
  // Une View bornée, elle, contraint toujours le texte qu'elle contient.
  numeroteIcone: { fontSize: 19, marginRight: 1 },
  numeroteBoite: { flex: 1 },
  numeroteTitre: { fontWeight: '600', color: th.textPrimary },
  numeroteDetail: { paddingLeft: 27 },

  // ── Actions : les seuls objets à porter un fond ───────────────────────────
  action: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: th.bgWarm, borderLeftWidth: 3, borderRadius: 4,
    paddingVertical: 16, paddingHorizontal: 16,
    marginTop: 12,
  },
  actionTexte: { flex: 1 },
  actionTitre: { fontFamily: SERIF, color: th.textPrimary, marginBottom: 2 },

  // ── Pied ──────────────────────────────────────────────────────────────────
  nav: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: V.section, paddingTop: 14,
    borderTopWidth: FILET, borderTopColor: F.rubrique,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  navTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },

  mentions: { color: th.textMuted, marginTop: 24, textAlign: 'center' },
});
