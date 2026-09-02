// src/data/synthese.js
// ─────────────────────────────────────────────────────────────────────────────
// SURCOUCHE ÉDITORIALE DE LA DIRECTION « REGISTRE »
//
// Ce fichier ne contient AUCUNE donnée juridique nouvelle. Il ne fait que dire,
// pour une fiche donnée :
//   — quels chiffres méritent la bande de tête ;
//   — sous quel libellé et quel délai présenter le paragraphe de recours.
//
// RÈGLE ABSOLUE : tout chiffre écrit ici doit se retrouver TEL QUEL dans la
// fiche correspondante de fiches.js — dans la valeur d'un droit, dans une puce,
// ou dans le titre d'une étape. On ne calcule rien, on ne déduit rien, on ne
// résume rien. La bande de tête est un raccourci de lecture, pas une source.
//
// Il est séparé de fiches.js pour deux raisons. La première est que fiches.js
// est le texte de référence, relu et vérifié ligne à ligne ; on n'y mêle pas
// des choix de présentation. La seconde est mécanique : toucher fiches.js
// change les empreintes SHA-256 et suivi_fiches.py signale alors tous les
// épisodes vidéo couverts comme « fiche modifiée depuis le tournage ».
//
// TOUT EST FACULTATIF. Une fiche absente d'ici s'affiche simplement sans bande
// de synthèse : moins renseignée, jamais fausse. C'est le cas de toutes les
// fiches qui ne portent pas de chiffre marquant — l'assistant de service
// social, le harcèlement, la protection fonctionnelle — et c'est très bien
// ainsi : une bande de chiffres inventés serait pire que pas de bande.
//
// DEUX OU TROIS CHIFFRES, pas davantage : la bande fait trois colonnes égales
// et n'en supporte pas plus. Deux suffisent quand la fiche n'en porte que deux.
//
// `chiffresParVersant` remplace `chiffres` quand la règle diffère selon le
// versant — le CLM, par exemple, verse 60 % en 2e et 3e années à l'État et
// 50 % ailleurs. Un versant absent de la table n'a pas de bande.
//
// Un classement des valeurs en « dégressif » / « maintenu » a existé ici entre
// le 01 et le 02/09/2026. Il a été retiré : il fallait trancher le sens de
// chaque valeur des 43 fiches, et une teinte fausse trompe plus qu'une teinte
// absente n'aide.
// ─────────────────────────────────────────────────────────────────────────────

