// src/theme/registre.js
// ─────────────────────────────────────────────────────────────────────────────
// DIRECTION « REGISTRE »
//
// Système de présentation retenu le 01/09/2026 pour les fiches, révisé le
// 02/09/2026 après lecture sur appareil. Ses règles, rappelées ici parce
// qu'elles se contredisent facilement quand on code vite :
//
//   1. La ligne a DEUX niveaux : libellé + valeur pour le balayage, explication
//      entière en dessous pour la lecture. L'explication n'est jamais résumée.
//   2. AUCUN contenant autour du TEXTE : ni carte, ni bordure, ni ombre. Des
//      filets seulement — fin entre deux lignes, franc entre deux sections.
//      Seuls les deux blocs d'ACTION du pied de fiche ont un fond, justement
//      pour ne pas se lire comme du texte.
//   3. Deux familles, trois rôles : serif pour le titre de la fiche, les
//      chiffres de synthèse et les titres de section ; sans pour la lecture ;
//      chasse fixe pour les valeurs, les compteurs et les références.
//   4. La couleur ne CLASSE rien. Elle distingue des natures de bloc, pas des
//      valeurs (voir `couleurs` ci-dessous). Un code dégressif/maintenu a été
//      essayé puis retiré le 02/09/2026 : il obligeait à trancher le sens de
//      chaque valeur des 43 fiches, et une couleur fausse est pire qu'une
//      couleur absente.
//   5. Trois chiffres en tête : deux montants ou durées, un délai.
//   6. Le CONTENU de la fiche ne se replie pas. Ce qui peut se replier, c'est
//      une notice posée par-dessus — la veille juridique.
//   7. Les textes de loi ont leur propre section en pied, plus la référence
//      sous chaque explication qui cite un texte.
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
// aucun signe d'erreur. Un alias système n'est donc pas une garantie : c'est
// justement pour que la fiche se lise pareil sur n'importe quel téléphone que
// ces fichiers sont embarqués.
//
// La police de LECTURE reste celle du système : c'est celle de tout le reste de
// l'app, elle est bien dessinée, et l'embarquer coûterait un fichier de plus
// sans rien changer à l'écran.
export const SERIF = 'Newsreader_500Medium';
export const MONO = 'IBMPlexMono_500Medium';
export const MONO_LEGER = 'IBMPlexMono_400Regular';

// ── Les couleurs ─────────────────────────────────────────────────────────────
// Quatre rôles, un seul par teinte. Aucun ne porte de jugement sur la valeur :
// ils disent de quelle NATURE est le bloc qu'on lit.
//
//   valeur     la valeur à droite d'un libellé, et les chiffres de synthèse
//   versant    la note qui ne vaut que pour le versant de l'agent
//   attention  les points d'attention, et une évolution non encore intégrée
//   action     les deux blocs qui proposent de faire quelque chose
//
// Les teintes de l'app sont posées pour de l'encre sombre sur fond clair. Sur
// le fond nuit elles s'éteignent : chaque rôle a donc une version éclaircie de
// la même famille.
const CLAIR = {
  valeur: Palette.terracotta,
  versant: Palette.sky,
  attention: Palette.amber,
  action: Palette.olive,
};
const SOMBRE = {
  valeur: '#D98253',
  versant: '#6FA8CC',
  attention: '#E0AE55',
  action: '#9AAB78',
};

export const couleurs = (isDark) => (isDark ? SOMBRE : CLAIR);

// ── Filets ───────────────────────────────────────────────────────────────────
// Trois épaisseurs d'encre, pas trois épaisseurs de trait : le trait fait
// toujours un pixel logique, c'est son opacité qui hiérarchise. Le filet de
// SECTION est franc — c'est lui qui découpe la fiche.
export const filets = (isDark) => (isDark
  ? { section: 'rgba(233,231,226,0.30)', rubrique: 'rgba(233,231,226,0.13)', ligne: 'rgba(233,231,226,0.07)' }
  : { section: 'rgba(45,55,72,0.26)', rubrique: 'rgba(45,55,72,0.11)', ligne: 'rgba(45,55,72,0.07)' });

// ── Échelle typographique ────────────────────────────────────────────────────
// Toutes ces tailles passent par le fs() du thème, pour que le réglage
// d'accessibilité continue de les agrandir.
export const T = {
  titre: 26,      // serif — le titre de la fiche
  chiffre: 29,    // serif — les trois chiffres de synthèse
  section: 17,    // serif — le titre d'une section
  lede: 12.5,     // le résumé
  label: 13,      // le libellé d'une ligne
  valeur: 12,     // chasse fixe — la valeur d'une ligne
  detail: 11.5,   // l'explication, en dessous
  etapeTitre: 12.5,
  action: 15,     // serif — le titre d'un bloc d'action
  oeil: 8.5,      // les petites étiquettes en capitales
  num: 9,         // chasse fixe — compteurs
  source: 9,      // chasse fixe — références et textes de loi
  fil: 10.5,      // le fil d'Ariane
};

// Interlignes. 1,55 pour tout ce qui se lit en paragraphe : c'est la valeur qui
// tenait le mieux sur l'écran de test.
export const INTERLIGNE = 1.55;

// ── Espacement vertical ──────────────────────────────────────────────────────
// L'écart au-dessus d'un titre de section est volontairement grand : c'est le
// principal outil de découpage d'une fiche qui, sans lui, se lit comme un seul
// bloc de texte du début à la fin.
export const V = {
  zone: 20,        // marge latérale de la fiche
  ligne: 13,       // au-dessus d'une ligne
  ligneBas: 14,    // en dessous
  section: 40,     // au-dessus d'un titre de section
  bloc: 22,        // au-dessus d'un bloc à filet latéral
};
