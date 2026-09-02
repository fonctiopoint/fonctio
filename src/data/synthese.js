// src/data/synthese.js
// ─────────────────────────────────────────────────────────────────────────────
// SURCOUCHE ÉDITORIALE DE LA DIRECTION « REGISTRE »
//
// Ce fichier ne contient AUCUNE donnée juridique. Il ne fait que dire, pour une
// fiche donnée :
//   — quels trois chiffres méritent la bande de tête ;
//   — sous quel libellé et quel délai présenter le paragraphe de recours.
//
// Il est séparé de fiches.js pour deux raisons. La première est que fiches.js
// est le texte de référence, relu et vérifié ligne à ligne ; on n'y mêle pas
// des choix de présentation. La seconde est mécanique : toucher fiches.js
// change les empreintes SHA-256 et suivi_fiches.py signale alors tous les
// épisodes vidéo couverts comme « fiche modifiée depuis le tournage ».
//
// TOUT EST FACULTATIF. Une fiche absente d'ici s'affiche simplement sans bande
// de synthèse : moins renseignée, jamais fausse.
//
// Un classement des valeurs en « dégressif » / « maintenu » a existé ici entre
// le 01 et le 02/09/2026. Il a été retiré : il fallait trancher le sens de
// chaque valeur des 43 fiches, et une teinte fausse trompe plus qu'une teinte
// absente n'aide. Toutes les valeurs prennent désormais la même couleur.
// ─────────────────────────────────────────────────────────────────────────────

export const SYNTHESE = {
  cmo: {
    // Deux montants et un délai de procédure. Le troisième chiffre n'est jamais
    // une rémunération : c'est ce que l'agent doit faire, et quand.
    chiffres: [
      { n: '90 %', c: 'mois 1 à 3' },
      { n: '50 %', c: 'mois 4 à 12' },
      { n: '48 h', c: 'pour transmettre' },
    ],
    // Le texte du recours reste celui de fiches.js, au mot près : on ne lui
    // ajoute qu'un libellé et un délai à balayer.
    recours: { label: 'Refus de congé', valeur: '2 mois' },
  },
};

export const getSynthese = (ficheId) => SYNTHESE[ficheId] || null;
