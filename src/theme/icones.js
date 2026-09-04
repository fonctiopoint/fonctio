// src/theme/icones.js
// ─────────────────────────────────────────────────────────────────────────────
// Les icônes de navigation, en trait, tirées d'Ionicons.
//
// Elles remplacent les emoji de module (🏥 👷 🦺 ♿ 👶 🩺 ⚖️ 🛡️ 📈 🎯) depuis le
// 04/09/2026. Un emoji est un petit dessin en couleurs, avec son propre style
// graphique, dessiné par Apple ou Google : dans une page qui ne compte que de
// l'encre, deux familles typographiques et quatre teintes, il détonne, et il
// ne se met pas à la couleur du module. Une icône en trait, elle, prend la
// couleur qu'on lui donne et pèse le même poids visuel que le texte à côté.
//
// La table est ici, et non dans fiches.js : c'est un choix de présentation, et
// toucher fiches.js ferait dériver les empreintes de suivi_fiches.py.
//
// Un module absent de la table retombe sur une icône neutre — moins parlante,
// jamais cassée.
// ─────────────────────────────────────────────────────────────────────────────

export const ICONE_MODULE = {
  sante: 'medkit-outline',
  contractuels: 'briefcase-outline',
  atmp: 'bandage-outline',
  inaptitude: 'accessibility-outline',
  'conges-specifiques': 'people-outline',
  medecine: 'chatbubbles-outline',
  'vieau-travail': 'shield-outline',
  psc: 'umbrella-outline',
  carriere: 'trending-up-outline',
  retraite: 'hourglass-outline',
};

export const iconeDeModule = (moduleId) => ICONE_MODULE[moduleId] || 'folder-open-outline';

// Les trois versants, pour l'écran de bienvenue.
export const ICONE_VERSANT = {
  fpe: 'library-outline',      // l'État — le fronton
  fpt: 'business-outline',     // la collectivité — l'immeuble
  fph: 'medkit-outline',       // l'hôpital
};
