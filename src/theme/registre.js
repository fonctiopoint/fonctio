// src/theme/registre.js
// ─────────────────────────────────────────────────────────────────────────────
// DIRECTION « REGISTRE »
//
// Système de présentation retenu le 01/09/2026 pour les fiches. Il repose sur
// sept règles, rappelées ici parce qu'elles se contredisent facilement quand on
// code vite :
//
//   1. La ligne a DEUX niveaux : libellé + valeur pour le balayage, explication
//      entière en dessous pour la lecture. L'explication n'est jamais résumée.
//   2. AUCUN contenant : ni carte, ni bordure, ni rayon, ni ombre. Deux filets
//      seulement — fin entre deux lignes, franc entre deux rubriques.
//   3. Deux familles, trois rôles : serif pour les titres et les chiffres de
//      synthèse, sans système pour la lecture, chasse fixe pour les valeurs,
//      les compteurs et les références.
//   4. La couleur dit UNE seule chose (voir LECTURE ci-dessous).
//   5. Trois chiffres en tête : deux montants ou durées, un délai.
//   6. Rien ne se replie. Ce sont les étiquettes de rubrique collantes qui
//      rendent une fiche longue navigable.
//   7. Sources en pied, en chasse fixe, plus la référence sous l'explication
//      qui cite un texte.
// ─────────────────────────────────────────────────────────────────────────────
import { Palette } from './index';

// Les deux familles sont EMBARQUÉES (chargées dans App.js), et non demandées au
// système par un alias.
//
// Pourquoi : sur le Motorola Razr 50 Ultra de test, « serif », « notoserif »,
// « Noto Serif », « Georgia », « Times New Roman », « monospace »,
// « Roboto Mono » et « Droid Sans Mono » rendent TOUS exactement la même police
// d'interface. Vérifié le 02/09/2026 en affichant les dix alias côte à côte.
// Le constructeur substitue sa police système à toutes les familles, et la
// règle des deux familles — l'ossature de cette direction — disparaissait sans
// aucun signe d'erreur. Un alias système n'est donc pas une garantie.
//
// Ce sont les polices de la maquette validée. La police de LECTURE reste celle
// du système : c'est celle de tout le reste de l'app, elle est bien dessinée,
// et l'embarquer coûterait un fichier de plus sans rien changer à l'écran.
export const SERIF = 'Newsreader_500Medium';
export const MONO = 'IBMPlexMono_500Medium';
export const MONO_LEGER = 'IBMPlexMono_400Regular';

// ── Code de lecture ──────────────────────────────────────────────────────────
// Une valeur porte au plus une de ces trois teintes, et la teinte ne dit qu'une
// chose : le sens de la valeur pour l'agent.
//
//   baisse  la rémunération ou le droit décroît
//   tient   la rémunération ou le droit est maintenu
//   neutre  ni l'un ni l'autre — une durée, un interlocuteur, une règle
//
// Le classement est éditorial, fiche par fiche : il vit dans src/data/synthese.js.
// Sans classement, une valeur reste NEUTRE. Une teinte absente n'induit personne
// en erreur ; une teinte fausse, si.
//
// Les teintes de l'app sont posées pour de l'encre sombre sur fond clair. Sur le
// fond nuit, elles s'éteignent : l'olive vire au noir et le terracotta perd son
// contraste. Chaque rôle a donc une version éclaircie, de même famille — ce sont
// celles de la maquette validée.
const CLAIR = {
  baisse: Palette.terracotta,
  tient: Palette.olive,
  versant: Palette.sky,
  attention: Palette.amber,
};
const SOMBRE = {
  baisse: '#D98253',
  tient: '#9AAB78',
  versant: '#6FA8CC',
  attention: '#E0AE55',
};

export const lecture = (isDark) => {
  const c = isDark ? SOMBRE : CLAIR;
  return {
    baisse: c.baisse,
    tient: c.tient,
    neutre: null, // prend l'encre secondaire du thème
    versant: c.versant,
    attention: c.attention,
  };
};

// ── Filets ───────────────────────────────────────────────────────────────────
// Deux épaisseurs d'encre, pas deux épaisseurs de trait : le trait fait
// toujours un pixel logique, c'est son opacité qui hiérarchise.
export const filets = (isDark) => (isDark
  ? { rubrique: 'rgba(233,231,226,0.13)', ligne: 'rgba(233,231,226,0.07)' }
  : { rubrique: 'rgba(45,55,72,0.11)', ligne: 'rgba(45,55,72,0.07)' });

// ── Échelle typographique ────────────────────────────────────────────────────
// Les tailles sont celles de la maquette validée. Elles passent toutes par le
// fs() du thème, pour que le réglage d'accessibilité continue de les agrandir.
export const T = {
  titre: 26,      // serif — le titre de la fiche
  chiffre: 29,    // serif — les trois chiffres de synthèse
  lede: 12.5,     // le résumé
  label: 13,      // le libellé d'une ligne
  valeur: 12,     // chasse fixe — la valeur d'une ligne
  detail: 11.5,   // l'explication, en dessous
  etapeTitre: 12.5,
  oeil: 8.5,      // les étiquettes de rubrique et de module
  num: 9,         // chasse fixe — compteurs
  source: 9,      // chasse fixe — références et pied de page
  fil: 10.5,      // le fil d'Ariane
};

// Interlignes. 1,55 pour tout ce qui se lit en paragraphe : c'est la valeur qui
// tenait le mieux sur l'écran de test.
export const INTERLIGNE = 1.55;

// ── Espacement vertical ──────────────────────────────────────────────────────
export const V = {
  zone: 20,        // marge latérale de la fiche
  ligne: 13,       // au-dessus d'une ligne
  ligneBas: 14,    // en dessous
  rubrique: 26,    // au-dessus d'une étiquette de rubrique
  bloc: 22,        // au-dessus d'un bloc à filet latéral
};
