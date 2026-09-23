// src/data/courriers.js
// ─────────────────────────────────────────────────────────────────────────────
// Les modèles de courrier attachés aux fiches.
//
// PRINCIPE. Un modèle n'existe que pour une démarche que l'agent accomplit
// LUI-MÊME, par écrit, auprès d'une administration ou d'un organisme. Les
// saisines juridictionnelles — requête au tribunal administratif, référé,
// plainte pénale, saisine du pôle social — n'ont volontairement PAS de modèle :
// elles obéissent à des règles de forme précises, et un modèle approximatif
// exposerait l'agent à une irrecevabilité. Pour ces fiches, le courrier proposé
// est le recours administratif qui PRÉCÈDE la saisine du juge : c'est lui qui
// interrompt le délai, et il est de toute façon le premier geste utile.
//
// SQUELETTE COMMUN. Le cadre procédural est le même pour tous les recours
// administratifs et n'a été vérifié qu'une fois, aux textes :
//   — CRPA art. L. 411-2  : le recours gracieux ou hiérarchique formé dans le
//     délai contentieux INTERROMPT ce délai.
//   — CRPA art. L. 231-4, 5° : dans les relations entre l'administration et ses
//     agents, le silence de deux mois vaut REJET. C'est une exception expresse
//     au principe « silence vaut acceptation » — elle vise nommément les agents
//     publics, donc tout le public de l'application.
//   — CJA art. R. 421-1 : deux mois à compter de la notification.
//   — CJA art. R. 421-2 : sur rejet implicite, deux mois à compter de sa
//     naissance, et la date de dépôt de la demande doit être établie à l'appui
//     de la requête — d'où le conseil de conserver une preuve d'envoi.
//   — CJA art. R. 421-5 : les délais ne sont opposables qu'à la condition
//     d'avoir été mentionnés, avec les voies de recours, dans la notification.
//
// Ce qui varie d'une fiche à l'autre tient en trois phrases : la décision
// contestée, le fondement, la demande. Le fondement est repris des sources déjà
// vérifiées de la fiche — il n'est jamais réécrit de mémoire.
//
// ZONES À COMPLÉTER. Toujours entre crochets et en capitales. L'écran les
// repère avec MOTIF_ZONE pour les mettre en évidence ; ne pas changer la
// convention sans changer l'expression régulière.
// ─────────────────────────────────────────────────────────────────────────────

export const MOTIF_ZONE = /(\[[^\]]+\])/g;

const SIGNATURE = `[PRÉNOM NOM]
[GRADE OU FONCTION]
[SERVICE OU DIRECTION]
[NUMÉRO DE TÉLÉPHONE]`;

const POLITESSE = "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.";

const EXPOSE = '[EXPOSEZ ICI VOTRE SITUATION EN QUELQUES LIGNES : les faits, les dates, '
  + "et les éléments que vous souhaitez porter à la connaissance de l'administration.]";

const ACCUSE = 'Je me tiens à votre disposition pour tout élément complémentaire et vous '
  + 'remercie de bien vouloir accuser réception de la présente.';

// ── Rappels de procédure ────────────────────────────────────────────────────
// Affichés dans l'écran, jamais dans le courrier : ils s'adressent à l'agent,
// pas à l'administration.

const RAPPELS_ADMIN = [
  'Vous avez deux mois à compter de la notification de la décision pour envoyer ce courrier. '
  + 'Envoyé dans ce délai, il interrompt le délai de recours devant le tribunal administratif : '
  + 'vous ne perdez donc rien à le tenter. Source : CRPA art. L. 411-2 et CJA art. R. 421-1',

  "Si l'administration ne répond pas dans les deux mois, son silence vaut rejet. C'est la règle "
  + "propre aux relations entre l'administration et ses agents, et non le principe « silence vaut "
  + 'acceptation ». Source : CRPA art. L. 231-4, 5°',

  "Conservez une preuve d'envoi — lettre recommandée avec accusé de réception, ou accusé de "
  + "réception électronique. En cas de rejet implicite, c'est à vous d'établir la date de dépôt "
  + 'devant le juge. Source : CJA art. R. 421-2',

  'Si la décision ne mentionne ni les voies ni les délais de recours, le délai de deux mois ne '
  + "vous est pas opposable : vous n'êtes pas forclos. Source : CJA art. R. 421-5",

  'Un recours gracieux et un recours hiérarchique peuvent être formés en même temps. Le délai ne '
  + "recommence à courir que lorsque les deux ont été rejetés. Source : CRPA art. L. 411-2",
];

// Une demande initiale n'est précédée d'aucune décision : les rappels communs,
// qui font courir deux mois « à compter de la notification de la décision »,
// n'ont rien à y faire. Ceux-ci décrivent le chemin inverse — ce qui se passe
// APRÈS la demande, et à partir de quand un recours devient possible.
const RAPPELS_DEMANDE = [
  "Formulez votre demande par écrit et datez-la : c'est elle qui fait courir les délais, et une "
  + 'demande verbale ne laisse aucune trace. Conservez-en une copie.',

  "Conservez une preuve d'envoi — lettre recommandée avec accusé de réception, ou accusé de "
  + "réception électronique. Si l'administration garde le silence, c'est à vous d'établir la date "
  + 'de dépôt de votre demande. Source : CJA art. R. 421-2',

  "Si l'administration ne répond pas dans les deux mois, son silence vaut rejet. C'est la règle "
  + "propre aux relations entre l'administration et ses agents, et non le principe « silence vaut "
  + 'acceptation ». Source : CRPA art. L. 231-4, 5°',

  'À compter de ce rejet, exprès ou implicite, vous disposez de deux mois pour former un recours '
  + 'gracieux ou hiérarchique, ou pour saisir le tribunal administratif. Source : CRPA '
  + 'art. L. 411-2 et CJA art. R. 421-1',
];

const RAPPELS_RAPO = [
  'Ce recours est obligatoire : sans lui, le juge déclarera votre demande irrecevable. Il doit être '
  + 'formé dans les deux mois suivant la notification de la décision. Source : art. R. 241-35 à '
  + 'R. 241-41 du code de l\'action sociale et des familles',

  "Conservez une preuve d'envoi. En cas de rejet, vous disposez de deux mois pour saisir le pôle "
  + 'social du tribunal judiciaire.',

  'Si la décision ne mentionne ni les voies ni les délais de recours, le délai ne vous est pas '
  + 'opposable.',
];

const RAPPELS_CRA = [
  'La commission de recours amiable doit être saisie dans les deux mois suivant la notification de '
  + 'la décision de la caisse. Cette étape est obligatoire avant toute saisine du juge. '
  + 'Source : art. L. 142-4 et R. 142-1 du code de la sécurité sociale',

  "Cette voie vaut pour les décisions administratives de la caisse — un refus de prise en charge, "
  + "par exemple. Une contestation d'ordre purement médical (taux d'incapacité, date de "
  + 'consolidation) relève d\'une expertise médicale et non de cette commission.',

  "Conservez une preuve d'envoi : c'est à vous d'établir la date de votre réclamation.",
];

const RAPPELS_MEDICAL = [
  "Adressez ce courrier à votre administration, qui saisit le conseil médical : l'agent ne le "
  + 'saisit pas directement.',

  'Demandez par écrit la communication des conclusions médicales sur lesquelles la décision se '
  + "fonde. Vous pouvez vous faire assister du médecin de votre choix devant le conseil médical.",

  "Cette démarche ne remplace pas le recours contre la décision administrative elle-même : si une "
  + 'décision a déjà été prise, formez aussi un recours gracieux dans les deux mois.',
];

// ── Squelettes ──────────────────────────────────────────────────────────────
// Chacun reçoit le modèle et rend le corps du courrier.

const SQUELETTES = {
  gracieux: (m) => `Madame, Monsieur,

Par décision du [DATE DE LA DÉCISION], qui m'a été notifiée le [DATE DE NOTIFICATION], vous avez ${m.decision}.

Je forme un recours gracieux contre cette décision et vous demande de bien vouloir la réexaminer.

${EXPOSE}

${m.fondement}

${m.demande}

${ACCUSE}

${POLITESSE}

${SIGNATURE}`,

  demande: (m) => `Madame, Monsieur,

${m.decision}

${EXPOSE}

${m.fondement}

${m.demande}

${ACCUSE}

${POLITESSE}

${SIGNATURE}`,

  medical: (m) => `Madame, Monsieur,

À la suite de l'avis médical rendu le [DATE DE L'AVIS], dont les conclusions m'ont été communiquées le [DATE DE NOTIFICATION], ${m.decision}.

Je conteste ces conclusions et sollicite une contre-expertise médicale, ainsi que la saisine du conseil médical afin qu'il se prononce au vu d'un examen contradictoire.

[EXPOSEZ ICI LES ÉLÉMENTS MÉDICAUX QUE VOUS SOUHAITEZ VOIR PRIS EN COMPTE : comptes rendus, certificats, avis de votre médecin traitant ou de votre spécialiste.]

${m.fondement}

${m.demande}

Je vous remercie de bien vouloir me communiquer la date de la séance et les pièces sur lesquelles le conseil se prononcera.

${POLITESSE}

${SIGNATURE}`,

  hierarchique: (m) => `Madame, Monsieur,

Par décision du [DATE DE LA DÉCISION], qui m'a été notifiée le [DATE DE NOTIFICATION], ${m.decision}.

Je forme un recours hiérarchique contre cette décision et vous demande de bien vouloir la réformer.

${EXPOSE}

${m.fondement}

${m.demande}

${ACCUSE}

${POLITESSE}

${SIGNATURE}`,

  rapo: (m) => `Madame, Monsieur le Président de la commission des droits et de l'autonomie des personnes handicapées,

Par décision du [DATE DE LA DÉCISION], qui m'a été notifiée le [DATE DE NOTIFICATION], la commission a ${m.decision}.

Je forme un recours administratif préalable obligatoire contre cette décision et vous demande de bien vouloir la réexaminer.

[EXPOSEZ ICI VOTRE SITUATION : les conséquences de votre état de santé sur votre travail, les aménagements nécessaires, les éléments médicaux ou professionnels nouveaux.]

${m.fondement}

${m.demande}

${ACCUSE}

${POLITESSE}

Numéro de dossier MDPH : [NUMÉRO DE DOSSIER]

${SIGNATURE}`,

  cra: (m) => `Madame, Monsieur le Président de la commission de recours amiable,

Par décision du [DATE DE LA DÉCISION], qui m'a été notifiée le [DATE DE NOTIFICATION], la caisse a ${m.decision}.

Je forme une réclamation contre cette décision et vous demande de bien vouloir la réexaminer.

${EXPOSE}

${m.fondement}

${m.demande}

${ACCUSE}

${POLITESSE}

Numéro de sécurité sociale : [NUMÉRO DE SÉCURITÉ SOCIALE]

${SIGNATURE}`,
};

const RAPPELS = {
  gracieux: RAPPELS_ADMIN,
  demande: RAPPELS_DEMANDE,
  hierarchique: RAPPELS_ADMIN,
  medical: RAPPELS_MEDICAL,
  rapo: RAPPELS_RAPO,
  cra: RAPPELS_CRA,
};

const A_QUI = {
  gracieux: "À l'autorité qui a signé la décision — le plus souvent votre direction ou votre "
    + 'service des ressources humaines. Vous pouvez adresser le même courrier à son supérieur '
    + 'hiérarchique : les deux recours se cumulent.',
  demande: 'À votre autorité hiérarchique, avec copie à votre service des ressources humaines.',
  hierarchique: "À l'autorité hiérarchique supérieure à celle qui a pris la décision.",
  medical: 'À votre service des ressources humaines, qui saisit le conseil médical compétent.',
  rapo: 'À la maison départementale des personnes handicapées (MDPH) de votre département.',
  cra: "À la commission de recours amiable de votre caisse primaire d'assurance maladie.",
};

