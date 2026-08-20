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
    id: "decret-2026-705",
    date: "2026-07-31",
    publie: "2026-07-31",
    rectificatif: null,
    vigueur: "2026-09-01",
    fiches: ["cmo", "clm", "cld", "tpt"],
    versants: ["fpe", "fpt", "fph"],
    portee: "refonte",
    titre: "Arrêt maladie : contrôle à domicile possible et rémunération suspendue en cas d'absence",
    resume: "À compter du 1er septembre 2026, l'administration peut faire contrôler par une personne habilitée votre présence à domicile (ou au lieu de repos déclaré) pendant les heures de sortie non autorisées, en congé de maladie, de longue maladie ou de longue durée : une absence injustifiée ou un refus de contrôle interrompt le versement de la rémunération jusqu'à la fin de l'arrêt, sans pour autant prolonger le congé, ce temps restant décompté. L'avis d'arrêt de travail doit respecter les règles du code de la sécurité sociale (durée maximale de prescription, prolongation par un prescripteur autorisé sous peine de perte du maintien de rémunération), et l'examen médical par médecin agréé peut désormais se tenir à distance. Le temps partiel thérapeutique est accordé dans la limite d'un an, la décision devant intervenir au plus tard au jour de la reprise après CLM/CLD/AT-MP, ou sous 30 jours dans les autres cas (à partir du 1er août 2026) ; en congé de longue maladie ou de grave maladie, les majorations et indexations outre-mer sont maintenues dans la même proportion que le traitement pour les rémunérations dues à compter du 1er septembre 2026.",
    source: {
      texte: "Décret n° 2026-705 du 29 juillet 2026 relatif aux congés pour raisons de santé des agents publics civils et militaires",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054570030",
    },
    integre: false,
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