export const SYNTHESE = {
  // ── Santé & Congés maladie ────────────────────────────────────────────────
  cmo: {
    chiffres: [
      { n: '90 %', c: 'mois 1 à 3' },
      { n: '50 %', c: 'mois 4 à 12' },
      { n: '48 h', c: 'pour transmettre' },
    ],
    // Le texte du recours reste celui de fiches.js, au mot près : on ne lui
    // ajoute qu'un libellé et un délai à balayer.
    recours: { label: 'Refus de congé', valeur: '2 mois' },
  },

  clm: {
    chiffresParVersant: {
      fpe: [
        { n: '100 %', c: '1re année' },
        { n: '60 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
      fpt: [
        { n: '100 %', c: '1re année' },
        { n: '50 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
      fph: [
        { n: '100 %', c: '1re année' },
        { n: '50 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
    },
  },

  cld: {
    chiffres: [
      { n: '3 ans', c: 'plein traitement' },
      { n: '2 ans', c: 'à 50 %' },
      { n: '5 ans', c: 'par groupe' },
    ],
  },

  tpt: {
    chiffres: [
      { n: '100 %', c: 'du traitement' },
      { n: '1 an', c: 'par autorisation' },
      { n: '30 j', c: 'délai de décision' },
    ],
  },

  'temps-partiel': {
    chiffres: [
      { n: '85,71 %', c: 'payé à 80 %' },
      { n: '91,43 %', c: 'payé à 90 %' },
    ],
  },

  // ── Droits des contractuels ───────────────────────────────────────────────
  // FPT et FPH n'ont pas de bande : leur régime est un escalier d'ancienneté
  // que deux ou trois chiffres ne résument pas sans tromper.
  'cmo-contractuels': {
    chiffresParVersant: {
      fpe: [
        { n: '90 %', c: '3 premiers mois' },
        { n: '50 %', c: '9 mois suivants' },
      ],
    },
  },

  cgm: {
    chiffresParVersant: {
      fpe: [
        { n: '100 %', c: '1re année' },
        { n: '60 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
      fpt: [
        { n: '100 %', c: '1re année' },
        { n: '50 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
      fph: [
        { n: '100 %', c: '1re année' },
        { n: '50 %', c: '2e et 3e années' },
        { n: '3 ans', c: 'durée maximale' },
      ],
    },
  },

  'cdi-public': {
    chiffres: [
      { n: '6 ans', c: 'puis CDI de droit' },
    ],
  },

  // ── Accidents de travail & maladies professionnelles ──────────────────────
  ati: {
    chiffres: [
      { n: '10 %', c: 'taux minimum' },
      { n: '1 an', c: 'délai de demande' },
      { n: '5 ans', c: 'durée initiale' },
    ],
  },

  'at-contractuels': {
    chiffres: [
      { n: '1 mois', c: 'de plein traitement' },
    ],
  },

  // ── Inaptitude & reclassement ─────────────────────────────────────────────
  'inaptitude-def': {
    chiffres: [
      { n: '30 j', c: 'puis visite de reprise' },
    ],
  },

  reclassement: {
    chiffres: [
      { n: '1 an', c: 'de préparation, payé' },
    ],
  },

  rqth: {
    chiffres: [
      { n: '1 à 5 ans', c: 'renouvelables' },
    ],
  },

  // ── Congés familiaux ──────────────────────────────────────────────────────
  'conge-maternite': {
    chiffres: [
      { n: '16 sem.', c: '1er ou 2e enfant' },
      { n: '26 sem.', c: '3e enfant ou plus' },
      { n: '100 %', c: 'du traitement' },
    ],
  },

  'conge-patho': {
    chiffres: [
      { n: '21 j', c: 'en prénatal' },
      { n: '4 sem.', c: 'en postnatal' },
      { n: '100 %', c: 'du traitement' },
    ],
  },

  'conge-paternite': {
    chiffres: [
      { n: '25 j', c: 'naissance simple' },
      { n: '32 j', c: 'naissances multiples' },
      { n: '100 %', c: 'du traitement' },
    ],
  },

  'conge-naissance': {
    chiffres: [
      { n: '1 ou 2 mois', c: 'au choix' },
      { n: '≥ 50 %', c: 'titulaires, dégressif' },
      { n: '70 %', c: 'contractuels, puis 60 %' },
    ],
  },

  'conge-adoption': {
    chiffres: [
      { n: '10 sem.', c: '1er ou 2e enfant' },
      { n: '18 sem.', c: '3e enfant ou plus' },
      { n: '100 %', c: 'du traitement' },
    ],
  },

  'conge-parental': {
    chiffres: [
      { n: '3 ans', c: "jusqu'aux 3 ans de l'enfant" },
      { n: '15 mois', c: 'report des congés annuels' },
      { n: '5 ans', c: "d'avancement conservé" },
    ],
  },

  // ── Vos interlocuteurs ────────────────────────────────────────────────────
  prevention: {
    chiffres: [
      { n: '5 ans', c: 'entre deux visites' },
      { n: '4 ans', c: 'si suivi renforcé' },
    ],
  },

  // ── Protection sociale complémentaire ─────────────────────────────────────
  // La FPH n'a pas de bande : sa participation est reportée à 2027, il n'y a
  // donc aucun chiffre en vigueur à afficher.
  'psc-reforme': {
    chiffresParVersant: {
      fpe: [
        { n: '50 %', c: 'part employeur santé' },
      ],
      fpt: [
        { n: '50 %', c: 'santé, depuis 2026' },
        { n: '20 %', c: 'prévoyance, depuis 2025' },
      ],
    },
  },

  // ── Carrière & formation ──────────────────────────────────────────────────
  evaluation: {
    chiffres: [
      { n: '15 j', c: 'recours hiérarchique' },
      { n: '1 mois', c: 'saisine de la CAP' },
    ],
  },

  'conge-formation': {
    chiffres: [
      { n: '3 ans', c: 'sur la carrière' },
      { n: '85 %', c: 'du traitement' },
      { n: '120 j', c: 'avant la formation' },
    ],
  },

  // ── Retraite ──────────────────────────────────────────────────────────────
  'retraite-cnracl': {
    chiffres: [
      { n: '64 ans', c: 'à partir de 1969' },
      { n: '43 ans', c: 'de cotisation' },
      { n: '75 %', c: 'du dernier traitement' },
    ],
  },

  'retraite-sre': {
    chiffres: [
      { n: '75 %', c: 'du dernier traitement' },
      { n: '59 ans', c: 'en catégorie active' },
      { n: '17 ans', c: 'de services actifs' },
    ],
  },

  'retraite-invalidite': {
    chiffres: [
      { n: '50 %', c: 'si invalidité ≥ 60 %' },
      { n: '80 %', c: 'cas exceptionnels' },
    ],
  },

  rafp: {
    chiffres: [
      { n: '10 %', c: '5 % agent, 5 % employeur' },
    ],
  },
};

// Renvoie la synthèse d'une fiche pour un versant donné. `chiffres` vaut null
// quand la fiche n'a pas de bande, ou quand ce versant n'en a pas.
export const getSynthese = (ficheId, versant) => {
  const s = SYNTHESE[ficheId];
  if (!s) return null;
  const chiffres = s.chiffresParVersant ? s.chiffresParVersant[versant] : s.chiffres;
  return { ...s, chiffres: chiffres || null };
};