// ── Les modèles, fiche par fiche ────────────────────────────────────────────
// `fondement` peut être une chaîne, ou un objet { fpe, fpt, fph } quand le texte
// applicable diffère selon le versant.

const MODELES = {
  // ── Santé ─────────────────────────────────────────────────────────────────
  cmo: [{
    type: 'gracieux',
    titre: 'Refus de congé de maladie ordinaire',
    objet: 'Recours gracieux — congé de maladie ordinaire',
    decision: 'refusé de me placer en congé de maladie ordinaire',
    fondement: 'Les articles L. 822-1 à L. 822-5 du code général de la fonction publique ouvrent '
      + "droit au congé de maladie ordinaire sur production de l'avis d'arrêt de travail.",
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me placer en congé '
      + 'de maladie ordinaire à compter du [DATE DE DÉBUT DE L\'ARRÊT].',
  }],

  clm: [{
    type: 'gracieux',
    titre: 'Refus de congé de longue maladie',
    objet: 'Recours gracieux — congé de longue maladie',
    decision: 'refusé de me placer en congé de longue maladie',
    fondement: "Les articles L. 822-6 et suivants du code général de la fonction publique ouvrent "
      + "droit au congé de longue maladie lorsque l'affection rend nécessaires un traitement et "
      + 'des soins prolongés et présente un caractère invalidant et de gravité confirmée.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de saisir le conseil '
      + 'médical afin qu\'il se prononce sur ma situation.',
  }, {
    type: 'medical',
    titre: 'Contester l\'avis médical et demander une contre-expertise',
    objet: 'Demande de contre-expertise et de saisine du conseil médical',
    decision: "il a été conclu que mon état de santé ne justifiait pas un congé de longue maladie",
    fondement: 'Les décrets n° 2022-353 (État), n° 2022-350 (territoriale) et n° 2022-351 '
      + '(hospitalière) du 11 mars 2022 organisent la saisine du conseil médical et la procédure '
      + 'contradictoire devant lui.',
    demande: 'Je vous demande de bien vouloir saisir le conseil médical et de faire procéder à une '
      + 'contre-expertise par un médecin agréé autre que celui ayant rendu le premier avis.',
  }],

  cld: [{
    type: 'gracieux',
    titre: 'Refus de congé de longue durée',
    objet: 'Recours gracieux — congé de longue durée',
    decision: 'refusé mon placement en congé de longue durée',
    fondement: 'Les articles L. 822-12 à L. 822-17 du code général de la fonction publique ouvrent '
      + "droit au congé de longue durée pour les affections qu'ils visent. L'article L. 822-14 "
      + "précise que l'année de congé de longue maladie à plein traitement est réputée période de "
      + 'congé de longue durée pour la même affection.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de saisir le conseil '
      + 'médical afin qu\'il se prononce sur ma situation.',
  }],

  tpt: [{
    type: 'gracieux',
    titre: 'Refus de temps partiel thérapeutique',
    objet: 'Recours gracieux — temps partiel thérapeutique',
    decision: 'refusé ma demande de temps partiel thérapeutique',
    fondement: "L'article L. 823-1 du code général de la fonction publique ouvre droit au temps "
      + 'partiel thérapeutique, sans qu\'un arrêt de travail préalable soit exigé. Le décret '
      + 'n° 2026-705 du 29 juillet 2026 impose par ailleurs que le refus soit motivé.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision, de me communiquer les '
      + 'motifs précis du refus, et de m\'autoriser à reprendre mes fonctions à temps partiel '
      + 'thérapeutique à hauteur de [QUOTITÉ DEMANDÉE] à compter du [DATE SOUHAITÉE].',
  }],

  'dispo-office-sante': [{
    type: 'gracieux',
    titre: 'Contester un placement en disponibilité d\'office',
    objet: 'Recours gracieux — placement en disponibilité d\'office pour raison de santé',
    decision: 'décidé de me placer en disponibilité d\'office pour raison de santé',
    fondement: "Les articles L. 514-1 et suivants du code général de la fonction publique "
      + "encadrent la disponibilité d'office pour raison de santé, qui ne peut intervenir qu'une "
      + "fois les droits à congé épuisés et après avis du conseil médical. Le décret "
      + 'n° 2011-1245 du 5 octobre 2011 prévoit le maintien du demi-traitement dans l\'attente de '
      + 'la décision.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision, de me communiquer l\'avis '
      + 'du conseil médical sur lequel elle se fonde, et d\'examiner les possibilités '
      + 'd\'aménagement de poste ou de reclassement avant tout placement en disponibilité.',
  }],

  'formation-pendant-conge': [{
    type: 'gracieux',
    titre: 'Refus de formation pendant un congé de santé',
    objet: 'Recours gracieux — suivre une formation pendant mon congé de santé',
    decision: 'refusé ma demande de suivre une formation pendant mon congé de santé',
    fondement: 'Le décret n° 2026-705 du 29 juillet 2026, en vigueur depuis le 1er septembre 2026, '
      + 'ouvre aux agents en congé de santé — titulaires comme contractuels — le droit de suivre '
      + 'une action de formation, sous réserve d\'un avis médical favorable.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me communiquer les '
      + 'motifs du refus ainsi que, le cas échéant, l\'avis médical sur lequel il se fonde.',
  }],

  'temps-partiel': [{
    type: 'gracieux',
    titre: 'Refus de temps partiel de droit',
    objet: 'Recours gracieux — temps partiel de droit',
    decision: 'refusé ma demande de temps partiel de droit',
    fondement: "Les articles L. 612-1 et suivants du code général de la fonction publique ouvrent "
      + 'le temps partiel de droit dans les cas qu\'ils énumèrent. Lorsque la condition est '
      + "remplie, l'administration ne dispose pas d'un pouvoir d'appréciation.",
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de m\'accorder le temps '
      + 'partiel de droit à hauteur de [QUOTITÉ DEMANDÉE] à compter du [DATE SOUHAITÉE].',
  }],

  disponibilite: [{
    type: 'demande',
    titre: 'Demander une réintégration anticipée pour raison de santé',
    objet: 'Demande de réintégration anticipée pour raison de santé',
    decision: 'Placé(e) en disponibilité depuis le [DATE DE DÉBUT DE LA DISPONIBILITÉ], je sollicite '
      + 'ma réintégration anticipée pour raison de santé à compter du [DATE SOUHAITÉE].',
    fondement: 'Les articles L. 514-1 et suivants du code général de la fonction publique '
      + 'encadrent la disponibilité et les conditions de réintégration.',
    demande: 'Je vous demande de bien vouloir examiner ma demande et de me préciser les postes '
      + 'susceptibles de m\'être proposés.',
  }],

  // ── Contractuels ──────────────────────────────────────────────────────────
  'cmo-contractuels': [{
    type: 'gracieux',
    titre: 'Contester la durée de maintien du traitement',
    objet: 'Recours gracieux — maintien du traitement pendant mon congé de maladie',
    decision: 'fixé la durée de maintien de mon traitement pendant mon congé de maladie',
    fondement: {
      fpe: "L'article 12 du décret n° 86-83 du 17 janvier 1986 fixe les droits à congé de maladie "
        + 'des agents contractuels de l\'État et la durée du maintien du traitement.',
      fpt: "L'article 7 du décret n° 88-145 du 15 février 1988 fixe les droits à congé de maladie "
        + 'des agents contractuels territoriaux et la durée du maintien du traitement.',
      fph: "L'article 10 du décret n° 91-155 du 6 février 1991 fixe les droits à congé de maladie "
        + 'des agents contractuels hospitaliers et la durée du maintien du traitement.',
    },
    demande: 'Je vous demande de bien vouloir réexaminer le décompte de mon ancienneté et de mes '
      + 'droits, et de me communiquer le détail du calcul retenu.',
  }],

  cgm: [{
    type: 'gracieux',
    titre: 'Refus de congé de grave maladie',
    objet: 'Recours gracieux — congé de grave maladie',
    decision: 'refusé ma demande de congé de grave maladie',
    fondement: {
      fpe: "L'article 13 du décret n° 86-83 du 17 janvier 1986 ouvre le congé de grave maladie aux "
        + 'agents contractuels de l\'État.',
      fpt: "L'article 8 du décret n° 88-145 du 15 février 1988 ouvre le congé de grave maladie aux "
        + 'agents contractuels territoriaux.',
      fph: "L'article 11 du décret n° 91-155 du 6 février 1991 ouvre le congé de grave maladie aux "
        + 'agents contractuels hospitaliers.',
    },
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de saisir le conseil '
      + 'médical afin qu\'il se prononce sur ma situation.',
  }],

  'reclassement-contractuels': [{
    type: 'demande',
    titre: 'Demander un reclassement avant un licenciement pour inaptitude',
    objet: 'Demande de reclassement',
    decision: 'Déclaré(e) inapte à mes fonctions par avis du [DATE DE L\'AVIS], je sollicite mon '
      + 'reclassement dans un autre emploi avant toute décision de licenciement.',
    fondement: "L'article 17 du décret n° 86-83 du 17 janvier 1986 — et, pour la fonction publique "
      + 'hospitalière, l\'article 17-1 du décret n° 91-155 du 6 février 1991 — impose à '
      + "l'employeur de proposer un reclassement avant tout licenciement pour inaptitude "
      + 'physique, et ouvre droit à un congé sans traitement de trois mois dans l\'attente.',
    demande: 'Je vous demande de bien vouloir me proposer les emplois disponibles compatibles avec '
      + 'les préconisations médicales, et de me communiquer mon dossier individuel.',
  }],

  'cdi-public': [{
    type: 'gracieux',
    titre: 'Faire reconnaître la transformation du contrat en CDI',
    objet: 'Recours gracieux — transformation de mon contrat en contrat à durée indéterminée',
    decision: 'renouvelé mon engagement par un contrat à durée déterminée, alors que je remplis '
      + 'les conditions de sa transformation en contrat à durée indéterminée',
    fondement: {
      fpe: "L'article L. 332-4 du code général de la fonction publique prévoit la reconduction en "
        + 'contrat à durée indéterminée au-delà de six années de services.',
      fpt: "L'article L. 332-10 du code général de la fonction publique prévoit la reconduction en "
        + 'contrat à durée indéterminée au-delà de six années de services.',
      fph: "L'article L. 332-17 du code général de la fonction publique prévoit la reconduction en "
        + 'contrat à durée indéterminée au-delà de six années de services.',
    },
    demande: 'Je vous demande de bien vouloir constater cette transformation, de m\'en proposer '
      + 'l\'avenant, et de me communiquer le décompte des services retenus.',
  }],

  // ── Accidents et maladies professionnelles ────────────────────────────────
  'at-service': [{
    type: 'gracieux',
    titre: 'Refus de reconnaissance d\'un accident de service',
    objet: 'Recours gracieux — imputabilité au service de mon accident du [DATE DE L\'ACCIDENT]',
    decision: 'refusé de reconnaître l\'imputabilité au service de mon accident survenu le '
      + '[DATE DE L\'ACCIDENT]',
    fondement: 'Les articles L. 822-18 à L. 822-23 du code général de la fonction publique '
      + "instituent le congé pour invalidité temporaire imputable au service. L'accident survenu "
      + "dans le temps et le lieu du service est présumé imputable, sauf preuve contraire.",
    demande: 'Je vous demande de bien vouloir réexaminer cette décision, de me communiquer les '
      + 'pièces sur lesquelles elle se fonde, et de saisir le conseil médical.',
  }],

  'maladie-pro': [{
    type: 'gracieux',
    titre: 'Refus de reconnaissance d\'une maladie professionnelle',
    objet: 'Recours gracieux — imputabilité au service de ma maladie',
    decision: 'refusé de reconnaître l\'imputabilité au service de ma maladie',
    fondement: "L'article L. 822-20 du code général de la fonction publique ouvre droit au congé "
      + 'pour invalidité temporaire imputable au service en cas de maladie contractée en service.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision, de me communiquer le '
      + 'rapport d\'expertise sur lequel elle se fonde, et de saisir le conseil médical.',
  }],

  ati: [{
    type: 'gracieux',
    titre: 'Refus ou contestation de l\'allocation temporaire d\'invalidité',
    objet: 'Recours gracieux — allocation temporaire d\'invalidité',
    decision: 'refusé de m\'attribuer l\'allocation temporaire d\'invalidité, ou en a fixé le taux à '
      + 'un niveau que je conteste',
    fondement: {
      fpe: "L'article 1er du décret n° 60-1089 du 6 octobre 1960 ouvre droit à l'allocation "
        + "temporaire d'invalidité et en fixe les conditions de demande.",
      fpt: 'Le décret n° 2005-442 du 2 mai 2005 ouvre droit à l\'allocation temporaire '
        + 'd\'invalidité pour les agents relevant de la CNRACL.',
      fph: 'Le décret n° 2005-442 du 2 mai 2005 ouvre droit à l\'allocation temporaire '
        + 'd\'invalidité pour les agents relevant de la CNRACL.',
    },
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de saisir le conseil '
      + 'médical pour une nouvelle évaluation de mon taux d\'incapacité permanente.',
  }],

  'at-contractuels': [{
    type: 'cra',
    titre: 'Contester une décision de la caisse sur un accident du travail',
    objet: 'Réclamation devant la commission de recours amiable',
    decision: 'refusé de reconnaître le caractère professionnel de mon accident ou de ma maladie',
    fondement: 'Le livre IV du code de la sécurité sociale régit la reconnaissance et la prise en '
      + 'charge des accidents du travail et des maladies professionnelles.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision au vu des éléments '
      + 'ci-dessus et de me communiquer les pièces du dossier.',
  }],

  // ── Inaptitude ────────────────────────────────────────────────────────────
  'inaptitude-def': [{
    type: 'medical',
    titre: 'Contester un avis d\'inaptitude',
    objet: 'Demande de contre-expertise et de saisine du conseil médical',
    decision: 'il a été conclu à mon inaptitude',
    fondement: 'Les articles L. 826-1 à L. 826-6 du code général de la fonction publique imposent '
      + "d'examiner l'adaptation du poste et le reclassement avant toute conséquence tirée d'une "
      + 'inaptitude.',
    demande: 'Je vous demande de bien vouloir saisir le conseil médical, de faire procéder à une '
      + 'contre-expertise, et d\'examiner au préalable les possibilités d\'aménagement de mon poste.',
  }],

  reclassement: [{
    type: 'demande',
    titre: 'Demander des propositions de reclassement',
    objet: 'Demande de reclassement et de période de préparation au reclassement',
    decision: 'Déclaré(e) inapte à mes fonctions, je n\'ai à ce jour reçu aucune proposition de '
      + 'reclassement compatible avec les préconisations médicales.',
    fondement: 'Les articles L. 826-1 à L. 826-6 du code général de la fonction publique ouvrent '
      + 'droit au reclassement, par intégration ou détachement, ainsi qu\'à une période de '
      + 'préparation au reclassement.',
    demande: 'Je vous demande de bien vouloir me proposer par écrit les emplois disponibles '
      + 'compatibles avec mon état de santé, et de m\'ouvrir une période de préparation au '
      + 'reclassement.',
  }],

  'majoration-tierce-personne': [{
    type: 'gracieux',
    titre: 'Refus de majoration pour tierce personne',
    objet: 'Recours gracieux — majoration pour tierce personne',
    decision: 'refusé de m\'accorder la majoration pour tierce personne, ou en a fixé le montant à '
      + 'un niveau que je conteste',
    fondement: "L'article L. 30 bis du code des pensions civiles et militaires de retraite — et, "
      + 'pour les agents relevant de la CNRACL, l\'article 34 du décret n° 2003-1306 du '
      + '26 décembre 2003 — ouvre droit à la majoration pour tierce personne.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me communiquer les '
      + 'éléments médicaux sur lesquels elle se fonde.',
  }],

  rqth: [{
    type: 'rapo',
    titre: 'Contester un refus de RQTH',
    objet: 'Recours administratif préalable obligatoire — reconnaissance de la qualité de '
      + 'travailleur handicapé',
    decision: 'refusé de me reconnaître la qualité de travailleur handicapé',
    fondement: "L'article L. 5213-1 du code du travail définit le travailleur handicapé comme "
      + "toute personne dont les possibilités d'obtenir ou de conserver un emploi sont "
      + "effectivement réduites par suite de l'altération d'une ou plusieurs fonctions physique, "
      + 'sensorielle, mentale ou psychique.',
    demande: 'Je vous demande de bien vouloir réexaminer ma demande au vu de ces éléments et de me '
      + 'communiquer, le cas échéant, les pièces de mon dossier.',
  }],

  // ── Congés familiaux ──────────────────────────────────────────────────────
  'conge-maternite': [{
    type: 'gracieux',
    titre: 'Refus ou retard d\'accès au congé de maternité',
    objet: 'Recours gracieux — congé de maternité',
    decision: 'refusé ou retardé mon placement en congé de maternité',
    fondement: "L'article L. 631-1 du code général de la fonction publique ouvre droit au congé de "
      + "maternité. L'article L. 1225-29 du code du travail interdit par ailleurs d'employer la "
      + "salariée pendant huit semaines au total autour de l'accouchement, dont six après.",
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me placer en congé '
      + 'de maternité à compter du [DATE DE DÉBUT SOUHAITÉE].',
  }],

  'conge-patho': [{
    type: 'gracieux',
    titre: 'Refus de congé pathologique',
    objet: 'Recours gracieux — congé pathologique',
    decision: 'refusé ma demande de congé pathologique',
    fondement: "L'article L. 631-3 du code général de la fonction publique ouvre droit au congé "
      + "pathologique sur prescription médicale. L'article 174 de la loi n° 2026-103 du "
      + '19 février 2026 en a porté la durée à 21 jours.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision au vu de la prescription '
      + 'médicale jointe.',
  }],

  'conge-paternite': [{
    type: 'gracieux',
    titre: 'Refus ou entrave au congé de paternité',
    objet: 'Recours gracieux — congé de paternité et d\'accueil de l\'enfant',
    decision: 'refusé ou entravé l\'exercice de mon congé de paternité et d\'accueil de l\'enfant',
    fondement: "L'article L. 631-9 du code général de la fonction publique ouvre droit au congé de "
      + 'paternité et d\'accueil de l\'enfant, sans condition d\'ancienneté depuis le '
      + '1er juillet 2021.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de m\'accorder ce congé '
      + 'à compter du [DATE DE DÉBUT SOUHAITÉE].',
  }],

  'conge-naissance': [{
    type: 'gracieux',
    titre: 'Refus de congé supplémentaire de naissance',
    objet: 'Recours gracieux — congé supplémentaire de naissance',
    decision: 'refusé ma demande de congé supplémentaire de naissance',
    fondement: "L'article 99 de la loi n° 2025-1403 du 30 décembre 2025 a créé le congé "
      + 'supplémentaire de naissance, dont le décret n° 2026-427 du 30 mai 2026 fixe le régime '
      + 'pour les agents publics.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de m\'accorder ce congé '
      + 'à compter du [DATE DE DÉBUT SOUHAITÉE].',
  }],

  'conge-adoption': [{
    type: 'gracieux',
    titre: 'Refus de congé d\'adoption',
    objet: 'Recours gracieux — congé d\'adoption',
    decision: 'refusé ma demande de congé d\'adoption',
    fondement: "L'article L. 631-8 du code général de la fonction publique ouvre droit au congé "
      + "d'adoption, dont l'article L. 1225-37 du code du travail fixe les durées.",
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de m\'accorder ce congé '
      + 'à compter du [DATE DE DÉBUT SOUHAITÉE].',
  }],

  'conge-parental': [{
    type: 'gracieux',
    titre: 'Refus de congé parental ou de réintégration',
    objet: 'Recours gracieux — congé parental',
    decision: 'refusé ma demande de congé parental, ou ma réintégration à l\'issue de celui-ci',
    fondement: 'Les articles L. 515-1 à L. 515-11 du code général de la fonction publique '
      + 'encadrent le congé parental, son renouvellement et la réintégration à son terme.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me préciser les '
      + 'conditions de ma [PRÉCISEZ : mise en congé parental / réintégration] à compter du '
      + '[DATE SOUHAITÉE].',
  }],

  // ── Vos interlocuteurs ────────────────────────────────────────────────────
  prevention: [{
    type: 'medical',
    titre: 'Contester un avis d\'aptitude',
    objet: 'Demande de saisine du conseil médical — avis d\'aptitude',
    decision: 'un avis d\'aptitude a été rendu que je conteste',
    fondement: 'Le décret n° 82-453 du 28 mai 1982 (État), le décret n° 85-603 du 10 juin 1985 '
      + '(territoriale) et les articles R. 4626-1 et suivants du code du travail (hospitalière) '
      + 'organisent la médecine de prévention et le suivi médical des agents.',
    demande: 'Je vous demande de bien vouloir saisir le conseil médical afin qu\'il se prononce sur '
      + 'mon aptitude, et de me communiquer les conclusions sur lesquelles l\'avis se fonde.',
  }],

  'conseil-medical': [{
    type: 'medical',
    titre: 'Demander une contre-expertise médicale',
    objet: 'Demande de contre-expertise et de saisine du conseil médical',
    decision: 'des conclusions ont été rendues que je conteste',
    fondement: 'Les décrets n° 2022-353 (État), n° 2022-350 (territoriale) et n° 2022-351 '
      + '(hospitalière) du 11 mars 2022 organisent la saisine du conseil médical et la procédure '
      + 'contradictoire devant lui.',
    demande: 'Je vous demande de bien vouloir saisir le conseil médical, de faire procéder à une '
      + 'contre-expertise par un médecin agréé distinct, et de me communiquer la date de séance.',
  }],

  'medecine-statutaire': [{
    type: 'medical',
    titre: 'Contester les conclusions d\'un médecin agréé',
    objet: 'Demande de contre-expertise et de saisine du conseil médical',
    decision: 'le médecin agréé a rendu des conclusions que je conteste',
    fondement: 'Les décrets n° 2022-353 (État), n° 2022-350 (territoriale) et n° 2022-351 '
      + '(hospitalière) du 11 mars 2022 permettent la saisine du conseil médical pour expertise '
      + 'contradictoire.',
    demande: 'Je vous demande de bien vouloir saisir le conseil médical et de faire procéder à une '
      + 'contre-expertise par un médecin agréé autre que celui ayant rendu le premier avis.',
  }],

  'role-assistant-prevention': [{
    type: 'demande',
    titre: 'Signaler une entrave à ses missions de prévention',
    objet: 'Saisine de la formation spécialisée — entrave à mes missions de prévention',
    decision: 'Assistant(e) de prévention, je vous saisis d\'une difficulté rencontrée dans '
      + 'l\'exercice de mes missions.',
    fondement: 'Le décret n° 82-453 du 28 mai 1982 (État) et le décret n° 85-603 du 10 juin 1985 '
      + '(territoriale) définissent les missions de l\'assistant de prévention et les moyens que '
      + 'l\'administration doit lui donner pour les exercer.',
    demande: 'Je vous demande de bien vouloir inscrire ce point à l\'ordre du jour de la prochaine '
      + 'séance et de me préciser les suites qui y seront données.',
  }],

  'role-ass': [{
    type: 'demande',
    titre: 'Signaler un manquement au secret professionnel',
    objet: 'Signalement — secret professionnel',
    decision: 'Je souhaite porter à votre connaissance des faits qui me paraissent constituer un '
      + 'manquement au secret professionnel.',
    fondement: "L'article L. 411-3 du code de l'action sociale et des familles soumet les "
      + "assistants de service social au secret professionnel, dont la violation est sanctionnée "
      + "par l'article 226-13 du code pénal.",
    demande: 'Je vous demande de bien vouloir examiner ces faits et de me préciser les suites qui '
      + 'y seront données.',
  }],

  'delegations-sociales': [{
    type: 'gracieux',
    titre: 'Refus d\'une prestation d\'action sociale',
    objet: 'Recours gracieux — prestation d\'action sociale',
    decision: 'refusé de m\'accorder la prestation d\'action sociale demandée',
    fondement: 'Les articles L. 731-1 à L. 733-2 du code général de la fonction publique '
      + "définissent l'action sociale. L'article L. 731-3 précise que les prestations sont "
      + "attribuées indépendamment du grade, de l'emploi et de la manière de servir.",
    demande: 'Je vous demande de bien vouloir réexaminer ma demande et de me communiquer les '
      + 'critères d\'attribution appliqués.',
  }],

  // ── Vie au travail ────────────────────────────────────────────────────────
  'protection-fonctionnelle': [{
    type: 'demande',
    titre: 'Demander la protection fonctionnelle',
    objet: 'Demande de protection fonctionnelle',
    decision: 'Je sollicite le bénéfice de la protection fonctionnelle à raison de faits dont j\'ai '
      + 'été victime dans l\'exercice de mes fonctions.',
    fondement: 'Les articles L. 134-1 à L. 134-12 du code général de la fonction publique imposent '
      + "à l'administration de protéger l'agent contre les atteintes subies à l'occasion de ses "
      + "fonctions. Cette protection est due, sauf faute personnelle détachable du service.",
    demande: 'Je vous demande de bien vouloir m\'accorder cette protection et de me préciser les '
      + 'mesures envisagées, notamment la prise en charge des frais de procédure.',
  }],

  harcelement: [{
    type: 'demande',
    titre: 'Signaler des faits de harcèlement et demander la protection',
    objet: 'Signalement de faits de harcèlement et demande de protection fonctionnelle',
    decision: 'Je vous saisis de faits de harcèlement dont je suis victime dans le cadre de mes '
      + 'fonctions, et sollicite le bénéfice de la protection fonctionnelle.',
    fondement: 'Les articles L. 133-1 à L. 133-3 du code général de la fonction publique '
      + "interdisent le harcèlement et protègent les victimes comme les témoins contre toute "
      + 'mesure de représailles. Les articles 222-33 et 222-33-2 du code pénal répriment le '
      + 'harcèlement sexuel et le harcèlement moral.',
    demande: 'Je vous demande de bien vouloir diligenter une enquête, prendre les mesures '
      + 'conservatoires nécessaires, et m\'accorder la protection fonctionnelle.',
  }],

  'fiche-signalement': [{
    type: 'demande',
    titre: 'Relancer un signalement resté sans réponse',
    objet: 'Signalement resté sans suite — demande d\'examen',
    decision: 'J\'ai déposé le [DATE DU SIGNALEMENT] une fiche de signalement qui, à ce jour, n\'a '
      + 'reçu aucune suite portée à ma connaissance.',
    fondement: 'Le décret n° 82-453 du 28 mai 1982 (État) et le décret n° 85-603 du 10 juin 1985 '
      + '(territoriale) organisent le registre de santé et de sécurité au travail et le traitement '
      + 'des signalements.',
    demande: 'Je vous demande de bien vouloir m\'indiquer les suites données à ce signalement et, à '
      + 'défaut, d\'inscrire ce point à l\'ordre du jour de la formation spécialisée.',
  }],

  // ── Protection sociale complémentaire ─────────────────────────────────────
  'psc-reforme': [{
    type: 'gracieux',
    titre: 'Refus de la participation employeur',
    objet: 'Recours gracieux — participation employeur à la protection sociale complémentaire',
    decision: 'refusé de me verser la participation employeur à ma protection sociale '
      + 'complémentaire',
    fondement: "Les articles L. 827-1 et suivants du code général de la fonction publique et "
      + "l'ordonnance n° 2021-175 du 17 février 2021 instituent la participation obligatoire de "
      + 'l\'employeur à la protection sociale complémentaire des agents.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me préciser le '
      + 'fondement du refus au regard du contrat collectif applicable.',
  }],

  prevoyance: [{
    type: 'gracieux',
    titre: 'Contester une décision en matière de prévoyance',
    objet: 'Réclamation — contrat de prévoyance',
    decision: 'rendu une décision relative à ma couverture de prévoyance que je conteste',
    fondement: "Les articles L. 827-1 et suivants du code général de la fonction publique et "
      + "l'ordonnance n° 2021-175 du 17 février 2021 encadrent la protection sociale "
      + 'complémentaire des agents publics.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me communiquer les '
      + 'clauses du contrat sur lesquelles elle se fonde.',
  }],

  // ── Carrière et formation ─────────────────────────────────────────────────
  evaluation: [{
    type: 'hierarchique',
    titre: 'Contester un compte rendu d\'entretien professionnel',
    objet: 'Recours hiérarchique — compte rendu d\'entretien professionnel',
    decision: 'le compte rendu de mon entretien professionnel m\'a été notifié',
    fondement: 'Les articles L. 521-1 et suivants du code général de la fonction publique '
      + "encadrent l'appréciation de la valeur professionnelle et les voies de révision du compte "
      + 'rendu.',
    demande: 'Je vous demande de bien vouloir réviser [PRÉCISEZ : l\'appréciation générale, les '
      + 'objectifs fixés, la valeur professionnelle retenue] et de me notifier le compte rendu '
      + 'modifié.',
  }],

  'conge-formation': [{
    type: 'gracieux',
    titre: 'Refus ou report de congé de formation professionnelle',
    objet: 'Recours gracieux — congé de formation professionnelle',
    decision: 'refusé ou reporté ma demande de congé de formation professionnelle',
    fondement: 'Les articles L. 422-1 et suivants du code général de la fonction publique ouvrent '
      + 'droit au congé de formation professionnelle. Le décret n° 2026-366 du 7 mai 2026 en a '
      + 'codifié le régime, en vigueur depuis le 1er août 2026.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision, de me communiquer les '
      + 'motifs du report ou du refus, et de me préciser mon rang de priorité.',
  }],

  sft: [{
    type: 'gracieux',
    titre: 'Refus ou contestation du supplément familial de traitement',
    objet: 'Recours gracieux — supplément familial de traitement',
    decision: 'refusé de m\'ouvrir le droit au supplément familial de traitement, ou en a fixé le '
      + 'montant à un niveau que je conteste',
    fondement: 'Les articles L. 712-8 à L. 712-11 du code général de la fonction publique ouvrent '
      + 'droit au supplément familial de traitement. Le décret n° 85-1148 du 24 octobre 1985 en '
      + 'fixe le barème et les modalités de calcul.',
    demande: 'Je vous demande de bien vouloir réexaminer ma situation et de me communiquer le '
      + 'détail du calcul retenu, notamment le nombre d\'enfants à charge et l\'indice pris en '
      + 'compte.',
  }],

  // ── Retraite ──────────────────────────────────────────────────────────────
  'retraite-cnracl': [{
    type: 'gracieux',
    titre: 'Contester le calcul de sa pension CNRACL',
    objet: 'Recours gracieux — calcul de ma pension',
    decision: 'arrêté le montant de ma pension à un niveau que je conteste',
    fondement: 'Le décret n° 2003-1306 du 26 décembre 2003 fixe le régime de retraite des agents '
      + 'affiliés à la CNRACL et les modalités de liquidation de la pension.',
    demande: 'Je vous demande de bien vouloir réexaminer la liquidation de ma pension et de me '
      + 'communiquer le détail du décompte des services et bonifications retenus.',
  }],

  'retraite-sre': [{
    type: 'gracieux',
    titre: 'Contester le calcul de sa pension de l\'État',
    objet: 'Recours gracieux — calcul de ma pension',
    decision: 'arrêté le montant de ma pension à un niveau que je conteste',
    fondement: 'Le code des pensions civiles et militaires de retraite fixe les règles de '
      + 'liquidation de la pension des fonctionnaires de l\'État.',
    demande: 'Je vous demande de bien vouloir réexaminer la liquidation de ma pension et de me '
      + 'communiquer le détail du décompte des services et bonifications retenus.',
  }],

  'retraite-invalidite': [{
    type: 'gracieux',
    titre: 'Contester une décision de retraite pour invalidité',
    objet: 'Recours gracieux — retraite pour invalidité',
    decision: 'rendu une décision relative à ma retraite pour invalidité que je conteste',
    fondement: 'Les articles L. 27 à L. 37 du code des pensions civiles et militaires de retraite '
      + '— et, pour les agents relevant de la CNRACL, les articles 37 et 38 du décret '
      + 'n° 2003-1306 du 26 décembre 2003 — fixent les droits à pension d\'invalidité et à rente '
      + 'viagère.',
    demande: 'Je vous demande de bien vouloir réexaminer cette décision et de me préciser si '
      + 'l\'imputabilité au service a été expressément retenue, celle-ci ouvrant droit à une rente '
      + 'viagère d\'invalidité.',
  }],

  rafp: [{
    type: 'gracieux',
    titre: 'Contester le calcul de sa prestation RAFP',
    objet: 'Recours gracieux — prestation du régime additionnel',
    decision: 'arrêté le montant de ma prestation du régime additionnel à un niveau que je conteste',
    fondement: 'La loi n° 2003-775 du 21 août 2003 a créé le régime de retraite additionnelle de '
      + 'la fonction publique et fixe les règles de calcul de la prestation.',
    demande: 'Je vous demande de bien vouloir réexaminer ce calcul et de me communiquer le détail '
      + 'des points acquis et de leur valorisation.',
  }],
};

