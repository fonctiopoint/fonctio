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
  demande: RAPPELS_ADMIN,
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

// ── Construction ────────────────────────────────────────────────────────────

const resoudre = (valeur, versant) =>
  (valeur && typeof valeur === 'object' ? valeur[versant] : valeur);

// Rend les courriers d'une fiche, prêts à l'affichage et à l'export. `versant`
// sert aux fondements qui diffèrent d'un versant à l'autre — un contractuel
// hospitalier ne doit pas citer le décret de l'État.
export const courriersDeLaFiche = (ficheId, versant) => {
  const modeles = MODELES[ficheId];
  if (!modeles) return [];
  return modeles.map((m, i) => {
    const resolu = { ...m, fondement: resoudre(m.fondement, versant) };
    return {
      id: `${ficheId}-${i}`,
      type: m.type,
      titre: m.titre,
      objet: m.objet,
      aQui: A_QUI[m.type],
      rappels: RAPPELS[m.type],
      corps: SQUELETTES[m.type](resolu),
    };
  });
};

export const aDesCourriers = (ficheId) => !!MODELES[ficheId];

export default MODELES;
