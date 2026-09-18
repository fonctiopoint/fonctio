// src/data/synthese.js
// ─────────────────────────────────────────────────────────────────────────────
// SURCOUCHE ÉDITORIALE DE LA DIRECTION « REGISTRE »
//
// Ce fichier ne contient AUCUNE donnée juridique nouvelle. Il ne fait que dire,
// pour une fiche donnée :
//   — quels chiffres méritent la bande de tête ;
//   — sous quel libellé et quel délai présenter le paragraphe de recours ;
//   — sous quel libellé présenter la rubrique des droits, quand « Ce que vous
//     percevez » annonce des montants que la fiche ne porte pas. C'est le cas
//     de 15 fiches sur 43 : rôles, instances, procédures et garanties.
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
    // La FPE est forfaitaire depuis le 01/09/2024 ; la FPT et la FPH restent
    // progressives selon l'ancienneté. C'est la différence que la bande doit
    // faire voir, sinon un contractuel territorial lit le régime de l'État.
    chiffresParVersant: {
      fpe: [
        { n: '90 %', c: '3 premiers mois' },
        { n: '50 %', c: '9 mois suivants' },
      ],
      fpt: [
        { n: '4 mois', c: "d'ancienneté minimum" },
        { n: '90 %', c: '1 à 3 mois selon ancienneté' },
        { n: '50 %', c: 'puis autant de mois' },
      ],
      fph: [
        { n: '4 mois', c: "d'ancienneté minimum" },
        { n: '90 %', c: '1 à 3 mois selon ancienneté' },
        { n: '50 %', c: 'puis autant de mois' },
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
    droits: { label: 'Ce à quoi vous avez droit' },
    chiffres: [
      { n: '6 ans', c: 'de services requis' },
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
  // La visite de reprise après 30 jours n'existe qu'à l'hôpital, par l'article
  // R. 4626-29 du code du travail — et elle suit la reprise au lieu de la
  // conditionner. La bande l'annonçait pour les trois versants. Les deux
  // autres ne portent aucun chiffre marquant sur cette fiche : ils n'ont donc
  // pas de bande, ce qui vaut mieux qu'une bande fausse.
  'inaptitude-def': {
    droits: { label: "Ce qu'il faut savoir" },
    chiffresParVersant: {
      fph: [
        { n: '30 jours', c: 'ouvrent la visite de reprise' },
      ],
    },
  },

  reclassement: {
    chiffres: [
      { n: '1 an', c: 'de préparation, payé' },
    ],
  },

  rqth: {
    droits: { label: 'Ce que la RQTH ouvre' },
    chiffres: [
      { n: '1 à 10 ans', c: 'ou sans limite' },
    ],
  },

  // ── Congés familiaux ──────────────────────────────────────────────────────
  'conge-maternite': {
    chiffres: [
      { n: '16 semaines', c: '1er ou 2e enfant' },
      { n: '26 semaines', c: '3e enfant ou plus' },
      { n: '100 %', c: 'du traitement' },
    ],
  },

  'conge-patho': {
    chiffres: [
      { n: '21 j', c: 'en prénatal' },
      { n: '4 semaines', c: 'en postnatal' },
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

  // Le taux est le meme pour les titulaires et les contractuels : 70 % puis
  // 60 % du traitement (decret 2026-428, et art. 15 du decret 86-83 pour les
  // contractuels). La bande annoncait un regime degressif « jamais sous 50 % »
  // pour les titulaires : il n'existe pas.
  'conge-naissance': {
    chiffres: [
      { n: '1 ou 2 mois', c: 'au choix' },
      { n: '70 %', c: 'le 1er mois, puis 60 %' },
      { n: '9 mois', c: 'pour le prendre' },
    ],
  },

  'conge-adoption': {
    chiffres: [
      { n: '16 semaines', c: '1er ou 2e enfant' },
      { n: '18 semaines', c: '3e enfant ou plus' },
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
    droits: { label: 'Ce à quoi vous avez droit' },
    chiffresParVersant: {
      fpe: [
        { n: '5 ans', c: 'entre deux visites' },
        { n: '4 ans', c: 'si suivi renforcé' },
      ],
      fpt: [
        { n: '5 ans', c: 'entre deux visites' },
        { n: '4 ans', c: 'si suivi renforcé' },
      ],
      fph: [
        { n: '24 mois', c: 'entre deux examens' },
      ],
    },
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
      fph: [
        { n: '50 %', c: 'part employeur santé' },
        { n: '2027', c: 'entrée en vigueur' },
      ],
    },
  },

  // ── Carrière & formation ──────────────────────────────────────────────────
  evaluation: {
    droits: { label: 'Ce que prévoit la règle' },
    recours: { label: 'Contester votre évaluation' },
    chiffres: [
      { n: '15 j', c: 'recours hiérarchique' },
      { n: '1 mois', c: 'saisine de la CAP' },
    ],
  },

  sft: {
    chiffres: [
      { n: '2,29 €', c: '1 enfant, fixe' },
      { n: '10,67 €', c: '2 enfants, + 3 %' },
      { n: '+ 6 %', c: 'par enfant au-delà du 3e' },
    ],
  },

  'conge-formation': {
    // Le délai de dépôt est la seule valeur de cette fiche qui change d'un
    // versant à l'autre, et c'est aussi celle qui fait rejeter les demandes.
    chiffresParVersant: {
      fpe: [
        { n: '3 ans', c: 'sur la carrière' },
        { n: '85 %', c: 'du traitement' },
        { n: '120 j', c: 'avant la formation' },
      ],
      fpt: [
        { n: '3 ans', c: 'sur la carrière' },
        { n: '85 %', c: 'du traitement' },
        { n: '90 j', c: 'avant la formation' },
      ],
      fph: [
        { n: '3 ans', c: 'sur la carrière' },
        { n: '85 %', c: 'du traitement' },
        { n: '60 j', c: 'avant la formation' },
      ],
    },
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

  // Le plafond des cas exceptionnels n'est pas le même des deux côtés :
  // 75 % à l'État (art. L. 28 renvoyant au maximum de l'art. L. 13), 80 % au
  // régime CNRACL (art. 38 du décret 2003-1306).
  'retraite-invalidite': {
    chiffresParVersant: {
      fpe: [
        { n: '50 %', c: 'si invalidité ≥ 60 %' },
        { n: '75 %', c: 'cas exceptionnels' },
      ],
      fpt: [
        { n: '50 %', c: 'si invalidité ≥ 60 %' },
        { n: '80 %', c: 'cas exceptionnels' },
      ],
      fph: [
        { n: '50 %', c: 'si invalidité ≥ 60 %' },
        { n: '80 %', c: 'cas exceptionnels' },
      ],
    },
  },

  rafp: {
    chiffres: [
      { n: '10 %', c: '5 % agent, 5 % employeur' },
    ],
  },
  'conseil-medical': {
    droits: { label: 'Ce que fait le conseil médical' },
    recours: { label: 'Contester un avis' },
  },
  'delegations-sociales': {
    droits: { label: 'Qui fait quoi' },
  },
  'fiche-signalement': {
    recours: { label: 'Si le signalement reste sans suite' },
  },
  'formation-pendant-conge': {
    droits: { label: 'Ce que dit la règle' },
  },
  harcelement: {
    droits: { label: 'Ce que la loi garantit' },
    recours: { label: 'Vers qui se tourner' },
  },
  'maladie-pro': {
    droits: { label: "Ce qu'il faut savoir" },
  },
  'medecine-statutaire': {
    droits: { label: 'Qui fait quoi' },
  },
  prevoyance: {
    droits: { label: 'Ce que la prévoyance couvre' },
  },
  'protection-fonctionnelle': {
    droits: { label: 'Ce que la protection couvre' },
  },
  'role-ass': {
    droits: { label: 'Ce qui vous est garanti' },
    recours: { label: 'En cas de manquement au secret' },
  },
  'role-assistant-prevention': {
    droits: { label: 'Ce que prévoit le texte' },
    recours: { label: "En cas d'entrave à ses missions" },
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
