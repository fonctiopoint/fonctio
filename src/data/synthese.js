// src/data/synthese.js
// ─────────────────────────────────────────────────────────────────────────────
// SURCOUCHE ÉDITORIALE DE LA DIRECTION « REGISTRE »
//
// Ce fichier ne contient AUCUNE donnée juridique. Il ne fait que dire, pour une
// fiche donnée :
//   — quels trois chiffres méritent la bande de tête ;
//   — comment se lit chaque valeur : à la baisse, maintenue, ou ni l'un ni
//     l'autre ;
//   — sous quel libellé présenter le paragraphe de recours.
//
// Il est séparé de fiches.js pour deux raisons. La première est que fiches.js
// est le texte de référence, relu et vérifié ligne à ligne ; on n'y mêle pas
// des choix de présentation. La seconde est mécanique : toucher fiches.js
// change les empreintes SHA-256 et suivi_fiches.py signale alors tous les
// épisodes vidéo couverts comme « fiche modifiée depuis le tournage ».
//
// TOUT EST FACULTATIF. Une fiche absente d'ici s'affiche sans bande de
// synthèse et avec des valeurs en encre neutre : moins renseignée, jamais
// fausse. C'est le bon défaut — une teinte absente n'induit personne en erreur,
// une teinte fausse, si.
//
// LES CLÉS DE `lecture` SONT LES `label` DE `droits`, au mot près. Un libellé
// qui ne correspond à rien retombe silencieusement sur « neutre ».
// ─────────────────────────────────────────────────────────────────────────────

export const SYNTHESE = {
  cmo: {
    // Deux montants et un délai de procédure. Le troisième chiffre n'est jamais
    // une rémunération : c'est ce que l'agent doit faire, et quand.
    chiffres: [
      { n: '90 %', c: 'mois 1 à 3', ton: 'baisse' },
      { n: '50 %', c: 'mois 4 à 12', ton: 'baisse' },
      { n: '48 h', c: 'pour transmettre', ton: 'neutre' },
    ],
    lecture: {
      // FPE
      '90 % traitement + 90 % primes': 'baisse',
      '50 % traitement + 50 % primes': 'baisse',
      // FPH
      '90 % du traitement': 'baisse',
      '50 % du traitement': 'baisse',
      'Primes en FPH': 'neutre',
      // FPT
      '90 % traitement': 'baisse',
      '50 % traitement': 'baisse',
      // Communs
      'Période de référence': 'neutre',
      'Jour de carence': 'baisse',
      'Cure thermale': 'tient',
      "Congé d'office": 'neutre',
    },
    // Le texte du recours reste celui de fiches.js, au mot près : on ne lui
    // ajoute qu'un libellé et un délai à balayer.
    recours: { label: 'Refus de congé', valeur: '2 mois' },
  },
};

export const getSynthese = (ficheId) => SYNTHESE[ficheId] || null;

// Teinte de lecture d'une valeur. Retombe sur « neutre » dès qu'on n'a pas
// tranché : c'est délibéré, voir l'en-tête.
export const tonDuDroit = (ficheId, label) =>
  SYNTHESE[ficheId]?.lecture?.[label] || 'neutre';