// ── Les demandes initiales ──────────────────────────────────────────────────
// Un recours suppose une décision ; une demande la précède. Les deux ne se
// rangent donc pas au même endroit de la fiche, et n'appellent pas les mêmes
// rappels — d'où une table distincte, fusionnée avec la précédente au moment
// de rendre les courriers.
//
// Le champ facultatif `rappels` ajoute les délais propres à CETTE démarche
// devant les rappels communs. Le champ facultatif `aQui` remplace le
// destinataire par défaut lorsque la demande ne part pas à la hiérarchie : une
// demande d'allocation d'invalidité, par exemple, transite par le service des
// retraites.

const DEMANDES = {
  // ── Santé ─────────────────────────────────────────────────────────────────
  clm: [{
    type: 'demande',
    titre: 'Demander un congé de longue maladie',
    objet: 'Demande de congé de longue maladie',
    aQui: 'À votre service des ressources humaines, qui saisit le conseil médical.',
    decision: 'Je sollicite mon placement en congé de longue maladie à compter du '
      + '[DATE DE DÉBUT SOUHAITÉE] et vous prie de bien vouloir saisir le conseil médical.',
    fondement: 'Les articles L. 822-6 et suivants du code général de la fonction publique ouvrent '
      + "droit au congé de longue maladie lorsque l'affection rend nécessaires un traitement et "
      + 'des soins prolongés et présente un caractère invalidant et de gravité confirmée. '
      + "L'avis du conseil médical réuni en formation restreinte est recueilli par "
      + "l'administration : l'agent ne le saisit pas lui-même.",
    demande: 'Vous trouverez joint le certificat médical circonstancié établi le '
      + '[DATE DU CERTIFICAT]. Je vous demande de bien vouloir enregistrer ma demande et de me '
      + 'faire connaître la date à laquelle le conseil médical se prononcera.',
    rappels: [
      'Le certificat médical est transmis au service des ressources humaines dans les 48 heures '
      + "suivant son établissement. Le diagnostic n'est pas communiqué à l'employeur : seules les "
      + 'conclusions du conseil médical lui sont transmises.',
    ],
  }],

  cld: [{
    type: 'demande',
    titre: 'Demander un congé de longue durée',
    objet: 'Demande de congé de longue durée',
    aQui: 'À votre service des ressources humaines, qui saisit le conseil médical.',
    decision: 'Je sollicite mon placement en congé de longue durée à compter du '
      + '[DATE DE DÉBUT SOUHAITÉE] et vous prie de bien vouloir saisir le conseil médical.',
    fondement: 'Les articles L. 822-12 à L. 822-17 du code général de la fonction publique ouvrent '
      + "droit au congé de longue durée pour les affections qu'ils visent. L'article L. 822-14 "
      + "précise que l'année de congé de longue maladie rémunérée à plein traitement est réputée "
      + 'période de congé de longue durée pour la même affection.',
    demande: 'Vous trouverez joint le certificat médical établi le [DATE DU CERTIFICAT]. Je vous '
      + 'demande de bien vouloir saisir le conseil médical et de me faire connaître la date de sa '
      + 'séance.',
    rappels: [
      'Le congé de longue durée fait suite, en principe, à une année de congé de longue maladie '
      + "rémunérée à plein traitement, qui en est décomptée. Il peut aussi être accordé d'emblée "
      + "lorsque l'agent ne peut pas être placé en congé de longue maladie à plein traitement.",
    ],
  }],

  tpt: [{
    type: 'demande',
    titre: 'Demander un temps partiel thérapeutique',
    objet: 'Demande de temps partiel pour raison thérapeutique',
    decision: "Je sollicite l'autorisation d'exercer mes fonctions à temps partiel pour raison "
      + 'thérapeutique à hauteur de [QUOTITÉ SOUHAITÉE : 50, 60, 70, 80 OU 90 %], à compter du '
      + '[DATE DE DÉBUT SOUHAITÉE] et pour une durée de [DURÉE SOUHAITÉE].',
    fondement: 'Les articles L. 823-1 à L. 823-6 du code général de la fonction publique ouvrent '
      + 'le temps partiel pour raison thérapeutique, dont la quotité ne peut être inférieure au '
      + "mi-temps. Depuis le 1er août 2026, l'administration dispose de trente jours pour statuer "
      + "et ne peut opposer un refus pour motif médical sans avoir fait procéder à l'examen de "
      + "l'agent par un médecin agréé. Source : décret n° 2026-705 du 29 juillet 2026.",
    demande: 'Vous trouverez joint le certificat de mon médecin, qui précise la quotité préconisée '
      + 'et les modalités de reprise. Je vous demande de bien vouloir examiner ma demande et de me '
      + 'notifier votre décision.',
    rappels: [
      'Lorsque la demande fait suite à un congé de longue maladie, un congé de longue durée, un '
      + 'congé pour invalidité temporaire imputable au service ou une disponibilité pour raison de '
      + "santé, ainsi que pour un renouvellement, l'administration doit répondre au plus tard le "
      + 'jour de la reprise.',

      "L'administration peut faire examiner l'agent par un médecin agréé dès réception de la "
      + 'demande. Une absence non justifiée à cet examen vaut désistement : prévenez le service '
      + 'des ressources humaines si vous ne pouvez pas vous y rendre.',
    ],
  }],

  'formation-pendant-conge': [{
    type: 'demande',
    titre: 'Demander à se former pendant un congé de maladie',
    objet: "Demande d'autorisation de suivre une formation pendant un congé de maladie",
    decision: 'Placé(e) en [CONGÉ CONCERNÉ : maladie ordinaire, longue maladie, longue durée…] '
      + 'depuis le [DATE DE DÉBUT DU CONGÉ], je sollicite votre autorisation pour suivre '
      + "l'action suivante : [INTITULÉ DE LA FORMATION OU DU BILAN DE COMPÉTENCES], d'une durée "
      + 'de [DURÉE], du [DATE DE DÉBUT] au [DATE DE FIN].',
    fondement: {
      fpe: 'Les articles 41-1 et 41-2 du décret n° 86-442 du 14 mars 1986, insérés par le décret '
        + "n° 2026-705 du 29 juillet 2026, ouvrent à l'agent en congé pour raison de santé la "
        + "possibilité de suivre une action de formation, après avis d'un médecin agréé sur sa "
        + "compatibilité avec l'état de santé.",
      fpt: 'Les articles 31-1 et 31-2 du décret n° 87-602 du 30 juillet 1987, insérés par le '
        + "décret n° 2026-705 du 29 juillet 2026, ouvrent à l'agent en congé pour raison de santé "
        + "la possibilité de suivre une action de formation, après avis d'un médecin agréé sur sa "
        + "compatibilité avec l'état de santé.",
      fph: 'Le décret n° 2026-705 du 29 juillet 2026 a inséré au décret n° 88-386 du 19 avril 1988 '
        + "les dispositions ouvrant à l'agent en congé pour raison de santé la possibilité de "
        + "suivre une action de formation, après avis d'un médecin agréé sur sa compatibilité avec "
        + "l'état de santé.",
    },
    demande: 'Je vous demande de bien vouloir saisir le médecin agréé, et de me donner votre '
      + 'accord écrit pour mobiliser mon compte personnel de formation au financement de cette '
      + 'action.',
    rappels: [
      "L'utilisation du compte personnel de formation suppose l'accord écrit de l'employeur. "
      + "Demandez-le dans le même courrier que l'autorisation de vous former : cela évite deux "
      + 'allers-retours.',

      'Un avis médical défavorable doit être motivé. Il peut être contesté par une demande de '
      + 'contre-expertise, puis par la saisine du conseil médical.',
    ],
  }],

  'temps-partiel': [{
    type: 'demande',
    titre: 'Demander un temps partiel',
    objet: 'Demande de travail à temps partiel',
    decision: "Je sollicite l'autorisation d'exercer mes fonctions à temps partiel à hauteur de "
      + '[QUOTITÉ SOUHAITÉE : 50, 60, 70, 80 OU 90 %], à compter du [DATE DE DÉBUT SOUHAITÉE] et '
      + 'pour une durée de [DURÉE SOUHAITÉE].',
    fondement: {
      fpe: 'Les articles L. 612-1 et suivants du code général de la fonction publique et le décret '
        + 'n° 82-624 du 20 juillet 1982 organisent le temps partiel. Il est accordé de droit dans '
        + "les cas que la loi énumère — notamment à la naissance ou à l'accueil d'un enfant, "
        + "jusqu'à ses trois ans, et au titre du handicap.",
      fpt: 'Les articles L. 612-1 et suivants du code général de la fonction publique et le décret '
        + 'n° 2004-777 du 29 juillet 2004 organisent le temps partiel. Il est accordé de droit '
        + "dans les cas que la loi énumère — notamment à la naissance ou à l'accueil d'un enfant, "
        + "jusqu'à ses trois ans, et au titre du handicap.",
      fph: 'Les articles L. 612-1 et suivants du code général de la fonction publique et le décret '
        + 'n° 82-1003 du 23 novembre 1982 organisent le temps partiel. Il est accordé de droit '
        + "dans les cas que la loi énumère — notamment à la naissance ou à l'accueil d'un enfant, "
        + "jusqu'à ses trois ans, et au titre du handicap.",
    },
    demande: 'Je vous demande de bien vouloir examiner ma demande et de me notifier votre '
      + 'décision. Je sollicite par ailleurs le bénéfice de la surcotisation retraite, afin de '
      + "cotiser sur la base d'un temps plein.",
    rappels: [
      'Si votre situation ouvre un temps partiel de droit, joignez le justificatif : acte de '
      + "naissance, certificat médical, attestation de proche aidant. L'administration ne peut "
      + 'alors pas refuser le principe du temps partiel ; elle en discute seulement les modalités '
      + 'pratiques.',

      "La surcotisation retraite n'est jamais automatique : elle se demande expressément, et elle "
      + 'a un coût mensuel. Demandez son chiffrage au service des ressources humaines avant de '
      + 'vous décider.',
    ],
  }],

  disponibilite: [{
    type: 'demande',
    titre: 'Demander une mise en disponibilité',
    objet: 'Demande de mise en disponibilité',
    decision: 'Je sollicite ma mise en disponibilité pour [MOTIF : convenances personnelles, '
      + 'suivre son conjoint, élever un enfant, donner des soins à un proche, créer une '
      + 'entreprise…], à compter du [DATE DE DÉBUT SOUHAITÉE] et pour une durée de '
      + '[DURÉE SOUHAITÉE].',
    fondement: 'Les articles L. 514-1 et suivants du code général de la fonction publique '
      + 'encadrent la disponibilité, ses motifs, sa durée et les conditions de réintégration.',
    demande: 'Je vous demande de bien vouloir examiner ma demande et de me notifier votre '
      + 'décision, en précisant la date à laquelle je devrai solliciter ma réintégration.',
    rappels: [
      'Notez dès maintenant la date à laquelle votre disponibilité prend fin, et celle à laquelle '
      + 'vous devrez demander votre réintégration. Une demande tardive fragilise le retour sur un '
      + 'poste.',

      'Certaines disponibilités sont de droit ; les autres sont accordées sous réserve des '
      + 'nécessités de service. Joignez les justificatifs de votre situation.',
    ],
  }],

  // ── Contractuels ──────────────────────────────────────────────────────────
  cgm: [{
    type: 'demande',
    titre: 'Demander un congé de grave maladie',
    objet: 'Demande de congé de grave maladie',
    aQui: "À l'autorité qui a signé votre contrat, avec copie au service des ressources humaines.",
    decision: 'Je sollicite mon placement en congé de grave maladie à compter du '
      + '[DATE DE DÉBUT SOUHAITÉE] et vous prie de bien vouloir saisir le conseil médical.',
    fondement: {
      fpe: "L'article 13 du décret n° 86-83 du 17 janvier 1986 ouvre le congé de grave maladie à "
        + "l'agent contractuel atteint d'une affection grave et invalidante nécessitant un "
        + 'traitement prolongé. Le congé est accordé après avis du conseil médical.',
      fpt: "L'article 8 du décret n° 88-145 du 15 février 1988 ouvre le congé de grave maladie à "
        + "l'agent contractuel atteint d'une affection grave et invalidante nécessitant un "
        + "traitement prolongé. L'avis du conseil médical est précédé d'un examen par un "
        + "spécialiste agréé compétent pour l'affection en cause.",
      fph: "L'article 11 du décret n° 91-155 du 6 février 1991 ouvre le congé de grave maladie à "
        + "l'agent contractuel atteint d'une affection grave et invalidante nécessitant un "
        + "traitement prolongé. L'avis du conseil médical est précédé d'un examen par un "
        + "spécialiste agréé compétent pour l'affection en cause.",
    },
    demande: 'Vous trouverez joint le certificat médical établi le [DATE DU CERTIFICAT]. Je vous '
      + 'demande de bien vouloir enregistrer ma demande et de saisir le conseil médical.',
    rappels: [
      'Chaque renouvellement suppose un nouveau certificat et un nouvel avis du conseil médical. '
      + 'Anticipez la demande avant la fin de la période en cours.',
    ],
  }],

  'cdi-public': [{
    type: 'demande',
    titre: 'Demander la reconnaissance de son CDI après six ans',
    objet: 'Demande de reconnaissance du caractère indéterminé de mon contrat',
    decision: 'Employé(e) par votre administration depuis le [DATE DU PREMIER CONTRAT] sur des '
      + 'fonctions de catégorie [A, B OU C], je totalise six années de services publics au '
      + '[DATE À LAQUELLE LES SIX ANS SONT ATTEINTS]. Je sollicite la reconnaissance du caractère '
      + 'indéterminé de mon contrat.',
    fondement: {
      fpe: "L'article L. 332-4 du code général de la fonction publique prévoit qu'au-delà de six "
        + 'années de services auprès du même employeur, dans des fonctions relevant de la même '
        + 'catégorie hiérarchique, le contrat en cours est réputé conclu pour une durée '
        + 'indéterminée, et que tout renouvellement ne peut intervenir que par contrat à durée '
        + 'indéterminée.',
      fpt: "L'article L. 332-10 du code général de la fonction publique prévoit qu'au-delà de six "
        + 'années de services auprès du même employeur, dans des fonctions relevant de la même '
        + 'catégorie hiérarchique, le contrat en cours est réputé conclu pour une durée '
        + 'indéterminée, et que tout renouvellement ne peut intervenir que par contrat à durée '
        + 'indéterminée.',
      fph: "L'article L. 332-17 du code général de la fonction publique prévoit qu'au-delà de six "
        + 'années de services auprès du même employeur, dans des fonctions relevant de la même '
        + 'catégorie hiérarchique, le contrat en cours est réputé conclu pour une durée '
        + 'indéterminée, et que tout renouvellement ne peut intervenir que par contrat à durée '
        + 'indéterminée.',
    },
    demande: 'Je vous demande de bien vouloir me confirmer cette situation par écrit et de '
      + "m'adresser l'avenant correspondant.",
    rappels: [
      "Les contrats successifs s'additionnent, y compris à travers une interruption de moins de "
      + 'quatre mois ; au-delà, le décompte repart de zéro. Le temps partiel compte comme du temps '
      + 'plein. Les services accomplis sur un contrat de projet ne comptent pas.',

      "Joignez la liste de vos contrats avec leurs dates : c'est la pièce qui permet de vérifier "
      + 'le décompte sans échange supplémentaire.',
    ],
  }],

  // ── Accidents et maladies professionnelles ────────────────────────────────
  'at-service': [{
    type: 'demande',
    titre: 'Déclarer un accident de service',
    objet: "Déclaration d'accident de service et demande de reconnaissance de l'imputabilité",
    decision: "Je déclare l'accident survenu le [DATE DE L'ACCIDENT] à [HEURE] à "
      + "[LIEU DE L'ACCIDENT], dans l'exercice de mes fonctions, et sollicite la reconnaissance de "
      + 'son imputabilité au service.',
    fondement: {
      fpe: 'Les articles L. 822-18 à L. 822-23 du code général de la fonction publique et le '
        + 'décret n° 2019-122 du 21 février 2019 organisent le congé pour invalidité temporaire '
        + "imputable au service. L'article 47-3 du décret n° 86-442 fixe le délai de déclaration à "
        + "quinze jours à compter de l'accident.",
      fpt: 'Les articles L. 822-18 à L. 822-23 du code général de la fonction publique et le '
        + 'décret n° 2019-301 du 10 avril 2019 organisent le congé pour invalidité temporaire '
        + 'imputable au service et fixent le délai de déclaration à quinze jours à compter de '
        + "l'accident.",
      fph: 'Les articles L. 822-18 à L. 822-23 du code général de la fonction publique et le '
        + 'décret n° 2020-566 du 13 mai 2020 organisent le congé pour invalidité temporaire '
        + 'imputable au service et fixent le délai de déclaration à quinze jours à compter de '
        + "l'accident.",
    },
    demande: 'Vous trouverez joint le certificat médical initial décrivant les lésions constatées. '
      + 'Je vous demande de bien vouloir enregistrer cette déclaration et de me tenir informé(e) '
      + "de l'instruction du dossier.",
    rappels: [
      "La déclaration doit parvenir à l'administration dans les quinze jours suivant l'accident. "
      + 'Ce délai est ferme et vaut dans les trois versants.',

      "Lorsque l'accident entraîne un arrêt de travail, le certificat médical initial est transmis "
      + 'dans les 48 heures suivant son établissement.',

      'Décrivez les faits avec précision — date, heure, lieu, circonstances, témoins, lésions. '
      + "C'est sur cette description que l'imputabilité au service est appréciée.",
    ],
  }],

  'maladie-pro': [{
    type: 'demande',
    titre: "Demander la reconnaissance d'une maladie professionnelle",
    objet: "Demande de reconnaissance de l'imputabilité au service d'une maladie",
    decision: "Je sollicite la reconnaissance de l'imputabilité au service de la pathologie "
      + 'constatée le [DATE DU PREMIER CONSTAT MÉDICAL], au regard des conditions dans lesquelles '
      + "j'exerce mes fonctions.",
    fondement: "L'article L. 822-20 du code général de la fonction publique ouvre le congé pour "
      + 'invalidité temporaire imputable au service à la maladie contractée en service. '
      + "L'article 47-3 du décret n° 86-442 fixe le délai de déclaration à deux ans à compter de "
      + 'la date de la première constatation médicale de la maladie, ou de la date à laquelle '
      + "l'agent est informé du lien possible entre sa maladie et son activité professionnelle.",
    demande: 'Vous trouverez joint le certificat médical initial. Je vous demande de bien vouloir '
      + 'enregistrer ma demande, saisir le conseil médical et me faire connaître les pièces '
      + 'complémentaires attendues.',
    rappels: [
      'Le délai de déclaration est de deux ans. Il court à compter de la première constatation '
      + 'médicale de la maladie, ou de la date à laquelle le lien possible avec votre activité '
      + 'vous a été signalé.',

      "Décrivez votre exposition : postes occupés, tâches, produits ou contraintes, durées. C'est "
      + 'cette description qui permet de rattacher la maladie à un tableau, ou de justifier une '
      + 'instruction hors tableau.',

      'La saisine du conseil médical en formation plénière est obligatoire lorsque la maladie ne '
      + 'figure pas dans un tableau.',
    ],
  }],

  ati: [{
    type: 'demande',
    titre: "Demander l'allocation temporaire d'invalidité",
    objet: "Demande d'allocation temporaire d'invalidité",
    aQui: 'À votre administration, qui instruit la demande et la transmet au service des retraites '
      + "de l'État ou à la CNRACL selon votre versant.",
    decision: "À la suite de l'accident de service survenu le [DATE DE L'ACCIDENT] — ou de la "
      + 'maladie professionnelle reconnue le [DATE DE LA RECONNAISSANCE] —, dont la consolidation '
      + "a été constatée le [DATE DE CONSOLIDATION], je sollicite le bénéfice de l'allocation "
      + "temporaire d'invalidité.",
    fondement: {
      fpe: "L'article 1er du décret n° 60-1089 du 6 octobre 1960 ouvre l'allocation temporaire "
        + "d'invalidité au fonctionnaire atteint d'une invalidité permanente résultant d'un "
        + "accident de service ou d'une maladie professionnelle, et enferme la demande dans un "
        + "délai d'un an.",
      fpt: "Le décret n° 2005-442 du 2 mai 2005 ouvre l'allocation temporaire d'invalidité au "
        + "fonctionnaire affilié à la CNRACL atteint d'une invalidité permanente résultant d'un "
        + "accident de service ou d'une maladie professionnelle, et enferme la demande dans un "
        + "délai d'un an.",
      fph: "Le décret n° 2005-442 du 2 mai 2005 ouvre l'allocation temporaire d'invalidité au "
        + "fonctionnaire affilié à la CNRACL atteint d'une invalidité permanente résultant d'un "
        + "accident de service ou d'une maladie professionnelle, et enferme la demande dans un "
        + "délai d'un an.",
    },
    demande: 'Je vous demande de bien vouloir enregistrer ma demande, saisir le conseil médical en '
      + "formation plénière pour l'évaluation de mon taux d'incapacité permanente, et transmettre "
      + 'mon dossier au service gestionnaire.',
    rappels: [
      "La demande doit être déposée dans le délai d'un an. Déposez-la dès la consolidation, sans "
      + "attendre l'évaluation du taux : c'est le dépôt qui compte.",

      'Joignez les pièces médicales décrivant les séquelles ainsi que la décision reconnaissant '
      + "l'imputabilité au service.",
    ],
  }],

  'at-contractuels': [{
    type: 'demande',
    titre: "Informer son employeur d'un accident du travail",
    objet: "Déclaration d'accident du travail",
    aQui: "À votre employeur, qui déclare l'accident à la caisse primaire d'assurance maladie.",
    decision: "Je vous informe de l'accident du travail dont j'ai été victime le "
      + "[DATE DE L'ACCIDENT] à [HEURE] à [LIEU DE L'ACCIDENT], dans le cadre de mes fonctions.",
    fondement: "Le livre IV du code de la sécurité sociale organise la reconnaissance des "
      + "accidents du travail. La déclaration à la caisse incombe à l'employeur ; à défaut, "
      + "l'article L. 431-2 permet à la victime de la faire elle-même dans un délai de deux ans à "
      + "compter de l'accident.",
    demande: 'Je vous demande de bien vouloir procéder à la déclaration auprès de la caisse '
      + "primaire d'assurance maladie et de me remettre la feuille d'accident du travail, qui "
      + 'permet la prise en charge des soins sans avance de frais.',
    rappels: [
      "L'information de l'employeur se fait dans les 24 heures suivant l'accident, sauf force "
      + "majeure. C'est la seule obligation de délai court qui pèse sur vous.",

      "L'employeur déclare ensuite l'accident à la caisse dans les 48 heures. Si la déclaration "
      + "n'est pas partie, vous pouvez la faire vous-même dans un délai de deux ans à compter de "
      + "l'accident. Source : art. L. 431-2 du code de la sécurité sociale.",
    ],
  }],

  'majoration-tierce-personne': [{
    type: 'demande',
    titre: 'Demander la majoration pour tierce personne',
    objet: "Demande de majoration pour assistance d'une tierce personne",
    aQui: "À l'administration qui gère votre dossier de retraite — le service des retraites de "
      + "l'État pour la fonction publique d'État, la CNRACL pour la territoriale et "
      + "l'hospitalière.",
    decision: "Titulaire d'une pension d'invalidité concédée le [DATE DE CONCESSION DE LA PENSION] "
      + 'sous le numéro [NUMÉRO DE PENSION], je sollicite le bénéfice de la majoration pour '
      + "assistance d'une tierce personne.",
    fondement: {
      fpe: "L'article L. 30 bis du code des pensions civiles et militaires de retraite ouvre une "
        + "majoration forfaitaire au titulaire d'une pension d'invalidité qui se trouve dans "
        + "l'obligation d'avoir recours d'une manière constante à l'assistance d'une tierce "
        + 'personne pour accomplir les actes ordinaires de la vie.',
      fpt: "L'article 34 du décret n° 2003-1306 du 26 décembre 2003 ouvre une majoration au "
        + "titulaire d'une pension d'invalidité qui se trouve dans l'obligation d'avoir recours "
        + "d'une manière constante à l'assistance d'une tierce personne pour accomplir les actes "
        + 'ordinaires de la vie.',
      fph: "L'article 34 du décret n° 2003-1306 du 26 décembre 2003 ouvre une majoration au "
        + "titulaire d'une pension d'invalidité qui se trouve dans l'obligation d'avoir recours "
        + "d'une manière constante à l'assistance d'une tierce personne pour accomplir les actes "
        + 'ordinaires de la vie.',
    },
    demande: 'Vous trouverez joints les certificats médicaux détaillant les actes de la vie '
      + 'courante que je ne peux pas accomplir seul(e). Je vous demande de bien vouloir examiner '
      + 'ma demande et de me notifier votre décision.',
    rappels: [
      'La majoration peut être demandée quelle que soit la date à laquelle votre pension a été '
      + 'concédée — y compris longtemps après.',

      'La situation est réexaminée au terme des cinq premières années. Si les conditions sont '
      + 'toujours remplies, la majoration est alors attribuée à titre définitif.',
    ],
  }],

  // ── Inaptitude et handicap ────────────────────────────────────────────────
  rqth: [{
    type: 'demande',
    titre: 'Demander un aménagement de poste au titre de la RQTH',
    objet: "Demande d'aménagement du poste de travail",
    aQui: 'À votre service des ressources humaines, avec copie au médecin du travail.',
    decision: "Bénéficiaire d'une reconnaissance de la qualité de travailleur handicapé notifiée "
      + "le [DATE DE LA NOTIFICATION] et valable jusqu'au [DATE DE FIN DE VALIDITÉ], je sollicite "
      + "l'aménagement de mon poste de travail.",
    fondement: 'Les articles L. 352-1 et suivants du code général de la fonction publique imposent '
      + "à l'employeur public de prendre les mesures appropriées pour permettre aux travailleurs "
      + "handicapés de conserver un emploi correspondant à leur qualification et d'y progresser, "
      + "sauf charge disproportionnée. Le fonds pour l'insertion des personnes handicapées dans la "
      + 'fonction publique peut en assurer le financement.',
    demande: "Je vous demande de bien vouloir saisir le médecin du travail afin qu'il formule ses "
      + 'préconisations, et de me faire connaître les aménagements envisagés ainsi que leur '
      + 'calendrier de mise en œuvre.',
    rappels: [
      "La reconnaissance de la qualité de travailleur handicapé n'est pas communiquée "
      + "automatiquement à l'employeur : c'est vous qui choisissez de la déclarer, et ce courrier "
      + 'vaut déclaration.',

      'Le renouvellement de la reconnaissance se prépare six mois avant son expiration, pour '
      + 'éviter une interruption des droits.',
    ],
  }],

  // ── Médecine du travail ───────────────────────────────────────────────────
  prevention: [{
    type: 'demande',
    titre: 'Demander une visite auprès du médecin du travail',
    objet: 'Demande de visite auprès du service de prévention et de santé au travail',
    aQui: 'Au service de prévention et de santé au travail (SPST) dont vous relevez, avec copie '
      + 'à votre service des ressources humaines.',
    decision: 'Je sollicite une visite auprès du médecin du travail, au motif suivant : '
      + '[MOTIF : difficultés rencontrées sur le poste, évolution de mon état de santé, reprise '
      + 'après un arrêt, exposition à un risque particulier…].',
    fondement: {
      fpe: 'Le décret n° 82-453 du 28 mai 1982 organise la médecine de prévention dans la fonction '
        + "publique de l'État. L'agent peut demander une visite à tout moment, indépendamment de "
        + 'la périodicité des visites obligatoires.',
      fpt: 'Le décret n° 85-603 du 10 juin 1985 organise la médecine préventive dans la fonction '
        + "publique territoriale. L'agent peut demander une visite à tout moment, indépendamment "
        + 'de la périodicité des visites obligatoires.',
      fph: 'Les articles R. 4626-1 et suivants du code du travail organisent le service de santé '
        + "au travail dans les établissements de santé. L'agent peut demander une visite à tout "
        + 'moment, indépendamment de la périodicité des examens obligatoires.',
    },
    demande: 'Je vous demande de bien vouloir me proposer un rendez-vous. Je souhaite que les '
      + "conditions dans lesquelles j'exerce mes fonctions soient examinées, et que les "
      + 'préconisations utiles soient formulées.',
    rappels: [
      "Le médecin du travail n'est pas le médecin de l'administration : il agit dans l'intérêt de "
      + 'votre santé, et il est tenu au secret médical. Votre diagnostic ne lui échappe pas.',

      "Vous pouvez demander cette visite à tout moment, sans avoir à attendre l'échéance de la "
      + 'visite périodique et sans passer par votre hiérarchie.',

      "Si le médecin préconise un aménagement de votre poste, l'administration est tenue d'en "
      + 'tenir compte. Demandez que la préconisation vous soit remise par écrit.',
    ],
  }],

  // ── Congés familiaux ──────────────────────────────────────────────────────
  'conge-paternite': [{
    type: 'demande',
    titre: 'Informer son employeur de la prise du congé de paternité',
    objet: "Congé de paternité et d'accueil de l'enfant — information préalable",
    decision: "Je vous informe de mon intention de prendre le congé de paternité et d'accueil de "
      + "l'enfant à la suite de la naissance prévue le [DATE PRÉVUE OU DATE DE NAISSANCE].",
    fondement: "L'article L. 631-9 du code général de la fonction publique ouvre le congé de "
      + "paternité et d'accueil de l'enfant. Les quatre premiers jours suivent immédiatement la "
      + 'naissance ; les vingt et un jours restants peuvent être fractionnés en deux périodes de '
      + 'cinq jours au minimum, à prendre dans les six mois suivant la naissance. Aucune condition '
      + "d'ancienneté n'est exigée depuis le 1er juillet 2021.",
    demande: 'Je prendrai les vingt et un jours restants selon les modalités suivantes : '
      + "[PÉRIODES ENVISAGÉES]. Je vous transmettrai l'acte de naissance dès qu'il sera "
      + 'disponible.',
    rappels: [
      'Les quatre jours obligatoires débutent immédiatement après la naissance : prévenez le '
      + "service des ressources humaines à l'avance pour que la paie et le planning soient "
      + 'préparés.',

      'Les vingt et un jours restants se prennent dans les six mois suivant la naissance. Ce délai '
      + "n'est reporté qu'en cas d'hospitalisation immédiate de l'enfant ou de décès de la mère ; "
      + 'en dehors de ces situations, les jours non pris sont perdus.',
    ],
  }],

  'conge-naissance': [{
    type: 'demande',
    titre: 'Demander le congé supplémentaire de naissance',
    objet: 'Demande de congé supplémentaire de naissance',
    decision: 'À la suite de la naissance de mon enfant le [DATE DE NAISSANCE], je sollicite le '
      + 'bénéfice du congé supplémentaire de naissance pour une durée de [UN OU DEUX MOIS], à '
      + 'compter du [DATE DE DÉBUT SOUHAITÉE].',
    fondement: "L'article 99 de la loi n° 2025-1403 du 30 décembre 2025 a créé le congé "
      + 'supplémentaire de naissance, dont le décret n° 2026-427 du 30 mai 2026 fixe le régime '
      + 'pour les agents publics. Il vise les enfants nés ou adoptés à compter du '
      + '1er janvier 2026.',
    demande: 'Je souhaite prendre ce congé selon les modalités suivantes : [PÉRIODES ENVISAGÉES, '
      + 'ET FRACTIONNEMENT ÉVENTUEL]. Je vous demande de bien vouloir enregistrer ma demande et de '
      + 'me notifier votre accord.',
    rappels: [
      "Le délai de prévenance est d'un mois. Il est réduit à quinze jours lorsque le congé suit "
      + "immédiatement le congé de paternité et d'accueil de l'enfant.",

      "Anticipez avec le service des ressources humaines l'ordre des congés — maternité ou "
      + 'paternité, puis congé supplémentaire de naissance, puis congé parental : chacun a ses '
      + 'propres règles de rémunération et de demande.',
    ],
  }],

  'conge-adoption': [{
    type: 'demande',
    titre: "Demander le congé d'adoption",
    objet: "Demande de congé d'adoption",
    decision: "À la suite de l'arrivée à mon foyer de [NOMBRE] enfant(s) le [DATE D'ARRIVÉE], je "
      + "sollicite le bénéfice du congé d'adoption à compter du [DATE DE DÉBUT SOUHAITÉE].",
    fondement: "L'article L. 631-8 du code général de la fonction publique ouvre le congé "
      + "d'adoption aux agents publics par renvoi au code du travail. L'article L. 1225-37 de ce "
      + 'code en fixe la durée, et son article L. 1225-40 prévoit que le congé réparti entre les '
      + "deux parents est majoré de vingt-cinq jours, ou de trente-deux jours en cas d'adoptions "
      + 'multiples.',
    demande: "Vous trouverez joint [LE JUGEMENT D'ADOPTION OU LA DÉCISION D'AGRÉMENT]. Je vous "
      + 'demande de bien vouloir enregistrer ma demande et de me notifier votre accord.',
    rappels: [
      'Si le congé est partagé entre les deux parents, le partage doit être acté par les deux '
      + 'services des ressources humaines. Indiquez dans votre demande la répartition retenue.',

      'Les deux parents peuvent prendre leur congé simultanément ou en alternance.',
    ],
  }],

  'conge-parental': [{
    type: 'demande',
    titre: 'Demander un congé parental',
    objet: 'Demande de congé parental',
    decision: "Je sollicite le bénéfice d'un congé parental pour mon enfant [PRÉNOM DE L'ENFANT], "
      + 'né(e) le [DATE DE NAISSANCE], à compter du [DATE DE DÉBUT SOUHAITÉE].',
    fondement: {
      fpe: 'Les articles L. 515-1 à L. 515-11 du code général de la fonction publique et le décret '
        + "n° 85-986 du 16 septembre 1985 ouvrent le congé parental de plein droit : "
        + "l'administration ne peut pas le refuser.",
      fpt: 'Les articles L. 515-1 à L. 515-11 du code général de la fonction publique et le décret '
        + "n° 86-68 du 13 janvier 1986 ouvrent le congé parental de plein droit : "
        + "l'administration ne peut pas le refuser.",
      fph: 'Les articles L. 515-1 à L. 515-11 du code général de la fonction publique et le décret '
        + "n° 88-976 du 13 octobre 1988 ouvrent le congé parental de plein droit : "
        + "l'administration ne peut pas le refuser.",
    },
    demande: "Je vous demande de bien vouloir enregistrer ma demande et de me notifier l'arrêté "
      + 'correspondant.',
    rappels: [
      'La demande se dépose au moins deux mois avant la date de début du congé.',

      "Chaque renouvellement se demande au moins un mois avant l'expiration de la période en "
      + 'cours.',

      "Vous pouvez mettre fin au congé parental à tout moment, sans avoir à justifier d'un motif "
      + 'grave.',
    ],
  }, {
    type: 'demande',
    titre: "Demander sa réintégration à l'issue du congé parental",
    objet: "Demande de réintégration à l'issue du congé parental",
    decision: "Placé(e) en congé parental jusqu'au [DATE DE FIN DE LA PÉRIODE EN COURS], je "
      + 'sollicite ma réintégration à compter du [DATE SOUHAITÉE].',
    fondement: 'Les articles L. 515-1 à L. 515-11 du code général de la fonction publique '
      + "organisent la réintégration à l'issue du congé parental. Le décret n° 2020-529 du "
      + "5 mai 2020 a fixé à un mois avant l'expiration de la période en cours le délai de la "
      + 'demande, et prévoit un entretien préalable quatre semaines avant la reprise.',
    demande: 'Je vous demande de bien vouloir me confirmer mon affectation et de fixer la date de '
      + "l'entretien préalable à ma reprise.",
    rappels: [
      "La demande de réintégration se dépose au moins un mois avant l'expiration de la période en "
      + "cours — le même délai qu'un renouvellement.",

      'Un entretien préalable est prévu quatre semaines avant la reprise : il sert à préparer '
      + 'votre affectation et vos conditions de travail.',
    ],
  }],

  // ── Protection sociale complémentaire ─────────────────────────────────────
  'psc-reforme': [{
    type: 'demande',
    titre: "Demander une dispense d'adhésion au contrat collectif",
    objet: "Demande de dispense d'adhésion au contrat collectif de protection sociale "
      + 'complémentaire',
    aQui: 'À votre service des ressources humaines.',
    decision: "Je sollicite une dispense d'adhésion au contrat collectif de protection sociale "
      + 'complémentaire souscrit par votre administration, au motif suivant : [MOTIF : couverture '
      + "par le contrat collectif obligatoire de mon conjoint, contrat à durée déterminée de moins "
      + "d'un an, quotité de travail réduite…].",
    fondement: "L'ordonnance n° 2021-175 du 17 février 2021 et les articles L. 827-1 et suivants "
      + 'du code général de la fonction publique organisent la protection sociale complémentaire '
      + "des agents publics et la participation de l'employeur. Les textes d'application prévoient "
      + "les cas dans lesquels l'agent peut demander à ne pas adhérer au contrat collectif.",
    demande: 'Vous trouverez joint le justificatif de ma situation. Je vous demande de bien '
      + 'vouloir enregistrer cette demande et de me notifier votre décision par écrit.',
    rappels: [
      "La dispense se demande par écrit, et elle se justifie : joignez l'attestation de "
      + 'couverture, le contrat, ou la pièce correspondant à votre motif.',

      'Vérifiez avant de renoncer que votre couverture actuelle est au moins équivalente, sur les '
      + 'garanties comme sur la prévoyance : une dispense vous prive aussi de la participation de '
      + "l'employeur.",
    ],
  }],

  // ── Carrière ──────────────────────────────────────────────────────────────
  'conge-formation': [{
    type: 'demande',
    titre: 'Demander un congé de formation professionnelle',
    objet: 'Demande de congé de formation professionnelle',
    aQui: 'À votre chef de service, avec copie au service des ressources humaines.',
    decision: 'Je sollicite un congé de formation professionnelle pour suivre la formation '
      + "suivante : [INTITULÉ DE LA FORMATION], dispensée par [ORGANISME DE FORMATION], d'une "
      + 'durée de [DURÉE], du [DATE DE DÉBUT] au [DATE DE FIN].',
    fondement: {
      fpe: 'Les articles L. 422-1 et suivants du code général de la fonction publique ouvrent le '
        + 'congé de formation professionnelle au fonctionnaire justifiant de trois années de '
        + 'services effectifs. La demande est déposée au moins 120 jours avant le début de la '
        + 'formation.',
      fpt: 'Les articles L. 422-1 et suivants du code général de la fonction publique ouvrent le '
        + 'congé de formation professionnelle au fonctionnaire justifiant de trois années de '
        + 'services effectifs. La demande est déposée au moins 90 jours avant le début de la '
        + 'formation.',
      fph: 'Les articles L. 422-1 et suivants du code général de la fonction publique ouvrent le '
        + 'congé de formation professionnelle au fonctionnaire justifiant de trois années de '
        + 'services effectifs. La demande est déposée au moins 60 jours avant le début de la '
        + 'formation.',
    },
    demande: 'Je vous demande de bien vouloir examiner ma demande et de me notifier votre '
      + "décision, ainsi que le montant et la durée de l'indemnité forfaitaire.",
    rappels: [
      "Le délai de dépôt diffère selon le versant : 120 jours à l'État, 90 jours dans la "
      + "territoriale, 60 jours à l'hôpital. Une demande déposée hors délai peut être écartée pour "
      + 'ce seul motif.',

      "À l'issue du congé, vous vous engagez à servir dans la fonction publique pendant le triple "
      + "de la durée pendant laquelle vous avez perçu l'indemnité. En cas de départ anticipé, elle "
      + 'doit être remboursée.',
    ],
  }],

  sft: [{
    type: 'demande',
    titre: 'Demander le supplément familial de traitement',
    objet: 'Demande de supplément familial de traitement',
    aQui: 'À votre service des ressources humaines.',
    decision: 'Je sollicite le bénéfice du supplément familial de traitement au titre de [NOMBRE] '
      + 'enfant(s) à charge : [PRÉNOMS ET DATES DE NAISSANCE].',
    fondement: 'Les articles L. 712-8 à L. 712-11 du code général de la fonction publique ouvrent '
      + "le supplément familial de traitement à l'agent public qui a la charge d'un ou plusieurs "
      + 'enfants, et en interdisent le cumul au titre du même enfant. Le décret n° 85-1148 du '
      + '24 octobre 1985 en fixe le barème et les modalités de calcul.',
    demande: 'Vous trouverez joints les actes de naissance et, le cas échéant, le jugement '
      + "d'adoption. Je vous demande de bien vouloir ouvrir le droit et de me confirmer la date de "
      + "prise d'effet.",
    rappels: [
      "Si les deux parents sont agents publics, vous indiquez d'un commun accord lequel des deux "
      + 'perçoit le supplément : il ne peut pas être versé deux fois au titre du même enfant.',

      'Le supplément apparaît comme une ligne distincte sur la fiche de paie. Vérifiez que le '
      + 'nombre d\'enfants retenu correspond à votre situation, surtout après un changement '
      + 'récent.',
    ],
  }, {
    type: 'demande',
    titre: 'Demander le partage du SFT en résidence alternée',
    objet: 'Demande de partage du supplément familial de traitement — résidence alternée',
    aQui: 'À votre service des ressources humaines.',
    decision: 'Mon (mes) enfant(s) [PRÉNOMS ET DATES DE NAISSANCE] réside(nt) en alternance à mon '
      + "domicile et à celui de l'autre parent depuis le [DATE DE MISE EN PLACE]. Je sollicite le "
      + 'partage du supplément familial de traitement à parts égales.',
    fondement: "L'article L. 712-10 du code général de la fonction publique et le décret "
      + "n° 2020-1366 du 10 novembre 2020 permettent, en cas de résidence alternée de l'enfant, le "
      + 'partage du supplément familial de traitement entre les deux parents.',
    demande: 'Vous trouverez joint [LE JUGEMENT OU LA CONVENTION FIXANT LA RÉSIDENCE ALTERNÉE]. Je '
      + "vous demande de bien vouloir appliquer ce partage et de me confirmer sa date de prise "
      + "d'effet.",
    rappels: [
      'Le partage modifie le montant perçu par chacun des deux parents. Prévenez le service des '
      + 'ressources humaines dès la mise en place de la résidence alternée, pour éviter un '
      + 'versement à régulariser ensuite.',
    ],
  }],

  // ── Retraite ──────────────────────────────────────────────────────────────
  'retraite-cnracl': [{
    type: 'demande',
    titre: 'Demander sa liquidation de pension',
    objet: "Demande d'admission à la retraite et de liquidation de pension",
    aQui: 'À votre service des ressources humaines, qui transmet votre demande à la CNRACL.',
    decision: 'Je sollicite mon admission à la retraite à compter du [DATE DE DÉPART SOUHAITÉE] et '
      + 'la liquidation de ma pension.',
    fondement: 'Le décret n° 2003-1306 du 26 décembre 2003 fixe le régime de retraite des '
      + 'fonctionnaires affiliés à la Caisse nationale de retraites des agents des collectivités '
      + 'locales, les conditions de liquidation et le calcul de la pension.',
    demande: 'Je vous demande de bien vouloir enregistrer ma demande, la transmettre à la CNRACL, '
      + "et me communiquer l'état de mes services tel qu'il sera transmis.",
    rappels: [
      'La demande se dépose au moins six mois avant la date de départ souhaitée.',

      'Vérifiez votre relevé de carrière sur info-retraite.fr avant de déposer votre demande, et '
      + 'signalez toute anomalie au service des ressources humaines : une correction prend du '
      + 'temps.',
    ],
  }],

  'retraite-sre': [{
    type: 'demande',
    titre: 'Demander sa mise à la retraite',
    objet: "Demande d'admission à la retraite et de liquidation de pension",
    aQui: 'À votre service des ressources humaines, qui transmet votre demande au service des '
      + "retraites de l'État.",
    decision: 'Je sollicite mon admission à la retraite à compter du [DATE DE DÉPART SOUHAITÉE] et '
      + 'la liquidation de ma pension.',
    fondement: 'Le code des pensions civiles et militaires de retraite fixe les conditions '
      + "d'ouverture du droit à pension, son calcul et sa liquidation pour les fonctionnaires de "
      + "l'État.",
    demande: 'Je vous demande de bien vouloir enregistrer ma demande, la transmettre au service '
      + "des retraites de l'État, et me communiquer l'état de mes services tel qu'il sera "
      + 'transmis.',
    rappels: [
      'Le dépôt est recommandé six mois avant la date de départ souhaitée.',

      'Vérifiez votre relevé de carrière sur info-retraite.fr avant de déposer votre demande, et '
      + 'signalez toute anomalie au service des ressources humaines.',
    ],
  }],

  'retraite-invalidite': [{
    type: 'demande',
    titre: 'Demander une retraite pour invalidité',
    objet: "Demande de saisine du conseil médical en vue d'une retraite pour invalidité",
    decision: "Mon état de santé ne me permet plus d'exercer mes fonctions. Je sollicite la "
      + "saisine du conseil médical en vue de l'examen de mes droits à une retraite pour "
      + 'invalidité.',
    fondement: {
      fpe: 'Les articles L. 27 à L. 37 du code des pensions civiles et militaires de retraite '
        + "ouvrent la retraite pour invalidité au fonctionnaire définitivement inapte à l'exercice "
        + "de ses fonctions. Elle est versée sans condition d'âge.",
      fpt: 'Le décret n° 2003-1306 du 26 décembre 2003 ouvre la retraite pour invalidité au '
        + "fonctionnaire affilié à la CNRACL définitivement inapte à l'exercice de ses fonctions. "
        + "Elle est versée sans condition d'âge.",
      fph: 'Le décret n° 2003-1306 du 26 décembre 2003 ouvre la retraite pour invalidité au '
        + "fonctionnaire affilié à la CNRACL définitivement inapte à l'exercice de ses fonctions. "
        + "Elle est versée sans condition d'âge.",
    },
    demande: 'Vous trouverez joints les éléments médicaux en ma possession. Je vous demande de '
      + 'bien vouloir saisir le conseil médical en formation plénière et de me faire connaître la '
      + 'date de sa séance.',
    rappels: [
      "Le conseil médical se prononce sur l'inaptitude définitive et sur l'imputabilité au "
      + 'service. Vous pouvez vous faire assister du médecin de votre choix.',

      "Avant d'engager cette démarche, demandez au service des ressources humaines si un "
      + "reclassement est envisageable : c'est une voie distincte, qui maintient l'activité.",
    ],
  }],
};

