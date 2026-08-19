// src/data/veille.js
// ─────────────────────────────────────────────────────────────────────────────
// SURCOUCHE DE VEILLE JURIDIQUE
//
// Ce fichier est la seule cible d'écriture de la veille automatique.
// fiches.js reste écrit à la main et n'est JAMAIS modifié par une machine.
//
// Chaque entrée signale qu'un texte est paru et sur quelles fiches il porte.
// L'app affiche ces entrées en tête des fiches concernées, ce qui permet de
// publier une information juridique en quelques minutes (eas update) sans
// attendre la réécriture complète de la fiche.
//
// CYCLE DE VIE D'UNE ENTRÉE
//   1. La veille détecte un texte      → entrée créée avec integre: false
//   2. L'app affiche « ⚖️ Évolution non encore intégrée » sur la fiche
//   3. Tu réécris la fiche dans fiches.js quand tu as le temps
//   4. Tu passes integre: true         → l'entrée devient un marqueur de
//                                        fraîcheur discret « À jour au … »
//
// Une entrée n'est jamais supprimée : elle constitue l'historique de la fiche.
//
// CHAMPS
//   id         identifiant stable, sert de clé de déduplication
//   date       date du texte (AAAA-MM-JJ)
//   publie     date de publication au JO
//   rectificatif  date d'un éventuel rectificatif au JO, sinon null
//   vigueur    entrée en vigueur, ou null si immédiate
//   fiches     ids de fiches concernées, tels qu'ils figurent dans fiches.js
//   versants   'fpe' | 'fpt' | 'fph' — RESTREINDRE quand le texte ne vise
//              qu'un versant (ex. décret 2024-641 : État uniquement)
//   portee     'info'   → contexte, ne change aucun droit
//              'modif'  → modifie un droit ou une procédure
//              'refonte'→ change le régime en profondeur
//   titre      formulation courte, orientée agent
//   resume     ce qui change concrètement, 1 à 3 phrases
//   source     { texte, url } — url vers Légifrance de préférence
//   integre    true si le texte de la fiche reflète déjà ce changement
// ─────────────────────────────────────────────────────────────────────────────

export const VEILLE = [
  /* @veille:start — zone gérée par l'admin Fonctio — ne pas éditer à la main */
  {
    id: 'decret-2026-705',
    date: '2026-07-29',
    publie: '2026-07-31',
    rectificatif: '2026-08-08',
    vigueur: '2026-09-01',
    fiches: ['cmo', 'tpt'],
    versants: ['fpe', 'fpt', 'fph'],
    portee: 'modif',
    titre: 'Arrêts de travail et temps partiel thérapeutique : nouvelles règles',
    resume:
      "L'arrêt initial est plafonné à 1 mois et la prolongation à 2 mois. Le contrôle à domicile peut être effectué par toute personne habilitée, et non plus seulement par un médecin agréé. Pour le TPT, le contrôle systématique par médecin agréé au-delà de trois mois est supprimé.",
    source: {
      texte: 'Décret n° 2026-705 du 29 juillet 2026 relatif aux congés pour raisons de santé des agents publics civils et militaires',
      url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054570030',
    },
    integre: true,
  },
  /* @veille:end */
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const parPlusRecent = (a, b) => (b.date || '').localeCompare(a.date || '');

/** Entrées concernant une fiche, filtrées par versant, plus récentes d'abord. */
export const getMajsForFiche = (ficheId, versant) =>
  VEILLE
    .filter(v => v.fiches?.includes(ficheId))
    .filter(v => !versant || !v.versants || v.versants.includes(versant))
    .sort(parPlusRecent);

/** Entrées pas encore répercutées dans le texte de la fiche. */
export const getMajsEnAttente = (ficheId, versant) =>
  getMajsForFiche(ficheId, versant).filter(v => !v.integre);

/** Fil d'actualité juridique, tous sujets confondus. */
export const getMajsRecentes = (versant, limite = 20) =>
  VEILLE
    .filter(v => !versant || !v.versants || v.versants.includes(versant))
    .sort(parPlusRecent)
    .slice(0, limite);