// ── Construction ────────────────────────────────────────────────────────────

const resoudre = (valeur, versant) =>
  (valeur && typeof valeur === 'object' ? valeur[versant] : valeur);

// Rend les courriers d'une fiche, prêts à l'affichage et à l'export. `versant`
// sert aux fondements qui diffèrent d'un versant à l'autre — un contractuel
// hospitalier ne doit pas citer le décret de l'État.
// Les demandes d'abord, les recours ensuite : c'est l'ordre de la vie d'un
// dossier. L'index rendu ici est celui de la liste FUSIONNÉE — c'est lui que
// l'écran passe en paramètre de navigation, et le découpage par type à
// l'affichage ne doit donc jamais le recalculer sur une sous-liste.
const modelesDeLaFiche = (ficheId) => [
  ...(DEMANDES[ficheId] || []),
  ...(MODELES[ficheId] || []),
];

export const courriersDeLaFiche = (ficheId, versant) => {
  const modeles = modelesDeLaFiche(ficheId);
  if (!modeles.length) return [];
  return modeles.map((m, i) => {
    const resolu = { ...m, fondement: resoudre(m.fondement, versant) };
    return {
      id: `${ficheId}-${i}`,
      type: m.type,
      titre: m.titre,
      objet: m.objet,
      // Un modèle peut remplacer son destinataire et ajouter ses propres
      // rappels : une demande d'allocation d'invalidité ne part pas à la
      // hiérarchie, et un accident de service se déclare en quinze jours.
      aQui: m.aQui || A_QUI[m.type],
      rappels: m.rappels ? [...m.rappels, ...RAPPELS[m.type]] : RAPPELS[m.type],
      corps: SQUELETTES[m.type](resolu),
    };
  });
};

export const aDesCourriers = (ficheId) => !!(MODELES[ficheId] || DEMANDES[ficheId]);

export default MODELES;
