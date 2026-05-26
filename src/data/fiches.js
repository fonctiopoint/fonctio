// src/data/fiches.js
// Sources vérifiables sur Légifrance : https://www.legifrance.gouv.fr

// ─────────────────────────────────────────────────────────────────────────────
// BANNIÈRE NOUVEAUTÉS — modifier ici à chaque mise à jour de contenu
// Mettre active: false pour masquer la bannière
// ─────────────────────────────────────────────────────────────────────────────
export const NOUVEAUTES = {
  active: true,
  version: 'v8',
  date: 'Avril 2025',
  titre: 'Nouveautés — Avril 2025',
  lignes: [
    '🆕 Module PSC complet (réforme, prévoyance, affiliation)',
    '🆕 Fiche médecine statutaire et médecin agréé',
    '🆕 Disponibilité d\'office pour raison de santé',
    '✏️ CMO : primes au prorata (90 % puis 50 %) — corrigé',
    '✏️ Simulateur CGM années 2-3 corrigé',
  ],
};

export const MODULES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 1 — SANTÉ & CONGÉS MALADIE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sante',
    updatedAt: 'mai. 2026',
    title: 'Santé & Congés maladie',
    icon: '🏥',
    color: '#C4673A',
    bgColor: '#F0D5C4',
    count: 8,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'CMO, CLM, CLD, disponibilité d\'office, fractionné, cure thermale, TPT',
    fiches: [
      {
        id: 'cmo',
        titre: 'Congé maladie ordinaire (CMO)',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Contractuels', '90 % puis 50 %'],
        resume: 'Le CMO est le congé de base pour toute maladie. Il ouvre droit à un maintien du traitement à 90 % pendant 3 mois, puis à 50 % pendant 9 mois, dans une période de 12 mois consécutifs.',
        ciblePublic: 'Fonctionnaires titulaires des trois versants (FPE, FPT, FPH) et agents contractuels (règles spécifiques selon versant — réforme 2024 pour la FPE).',
        droits: [
          { label: '90 % traitement + 90 % primes', valeur: '3 premiers mois', detail: '90 % du traitement indiciaire + 90 % des primes (RIFSEEP, NBI…) + IR + SFT intégral. Source : Décret 2010-997 art. 1er + Loi 2025-127.', versants: ['fpe', 'fph'] },
          { label: '50 % traitement + 50 % primes', valeur: 'Mois 4 à 12', detail: '50 % du traitement indiciaire + 50 % des primes. SFT et IR maintenus intégralement.', versants: ['fpe', 'fph'] },
          { label: '90 % traitement', valeur: '3 premiers mois', detail: '90 % du traitement indiciaire + IR + SFT. Primes : selon délibération de la collectivité (soumis à vote de l\'assemblée délibérante). Source : CE n°462452 du 4 juil. 2024.', versants: ['fpt'] },
          { label: '50 % traitement', valeur: 'Mois 4 à 12', detail: '50 % du traitement indiciaire. Primes : selon délibération. SFT maintenu intégralement.', versants: ['fpt'] },
          { label: 'Période de référence', valeur: '12 mois glissants', detail: 'Les droits sont calculés sur les 12 derniers mois consécutifs.' },
          { label: 'Jour de carence', valeur: '1er jour', detail: 'Applicable au premier jour de chaque arrêt (sauf AT, longue maladie, 3e arrêt même pathologie dans les 12 mois).' },
        ],
        tableau: {
          colonnes: [
            { label: 'Période', flex: 1.2 },
            { label: 'Taux traitement', flex: 1 },
            { label: 'Primes', flex: 0.9 },
            { label: 'SFT', flex: 0.7 },
          ],
          lignes: [
            ['Mois 1 à 3', '90 %', '90 %', 'Maintenu'],
            ['Mois 4 à 12', '50 %', '50 %', 'Maintenu'],
            ['Au-delà', 'Aucun droit', '—', '—'],
          ],
        },
        etapes: [
          { num: 1, titre: 'Consulter un médecin', texte: 'Le médecin traitant établit un avis d\'arrêt de travail (formulaire Cerfa).' },
          { num: 2, titre: 'Transmettre sous 48 heures', texte: 'Le volet employeur doit parvenir à l\'administration dans les 48 heures. Le volet CPAM est transmis directement pour les contractuels.' },
          { num: 3, titre: 'Contre-visite possible', texte: 'L\'administration peut organiser une contre-visite par un médecin agréé. L\'agent doit être présent à son domicile aux heures légales (9 h-11 h / 14 h-16 h).' },
          { num: 4, titre: 'Reprise ou prolongation', texte: 'Tout certificat de prolongation doit être transmis dans les mêmes délais. Au-delà de 6 mois consécutifs, le dossier peut être orienté vers le CLM.' },
        ],
        pieges: [
          'Le délai de 48 heures est impératif. Un retard injustifié peut entraîner une retenue sur traitement.',
          { texte: 'Les primes et indemnités (RIFSEEP, NBI…) suivent le traitement : 90 % les 3 premiers mois, puis 50 % en demi-traitement. Source : Décret 2010-997 art. 1er + Loi 2025-127.', versants: ['fpe', 'fph'] },
          { texte: 'Le maintien des primes au prorata (90 % puis 50 %) est soumis à délibération de la collectivité. Sans délibération, les primes peuvent être suspendues. Vérifier auprès du service RH.', versants: ['fpt'] },
          'La contre-visite ne peut pas s\'effectuer pendant les heures de sortie autorisées par le médecin.',
          'Lors du passage à 50 % (demi-traitement), le traitement peut être versé à tort à taux plein en raison du calendrier des payes. La somme versée en trop constitue un indu qui devra être remboursé. Se rapprocher impérativement du service RH dès le passage à mi-traitement.',
          'Le CMO à 90 % n\'est pas un plein traitement intégral — vérifier sa fiche de paie pour s\'assurer du bon calcul.',
        ],
        recours: 'En cas de refus injustifié, recours gracieux auprès de l\'administration (2 mois), puis tribunal administratif.',
        sources: [
          { texte: 'Art. 34-2° Loi n° 84-16 du 11 janvier 1984 (FPE)' },
          { texte: 'Art. 57-2° Loi n° 84-53 du 26 janvier 1984 (FPT)' },
          { texte: 'Décret n° 86-442 du 14 mars 1986' },
        ],
        versantNotes: {
          fpe: '✅ En FPE, les primes (RIFSEEP, NBI…) sont maintenues à 90 % les 3 premiers mois puis à 50 % en demi-traitement. Source : Décret 2010-997 art. 1er + Loi 2025-127. Le jour de carence s\'applique au 1er jour de chaque arrêt.',
          fpt: '⚠️ En FPT, le maintien des primes au prorata (90 % puis 50 %) est conditionné à une délibération de la collectivité. Sans délibération, les primes peuvent être entièrement suspendues. Vérifier impérativement auprès du service RH ou de la DRH de la collectivité. Source : CE n°462452 du 4 juil. 2024 + principe de parité.',
          fph: '✅ En FPH, les primes suivent le traitement (90 % puis 50 %), comme en FPE. Source : Décret 2010-997 applicable par parité + Décret 2025-197.',
        },
      },
      {
        id: 'clm',
        titre: 'Congé de longue maladie (CLM)',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Conseil médical', '3 ans max'],
        resume: 'Le CLM est accordé pour une maladie grave nécessitant un traitement prolongé. Il dure jusqu\'à 3 ans et nécessite l\'avis obligatoire du conseil médical (formation restreinte).',
        ciblePublic: 'Fonctionnaires titulaires uniquement. Les contractuels bénéficient du congé grave maladie (CGM).',
        droits: [
          { label: '1re année — traitement', valeur: '100 %', detail: '100 % du traitement indiciaire.' },
          { label: '1re année — primes', valeur: '33 %', detail: 'Depuis le Décret n°2024-641 du 27 juin 2024.', versants: ['fpe'] },
          { label: '1re année — primes', valeur: 'Selon délibération', detail: 'Le Décret 2024-641 ne s\'applique pas directement. La collectivité peut prévoir le maintien par délibération.', versants: ['fpt'] },
          { label: '1re année — primes', valeur: 'Selon règles locales', detail: 'Se renseigner auprès de la DRH de l\'établissement.', versants: ['fph'] },
          { label: '2e et 3e années — traitement', valeur: '60 %', detail: '60 % du traitement indiciaire.' },
          { label: '2e et 3e années — primes', valeur: '60 %', detail: 'Depuis le Décret n°2024-641 du 27 juin 2024.', versants: ['fpe'] },
          { label: '2e et 3e années — primes', valeur: 'Selon délibération', detail: 'Maintien possible par délibération de la collectivité, dans la limite du taux FPE.', versants: ['fpt'] },
          { label: '2e et 3e années — primes', valeur: 'Selon règles locales', detail: 'Se renseigner auprès de la DRH de l\'établissement.', versants: ['fph'] },
          { label: 'Durée maximale', valeur: '3 ans', detail: 'Renouvellement par période de 3 à 6 mois, sur avis du conseil médical.' },
        ],
        tableau: null,
        tableaux: {
          fpe: {
            colonnes: [
              { label: 'Période', flex: 1.2 },
              { label: 'Traitement', flex: 0.9 },
              { label: 'Primes', flex: 0.9 },
              { label: 'SFT', flex: 0.7 },
            ],
            lignes: [
              ['Année 1', '100 %', '33 %', 'Maintenu'],
              ['Années 2 & 3', '60 %', '60 %', 'Maintenu'],
            ],
          },
          fpt: {
            colonnes: [
              { label: 'Période', flex: 1.2 },
              { label: 'Traitement', flex: 0.9 },
              { label: 'Primes', flex: 0.9 },
              { label: 'SFT', flex: 0.7 },
            ],
            lignes: [
              ['Année 1', '100 %', 'Délibération', 'Maintenu'],
              ['Années 2 & 3', '60 %', 'Délibération', 'Maintenu'],
            ],
          },
          fph: {
            colonnes: [
              { label: 'Période', flex: 1.2 },
              { label: 'Traitement', flex: 0.9 },
              { label: 'Primes', flex: 0.9 },
              { label: 'SFT', flex: 0.7 },
            ],
            lignes: [
              ['Année 1', '100 %', 'Selon DRH', 'Maintenu'],
              ['Années 2 & 3', '60 %', 'Selon DRH', 'Maintenu'],
            ],
          },
        },
        etapes: [
          { num: 1, titre: 'Certificat médical circonstancié', texte: 'Votre médecin traitant rédige un certificat détaillant la pathologie (sans que le diagnostic soit transmis à l\'employeur — secret médical).' },
          { num: 2, titre: 'Demande à l\'administration', texte: 'Transmission du certificat au service RH dans les 48 heures. L\'administration saisit le conseil médical.' },
          { num: 3, titre: 'Avis du conseil médical', texte: 'La formation restreinte se prononce. Délai réglementaire : 2 mois. L\'agent peut se faire accompagner.' },
          { num: 4, titre: 'Décision de l\'administration', texte: 'L\'administration place l\'agent en CLM. Elle suit en principe l\'avis du conseil médical.' },
          { num: 5, titre: 'Renouvellements', texte: 'Tous les 3 à 6 mois, le conseil médical est à nouveau saisi pour renouveler ou modifier le congé.' },
        ],
        pieges: [
          'L\'administration ne peut pas connaître votre diagnostic — seul l\'avis d\'aptitude ou d\'inaptitude lui est transmis.',
          'Le refus de CLM doit être motivé et notifié par écrit. Il est contestable devant le tribunal administratif.',
          'Lors du passage à 60 % (2e et 3e années), le traitement peut être versé en trop. La somme indûment perçue devra être remboursée. Se rapprocher impérativement du service RH.',
          { texte: 'Les primes sont maintenues à 33 % puis 60 % sur décision de la collectivité — vérifier la délibération auprès du service RH.', versants: ['fpt'] },
          { texte: 'Les primes sont maintenues à 33 % puis 60 % depuis le Décret 2024-641.', versants: ['fpe'] },
          'Rechute : de nouveaux droits s\'ouvrent si l\'agent a accompli 1 an de service actif entre les deux congés.',
        ],
        recours: 'Recours gracieux (2 mois), puis recours contentieux devant le tribunal administratif. Vous pouvez demander une expertise médicale contradictoire via le conseil médical.',
        sources: [
          { texte: 'DECRET du 2026-05-04 — NOR : FPPD2026312A' },
          { texte: 'Art. 34-3° Loi n° 84-16 (FPE) — Décret 86-442 art. 28 à 35' },
          { texte: 'Décret n° 2024-641 du 27 juin 2024 (réforme rémunération CLM/CGM)' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022 (conseil médical)' },
        ],
        versantNotes: {
          fpe: '✅ En FPE : 100 % du traitement + 33 % des primes en 1re année, puis 60 % + 60 % des primes en 2e et 3e années. Source : Décret n°2024-641 du 27 juin 2024.',
          fpt: '⚠️ En FPT : 100 % du traitement en 1re année, puis 60 % en 2e et 3e années. Le maintien des primes dépend d\'une délibération de la collectivité (non obligatoire). Le décret 2024-641 s\'applique à titre de plafond. Vérifier auprès du service RH.',
          fph: '⚠️ En FPH : 100 % du traitement en 1re année, puis 60 % en 2e et 3e années. Le maintien des primes est soumis aux règles locales de l\'établissement hospitalier. Se renseigner auprès de la DRH.',
        },
      },
      {
        id: 'cld',
        titre: 'Congé de longue durée (CLD)',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', '5 affections', '5 ans max'],
        resume: 'Le CLD est réservé aux 5 affections les plus graves. Il offre une protection maximale avec 5 ans de congé, dont 3 ans à plein traitement.',
        ciblePublic: 'Fonctionnaires titulaires uniquement. Réservé aux 5 affections listées par décret.',
        droits: [
          { label: 'Plein traitement', valeur: '3 ans', detail: '100 % du traitement indiciaire.' },
          { label: 'Demi-traitement + primes', valeur: '2 ans à 50 % + 60 % primes', detail: '50 % du traitement indiciaire + 60 % des primes. Depuis le Décret n°2024-641 du 27 juin 2024.', versants: ['fpe'] },
          { label: 'Demi-traitement', valeur: '2 ans à 50 %', detail: '50 % du traitement indiciaire. Primes selon délibération de la collectivité.', versants: ['fpt'] },
          { label: 'Demi-traitement', valeur: '2 ans à 50 %', detail: '50 % du traitement indiciaire. Se renseigner auprès de la DRH pour les primes.', versants: ['fph'] },
          { label: 'Durée totale', valeur: '5 ans', detail: 'Durée maximale cumulée, renouvellements compris.' },
        ],
        tableau: {
          colonnes: [
            { label: 'Période', flex: 1.2 },
            { label: 'Traitement', flex: 1 },
            { label: 'Durée', flex: 0.8 },
          ],
          lignes: [
            ['Plein traitement', '100 %', '3 ans'],
            ['Demi-traitement', '50 %', '2 ans'],
            ['Total maximum', '—', '5 ans'],
          ],
        },
        etapes: [
          { num: 1, titre: 'Vérifier l\'affection', texte: 'Les 5 affections ouvrant droit au CLD : tuberculose, maladie mentale, affections neurologiques invalidantes, lupus érythémateux systémique, maladie de Parkinson.' },
          { num: 2, titre: 'Parcours CMO → CLM → CLD', texte: 'CMO épuisé → CLM accordé → au bout d\'un an de CLM, possibilité de passage en CLD si l\'affection figure dans la liste.' },
          { num: 3, titre: 'Saisine du conseil médical', texte: 'La formation restreinte du conseil médical se prononce sur le passage en CLD.' },
          { num: 4, titre: 'Suivi médical régulier', texte: 'Le conseil médical est saisi à chaque renouvellement.' },
        ],
        pieges: [
          'Un agent ne peut pas être en CLM et en CLD simultanément. Le CLD remplace le CLM.',
          'La non-inscription de votre maladie à la liste n\'empêche pas un CLM — seulement le CLD.',
          'Lors du passage au demi-traitement (4e année), un versement en trop peut intervenir. Se rapprocher du service RH dès le changement de taux pour éviter un indu.',
        ],
        recours: 'Même procédure que pour le CLM. Le refus de passage en CLD est une décision administrative susceptible de recours.',
        sources: [
          { texte: 'Art. 34-4° Loi n° 84-16 — Décret 86-442 art. 36 à 40', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000695191' },
          { texte: 'Arrêté du 14 mars 1986 (liste des 5 affections CLD)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000319546' },
        ],
      },
      {
        id: 'fractionne',
        titre: 'Congé maladie fractionné',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Conseil médical', 'Discontinu'],
        resume: 'Le congé maladie peut, sous conditions, être utilisé de façon discontinue — en périodes séparées — lorsque le traitement médical le justifie (chimiothérapie, dialyse, traitement ambulatoire lourd).',
        ciblePublic: 'Fonctionnaires titulaires, sur avis du conseil médical.',
        droits: [
          { label: 'CMO fractionné', valeur: 'Possible', detail: 'Les droits (3 mois à 90 % + 9 mois à 50 %) sont calculés sur 12 mois consécutifs mais consommés de façon discontinue.' },
          { label: 'CLM fractionné', valeur: 'Sur avis', detail: 'Le conseil médical peut autoriser la prise discontinue du CLM pour permettre des reprises partielles entre les périodes de traitement.' },
        ],
        etapes: [
          { num: 1, titre: 'Justification médicale', texte: 'Le médecin traitant justifie la nécessité du fractionnement (protocole de traitement : chimio, séances, cures).' },
          { num: 2, titre: 'Demande et avis médical', texte: 'L\'agent soumet sa demande. Le médecin agréé et/ou le conseil médical donnent leur avis.' },
          { num: 3, titre: 'Accord de l\'administration', texte: 'L\'administration décide du placement en congé fractionné selon un calendrier établi avec l\'agent.' },
          { num: 4, titre: 'Articulation avec le TPT', texte: 'Le congé fractionné peut précéder un temps partiel thérapeutique à la reprise.' },
        ],
        pieges: [
          'Le fractionnement ne rallonge pas la durée totale des droits — il modifie seulement leur mode d\'utilisation.',
          'La reprise entre deux périodes de congé fractionné est une vraie reprise : les obligations de service s\'appliquent.',
          'Des versements en trop sont possibles lors des transitions entre périodes. Vérifier sa fiche de paie et se rapprocher du service RH.',
        ],
        recours: 'Le refus de fractionnement peut être contesté. L\'agent peut demander un réexamen par le conseil médical.',
        sources: [
          { texte: 'Décret n° 86-442 du 14 mars 1986', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000695191' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022 (conseil médical)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045344395' },
        ],
      },
      {
        id: 'office',
        titre: 'Congé d\'office',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Initiative admin', 'Avis obligatoire'],
        resume: 'Le congé d\'office est un placement en congé de maladie décidé par l\'administration — sans demande de l\'agent — lorsqu\'elle constate une inaptitude à exercer les fonctions.',
        ciblePublic: 'Fonctionnaires titulaires. Mesure exceptionnelle à l\'initiative de l\'employeur public.',
        droits: [
          { label: 'Nature du congé', valeur: 'CMO ou CLM', detail: 'Selon la durée et la pathologie, l\'administration place l\'agent en CMO ou en CLM d\'office.' },
          { label: 'Rémunération', valeur: 'Identique', detail: 'Les droits à rémunération sont les mêmes que pour un congé demandé par l\'agent.' },
        ],
        etapes: [
          { num: 1, titre: 'Constat de l\'administration', texte: 'Signalement du supérieur hiérarchique, du médecin de prévention, ou de tout tiers.' },
          { num: 2, titre: 'Visite médicale obligatoire', texte: 'Un médecin agréé examine l\'agent pour confirmer l\'inaptitude temporaire.' },
          { num: 3, titre: 'Avis du conseil médical', texte: 'Le conseil médical (formation restreinte) est obligatoirement saisi avant tout placement en CLM d\'office.' },
          { num: 4, titre: 'Notification à l\'agent', texte: 'La décision est notifiée à l\'agent avec ses voies et délais de recours. Le principe du contradictoire doit être respecté.' },
        ],
        pieges: [
          'L\'administration doit respecter le principe du contradictoire : l\'agent doit pouvoir présenter ses observations avant la décision.',
          'Le congé d\'office ne peut pas être utilisé comme sanction disciplinaire déguisée.',
          'Ne pas confondre avec la mise en disponibilité d\'office : le congé d\'office maintient les droits à rémunération.',
          'Un versement en trop est possible si le congé d\'office est prononcé en cours de mois. Vérifier sa fiche de paie.',
        ],
        recours: 'Recours gracieux (2 mois). Recours contentieux devant le tribunal administratif. Demande de contre-expertise médicale via le conseil médical.',
        sources: [
          { texte: 'Décret n° 86-442 du 14 mars 1986, art. 42 et suivants', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000695191' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045344395' },
        ],
      },
      {
        id: 'cure',
        titre: 'Cure thermale',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'CMO', 'Prescription médicale'],
        resume: 'La cure thermale prescrite par un médecin est assimilée à un congé de maladie ordinaire. Elle est prise en charge dans les mêmes conditions et impute les droits à CMO.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels.',
        droits: [
          { label: 'Statut juridique', valeur: 'CMO', detail: 'La cure thermale est traitée comme un CMO classique : mêmes droits à rémunération, mêmes règles de transmission.' },
          { label: 'Prise en charge médicale', valeur: 'CPAM / régime', detail: 'La caisse primaire prend en charge les frais thermaux sur prescription médicale. Ce n\'est pas automatique.' },
        ],
        etapes: [
          { num: 1, titre: 'Prescription médicale', texte: 'Votre médecin traitant prescrit la cure thermale sur ordonnance.' },
          { num: 2, titre: 'Accord CPAM', texte: 'La CPAM donne son accord pour la prise en charge des frais.' },
          { num: 3, titre: 'Arrêt de travail', texte: 'Un arrêt de travail doit être établi pour la période de cure. Transmission à l\'administration sous 48 heures.' },
          { num: 4, titre: 'Imputation sur le CMO', texte: 'La durée de la cure s\'impute sur les droits à CMO de l\'agent.' },
        ],
        pieges: [
          'Sans prescription médicale et accord CPAM, aucun congé maladie ne peut être accordé pour une cure de confort.',
          'La cure impute les droits à CMO : si l\'agent a déjà épuisé son CMO, les règles du demi-traitement (50 %) s\'appliquent.',
          'Un versement en trop est possible si la cure chevauche un changement de taux. Se rapprocher du service RH.',
        ],
        recours: 'En cas de refus de l\'administration d\'accorder le congé maladie pour cure, recours gracieux puis contentieux.',
        sources: [
          { texte: 'Décret n° 86-442 du 14 mars 1986 (régime CMO)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000695191' },
          { texte: 'Code de la sécurité sociale — prise en charge thermalisme', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006073189' },
        ],
      },
      {
        id: 'tpt',
        titre: 'Temps partiel thérapeutique (TPT)',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Plein traitement', 'Renouvelable sans limite d\'affection'],
        resume: 'Le TPT permet une reprise progressive du travail à temps partiel tout en percevant la totalité de son traitement. Depuis le décret du 28 juillet 2021, il n\'y a plus de limite par affection ni par pathologie : le TPT est renouvelable après 1 an de position d\'activité, quelle que soit la maladie.',
        ciblePublic: 'Fonctionnaires titulaires en position d\'activité. Depuis 2021, le TPT peut être accordé sans condition préalable d\'arrêt maladie (FPE). Contractuels : soumis aux règles CPAM.',
        droits: [
          { label: 'Rémunération', valeur: 'Plein traitement maintenu', detail: 'Le traitement indiciaire est versé intégralement (SFT et NBI compris), quelle que soit la quotité de reprise. Source : Art. L. 823-1 CGFP.' },
          { label: 'Durée par autorisation', valeur: '1 an maximum', detail: 'Accordée et renouvelée par périodes de 1 à 3 mois, dans la limite d\'un an (continu ou discontinu). Source : Art. L. 823-5 CGFP + Décret 86-442 art. 23-3.' },
          { label: 'Renouvellement', valeur: 'Après 1 an d\'activité', detail: 'À l\'issue des 12 mois de TPT, une nouvelle autorisation peut être accordée après un délai minimal d\'1 an en position d\'activité ou de détachement. Source : Art. L. 823-6 CGFP + Décret 86-442 art. 23-14 (modifié par Décret 2024-641).' },
          { label: 'Limite par affection', valeur: '❌ Supprimée', detail: 'Depuis le Décret n°2021-997 du 28 juillet 2021, il n\'y a plus aucune distinction selon l\'origine ou la nature de la pathologie. La nouvelle autorisation peut être accordée pour la même affection ou une affection différente. Source : FAQ officielle portail FP + Art. L. 823-6 CGFP.' },
          { label: 'Quotité', valeur: '50 %, 60 %, 70 %, 80 % ou 90 %', detail: 'Fixée par le médecin traitant dans le certificat médical. Ne peut être inférieure à 50 %.' },
        ],
        tableau: null,
        tableaux: {
          fpe: {
            colonnes: [{ label: 'Élément', flex: 1.4 }, { label: 'Règle', flex: 1.6 }],
            lignes: [
              ['Durée max. par autorisation', '12 mois'],
              ['Renouvellement', 'Après 1 an d\'activité'],
              ['Limite par affection', 'Aucune depuis 2021'],
              ['Condition préalable d\'arrêt', 'Non requise depuis nov. 2021'],
              ['Rémunération', 'Plein traitement (100 %)'],
            ],
          },
          fpt: {
            colonnes: [{ label: 'Élément', flex: 1.4 }, { label: 'Règle', flex: 1.6 }],
            lignes: [
              ['Durée max. par autorisation', '12 mois'],
              ['Renouvellement', 'Après 1 an d\'activité'],
              ['Limite par affection', 'Aucune depuis 2021'],
              ['Condition préalable CNRACL', 'Arrêt de travail préalable requis'],
              ['Condition préalable IRCANTEC', 'Non requise depuis nov. 2021'],
              ['Rémunération', 'Plein traitement (100 %)'],
            ],
          },
          fph: {
            colonnes: [{ label: 'Élément', flex: 1.4 }, { label: 'Règle', flex: 1.6 }],
            lignes: [
              ['Durée max. par autorisation', '12 mois'],
              ['Renouvellement', 'Après 1 an d\'activité'],
              ['Limite par affection', 'Aucune depuis 2021'],
              ['Condition préalable d\'arrêt', 'Non requise — vérifier DRH'],
              ['Rémunération', 'Plein traitement (100 %)'],
            ],
          },
        },
        etapes: [
          { num: 1, titre: 'Certificat du médecin traitant', texte: 'Le médecin traitant établit un certificat précisant la quotité de travail préconisée, la durée et les modalités de reprise. Ce certificat constitue la pièce maîtresse de la demande.' },
          { num: 2, titre: 'Dépôt de la demande', texte: 'L\'agent adresse la demande à l\'administration accompagnée du certificat médical. L\'administration peut faire procéder à l\'examen par un médecin agréé — obligatoire dès que la prolongation dépasse 3 mois.' },
          { num: 3, titre: 'Avis médical et décision', texte: 'Le médecin agréé rend un avis sur la justification médicale, la quotité et la durée demandée. L\'administration prend sa décision par arrêté. En cas de désaccord entre médecins, le conseil médical est saisi.' },
          { num: 4, titre: 'Exercice du TPT', texte: 'L\'agent reprend ses fonctions à la quotité définie. Il peut exercer dans son poste habituel ou être affecté temporairement si les fonctions ne sont pas partageables.' },
          { num: 5, titre: 'Renouvellement après 1 an d\'activité', texte: 'À l\'issue des 12 mois de TPT, si l\'état de santé le justifie, une nouvelle demande peut être déposée après au moins 1 an en position d\'activité ou de détachement — pour la même pathologie ou une autre.' },
        ],
        pieges: [
          '⚠️ Attention à la confusion fréquente : la limite "1 an renouvelable une fois" qui existait avant 2021 est SUPPRIMÉE. Le TPT n\'est plus limité à 2 ans par affection. La seule contrainte est : 1 an de TPT maximum, puis 1 an d\'activité avant une nouvelle autorisation.',
          'Le refus de TPT est une décision administrative défavorable qui doit être motivée par l\'administration. Un refus non motivé est illégal.',
          'Le TPT cesse automatiquement si l\'agent est en arrêt maladie plus de 30 jours consécutifs pendant le TPT — l\'arrêt n\'interrompt pas les droits mais suspend l\'autorisation.',
          'En cas d\'aggravation pendant le TPT, l\'agent peut être replacé en CLM ou CLD. Un arrêt survenant pendant le TPT ne remet pas à zéro le délai d\'1 an d\'activité nécessaire au renouvellement.',
          'Les contractuels relevant du régime général doivent obtenir l\'accord de la CPAM pour bénéficier du TPT — règles différentes des titulaires.',
        ],
        recours: 'Refus de TPT : recours gracieux (2 mois), puis tribunal administratif. En cas d\'urgence médicale, référé devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L. 823-1 à L. 823-6 CGFP (TPT — droit et renouvellement)' },
          { texte: 'Décret n°86-442 du 14 mars 1986, art. 23-1 à 23-14 (FPE — modifié par Décret 2021-997)' },
          { texte: 'Décret n°2021-997 du 28 juillet 2021 (réforme TPT — suppression limite par affection)' },
          { texte: 'Décret n°2021-1462 du 8 novembre 2021 (TPT FPT)' },
          { texte: 'Décret n°2024-641 du 27 juin 2024, art. 5 (mise à jour art. 23-14 Décret 86-442)' },
          { texte: 'FAQ officielle portail FP (portail fonction-publique.gouv.fr — TPT)' },
        ],
        versantNotes: {
          fpe: '✅ FPE : depuis le 11 novembre 2021, le TPT peut être accordé sans condition préalable d\'arrêt de travail. Source : Décret 2021-997 du 28 juillet 2021.',
          fpt: '⚠️ FPT : le TPT pour les fonctionnaires CNRACL est accordé après un congé pour raison de santé préalable. Pour les fonctionnaires IRCANTEC (temps non complet), plus de condition préalable d\'arrêt depuis 2021. Source : Décret 2021-1462 du 8 novembre 2021.',
          fph: '✅ FPH : règles alignées sur la FPE. Le TPT peut être accordé sans condition préalable d\'arrêt. Vérifier les modalités auprès de la DRH de l\'établissement.',
        },
      },
      {
        id: 'dispo-office-sante',
        titre: 'Disponibilité d\'office pour raison de santé',
        categorie: 'Santé & Congés maladie',
        chips: ['Titulaires', 'Droits suspendus', 'Procédure stricte'],
        resume: 'La disponibilité d\'office pour raison de santé intervient lorsqu\'un fonctionnaire a épuisé tous ses droits à congé maladie et ne peut pas reprendre ses fonctions. Elle suspend le traitement mais préserve les droits à la retraite sous conditions.',
        ciblePublic: 'Fonctionnaires titulaires ayant épuisé leurs droits à CLM, CLD ou CITIS et se trouvant dans l\'impossibilité de reprendre le service.',
        droits: [
          { label: 'Traitement', valeur: 'Suspendu', detail: 'Contrairement au congé d\'office, la disponibilité d\'office n\'ouvre plus droit au traitement. L\'agent ne perçoit plus de rémunération de son employeur.' },
          { label: 'Couverture sociale', valeur: 'Maintien sous conditions', detail: 'L\'agent reste affilié à la CPAM pour la prise en charge des soins, mais ne perçoit plus d\'indemnités journalières de son employeur.' },
          { label: 'Droits à la retraite', valeur: 'Partiellement maintenus', detail: 'Les trimestres de disponibilité d\'office pour raison de santé peuvent être pris en compte, contrairement à la disponibilité ordinaire.' },
          { label: 'Durée', valeur: 'Sans limite légale', detail: 'La disponibilité d\'office pour raison de santé dure jusqu\'à ce que l\'agent soit en état de reprendre ses fonctions, qu\'il soit reclassé ou mis à la retraite pour invalidité.' },
          { label: 'Réintégration', valeur: 'Droit garanti', detail: 'L\'agent conserve le droit d\'être réintégré dans son corps d\'origine dès lors qu\'il est reconnu apte à reprendre ses fonctions.' },
        ],
        etapes: [
          { num: 1, titre: 'Épuisement des droits à congé', texte: 'La disponibilité d\'office ne peut intervenir qu\'après épuisement de tous les droits à congé maladie (CMO, CLM ou CLD selon les cas). Le conseil médical se prononce sur l\'impossibilité de reprendre le service.' },
          { num: 2, titre: 'Avis obligatoire du conseil médical', texte: 'Le conseil médical (formation restreinte) doit être saisi et rendre un avis favorable avant tout placement en disponibilité d\'office. L\'agent doit être informé de la procédure et peut se faire accompagner.' },
          { num: 3, titre: 'Notification de la décision', texte: 'L\'administration notifie la décision à l\'agent avec les voies et délais de recours. La décision précise la durée de la disponibilité et les conditions de réintégration.' },
          { num: 4, titre: 'Suivi médical régulier', texte: 'L\'agent est convoqué périodiquement devant le conseil médical pour évaluer son état de santé et les possibilités de reprise ou de reclassement.' },
          { num: 5, titre: 'Fin de disponibilité', texte: 'Trois issues possibles : reprise du service si l\'agent est reconnu apte, reclassement dans un autre emploi adapté, ou mise à la retraite pour invalidité si l\'inaptitude est définitive.' },
        ],
        pieges: [
          'Ne pas confondre disponibilité d\'office pour raison de santé et disponibilité ordinaire (sur demande). La première est subie, la seconde est choisie. Leurs régimes sont très différents.',
          'L\'agent en disponibilité d\'office ne perçoit plus de traitement mais reste fonctionnaire — il conserve ses droits à réintégration.',
          'La disponibilité d\'office ne peut pas être utilisée par l\'administration comme moyen de pression ou de sanction déguisée — tout placement irrégulier est contestable.',
          'Durant la disponibilité d\'office, l\'agent doit informer son administration de tout changement dans son état de santé susceptible de permettre une reprise.',
          'L\'agent peut demander sa réintégration à tout moment s\'il est en état de reprendre ses fonctions — l\'administration ne peut pas refuser sans motif.',
        ],
        recours: 'Contestation du placement en disponibilité d\'office : recours gracieux (2 mois), puis tribunal administratif. Refus de réintégration : recours contentieux urgent (référé). L\'agent peut demander une contre-expertise médicale auprès du conseil médical.',
        sources: [
          { texte: 'Art. L. 514-1 et suivants CGFP (disponibilité d\'office pour raison de santé)' },
          { texte: 'Décret n° 86-442 du 14 mars 1986 (congés maladie et disponibilité d\'office)' },
          { texte: 'Décret n° 85-986 du 16 septembre 1985 (positions statutaires FPE)' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022 (conseil médical)' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 2 — MÉDECINE STATUTAIRE & PRÉVENTION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'medecine',
    updatedAt: 'Avr. 2025',
    title: 'Médecine statutaire & Prévention',
    icon: '🩺',
    color: '#3A7CA5',
    bgColor: '#D6EAF4',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Médecin agréé, médecine de prévention, conseil médical, secret médical',
    fiches: [
      {
        id: 'prevention',
        titre: 'Médecine de prévention',
        categorie: 'Médecine statutaire & Prévention',
        chips: ['Tous agents', 'SPST', 'Droit de l\'agent'],
        resume: 'Le médecin de prévention joue un rôle de conseil et de prévention — il n\'est pas le médecin de l\'administration. Il agit dans l\'intérêt de la santé des agents.',
        ciblePublic: 'Tous les agents publics (titulaires et contractuels).',
        droits: [
          { label: 'Visites obligatoires', valeur: 'Périodiques', detail: 'Visite médicale au moins tous les 5 ans. Plus fréquentes pour les postes à risque.' },
          { label: 'Visite à la demande', valeur: 'Sur demande agent', detail: 'L\'agent peut demander une visite à tout moment auprès du SPST.' },
          { label: 'Fiche d\'aptitude', valeur: 'Document clé', detail: 'Atteste de l\'aptitude à occuper le poste. Ne contient pas le diagnostic.' },
        ],
        etapes: [
          { num: 1, titre: 'Contacter le SPST', texte: 'Le Service de Prévention et de Santé au Travail (depuis 2022) est le point de contact pour toute visite médicale.' },
          { num: 2, titre: 'Visite médicale', texte: 'Le médecin du travail examine l\'agent, évalue les conditions de travail et formule des préconisations d\'aménagement si nécessaire.' },
          { num: 3, titre: 'Aménagement de poste', texte: 'Si le médecin de prévention préconise un aménagement, l\'administration est tenue d\'en tenir compte.' },
        ],
        pieges: [
          'Le médecin de prévention est différent du médecin agréé : il agit pour l\'agent, pas pour l\'administration.',
          'La fiche d\'aptitude ne doit jamais mentionner le diagnostic — uniquement l\'aptitude ou l\'inaptitude au poste.',
        ],
        recours: 'L\'agent peut contester un avis d\'aptitude devant le conseil médical.',
        sources: [
          { texte: 'Décret n° 82-453 du 28 mai 1982 modifié (hygiène et sécurité FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509290' },
          { texte: 'Décret n° 2020-566 du 13 mai 2020 (SPST)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000041885527' },
        ],
      },
      {
        id: 'conseil-medical',
        titre: 'Le conseil médical',
        categorie: 'Médecine statutaire & Prévention',
        chips: ['Depuis 2022', 'Deux formations', 'Droits de l\'agent'],
        resume: 'Depuis 2022, l\'ancien comité médical et l\'ancienne commission de réforme ont fusionné en un seul conseil médical, qui intervient dans toutes les décisions médicales importantes.',
        ciblePublic: 'Tous les fonctionnaires titulaires pour les décisions nécessitant un avis médical réglementaire.',
        droits: [
          { label: 'Formation restreinte', valeur: 'Ex-comité médical', detail: 'Intervient pour : CLM, CLD, reclassement, inaptitude, TPT.' },
          { label: 'Formation plénière', valeur: 'Ex-commission de réforme', detail: 'Intervient pour : AT/MP, retraite pour invalidité, ATI.' },
          { label: 'Droits de l\'agent', valeur: 'Garantis', detail: 'Être entendu, se faire accompagner d\'un médecin de son choix, contester l\'avis.' },
        ],
        etapes: [
          { num: 1, titre: 'Saisine', texte: 'L\'administration saisit le conseil médical. L\'agent peut aussi le saisir directement dans certains cas.' },
          { num: 2, titre: 'Examen du dossier', texte: 'Le conseil médical examine le dossier médical transmis dans le respect du secret médical.' },
          { num: 3, titre: 'Audition possible', texte: 'L\'agent a le droit d\'être entendu. Il peut être accompagné d\'un médecin de son choix.' },
          { num: 4, titre: 'Avis rendu', texte: 'Délai réglementaire : 2 mois. L\'administration suit l\'avis ou motive sa divergence.' },
        ],
        pieges: [
          'L\'avis du conseil médical n\'est pas une décision — c\'est l\'administration qui décide.',
          'Ne pas confondre formation restreinte (3 médecins) et formation plénière (représentants admin + agents + médecins).',
        ],
        recours: 'Demande de contre-expertise médicale contradictoire. Recours gracieux puis contentieux.',
        sources: [
          { texte: 'Décret n° 2022-353 du 11 mars 2022 (conseil médical FPE)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045344395' },
          { texte: 'Loi n° 2019-828 du 6 août 2019 (transformation FP)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038884854' },
        ],
      },
      {
        id: 'secret-medical',
        titre: 'Secret médical dans la FP',
        categorie: 'Médecine statutaire & Prévention',
        chips: ['Droit fondamental', 'Tous agents', 'Principe absolu'],
        resume: 'L\'administration n\'a jamais accès au diagnostic de son agent. Le secret médical est un principe absolu qui s\'applique à toutes les procédures statutaires.',
        ciblePublic: 'Tous les agents publics.',
        droits: [
          { label: 'Secret du diagnostic', valeur: 'Absolu', detail: 'Seul l\'avis d\'aptitude ou d\'inaptitude et la durée du congé sont communiqués à l\'administration. Jamais le diagnostic.' },
          { label: 'Dossier médical', valeur: 'Accès agent', detail: 'L\'agent a le droit de consulter son dossier médical constitué par le médecin agréé.' },
        ],
        etapes: [
          { num: 1, titre: 'Ce que le médecin communique à l\'admin', texte: 'Uniquement : aptitude au poste (oui/non), durée estimée d\'inaptitude, éventuelles restrictions fonctionnelles.' },
          { num: 2, titre: 'Demande du dossier médical', texte: 'L\'agent peut demander à consulter son dossier médical constitué dans le cadre des procédures statutaires.' },
        ],
        pieges: [
          'Un agent RH qui note le nom d\'une maladie dans un dossier administratif commet une violation du secret médical — recours CNIL et pénal.',
          'L\'administration ne peut pas conditionner une décision (mutation, promotion) à la connaissance d\'un diagnostic.',
          'Le médecin de prévention ne peut pas transmettre le diagnostic à l\'employeur sans accord écrit de l\'agent.',
        ],
        recours: 'Plainte auprès du Conseil de l\'Ordre des médecins. Signalement CNIL. Recours pénal (art. 226-13 du Code pénal).',
        sources: [
          { texte: 'Art. 226-13 Code pénal (secret professionnel)' },
          { texte: 'Art. L. 1110-4 Code de la santé publique' },
        ],
      },
      {
        id: 'medecine-statutaire',
        titre: 'Médecine statutaire — rôle et saisine',
        categorie: 'Médecine statutaire & Prévention',
        chips: ['Tous agents', 'Médecin agréé', 'Saisine administrative'],
        resume: 'La médecine statutaire désigne les médecins mandatés par l\'administration pour évaluer l\'aptitude des agents dans le cadre de procédures réglementées. Elle est distincte de la médecine de prévention et de la médecine traitante.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels, dans le cadre de toute procédure nécessitant un avis médical officiel (CLM, CLD, reclassement, aptitude au recrutement…).',
        droits: [
          { label: 'Médecin agréé', valeur: 'Mandaté par l\'admin', detail: 'Le médecin agréé est un médecin généraliste ou spécialiste agréé par le préfet. Il est mandaté par l\'administration pour produire un avis médical dans des procédures spécifiques.' },
          { label: 'Missions', valeur: 'Évaluation d\'aptitude', detail: 'Il se prononce sur l\'aptitude au poste, la réalité d\'une maladie invoquée, l\'opportunité d\'un congé maladie, les conditions d\'un reclassement.' },
          { label: 'Secret médical', valeur: 'Maintenu', detail: 'Le médecin agréé est tenu au secret médical. Il transmet uniquement ses conclusions (apte/inapte, durée) à l\'administration, jamais le diagnostic.' },
          { label: 'Auprès de qui', valeur: 'Tous agents concernés', detail: 'Le médecin agréé intervient pour tous les agents : titulaires comme contractuels, pour toute procédure nécessitant un avis médical officiel.' },
        ],
        etapes: [
          { num: 1, titre: 'Saisine par l\'administration', texte: 'C\'est l\'administration qui saisit le médecin agréé, pas l\'agent directement. Elle le fait dans le cadre d\'une procédure précise : instruction d\'un CLM, vérification d\'aptitude au retour de congé, bilan pour reclassement…' },
          { num: 2, titre: 'Convocation de l\'agent', texte: 'L\'agent est convoqué par le médecin agréé. Il peut se présenter accompagné d\'un médecin de son choix (médecin de partie). Le refus de se soumettre à l\'examen peut entraîner des conséquences sur le dossier.' },
          { num: 3, titre: 'Examen et rapport', texte: 'Le médecin agréé examine l\'agent et peut consulter son dossier médical (transmis via le médecin traitant). Il rédige un rapport médical confidentiel destiné au conseil médical, et une conclusion transmissible à l\'administration.' },
          { num: 4, titre: 'Transmission des conclusions', texte: 'Seules les conclusions (aptitude, inaptitude, durée estimée) parviennent à l\'administration. Le rapport médical complet va au conseil médical, pas au service RH.' },
          { num: 5, titre: 'Recours possible', texte: 'Si l\'agent conteste les conclusions du médecin agréé, il peut demander une contre-expertise ou saisir le conseil médical qui peut ordonner une expertise contradictoire.' },
        ],
        pieges: [
          'Le médecin agréé n\'est pas un médecin de confiance choisi par l\'agent — il est désigné par l\'administration. Ses conclusions peuvent être défavorables à l\'agent.',
          'L\'agent a le droit de se faire accompagner d\'un médecin de son choix lors de la visite — ne jamais y aller seul si la situation est complexe.',
          'Le refus de se soumettre à la visite médicale peut être interprété défavorablement dans la procédure en cours.',
          'La différence entre médecin agréé (mandaté par l\'admin) et médecin de prévention (défenseur de la santé de l\'agent) est fondamentale — ne pas les confondre.',
        ],
        recours: 'Contestation des conclusions du médecin agréé : demande de contre-expertise, saisine du conseil médical pour expertise contradictoire. Recours contentieux contre la décision administrative fondée sur l\'avis.',
        sources: [
          { texte: 'Décret n° 86-442 du 14 mars 1986 (médecins agréés et conseil médical)' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022 (réforme conseil médical)' },
          { texte: 'Art. L. 822-1 et suivants CGFP (congés pour raison de santé)' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'inaptitude',
    updatedAt: 'Avr. 2025',
    title: 'Inaptitude & Reclassement',
    icon: '♿',
    color: '#5C6B45',
    bgColor: '#E8EDDF',
    count: 5,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Inaptitude temporaire, définitive, reclassement, RQTH, majoration tierce personne',
    fiches: [
      {
        id: 'inaptitude-temp',
        titre: 'Inaptitude temporaire',
        categorie: 'Inaptitude & Reclassement',
        chips: ['Titulaires', 'Réversible', 'Aménagement poste'],
        resume: 'L\'inaptitude temporaire est une incapacité médicalement constatée à exercer ses fonctions pour une durée limitée. Elle est par définition réversible.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels.',
        droits: [
          { label: 'Pendant l\'inaptitude', valeur: 'Congé maladie', detail: 'L\'agent est placé en CMO, CLM ou CLD selon la durée et la pathologie.' },
          { label: 'Aménagement du poste', valeur: 'Obligation', detail: 'Si le médecin de prévention le préconise, l\'administration est tenue de proposer un aménagement.' },
          { label: 'Visite de reprise', valeur: 'Obligatoire', detail: 'Après un arrêt de plus de 30 jours, une visite de reprise auprès du médecin de prévention est obligatoire.' },
        ],
        etapes: [
          { num: 1, titre: 'Constat médical', texte: 'Le médecin traitant, le médecin agréé ou le médecin de prévention constate l\'inaptitude temporaire.' },
          { num: 2, titre: 'Placement en congé', texte: 'L\'agent est placé dans le congé adapté à sa situation.' },
          { num: 3, titre: 'Aménagement ou adaptation du poste', texte: 'Le médecin de prévention peut recommander des aménagements.' },
          { num: 4, titre: 'Visite de reprise', texte: 'Obligatoire après tout arrêt de plus de 30 jours. Elle conditionne la reprise effective du travail.' },
        ],
        pieges: [
          'L\'inaptitude temporaire peut devenir définitive — anticiper la procédure de reclassement.',
          'L\'administration ne peut pas imposer un poste qui ne respecte pas les préconisations du médecin de prévention.',
        ],
        recours: 'Contestation de l\'avis d\'aptitude ou d\'inaptitude devant le conseil médical.',
        sources: [
          { texte: 'Art. 63 Loi n° 84-16 (FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000504749' },
          { texte: 'Décret n° 84-1051 du 30 novembre 1984 (reclassement FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693893' },
        ],
      },
      {
        id: 'inaptitude-def',
        titre: 'Inaptitude définitive',
        categorie: 'Inaptitude & Reclassement',
        chips: ['Titulaires', 'Conseil médical', 'Reclassement ou retraite'],
        resume: 'L\'inaptitude définitive est constatée par le conseil médical lorsque l\'agent ne pourra plus jamais exercer son emploi. Elle ouvre sur deux issues : le reclassement ou la retraite pour invalidité.',
        ciblePublic: 'Fonctionnaires titulaires.',
        droits: [
          { label: 'Constat par', valeur: 'Conseil médical plénier', detail: 'La formation plénière constate l\'inaptitude définitive après expertise médicale.' },
          { label: 'Issue 1', valeur: 'Reclassement', detail: 'Si un poste adapté est possible dans un autre corps ou cadre d\'emplois.' },
          { label: 'Issue 2', valeur: 'Retraite pour invalidité', detail: 'Si aucun reclassement n\'est possible.' },
        ],
        etapes: [
          { num: 1, titre: 'Saisine du conseil médical', texte: 'L\'administration ou l\'agent saisit le conseil médical (formation plénière).' },
          { num: 2, titre: 'Expertise médicale', texte: 'Le conseil médical peut ordonner une expertise complémentaire.' },
          { num: 3, titre: 'Avis sur les perspectives', texte: 'Le conseil médical se prononce sur le reclassement possible ou l\'inaptitude totale.' },
          { num: 4, titre: 'Décision administrative', texte: 'L\'administration décide du reclassement ou de la mise en retraite pour invalidité.' },
        ],
        pieges: [
          'L\'inaptitude définitive à ses fonctions ≠ inaptitude à toutes fonctions. La première peut permettre un reclassement.',
          'L\'agent ne peut pas être licencié pour inaptitude : les titulaires sont soit reclassés, soit mis à la retraite.',
        ],
        recours: 'Contestation de l\'avis du conseil médical. Recours administratif devant le tribunal administratif.',
        sources: [
          { texte: 'Art. 63 Loi n° 84-16 (FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000504749' },
          { texte: 'Décret n° 2022-353 du 11 mars 2022', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045344395' },
        ],
      },
      {
        id: 'reclassement',
        titre: 'Reclassement professionnel',
        categorie: 'Inaptitude & Reclassement',
        chips: ['Titulaires', 'Obligation admin', 'Autre corps'],
        resume: 'Quand un fonctionnaire ne peut plus exercer ses fonctions pour raisons de santé, l\'administration est légalement obligée de lui proposer un reclassement dans un autre emploi adapté.',
        ciblePublic: 'Fonctionnaires titulaires inaptes définitivement à leur emploi.',
        droits: [
          { label: 'Obligation de l\'admin', valeur: 'Recherche active', detail: 'L\'administration doit rechercher activement un poste adapté.' },
          { label: 'Détachement', valeur: 'Possible', detail: 'L\'agent peut être détaché dans un autre corps ou cadre d\'emplois.' },
          { label: 'Maintien du traitement', valeur: 'Pendant la procédure', detail: 'Le traitement est maintenu pendant la période de reclassement.' },
        ],
        etapes: [
          { num: 1, titre: 'Demande de reclassement', texte: 'L\'agent formule une demande auprès de son administration, après avis du conseil médical.' },
          { num: 2, titre: 'Recherche de poste', texte: 'L\'administration recherche, dans un délai raisonnable, un emploi correspondant aux capacités de l\'agent.' },
          { num: 3, titre: 'Proposition de poste', texte: 'L\'administration soumet des propositions concrètes.' },
          { num: 4, titre: 'Décision finale', texte: 'Reclassement accepté → mise en place. Reclassement impossible → mise à la retraite pour invalidité.' },
        ],
        pieges: [
          'Le refus d\'un reclassement peut entraîner la perte d\'indemnités. Ne pas refuser sans conseil préalable.',
          'Un reclassement dans un corps inférieur est possible avec maintien du traitement antérieur (indemnité compensatrice).',
        ],
        recours: 'Saisine du tribunal administratif si l\'administration ne propose aucun poste ou si les propositions ne respectent pas les préconisations médicales.',
        sources: [
          { texte: 'Art. 63 Loi n° 84-16 (FPE) — Art. 81-2 Loi n° 84-53 (FPT)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000504749' },
          { texte: 'Décret n° 84-1051 du 30 novembre 1984 (reclassement FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693893' },
        ],
      },
      {
        id: 'majoration-tierce-personne',
        titre: 'Majoration pour tierce personne',
        categorie: 'Inaptitude & Reclassement',
        chips: ['Titulaires', 'Invalidité grave', 'Complément pension'],
        resume: 'La majoration pour tierce personne est une allocation supplémentaire accordée au fonctionnaire invalide ou retraité pour invalidité dont l\'état de santé nécessite l\'assistance constante d\'une tierce personne pour accomplir les actes ordinaires de la vie.',
        ciblePublic: 'Fonctionnaires titulaires en retraite pour invalidité ou reconnus invalides avec un taux d\'invalidité très élevé.',
        droits: [
          { label: 'Éligibilité', valeur: 'Invalidité absolue et définitive', detail: 'L\'agent doit être dans l\'impossibilité absolue et définitive d\'exercer une quelconque activité professionnelle ET avoir besoin de l\'assistance d\'une tierce personne pour les actes ordinaires de la vie.' },
          { label: 'Montant', valeur: '40 % de la pension', detail: 'La majoration est égale à 40 % de la pension principale, avec un plancher minimal fixé par décret.' },
          { label: 'Cumul', valeur: 'Avec la pension', detail: 'La majoration s\'ajoute à la pension d\'invalidité ou de retraite pour invalidité.' },
          { label: 'Renouvellement', valeur: 'Réexamen périodique', detail: 'L\'état de santé est réexaminé périodiquement par le conseil médical pour vérifier le maintien des conditions d\'éligibilité.' },
        ],
        etapes: [
          { num: 1, titre: 'Conditions préalables', texte: 'La majoration ne peut être demandée qu\'après la reconnaissance de l\'invalidité absolue et définitive par le conseil médical (formation plénière).' },
          { num: 2, titre: 'Demande auprès de l\'administration', texte: 'L\'agent ou son représentant dépose une demande de majoration pour tierce personne auprès de l\'administration gestionnaire du dossier retraite (SRE pour la FPE, CNRACL pour la FPT/FPH).' },
          { num: 3, titre: 'Pièces justificatives', texte: 'Certificats médicaux détaillés attestant de la nécessité d\'une assistance tierce. Le conseil médical (formation plénière) peut ordonner une expertise complémentaire.' },
          { num: 4, titre: 'Décision et versement', texte: 'Si accordée, la majoration est versée mensuellement en complément de la pension. Elle est mentionnée sur l\'avis de paiement.' },
          { num: 5, titre: 'Réexamen', texte: 'L\'état de santé est réexaminé périodiquement. En cas d\'amélioration constatée, la majoration peut être supprimée.' },
        ],
        pieges: [
          'La majoration pour tierce personne est distincte de l\'Allocation Personnalisée d\'Autonomie (APA) — les deux peuvent se cumuler sous conditions.',
          'Ne pas confondre avec l\'Allocation Tierce Personne de la Sécurité sociale, qui relève d\'un régime différent pour les contractuels.',
          'Le montant de 40 % s\'applique à la pension brute, pas au net perçu. Vérifier le calcul sur l\'avis de paiement.',
          'En cas de décès du bénéficiaire, la majoration ne se transmet pas aux ayants droit — contrairement à la pension de réversion.',
        ],
        recours: 'Refus de la majoration ou montant contesté : recours gracieux auprès du SRE ou de la CNRACL, puis tribunal administratif.',
        sources: [
          { texte: 'Art. L. 30 et L. 30 bis Code des pensions civiles (majoration tierce personne FPE)' },
          { texte: 'Art. 34 Décret n° 2003-1306 du 26 décembre 2003 (CNRACL)' },
        ],
      },
      {
        id: 'rqth',
        titre: 'RQTH — Reconnaissance de la Qualité de Travailleur Handicapé',
        categorie: 'Inaptitude & Reclassement',
        chips: ['Tous agents', 'MDPH', 'Droits renforcés'],
        resume: 'La RQTH est une reconnaissance administrative du handicap qui ouvre des droits spécifiques dans la fonction publique : aménagement du poste, protection renforcée, aides du FIPHFP. Elle est attribuée par la Maison Départementale des Personnes Handicapées (MDPH).',
        ciblePublic: 'Tout agent public présentant une déficience physique, sensorielle, mentale, cognitive, psychique ou un trouble de santé invalidant.',
        droits: [
          { label: 'Aménagement du poste', valeur: 'Obligation renforcée', detail: 'L\'administration est tenue de prendre les mesures appropriées : matériel adapté, horaires, télétravail renforcé, accessibilité.' },
          { label: 'Préavis doublé', valeur: 'Licenciement / fin contrat', detail: 'En cas de licenciement ou de fin de contrat, le préavis est doublé pour les agents reconnus travailleurs handicapés.' },
          { label: 'FIPHFP', valeur: 'Aides à l\'équipement', detail: 'Le Fonds pour l\'Insertion des Personnes Handicapées dans la FP finance du matériel adapté. La demande est faite par l\'employeur.' },
          { label: 'Durée', valeur: '1 à 5 ans renouvelables', detail: 'La RQTH peut aussi être accordée à vie dans certains cas.' },
          { label: 'Recrutement direct', valeur: 'Voie spécifique FP', detail: 'Il existe une voie de recrutement spécifique dans la FP pour les personnes handicapées.' },
        ],
        etapes: [
          { num: 1, titre: 'Constitution du dossier MDPH', texte: 'Formulaire Cerfa n° 13788*01 + certificat médical récent (moins de 3 mois) + tout document attestant du handicap. Dépôt auprès de la MDPH du département de résidence.' },
          { num: 2, titre: 'Instruction', texte: 'Délai légal : 4 mois. Sans réponse → refus implicite (mais recours possible). La MDPH peut demander des évaluations complémentaires.' },
          { num: 3, titre: 'Notification de la décision', texte: 'En cas d\'accord, la RQTH précise sa durée et les éventuelles orientations (ESAT, marché ordinaire, voie de recrutement FP…).' },
          { num: 4, titre: 'Déclaration à l\'employeur (facultative)', texte: 'La RQTH n\'est PAS automatiquement communiquée à l\'employeur. L\'agent choisit librement s\'il veut en informer son administration pour bénéficier des aménagements de poste et du FIPHFP.' },
          { num: 5, titre: 'Demande d\'aménagement', texte: 'Après déclaration à l\'employeur : saisir le médecin de prévention pour préconisations. L\'administration est tenue de les mettre en œuvre sauf contrainte dûment justifiée.' },
          { num: 6, titre: 'Renouvellement', texte: 'À anticiper 6 mois avant l\'expiration pour éviter une interruption des droits. Procédure identique à la demande initiale.' },
        ],
        pieges: [
          'La RQTH est confidentielle — l\'agent n\'est jamais obligé d\'en informer son employeur. C\'est un choix strictement personnel.',
          'Ne pas confondre RQTH (reconnaissance administrative) et invalidité SS (évaluation médicale de l\'incapacité de travail) — deux dispositifs distincts, cumulables.',
          'Sans RQTH, le médecin de prévention peut quand même préconiser des aménagements de poste — la RQTH n\'est pas un préalable obligatoire.',
          'Le FIPHFP finance du matériel mais la demande doit être faite par l\'employeur, pas directement par l\'agent.',
          'Un renouvellement tardif entraîne une interruption temporaire des droits — ne pas attendre la dernière minute.',
        ],
        recours: 'Refus de RQTH : recours gracieux MDPH (2 mois), puis tribunal du contentieux de l\'incapacité. Refus d\'aménagement de poste : recours devant le tribunal administratif après mise en demeure.',
        sources: [
          { texte: 'Art. L. 352-1 et suivants CGFP (agents handicapés dans la FP)' },
          { texte: 'Loi n° 2005-102 du 11 février 2005 (égalité des droits et des chances)' },
          { texte: 'Art. L. 5213-1 Code du travail (RQTH — applicable par renvoi dans la FP)' },
          { texte: 'FIPHFP — Fonds pour l\'insertion des personnes handicapées dans la FP' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 4 — ACCIDENTS DE TRAVAIL & MP
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'atmp',
    updatedAt: 'Avr. 2025',
    title: 'Accidents de travail & MP',
    icon: '🦺',
    color: '#C0392B',
    bgColor: '#FDECEA',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Accident de service, maladie professionnelle, CITIS, ATI',
    fiches: [
      {
        id: 'at-service',
        titre: 'Accident de service',
        categorie: 'Accidents de travail & MP',
        chips: ['Titulaires', 'CITIS', 'Plein traitement illimité'],
        resume: 'L\'accident survenu dans l\'exercice des fonctions est un accident de service. Il ouvre droit au CITIS : maintien du plein traitement sans limitation de durée et prise en charge à 100 % des frais médicaux.',
        ciblePublic: 'Fonctionnaires titulaires exclusivement.',
        droits: [
          { label: 'CITIS', valeur: 'Plein traitement', detail: 'Congé pour Invalidité Temporaire Imputable au Service : plein traitement maintenu jusqu\'à guérison ou mise à la retraite.' },
          { label: 'Frais médicaux', valeur: '100 % pris en charge', detail: 'Tous les frais médicaux liés à l\'accident sont pris en charge par l\'administration, sans avance de frais.' },
          { label: 'Primes et indemnités', valeur: 'Maintenues', detail: 'Contrairement au CLM, les primes sont maintenues intégralement pendant le CITIS.' },
        ],
        etapes: [
          { num: 1, titre: 'Déclaration immédiate', texte: 'Déclarer l\'accident à son supérieur hiérarchique immédiatement ou dans les plus brefs délais.' },
          { num: 2, titre: 'Certificat médical initial', texte: 'Un certificat médical initial décrivant les lésions doit être établi et transmis à l\'administration.' },
          { num: 3, titre: 'Instruction administrative', texte: 'L\'administration instruit le dossier pour reconnaître l\'imputabilité au service.' },
          { num: 4, titre: 'Reconnaissance de l\'imputabilité', texte: 'Si l\'imputabilité est reconnue → CITIS. Si refusée → CMO classique. Contestation possible.' },
          { num: 5, titre: 'Consolidation', texte: 'À la consolidation des blessures, le médecin évalue les éventuelles séquelles. L\'ATI peut être accordée.' },
        ],
        pieges: [
          'L\'accident de service doit avoir un lien direct avec l\'exercice des fonctions. Un malaise sur le lieu de travail ne suffit pas automatiquement.',
          'Le refus d\'imputabilité doit être motivé et notifié. Il est systématiquement contestable.',
          'Accident de trajet : couvert uniquement pour le trajet direct domicile-travail.',
          'Ne jamais signer de protocole transactionnel sans conseil juridique — risque de renoncer à des droits importants.',
        ],
        recours: 'Recours gracieux (2 mois), puis tribunal administratif.',
        sources: [
          { texte: 'Art. L. 822-18 à L. 822-23 CGFP (CITIS)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
          { texte: 'Décret n° 2019-122 du 21 février 2019 (CITIS)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038134100' },
        ],
      },
      {
        id: 'maladie-pro',
        titre: 'Maladie professionnelle',
        categorie: 'Accidents de travail & MP',
        chips: ['Titulaires', 'Tableau MP', 'CITIS applicable'],
        resume: 'La maladie contractée dans l\'exercice des fonctions peut être reconnue comme maladie professionnelle et ouvrir les mêmes droits que l\'accident de service (CITIS).',
        ciblePublic: 'Fonctionnaires titulaires.',
        droits: [
          { label: 'Régime applicable', valeur: 'Identique AT', detail: 'Une fois reconnue, la maladie professionnelle ouvre droit au CITIS.' },
          { label: 'Tableaux MP', valeur: 'Liste réglementaire', detail: 'Les maladies inscrites aux tableaux sont présumées professionnelles si les conditions d\'exposition sont remplies.' },
          { label: 'Hors tableaux', valeur: 'Expertise possible', detail: 'Une maladie non inscrite peut être reconnue si un lien direct est établi par expertise médicale.' },
        ],
        etapes: [
          { num: 1, titre: 'Vérification du tableau', texte: 'Vérifier si la maladie figure aux tableaux des maladies professionnelles.' },
          { num: 2, titre: 'Déclaration à l\'administration', texte: 'Déclaration avec le certificat médical initial.' },
          { num: 3, titre: 'Instruction par le conseil médical', texte: 'Formation plénière : conditions d\'exposition, ancienneté, tableau applicable.' },
          { num: 4, titre: 'Reconnaissance et droits', texte: 'Si reconnue : CITIS, frais à 100 %, ATI possible.' },
        ],
        pieges: [
          'La prescription est de 2 ans après le constat médical — agir rapidement.',
          'Les RPS et burn-out peuvent être reconnus professionnels, mais nécessitent une expertise médicale détaillée.',
        ],
        recours: 'Recours gracieux puis tribunal administratif. Expertise médicale indépendante.',
        sources: [
          { texte: 'Art. L. 822-20 CGFP (maladie imputable)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
      {
        id: 'ati',
        titre: 'Allocation Temporaire d\'Invalidité (ATI)',
        categorie: 'Accidents de travail & MP',
        chips: ['Titulaires', 'Séquelles permanentes', 'Cumulable traitement'],
        resume: 'L\'ATI compense les séquelles permanentes résultant d\'un accident de service ou d\'une maladie professionnelle. Elle est cumulable avec le traitement en activité.',
        ciblePublic: 'Fonctionnaires titulaires ayant conservé des séquelles après consolidation d\'un AT ou MP.',
        droits: [
          { label: 'Conditions', valeur: 'Taux ≥ 10 %', detail: 'L\'ATI est accordée si le taux d\'incapacité permanente partielle (IPP) est d\'au moins 10 %.' },
          { label: 'Montant', valeur: 'Proportionnel au taux IPP', detail: 'Calculé en pourcentage du traitement indiciaire brut.' },
          { label: 'Cumul', valeur: 'Avec le traitement', detail: 'L\'ATI est cumulable avec le traitement en activité. Elle se transforme en rente d\'invalidité à la retraite.' },
          { label: 'Délai de demande', valeur: '1 an après consolidation', detail: 'Passé ce délai, les droits peuvent être perdus.' },
        ],
        etapes: [
          { num: 1, titre: 'Consolidation des blessures', texte: 'Le médecin constate la consolidation : l\'état de santé est stabilisé.' },
          { num: 2, titre: 'Évaluation du taux d\'IPP', texte: 'Le conseil médical (formation plénière) évalue le taux d\'IPP.' },
          { num: 3, titre: 'Demande d\'ATI', texte: 'Demande auprès de l\'administration avec les pièces médicales dans le délai d\'un an.' },
          { num: 4, titre: 'Versement mensuel', texte: 'L\'ATI est versée mensuellement. Elle est révisable en cas d\'évolution.' },
        ],
        pieges: [
          'Ne pas confondre ATI (en activité) et rente d\'invalidité (à la retraite) — ce sont deux dispositifs distincts qui se suivent.',
          'L\'ATI est imposable.',
          'Le délai d\'un an est impératif — ne pas attendre.',
        ],
        recours: 'Contestation du taux d\'IPP devant le conseil médical. Recours contentieux.',
        sources: [
          { texte: 'Art. L. 826-1 et suivants CGFP (ATI)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
          { texte: 'Décret n° 60-1089 du 6 octobre 1960 (ATI)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000304764' },
        ],
      },
      {
        id: 'at-contractuels',
        titre: 'AT/MP des contractuels',
        categorie: 'Accidents de travail & MP',
        chips: ['Contractuels', 'Régime général', 'Double déclaration'],
        resume: 'Les contractuels relèvent du régime général de la Sécurité sociale pour les AT/MP — pas du CITIS des titulaires.',
        ciblePublic: 'Agents contractuels de droit public des trois versants.',
        droits: [
          { label: 'Régime applicable', valeur: 'Régime général SS', detail: 'Les contractuels sont affiliés à la CPAM pour les AT/MP.' },
          { label: 'Maintien du traitement', valeur: 'Selon ancienneté', detail: 'L\'administration complète les IJ de la SS pour atteindre le plein traitement pendant une durée dépendant de l\'ancienneté.' },
          { label: 'CITIS', valeur: '❌ Non applicable', detail: 'Les contractuels ne bénéficient pas du CITIS.' },
        ],
        etapes: [
          { num: 1, titre: 'Déclaration à l\'administration', texte: 'Dans les 24 heures.' },
          { num: 2, titre: 'Déclaration à la CPAM', texte: 'Obligatoire et indépendante de la déclaration administrative.' },
          { num: 3, titre: 'Instruction AT', texte: 'La CPAM instruit le dossier.' },
          { num: 4, titre: 'Prise en charge', texte: 'Si reconnu : frais médicaux à 100 % et IJ AT majorées. L\'administration complète selon l\'ancienneté.' },
        ],
        pieges: [
          'Pas de CITIS pour les contractuels — la durée de maintien est limitée selon l\'ancienneté.',
          'En CDD, le congé AT ne peut pas dépasser la durée du contrat.',
        ],
        recours: 'Contestation CPAM devant le tribunal judiciaire (pôle social). Recours administratif contre l\'administration.',
        sources: [
          { texte: 'Décret n° 86-83 art. 20 (FPE contractuels AT)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000339494' },
          { texte: 'Portail FP — AT contractuels', url: 'https://www.fonction-publique.gouv.fr/etre-agent-public/ma-protection-sociale/accidents-et-maladies-professionnelles' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 5 — DROITS DES CONTRACTUELS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'contractuels',
    updatedAt: 'Avr. 2025',
    title: 'Droits des contractuels',
    icon: '👷',
    color: '#D4972A',
    bgColor: '#FBF0D6',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'CMO, CGM, AT/MP, reclassement, CDI de droit public',
    fiches: [
      {
        id: 'cmo-contractuels',
        titre: 'CMO des contractuels',
        categorie: 'Droits des contractuels',
        chips: ['Contractuels', 'FPE alignée 2024', 'FPT : progressif'],
        resume: 'En FPT, le droit au maintien de salaire dépend uniquement de votre ancienneté dans la collectivité. Plus vous êtes anciens, plus vous touchez longtemps. La réforme 2024 ne s\'applique pas à la FPT — l\'ancien système progressif reste en vigueur.',
        ciblePublic: 'Agents contractuels de droit public. Le régime diffère selon le versant — voir l\'encart "Pour votre versant" ci-dessous.',
        droits: [
          {
            label: 'Règle générale FPT',
            valeur: 'Progressif selon ancienneté',
            detail: 'Le maintien dépend de votre ancienneté dans la collectivité. Seuls les mois effectivement travaillés dans la même collectivité comptent.',
            versants: ['fpt'],
          },
          {
            label: 'Moins de 4 mois d\'ancienneté',
            valeur: 'Rien maintenu',
            detail: 'Aucun maintien de traitement. Vous percevez uniquement les indemnités journalières (IJ) de la CPAM, soit environ 50 % de votre salaire journalier brut, plafonné à 52 € / jour en 2025.',
            versants: ['fpt'],
          },
          {
            label: 'Entre 4 mois et 2 ans',
            valeur: '1 mois à 90 % + 1 mois à 50 %',
            detail: 'Puis uniquement les IJ CPAM à partir du 3e mois. Exemple : salaire brut 2 000 € → M1-M2 à 90 % = 1 800 €, M3 à 50 % = 1 000 €, M4+ = IJ CPAM seules (~50 %).',
            versants: ['fpt'],
          },
          {
            label: 'Entre 2 ans et 3 ans',
            valeur: '2 mois à 90 % + 2 mois à 50 %',
            detail: 'Puis uniquement les IJ CPAM à partir du 5e mois. Exemple : salaire brut 2 000 € → M1-M2 à 90 % = 1 800 €, M3-M4 à 50 % = 1 000 €, M5+ = IJ CPAM seules.',
            versants: ['fpt'],
          },
          {
            label: '3 ans et plus d\'ancienneté',
            valeur: '3 mois à 90 % + 3 mois à 50 %',
            detail: 'Puis uniquement les IJ CPAM à partir du 7e mois. Exemple : salaire brut 2 000 € → M1-M3 à 90 % = 1 800 €, M4-M6 à 50 % = 1 000 €, M7+ = IJ CPAM seules.',
            versants: ['fpt'],
          },
          {
            label: 'Depuis le 01/09/2024',
            valeur: '3 mois à 90 % + 9 mois à 50 %',
            detail: 'Droits alignés sur les titulaires dès 4 mois d\'ancienneté. Fin de la progressivité. Source : Décret 2024-641.',
            versants: ['fpe'],
          },
          {
            label: 'Depuis le 01/09/2024',
            valeur: 'Aligné FPE',
            detail: '3 mois à 90 % + 9 mois à 50 % dès 4 mois d\'ancienneté. Vérifier auprès de la DRH.',
            versants: ['fph'],
          },
        ],
        tableau: {
          versants: ['fpe', 'fph'],
          colonnes: [
            { label: 'Période', flex: 1.1 },
            { label: 'Traitement', flex: 0.9 },
            { label: 'Primes', flex: 0.9 },
            { label: 'Condition', flex: 1.1 },
          ],
          lignes: [
            ['Mois 1 à 3', '90 %', '90 %', '≥ 4 mois ancienneté'],
            ['Mois 4 à 12', '50 %', '50 %', 'Idem'],
            ['< 4 mois anc.', 'Aucun', 'Aucun', 'IJ CPAM seulement'],
          ],
        },
        tableauFpt: {
          titre: 'Ce que vous touchez selon votre ancienneté',
          colonnes: [
            { label: 'Ancienneté', flex: 1.2 },
            { label: 'À 90 %', flex: 0.8 },
            { label: 'À 50 %', flex: 0.8 },
            { label: 'Après', flex: 1.2 },
          ],
          lignes: [
            ['< 4 mois', '0 mois', '0 mois', 'IJ CPAM dès J1'],
            ['4 mois – 2 ans', '1 mois', '1 mois', 'IJ CPAM dès M3'],
            ['2 ans – 3 ans', '2 mois', '2 mois', 'IJ CPAM dès M5'],
            ['≥ 3 ans', '3 mois', '3 mois', 'IJ CPAM dès M7'],
          ],
        },
        etapes: [
          {
            num: 1,
            titre: 'Calculer votre ancienneté',
            texte: 'Comptez les jours effectivement travaillés dans votre collectivité actuelle (même commune, même département…). Les périodes dans d\'autres collectivités ne comptent pas.',
            versants: ['fpt'],
          },
          {
            num: 1,
            titre: 'Vérifier vos 4 mois d\'ancienneté',
            texte: 'Avant 4 mois : aucun maintien de traitement, uniquement les IJ CPAM. Après 4 mois : 3 mois à 90 % puis 9 mois à 50 %.',
            versants: ['fpe', 'fph'],
          },
          {
            num: 2,
            titre: 'Déclarer à la CPAM',
            texte: 'En tant que contractuel, vous êtes affilié au régime général. Transmettez votre arrêt à la CPAM dans les 48h — elle verse les IJ directement. L\'employeur complète jusqu\'aux taux de maintien applicables.',
          },
          {
            num: 3,
            titre: 'Transmettre à l\'administration',
            texte: 'Envoyez le volet employeur à votre collectivité ou administration dans les 48 heures. Un retard injustifié peut entraîner une retenue sur traitement.',
          },
          {
            num: 4,
            titre: 'Vérifier votre fiche de paie',
            texte: 'Au passage à 50 %, vérifiez que le bon taux est appliqué dès le premier jour du changement. Un versement en trop (indu) devra être remboursé — se rapprocher du service RH dès le changement de taux.',
          },
        ],
        pieges: [
          { texte: 'Ancienneté dans la même collectivité uniquement. Si vous avez changé de commune ou de département, le compteur repart à zéro.', versants: ['fpt'] },
          { texte: 'Sans ancienneté suffisante (< 4 mois), vous ne touchez que les IJ CPAM — soit environ la moitié de votre salaire, plafonnées à 52 €/jour en 2025.', versants: ['fpt'] },
          { texte: 'La réforme 2024 ne s\'applique PAS à la FPT. Les contractuels FPT gardent l\'ancien régime progressif (Décret 88-145 art. 7 inchangé).', versants: ['fpt'] },
          { texte: 'Avant 4 mois d\'ancienneté, aucun maintien de traitement — uniquement les IJ CPAM.', versants: ['fpe', 'fph'] },
          'Au passage au demi-traitement, vérifier immédiatement sa fiche de paie — un trop-perçu devra être remboursé.',
        ],
        recours: 'Contestation de la durée de maintien : recours gracieux (2 mois) puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 88-145 du 15 février 1988 art. 7 (FPT contractuels — inchangé)' },
          { texte: 'Décret n° 2024-641 du 27 juin 2024 (réforme FPE uniquement)' },
          { texte: 'Art. L. 323-1 et suivants Code de la sécurité sociale (IJ CPAM)' },
        ],
        versantNotes: {
          fpe: '✅ FPE : depuis le 1er septembre 2024, 3 mois à 90 % puis 9 mois à 50 % dès 4 mois d\'ancienneté. Source : Décret 2024-641.',
          fpt: '⚠️ FPT : régime progressif maintenu selon votre ancienneté dans la collectivité. Exemple avec 3 ans d\'ancienneté et 2 000 € brut : mois 1-3 → 1 800 € (90 %), mois 4-6 → 1 000 € (50 %), mois 7+ → IJ CPAM seules. Source : Décret 88-145 art. 7.',
          fph: '✅ FPH : droits alignés sur la FPE depuis la réforme 2024. Vérifier les modalités auprès de la DRH de l\'établissement.',
        },
      },
      {
        id: 'cgm',
        titre: 'Congé grave maladie (CGM)',
        categorie: 'Droits des contractuels',
        chips: ['Contractuels', 'Équivalent CLM', '3 ans max'],
        resume: 'Le congé grave maladie est l\'équivalent du CLM pour les contractuels. Il dure jusqu\'à 3 ans pour une affection grave et invalidante.',
        ciblePublic: 'Agents contractuels des trois versants.',
        droits: [
          { label: '1re année', valeur: '100 % + 33 % primes', detail: 'Depuis le Décret n°2024-641 du 27 juin 2024.', versants: ['fpe'] },
          { label: '2e et 3e années', valeur: '60 % + 60 % primes', detail: 'Depuis le Décret n°2024-641 du 27 juin 2024.', versants: ['fpe'] },
          { label: '1re année', valeur: '100 % traitement', detail: 'Le Décret 2024-641 ne s\'applique pas aux contractuels FPT. Primes : selon délibération. Source : Décret 88-145 art. 8.', versants: ['fpt'] },
          { label: '2e et 3e années', valeur: '50 % traitement', detail: 'Le Décret 2024-641 ne s\'applique pas aux contractuels FPT. Primes non revalorisées.', versants: ['fpt'] },
          { label: '1re année', valeur: '100 % + primes selon règles locales', detail: 'Se renseigner auprès de la DRH de l\'établissement.', versants: ['fph'] },
          { label: '2e et 3e années', valeur: '60 % + primes selon règles locales', detail: 'Se renseigner auprès de la DRH de l\'établissement.', versants: ['fph'] },
          { label: 'Durée maximale', valeur: '3 ans', detail: 'Renouvellements par période de 3 à 6 mois.' },
        ],
        etapes: [
          { num: 1, titre: 'Certificat médical', texte: 'Attestant d\'une affection grave et invalidante nécessitant un traitement prolongé.' },
          { num: 2, titre: 'Avis du médecin agréé', texte: 'L\'administration soumet le dossier à un médecin agréé.' },
          { num: 3, titre: 'Placement en CGM et renouvellements', texte: 'Chaque renouvellement nécessite un nouveau certificat et un nouvel avis.' },
        ],
        pieges: [
          'À l\'expiration du CGM sans possibilité de reprise : licenciement pour inaptitude ou reclassement.',
          { texte: 'Le Décret 2024-641 ne s\'applique pas aux contractuels FPT — primes non revalorisées. Droits basés sur le Décret 88-145 art. 8.', versants: ['fpt'] },
          'Un versement en trop peut intervenir lors du passage à 60 %. Se rapprocher du service RH.',
        ],
        recours: 'Refus de CGM contestable par recours gracieux puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 86-83 art. 13 (FPE contractuels)' },
          { texte: 'Décret n° 2024-641 du 27 juin 2024' },
        ],
        versantNotes: {
          fpe: '✅ FPE : 100 % du traitement + 33 % des primes en 1re année, puis 60 % + 60 % des primes en 2e et 3e années. Source : Décret 2024-641.',
          fpt: '⚠️ FPT : 100 % du traitement en 1re année, puis 50 % en 2e et 3e années. Les primes ne sont pas revalorisées — le décret 2024 ne s\'applique pas aux contractuels FPT. Source : Décret 88-145 art. 8.',
          fph: '⚠️ FPH : règles proches de la FPE mais à vérifier auprès de la DRH de l\'établissement. Les conventions collectives locales peuvent prévoir des dispositions différentes.',
        },
      },
      {
        id: 'reclassement-contractuels',
        titre: 'Reclassement & Inaptitude des contractuels',
        categorie: 'Droits des contractuels',
        chips: ['Contractuels', 'CDI / CDD long', 'Licenciement possible'],
        resume: 'Quand un contractuel est définitivement inapte, son employeur doit rechercher un reclassement. Si impossible, il est licencié avec indemnité.',
        ciblePublic: 'Agents contractuels en CDI ou en CDD long (recrutés sur emploi permanent).',
        droits: [
          { label: 'Obligation de l\'admin', valeur: 'Recherche de reclassement', detail: 'L\'employeur doit chercher un poste adapté avant tout licenciement.' },
          { label: 'Si reclassement impossible', valeur: 'Licenciement + indemnité', detail: 'Licenciement pour inaptitude physique avec indemnité selon l\'ancienneté.' },
        ],
        etapes: [
          { num: 1, titre: 'Constat d\'inaptitude', texte: 'Par le médecin agréé à l\'issue des congés maladie.' },
          { num: 2, titre: 'Demande de reclassement', texte: 'Dans le délai imparti selon l\'ancienneté.' },
          { num: 3, titre: 'Recherche de poste', texte: 'L\'administration recherche un emploi adapté de même catégorie.' },
          { num: 4, titre: 'Décision finale', texte: 'Reclassement ou licenciement avec procédure contradictoire et consultation de la CCP.' },
        ],
        pieges: [
          'Seuls les contractuels sur emploi permanent bénéficient de l\'obligation de reclassement.',
          'La CCP doit obligatoirement être consultée avant tout licenciement pour inaptitude physique.',
        ],
        recours: 'Contestation du licenciement devant le tribunal administratif (2 mois).',
        sources: [
          { texte: 'Décret n° 88-145 art. 13 et 17-2 (FPT)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000699407' },
          { texte: 'Service-public.fr — reclassement contractuel', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F34670' },
        ],
      },
      {
        id: 'cdi-public',
        titre: 'CDI de droit public',
        categorie: 'Droits des contractuels',
        chips: ['CDI uniquement', 'Droits renforcés', 'Portabilité'],
        resume: 'Le CDI dans la fonction publique confère des droits renforcés : protection contre le licenciement, portabilité en cas de restructuration, droits à la formation.',
        ciblePublic: 'Agents contractuels en CDI de droit public.',
        droits: [
          { label: 'Accès au CDI', valeur: 'Après 6 ans', detail: '6 ans de services continus sur même emploi → transformation possible en CDI.' },
          { label: 'Portabilité', valeur: 'En cas de restructuration', detail: 'Si le service est supprimé, le CDI peut être transféré à un autre employeur public.' },
          { label: 'Protection licenciement', valeur: 'Renforcée', detail: 'Motifs précis, procédure contradictoire, avis de la CCP souvent requis.' },
        ],
        etapes: [
          { num: 1, titre: 'Vérifier l\'ancienneté requise', texte: 'Pour bénéficier d\'un CDI, l\'agent doit justifier de 6 années de services continus sur un même emploi permanent auprès du même employeur public. Les CDD successifs comptent s\'ils ont été renouvelés sans interruption supérieure à quelques mois.' },
          { num: 2, titre: 'Demander la transformation en CDI', texte: 'La transformation en CDI n\'est pas automatique. L\'agent doit en faire la demande auprès de son administration. En cas de refus non motivé, un recours est possible devant la commission consultative paritaire (CCP).' },
          { num: 3, titre: 'Signature du contrat', texte: 'Le CDI est formalisé par un écrit signé des deux parties. Il précise les fonctions, la rémunération et les conditions de travail.' },
        ],
        recours: 'Refus de transformation en CDI contestable devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L. 332-23 CGFP (CDI)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 6 — ASSISTANT DE PRÉVENTION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'assistant-prevention',
    updatedAt: 'Avr. 2025',
    title: 'Assistant de prévention',
    icon: '🦺',
    color: '#3A7CA5',
    bgColor: '#D6EAF4',
    count: 1,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Rôle, missions, positionnement, droits et obligations',
    fiches: [
      {
        id: 'role-assistant-prevention',
        titre: 'L\'assistant de prévention — rôle et missions',
        categorie: 'Assistant de prévention',
        chips: ['Tous versants', 'Hygiène & Sécurité', 'Réseau PSST'],
        resume: 'L\'assistant de prévention est un agent nommé par l\'autorité administrative pour assister et conseiller le chef de service et la direction dans la mise en œuvre des règles d\'hygiène, de sécurité et de prévention des risques professionnels.',
        ciblePublic: 'Tout agent public susceptible d\'être nommé assistant de prévention, ou souhaitant connaître son rôle.',
        droits: [
          { label: 'Statut', valeur: 'Agent nommé', detail: 'L\'assistant de prévention est un agent de l\'administration nommé par l\'autorité territoriale ou le chef de service. Ce n\'est pas un corps ou un grade — c\'est une mission.' },
          { label: 'Positionnement hiérarchique', valeur: 'Sous l\'autorité du chef de service', detail: 'L\'assistant de prévention intervient sous l\'autorité hiérarchique du chef de service ou du directeur qui l\'a nommé. Il n\'est pas indépendant de la hiérarchie, contrairement au médecin de prévention.' },
          { label: 'Temps dédié', valeur: 'Variable', detail: 'La quotité de temps consacrée à la mission de prévention est définie lors de la nomination. Elle peut aller de quelques heures par semaine à un temps plein.' },
          { label: 'Formation', valeur: 'Obligatoire', detail: 'L\'assistant de prévention doit bénéficier d\'une formation initiale à sa prise de poste et d\'une formation continue.' },
        ],
        etapes: [
          { num: 1, titre: 'Nomination', texte: 'L\'assistant de prévention est nommé par l\'autorité administrative (ministre, préfet, directeur de structure…). La nomination fait l\'objet d\'un acte formel précisant la quotité de temps et les missions.' },
          { num: 2, titre: 'Missions principales', texte: 'Il assiste et conseille le chef de service dans l\'analyse des risques, l\'élaboration du Document Unique d\'Évaluation des Risques Professionnels (DUERP), la mise en place des mesures de prévention et la formation des agents.' },
          { num: 3, titre: 'Participation aux instances', texte: 'L\'assistant de prévention participe aux travaux du Comité Social d\'Administration (CSA) et de sa formation spécialisée (ex-CHSCT). Il peut présenter ses travaux et alertes.' },
          { num: 4, titre: 'Droit d\'alerte', texte: 'En cas de danger grave et imminent, l\'assistant de prévention peut exercer un droit d\'alerte et en informer immédiatement le chef de service et le représentant du SPST.' },
        ],
        pieges: [
          'L\'assistant de prévention ne se substitue pas au médecin de prévention (SPST) — leurs rôles sont complémentaires mais distincts. Le médecin a une indépendance professionnelle ; l\'assistant est sous autorité hiérarchique.',
          'L\'assistant de prévention ne peut pas être sanctionné pour avoir exercé son droit d\'alerte de bonne foi — toute mesure de rétorsion constitue une faute de l\'administration.',
          'Le DUERP doit être mis à jour au moins chaque année et lors de toute modification significative des conditions de travail — l\'assistant de prévention est acteur de cette mise à jour mais ce n\'est pas lui seul qui en est responsable.',
          'L\'assistant de prévention n\'est pas responsable pénalement des accidents du travail — la responsabilité incombe à l\'employeur et au chef de service.',
        ],
        recours: 'En cas d\'entrave à l\'exercice de ses missions ou de sanction liée à ses fonctions de prévention, l\'assistant de prévention peut saisir le CSA et sa formation spécialisée, ainsi que l\'inspection du travail compétente pour la fonction publique.',
        sources: [
          { texte: 'Décret n° 82-453 du 28 mai 1982 modifié (hygiène et sécurité FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509290' },
          { texte: 'Décret n° 85-603 du 10 juin 1985 (FPT — hygiène et sécurité)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000340067' },
          { texte: 'Loi n° 2019-828 du 6 août 2019 (réforme CSA/formation spécialisée)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038884854' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 7 — ASSISTANT DE SERVICE SOCIAL DU PERSONNEL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'assistant-social',
    updatedAt: 'Avr. 2025',
    title: 'Assistant de service social du personnel',
    icon: '🤝',
    color: '#5C6B45',
    bgColor: '#E8EDDF',
    count: 1,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Missions, rôle, domaines d\'intervention, confidentialité, neutralité institutionnelle',
    fiches: [
      {
        id: 'role-ass',
        titre: 'L\'assistant de service social du personnel — qui est-il ?',
        categorie: 'Assistant de service social du personnel',
        chips: ['Tous agents', 'Confidentiel', 'Neutre institutionnellement'],
        resume: 'L\'assistant de service social du personnel est un professionnel du travail social diplômé d\'État, au service exclusif des agents. Il accompagne toute difficulté personnelle ou professionnelle, dans la plus stricte confidentialité et sans lien de dépendance avec la hiérarchie locale.',
        ciblePublic: 'Tous les agents publics, titulaires et contractuels, des trois versants. Sans condition de grade, de statut ou d\'ancienneté.',
        droits: [
          { label: 'Accès', valeur: 'Libre, gratuit, confidentiel', detail: 'Tout agent peut contacter l\'assistant social sans en informer sa hiérarchie, sans rendez-vous obligatoire, sans justification à donner.' },
          { label: 'Secret professionnel', valeur: 'Absolu', detail: 'L\'assistant de service social est soumis au secret professionnel. Aucune information ne peut être transmise à l\'employeur sans accord écrit de l\'agent, sauf exceptions légales (danger grave et imminent pour la personne ou pour autrui).' },
          { label: 'Neutralité institutionnelle', valeur: 'Garantie', detail: 'L\'assistant de service social ne dépend pas de la hiérarchie locale du service. Il est rattaché fonctionnellement à une structure nationale ou régionale (direction des ressources humaines ministérielle, service social interministériel…). Il ne rend pas compte des situations individuelles à l\'employeur.' },
          { label: 'Diplôme d\'État', valeur: 'DEASS obligatoire', detail: 'L\'assistant de service social du personnel est titulaire du Diplôme d\'État d\'Assistant de Service Social (DEASS). C\'est une profession réglementée.' },
        ],
        etapes: [
          { num: 1, titre: 'Comment le contacter ?', texte: 'Les coordonnées de l\'assistant social du personnel figurent sur l\'intranet de l\'administration, sur les panneaux d\'affichage des services RH, ou peuvent être obtenues auprès du service des ressources humaines. Certaines administrations disposent également d\'une permanence téléphonique ou d\'une adresse de messagerie dédiée.' },
          { num: 2, titre: 'Premier contact', texte: 'Le premier entretien peut se faire par téléphone, en présentiel ou en visioconférence selon les modalités offertes. L\'agent expose librement sa situation, sans obligation de tout dire d\'emblée. L\'assistant social écoute, recueille les informations nécessaires et explique comment il peut intervenir.' },
          { num: 3, titre: 'Accompagnement et suivi', texte: 'L\'assistant social élabore avec l\'agent un plan d\'action adapté : démarches administratives, demandes d\'aide, orientation vers des partenaires (CPAM, CAF, bailleurs sociaux, structures de soin, associations…). Il assure un suivi dans le temps selon les besoins.' },
          { num: 4, titre: 'Intervention en urgence', texte: 'En cas de situation urgente (précarité financière grave, violence conjugale, risque suicidaire, expulsion…), l\'assistant social peut mobiliser rapidement des ressources d\'urgence et des réseaux de partenaires.' },
        ],
        pieges: [
          'L\'assistant de service social du personnel n\'est pas un représentant de l\'employeur — il travaille pour l\'agent, pas pour l\'administration.',
          'Ne pas attendre que la situation soit en crise pour consulter. L\'assistant social intervient aussi en prévention, avant que les difficultés ne deviennent insurmontables.',
          'L\'assistant social ne peut pas prendre de décisions à la place de l\'agent. Il accompagne, oriente et soutient — il ne se substitue pas à la personne dans ses choix.',
          'Contacter l\'assistant social n\'a aucune conséquence sur la carrière ou l\'évaluation professionnelle. La hiérarchie n\'est pas informée.',
        ],
        recours: 'En cas de manquement au secret professionnel ou de comportement contraire à la déontologie, l\'agent peut porter plainte auprès du Conseil Départemental de l\'Ordre des Assistants de Service Social (CDOASS) compétent.',
        sources: [
          { texte: 'Art. L. 411-1 Code de l\'action sociale et des familles (secret professionnel ASS)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006074069' },
          { texte: 'Circulaire du 16 mars 2017 relative au service social du personnel (FPE)', url: 'https://www.fonction-publique.gouv.fr' },
          { texte: 'Code de déontologie des assistants de service social', url: 'https://www.ordreassistantssociaux.fr' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 8 — CARRIÈRE & RÉMUNÉRATION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'carriere',
    updatedAt: 'Avr. 2025',
    title: 'Carrière & Rémunération',
    icon: '📈',
    color: '#3A7CA5',
    bgColor: '#D6EAF4',
    count: 5,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Grilles indiciaires, avancement, point d\'indice, RIFSEEP, évaluation',
    fiches: [
      {
        id: 'grille-indicaire',
        titre: 'Grilles indiciaires & Point d\'indice',
        categorie: 'Carrière & Rémunération',
        chips: ['Tous titulaires', 'Catégories A B C', 'Traitement de base'],
        resume: 'Le traitement d\'un fonctionnaire est calculé à partir d\'un indice multiplié par la valeur du point d\'indice. Comprendre ce mécanisme permet de vérifier sa fiche de paie et d\'anticiper ses évolutions salariales.',
        ciblePublic: 'Fonctionnaires titulaires des trois versants.',
        droits: [
          { label: 'Traitement brut', valeur: 'Indice × valeur du point', detail: 'Valeur du point d\'indice au 1er juillet 2023 : 4,92 €. Vérifier la valeur actualisée sur le portail de la FP.' },
          { label: 'Catégorie A', valeur: 'Indices 349 à 1 015', detail: 'Cadres supérieurs, attachés, ingénieurs, professeurs…' },
          { label: 'Catégorie B', valeur: 'Indices 325 à 660', detail: 'Techniciens, rédacteurs, contrôleurs…' },
          { label: 'Catégorie C', valeur: 'Indices 327 à 476', detail: 'Agents d\'exécution, adjoints administratifs…' },
        ],
        etapes: [
          { num: 1, titre: 'Trouver son indice', texte: 'L\'indice majoré figure sur la fiche de paie. Il correspond à l\'échelon actuel dans le grade.' },
          { num: 2, titre: 'Calculer le traitement brut', texte: 'Indice majoré × 4,92 € = traitement brut mensuel. Exemple : indice 400 → 1 968 € brut.' },
          { num: 3, titre: 'Ajouter les éléments complémentaires', texte: 'Indemnité de résidence (0 à 3 %), SFT (si enfants à charge), primes (RIFSEEP…).' },
        ],
        pieges: [
          'La valeur du point d\'indice évolue — toujours vérifier la valeur en vigueur sur le portail de la Fonction publique.',
          'L\'indice majoré (IM) affiché sur la fiche de paie est différent de l\'indice brut (IB) mentionné dans les textes.',
        ],
        recours: 'Erreur sur la fiche de paie : recours gracieux auprès du service RH, puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 85-1148 du 24 octobre 1985 (rémunération FP)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000694748' },
          { texte: 'Portail FP — valeur du point d\'indice', url: 'https://www.fonction-publique.gouv.fr/etre-agent-public/ma-remuneration/le-traitement-indiciaire' },
        ],
      },
      {
        id: 'avancement',
        titre: 'Avancement d\'échelon & de grade',
        categorie: 'Carrière & Rémunération',
        chips: ['Titulaires', 'Automatique / Examen', 'PPCR'],
        resume: 'L\'avancement d\'échelon est automatique à la durée. L\'avancement de grade est conditionné à l\'ancienneté, à la manière de servir et parfois à un examen professionnel.',
        ciblePublic: 'Fonctionnaires titulaires.',
        droits: [
          { label: 'Avancement d\'échelon', valeur: 'Automatique', detail: 'Il intervient après une durée fixée par le statut particulier.' },
          { label: 'Avancement de grade', valeur: 'Au choix ou examen', detail: 'Inscription au tableau d\'avancement après avis de la CAP.' },
        ],
        etapes: [
          { num: 1, titre: 'Vérifier les durées réglementaires', texte: 'Chaque corps a ses propres durées d\'échelon. Se reporter au statut particulier ou au service RH.' },
          { num: 2, titre: 'Entretien professionnel annuel', texte: 'Il conditionne l\'avancement de grade au choix. Ne pas le négliger.' },
          { num: 3, titre: 'Tableau d\'avancement', texte: 'Chaque année, l\'administration dresse un tableau d\'avancement. L\'agent peut consulter sa situation.' },
        ],
        pieges: [
          'Ne jamais signer un compte rendu d\'entretien sans l\'avoir lu — il peut être utilisé pour justifier un refus d\'avancement.',
          'La CAP peut être saisie en cas de désaccord sur l\'avancement.',
        ],
        recours: 'Contestation d\'un refus d\'avancement : recours devant la CAP, puis tribunal administratif.',
        sources: [
          { texte: 'Loi n° 84-16 du 11 janvier 1984 (FPE) — art. 56 et suivants', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000504749' },
        ],
      },
      {
        id: 'rifseep',
        titre: 'RIFSEEP — Le régime indemnitaire expliqué',
        categorie: 'Carrière & Rémunération',
        chips: ['FPE principalement', 'IFSE + CIA', 'Lié au poste'],
        resume: 'Le RIFSEEP est la principale prime des fonctionnaires de l\'État. Il comprend l\'IFSE (lié au poste) et le CIA (lié à la manière de servir).',
        ciblePublic: 'Fonctionnaires titulaires de la FPE principalement.',
        droits: [
          { label: 'IFSE', valeur: 'Mensuel', detail: 'Liée au groupe de fonctions du poste. Son montant dépend du classement du poste.' },
          { label: 'CIA', valeur: 'Annuel', detail: 'Lié à l\'engagement professionnel et à la manière de servir. Versé une ou deux fois par an.' },
          { label: 'Suspension', valeur: 'Certains congés', detail: 'Réduit ou suspendu pendant le CMO (demi-traitement) et le CLM.' },
        ],
        etapes: [
          { num: 1, titre: 'Identifier son groupe de fonctions', texte: 'Chaque poste est classé dans un groupe de fonctions (de 1 à 4 généralement). Ce classement détermine le montant plancher et plafond de l\'IFSE. Se renseigner auprès du service RH.' },
          { num: 2, titre: 'Vérifier son IFSE sur la fiche de paie', texte: 'L\'IFSE apparaît sur la fiche de paie à la ligne "IFSE" ou "Indemnité de fonctions, sujétions et expertise". En cas de doute sur le montant, demander un justificatif au service RH.' },
          { num: 3, titre: 'Comprendre le CIA', texte: 'Le CIA est versé une à deux fois par an, après l\'entretien professionnel. Son montant est décidé par le supérieur hiérarchique dans une enveloppe fixée par l\'administration.' },
        ],
        pieges: [
          'Le CIA n\'est pas un droit acquis — il peut être réduit en cas d\'insuffisance professionnelle.',
          'Le RIFSEEP n\'est pas automatiquement transférable en cas de mutation.',
        ],
        recours: 'Contestation du montant : recours gracieux auprès du service RH, puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 2014-513 du 20 mai 2014 (RIFSEEP)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000029013180' },
        ],
      },
      {
        id: 'evaluation',
        titre: 'Entretien professionnel & évaluation',
        categorie: 'Carrière & Rémunération',
        chips: ['Tous titulaires', 'Annuel', 'CAP en recours'],
        resume: 'L\'entretien professionnel annuel évalue la manière de servir et conditionne l\'avancement de grade au choix.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels sur emploi permanent.',
        droits: [
          { label: 'Périodicité', valeur: 'Annuel', detail: 'Convocation au moins 8 jours à l\'avance.' },
          { label: 'Compte rendu', valeur: 'Signable avec réserves', detail: 'L\'agent peut signer avec réserves ou refuser de signer.' },
        ],
        etapes: [
          { num: 1, titre: 'Convocation', texte: 'Minimum 8 jours avant. L\'agent prépare ses éléments.' },
          { num: 2, titre: 'Déroulement', texte: 'Échange sur les thèmes réglementaires. L\'agent s\'exprime librement.' },
          { num: 3, titre: 'Compte rendu', texte: 'Rédigé par le supérieur. L\'agent dispose de 15 jours pour faire des observations.' },
          { num: 4, titre: 'Recours', texte: 'Recours hiérarchique (15 jours), puis saisine de la CAP.' },
        ],
        pieges: [
          'Ne jamais signer le compte rendu sans le lire entièrement — y compris les cases pré-cochées.',
          'Les appréciations négatives non contestées restent au dossier et peuvent justifier un refus d\'avancement.',
        ],
        recours: 'Saisine de la CAP, puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 2010-888 du 28 juillet 2010 (entretien FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000022636490' },
        ],
      },
      {
        id: 'temps-partiel',
        titre: 'Temps partiel — droits et procédures',
        categorie: 'Carrière & Rémunération',
        chips: ['Titulaires', 'De droit ou sur autorisation', 'Impact retraite'],
        resume: 'Le temps partiel peut être accordé de droit (famille, handicap) ou sur autorisation. Il réduit le traitement proportionnellement.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels.',
        droits: [
          { label: 'Temps partiel de droit', valeur: 'Incontournable', detail: 'Motifs : naissance, enfant < 3 ans, proche aidant, handicap. L\'administration ne peut pas le refuser.' },
          { label: 'Sur autorisation', valeur: 'Sous conditions', detail: 'L\'administration peut le refuser pour nécessité de service. Quotités : 50 %, 60 %, 70 %, 80 %, 90 %.' },
          { label: 'Rémunération', valeur: 'Au prorata', detail: '80 % du temps → 6/7 du traitement (pas 80 %). 50 % → 60 %.' },
        ],
        etapes: [
          { num: 1, titre: 'Identifier le type de temps partiel', texte: 'Déterminer si le temps partiel peut être accordé de droit (naissance, enfant < 3 ans, proche aidant, handicap) ou s\'il nécessite une autorisation de l\'administration.' },
          { num: 2, titre: 'Faire la demande écrite', texte: 'Adresser une demande écrite au chef de service ou au service RH, en précisant la quotité souhaitée et la durée. Pour le temps partiel de droit, fournir les justificatifs (acte de naissance, certificat médical…).' },
          { num: 3, titre: 'Délai de réponse', texte: 'L\'administration dispose d\'un délai de réponse (généralement 2 mois). Pour le temps partiel de droit, elle ne peut pas refuser mais peut négocier les modalités pratiques.' },
          { num: 4, titre: 'Demander la surcotisation retraite', texte: 'Demander expressément au service RH la surcotisation retraite (pour cotiser comme si on était à temps plein). Elle n\'est jamais automatique et a un coût mensuel — à évaluer.' },
        ],
        pieges: [
          'Le refus d\'un temps partiel de droit est illégal et contestable en référé.',
          'Ne pas oublier de demander la surcotisation retraite — elle ne se fait pas automatiquement.',
        ],
        recours: 'Refus de temps partiel de droit : référé devant le tribunal administratif.',
        sources: [
          { texte: 'Art. 37 bis Loi n° 84-16 (FPE) — temps partiel de droit', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000504749' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 9 — FORMATION & MOBILITÉ
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'formation',
    updatedAt: 'Avr. 2025',
    title: 'Formation & Mobilité',
    icon: '🎓',
    color: '#5C6B45',
    bgColor: '#E8EDDF',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'CPF, congé de formation, mutation, détachement, disponibilité',
    fiches: [
      {
        id: 'cpf',
        titre: 'Compte Personnel de Formation (CPF)',
        categorie: 'Formation & Mobilité',
        chips: ['Tous agents', '150 h / 400 h', 'Droit individuel'],
        resume: 'Le CPF permet à chaque agent de se constituer un capital d\'heures de formation qu\'il peut utiliser librement tout au long de sa carrière.',
        ciblePublic: 'Tous les agents publics (titulaires et contractuels ayant au moins 1 an d\'ancienneté).',
        droits: [
          { label: 'Acquisition', valeur: '25 h / an', detail: 'Pour un agent à temps complet. Plafond : 150 heures. Agents peu qualifiés : 50 h/an, plafond 400 h.' },
          { label: 'Utilisation', valeur: 'Libre', detail: 'L\'agent peut suivre la formation de son choix, même sans lien avec ses fonctions.' },
        ],
        etapes: [
          { num: 1, titre: 'Consulter son compteur CPF', texte: 'Se connecter sur moncompteformation.gouv.fr avec FranceConnect. Le solde d\'heures CPF y est disponible. Dans la FP, le CPF est géré par le compte formation propre à chaque versant (pas le même que le secteur privé).' },
          { num: 2, titre: 'Choisir une formation', texte: 'La formation doit être éligible au CPF dans la fonction publique. Elle peut être sans lien avec les fonctions actuelles. Consulter le catalogue de formations disponible sur la plateforme ou auprès du service formation de l\'administration.' },
          { num: 3, titre: 'Faire la demande', texte: 'Dépôt de la demande auprès du service RH ou formation, avec le descriptif de la formation souhaitée. L\'accord de l\'administration est nécessaire si la formation se déroule sur le temps de service.' },
          { num: 4, titre: 'Mobiliser les heures', texte: 'Après accord, les heures CPF sont mobilisées et l\'organisme de formation est sollicité. Les frais pédagogiques peuvent être pris en charge dans la limite des heures disponibles.' },
        ],
        pieges: [
          'Le CPF de la FP est différent du CPF du secteur privé — catalogues et modalités distincts.',
          'Les heures CPF acquises dans le privé avant l\'entrée dans la FP ne sont généralement pas transférables.',
        ],
        recours: 'Refus abusif d\'utilisation du CPF : recours gracieux, puis tribunal administratif.',
        sources: [
          { texte: 'Art. L. 422-1 CGFP (CPF dans la FP)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
      {
        id: 'conge-formation',
        titre: 'Congé de formation professionnelle',
        categorie: 'Formation & Mobilité',
        chips: ['Titulaires', '3 ans / carrière', '85 % traitement'],
        resume: 'Le congé de formation professionnelle permet de suivre une formation longue de son choix, avec maintien de 85 % de la rémunération pendant 1 an.',
        ciblePublic: 'Fonctionnaires titulaires ayant au moins 3 ans de services effectifs.',
        droits: [
          { label: 'Durée maximale', valeur: '3 ans sur la carrière', detail: 'Par fractions d\'au moins 5 jours consécutifs.' },
          { label: 'Indemnité', valeur: '85 % du traitement', detail: 'Pendant la 1re année uniquement. Au-delà : congé sans traitement.' },
        ],
        etapes: [
          { num: 1, titre: 'Vérifier les conditions', texte: 'Avoir au moins 3 ans de services effectifs. La formation peut être de tout type — elle n\'a pas besoin d\'être liée aux fonctions actuelles.' },
          { num: 2, titre: 'Faire la demande', texte: 'Demande écrite au chef de service, au moins 3 mois avant la date de début souhaitée. L\'administration peut reporter la demande mais pas la refuser définitivement (dans la limite de 6 mois de report).' },
          { num: 3, titre: 'Accord et formalisation', texte: 'L\'accord est notifié par écrit. Un arrêté de placement en congé de formation est pris. L\'administration verse l\'indemnité de 85 % directement.' },
          { num: 4, titre: 'Obligation de retour', texte: 'À l\'issue du congé, l\'agent est tenu de rester au moins 3 ans dans la FP. En cas de démission anticipée, l\'indemnité perçue doit être remboursée au prorata.' },
        ],
        pieges: [
          'Le remboursement de l\'indemnité est exigé si l\'agent démissionne dans les 3 ans suivant le congé.',
        ],
        recours: 'Refus ou report abusif : recours gracieux puis tribunal administratif.',
        sources: [
          { texte: 'Art. L. 422-1 et suivants CGFP (congé de formation)' },
        ],
      },
      {
        id: 'mutation',
        titre: 'Mutation & Priorités légales',
        categorie: 'Formation & Mobilité',
        chips: ['Titulaires', 'Priorités légales', 'CAP en recours'],
        resume: 'La mutation permet de changer d\'affectation. Des priorités légales s\'imposent à l\'administration.',
        ciblePublic: 'Fonctionnaires titulaires.',
        droits: [
          { label: 'Priorités légales', valeur: 'Incontournables', detail: 'Rapprochement de conjoint, handicap, raisons médicales graves, militaires de retour de mission.' },
          { label: 'Mutation au choix', valeur: 'Tableaux de mutation', detail: 'Hors priorités : les demandes sont examinées selon un barème (ancienneté, situation familiale).' },
        ],
        etapes: [
          { num: 1, titre: 'Identifier le motif et le poste', texte: 'Repérer les postes vacants publiés sur la bourse aux emplois ou les sites ministériels. Identifier si une priorité légale est applicable (rapprochement de conjoint, handicap…).' },
          { num: 2, titre: 'Candidater et faire sa demande de mutation', texte: 'La demande se fait via le système de gestion de l\'administration (SIRH). Pour les priorités légales, joindre les justificatifs (acte de mariage, certificat médical, document RQTH…).' },
          { num: 3, titre: 'Instruction par la CAP', texte: 'La Commission Administrative Paritaire examine les demandes. Pour les priorités légales, l\'avis est contraignant pour l\'administration.' },
          { num: 4, titre: 'Décision et prise de poste', texte: 'En cas de mutation accordée, un arrêté est pris. L\'agent dispose généralement d\'un préavis de 3 mois avant la prise de poste.' },
        ],
        pieges: [
          'Une priorité légale ne garantit pas l\'obtention d\'un poste précis — seulement d\'être examiné en priorité.',
          'La mutation ne peut pas être utilisée comme sanction déguisée.',
        ],
        recours: 'Saisine de la CAP. Recours gracieux. Tribunal administratif.',
        sources: [
          { texte: 'Art. L. 512-19 et suivants CGFP (priorités de mutation)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
      {
        id: 'detachement',
        titre: 'Détachement & Disponibilité — comprendre ces positions',
        categorie: 'Formation & Mobilité',
        chips: ['Titulaires', 'Positions statutaires', 'Droits maintenus ou suspendus'],
        resume: 'Le détachement et la disponibilité sont deux positions statutaires qui permettent à un fonctionnaire de s\'éloigner temporairement de son corps d\'origine. Leurs effets sur les droits et la rémunération sont radicalement différents.',
        ciblePublic: 'Fonctionnaires titulaires souhaitant exercer dans un autre corps, une autre administration, le secteur privé ou faire une pause professionnelle.',
        droits: [
          { label: 'Détachement', valeur: 'Exercer ailleurs', detail: "L'agent exerce dans un autre corps ou organisme, tout en restant rattaché à son corps d'origine. Réintégration garantie à l'issue." },
          { label: 'Rémunération', valeur: 'Versée par l\'accueil', detail: "L'agent est rémunéré par l'organisme d'accueil. Il ne perçoit plus son traitement d'origine." },
          { label: 'Droits', valeur: 'Avancement + retraite', detail: "Avancement dans le corps d'origine maintenu. Cotisations retraite versées sur l'emploi occupé." },
          { label: 'Disponibilité', valeur: 'Suspension du statut', detail: "Le fonctionnaire cesse ses fonctions. Il n'est plus rémunéré par son employeur public." },
          { label: 'Tout suspendu', valeur: 'Traitement + droits', detail: "Pas de traitement, pas d'avancement, pas de retraite FP. Affiliation CPAM obligatoire avant la prise d'effet." },
          { label: 'Motifs disponibilité', valeur: 'Droit ou autorisation', detail: "De droit : enfant < 8 ans, conjoint, proche aidant. Sur autorisation : convenances personnelles, création d'entreprise." },
          { label: 'Durées', valeur: '5 ans / 3 ans', detail: "Détachement : 5 ans renouvelables. Disponibilité convenances : 3 ans, plafonnée à 10 ans sur la carrière." },
        ],
        etapes: [
          { num: 1, titre: 'Identifier le bon dispositif', texte: 'Détachement = l\'agent a trouvé un poste dans un autre organisme et veut exercer tout en conservant son statut. Disponibilité = l\'agent souhaite une pause complète ou suivre son conjoint sans emploi défini.' },
          { num: 2, titre: 'Faire la demande', texte: 'Détachement : demande écrite à l\'administration d\'origine + accord de l\'organisme d\'accueil. Délai de prévenance : 3 mois minimum conseillé. Disponibilité : demande écrite motivée, avec le motif précis. L\'administration peut refuser pour nécessité de service (sauf motifs de droit).' },
          { num: 3, titre: 'Gestion de la protection sociale en disponibilité', texte: 'Dès la mise en disponibilité, l\'agent doit impérativement s\'affilier à la CPAM en tant qu\'ayant-droit ou assuré direct. Sans affiliation, aucun soin ne sera pris en charge. Si l\'agent travaille à l\'extérieur, son employeur privé cotise pour lui.' },
          { num: 4, titre: 'Réintégration', texte: 'À l\'issue du détachement ou de la disponibilité, l\'agent doit demander sa réintégration dans un délai précis (souvent 2 à 3 mois avant la fin). L\'administration est tenue de réintégrer mais peut attendre un poste vacant si aucun emploi n\'est disponible immédiatement.' },
        ],
        pieges: [
          '⚠️ La disponibilité est la position la plus risquée financièrement : zéro traitement, zéro couverture sociale automatique, zéro cotisation retraite FP. À n\'envisager qu\'avec une préparation financière et sociale sérieuse.',
          'En disponibilité, tomber malade sans CPAM = aucune prise en charge des soins ni indemnisation. Anticiper l\'affiliation AVANT la prise d\'effet de la disponibilité.',
          'Un détachement peut être refusé par l\'administration d\'origine pour nécessité de service — prévoir un délai de demande suffisant (au moins 3 mois à l\'avance).',
          'La disponibilité pour convenances personnelles ne génère pas de droits à retraite FP. Ces années sont définitivement perdues pour la pension sauf rachat (coûteux).',
          'Ne pas oublier de demander la réintégration avant l\'expiration du détachement ou de la disponibilité — passé le délai légal, l\'agent peut être radié des cadres.',
        ],
        recours: 'Refus de détachement ou de disponibilité de droit : recours contentieux urgent. Refus de réintégration : recours devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L. 511-1 à L. 514-8 CGFP (positions statutaires — détachement et disponibilité)' },
          { texte: 'Décret n° 85-986 du 16 septembre 1985 (positions FPE — détachement, disponibilité)' },
          { texte: 'Décret n° 86-68 du 13 janvier 1986 (positions FPT)' },
        ],
      },
      {
        id: 'disponibilite',
        titre: 'Disponibilité & droits à maladie',
        categorie: 'Formation & Mobilité',
        chips: ['Titulaires', 'Droits suspendus', 'Affiliation CPAM obligatoire'],
        resume: 'La disponibilité suspend les droits à congé maladie statutaire. Un fonctionnaire en disponibilité qui tombe malade doit se retourner vers la Sécurité sociale — sans affiliation préalable, aucune couverture n\'est garantie.',
        ciblePublic: 'Fonctionnaires titulaires en position de disponibilité.',
        droits: [
          { label: 'Congés maladie statutaires', valeur: 'Suspendus', detail: 'En disponibilité, l\'agent ne bénéficie plus des congés CMO, CLM, CLD ni du CITIS. Ces droits sont liés à la position d\'activité.' },
          { label: 'Couverture maladie', valeur: 'Régime général uniquement', detail: 'L\'agent doit s\'affilier volontairement à la CPAM avant la prise d\'effet de la disponibilité. Sans affiliation, aucune prise en charge des soins.' },
          { label: 'Traitement', valeur: 'Suspendu', detail: 'Aucun traitement pendant la disponibilité, sauf disponibilité pour raisons de santé.' },
          { label: 'Réintégration anticipée', valeur: 'Possible', detail: 'En cas de maladie grave pendant la disponibilité, l\'agent peut demander une réintégration anticipée pour retrouver ses droits statutaires.' },
        ],
        etapes: [
          { num: 1, titre: 'S\'affilier à la CPAM avant la disponibilité', texte: 'Démarche impérative à effectuer AVANT la prise d\'effet de la disponibilité. Contacter la CPAM du lieu de résidence avec les justificatifs de fin d\'activité.' },
          { num: 2, titre: 'Vérifier la couverture', texte: 'S\'assurer que la couverture santé (mutuelle) reste active ou s\'adapter. La mutuelle liée à l\'employeur peut ne plus couvrir pendant la disponibilité.' },
          { num: 3, titre: 'En cas de maladie', texte: 'Si maladie pendant la disponibilité : soins pris en charge par la CPAM. Pour une maladie grave nécessitant un arrêt long, contacter l\'administration pour une réintégration anticipée.' },
          { num: 4, titre: 'Réintégration', texte: 'Demande de réintégration à adresser à l\'administration au moins 3 mois avant la fin de la disponibilité ou sans délai en cas d\'urgence médicale.' },
        ],
        pieges: [
          'Tomber malade sans affiliation CPAM préalable = aucune prise en charge des soins et aucune indemnisation. C\'est le piège le plus fréquent en disponibilité.',
          'La mutuelle employeur s\'arrête souvent à la fin du contrat ou de l\'activité — vérifier les clauses de portabilité.',
          'Une réintégration anticipée n\'est pas automatique : l\'administration peut l\'accepter ou la différer selon les nécessités de service. En cas de refus abusif, recours possible.',
        ],
        recours: 'Demande de réintégration anticipée pour raisons médicales : recours gracieux si refus, puis tribunal administratif en urgence (référé).',
        sources: [
          { texte: 'Art. L. 514-1 CGFP (disponibilité d\'office pour raison de santé)' },
          { texte: 'Art. 51 et suivants Loi n° 84-16 (disponibilité FPE)' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE PSC — PROTECTION SOCIALE COMPLÉMENTAIRE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'psc',
    updatedAt: 'Avr. 2025',
    title: 'Protection sociale complémentaire (PSC)',
    icon: '🛡️',
    color: '#3A7CA5',
    bgColor: '#D6EAF4',
    count: 2,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Réforme PSC, mutuelle santé, prévoyance, affiliation, rôle des RH',
    fiches: [
      {
        id: 'psc-reforme',
        titre: 'Réforme PSC — La participation obligatoire de l\'employeur',
        categorie: 'Protection sociale complémentaire',
        chips: ['Tous agents', 'Réforme 2022-2026', 'Participation employeur'],
        resume: 'La réforme de la Protection Sociale Complémentaire (PSC) dans la fonction publique oblige l\'employeur public à participer au financement de la mutuelle santé et de la prévoyance de ses agents, à l\'instar du secteur privé. Une révolution dans la couverture sociale des fonctionnaires.',
        ciblePublic: 'Tous les agents publics, titulaires et contractuels, des trois versants. La réforme s\'applique progressivement selon le versant.',
        droits: [
          { label: 'Participation employeur santé', valeur: 'Min. 50 % depuis janv. 2022', detail: 'Participation obligatoire d\'au moins 50 % sur la cotisation santé via contrats collectifs obligatoires. Source : Décret 2021-1164.', versants: ['fpe'] },
          { label: 'Participation employeur santé', valeur: 'Min. 50 % depuis janv. 2025', detail: 'Participation obligatoire d\'au moins 50 % depuis le 1er janvier 2025. Les modalités varient selon la collectivité. Se renseigner auprès du service RH.', versants: ['fpt'] },
          { label: 'Participation employeur santé', valeur: 'Min. 50 % depuis janv. 2025', detail: 'Participation obligatoire d\'au moins 50 % depuis le 1er janvier 2025. Les modalités varient selon l\'établissement. Se renseigner auprès de la DRH.', versants: ['fph'] },
          { label: 'Prévoyance', valeur: 'Déploiement en cours', detail: 'Participation employeur sur incapacité, invalidité et décès en cours de déploiement. Vérifier auprès du service RH le dispositif applicable.' },
          { label: 'PSC et mi-traitement CMO', valeur: 'Complémentaire utile', detail: 'Lors du passage à 50 % du traitement en CMO (mois 4 à 12), la PSC santé peut rembourser les dépassements d\'honoraires, mais ne compense pas la perte de revenus — c\'est le rôle de la prévoyance.' },
          { label: 'CMO 90 % non couvert', valeur: '⚠️ Point d\'attention', detail: 'Les contrats de prévoyance ne couvrent généralement pas la période à 90 % du CMO (3 premiers mois). La prévoyance n\'intervient qu\'à partir du demi-traitement ou après un délai de carence. Vérifier les conditions de son contrat.' },
        ],
        etapes: [
          { num: 1, titre: 'Se renseigner auprès du service RH', texte: 'Le service RH est l\'interlocuteur principal pour toute démarche d\'affiliation. Il informe l\'agent sur le contrat collectif retenu par l\'administration, les organismes éligibles, les niveaux de garanties, et les modalités d\'affiliation.' },
          { num: 2, titre: 'Adhérer au contrat collectif', texte: 'L\'agent adhère au contrat de référence ou à un contrat labellisé proposé par son administration. L\'adhésion est obligatoire pour bénéficier de la participation employeur, sauf cas de dispense.' },
          { num: 3, titre: 'Cas de dispense', texte: 'Certains agents peuvent demander à ne pas adhérer au contrat collectif : ceux déjà couverts par un contrat collectif obligatoire (conjoint salarié du privé), les agents en CDD de moins d\'un an, les agents à temps très partiel. La demande de dispense se fait par écrit auprès du service RH.' },
          { num: 4, titre: 'Vérifier sa couverture', texte: 'L\'agent doit vérifier que sa couverture santé et sa prévoyance sont adaptées à sa situation : garanties, plafonds, délais de carence, couverture des ayants droit, prestations en cas d\'incapacité prolongée.' },
        ],
        pieges: [
          'Ne pas adhérer au contrat collectif de son administration signifie renoncer à la participation employeur — une perte financière significative (parfois 200 à 400 €/an).',
          'La participation employeur ne concerne que les contrats labellisés ou collectifs désignés. Un contrat individuel souscrit librement ne bénéficie pas de la participation.',
          'Les agents contractuels bénéficient des mêmes droits à la participation employeur que les titulaires — ne pas hésiter à le faire valoir.',
          'La prévoyance (incapacité, invalidité, décès) est souvent sous-estimée. En cas de longue maladie, la perte de revenus peut être importante — avoir une prévoyance solide est essentiel.',
        ],
        recours: 'Refus de la participation employeur : recours gracieux auprès du service RH. En cas de litige sur le contrat collectif : saisine du médiateur, puis tribunal administratif.',
        sources: [
          { texte: 'Ordonnance n° 2021-175 du 17 février 2021 (PSC dans la FP)' },
          { texte: 'Décret n° 2021-1164 du 8 septembre 2021 (PSC FPE — contrats collectifs)' },
          { texte: 'Loi n° 2019-828 du 6 août 2019 — art. 22 (obligation PSC dans la FP)' },
          { texte: 'Art. L. 827-1 et suivants CGFP (protection sociale complémentaire)' },
        ],
        versantNotes: {
          fpe: '✅ FPE : participation employeur obligatoire d\'au moins 50 % sur la santé depuis le 1er janvier 2022. Des contrats collectifs ont été négociés ministère par ministère. Votre RH dispose des détails du contrat retenu.',
          fpt: '✅ FPT : participation employeur d\'au moins 50 % obligatoire depuis le 1er janvier 2025. Les modalités varient selon la collectivité. Certaines ont anticipé, d\'autres viennent de mettre en place le dispositif. Renseignez-vous auprès de votre DRH.',
          fph: '✅ FPH : participation employeur d\'au moins 50 % obligatoire depuis le 1er janvier 2025. Les établissements hospitaliers ont négocié des contrats collectifs. Votre DRH est l\'interlocuteur pour l\'affiliation.',
        },
      },
      {
        id: 'prevoyance',
        titre: 'La prévoyance — pourquoi c\'est essentiel',
        categorie: 'Protection sociale complémentaire',
        chips: ['Tous agents', 'Incapacité / Invalidité / Décès', 'Complément indispensable'],
        resume: 'La prévoyance couvre les risques financiers liés à une incapacité de travail prolongée, une invalidité ou un décès. Dans la fonction publique, le statut protège mais ne garantit pas le maintien total des revenus sur le long terme.',
        ciblePublic: 'Tous les agents publics. Particulièrement important pour les agents en CLM/CLD dont les revenus sont réduits à 60 % du traitement après la première année.',
        droits: [
          { label: 'Incapacité', valeur: 'Complément maladie longue', detail: 'Verse une indemnité quand le traitement est réduit (CLM, CLD). Maintien du niveau de revenus proche du net habituel.' },
          { label: 'Invalidité', valeur: 'Rente complémentaire', detail: 'Rente complémentaire à la pension d\'invalidité. Particulièrement utile si le taux d\'IPP est insuffisant pour une pension correcte.' },
          { label: 'Décès', valeur: 'Capital aux ayants droit', detail: 'Capital versé aux bénéficiaires désignés (conjoint, enfants), en complément du régime général et de la pension de réversion.' },
          { label: 'Participation employeur', valeur: 'Minimum légal', detail: 'L\'employeur contribue selon les accords de branche. Vérifier le taux exact auprès du service RH.' },
        ],
        etapes: [
          { num: 1, titre: 'Évaluer ses besoins', texte: 'Calculer l\'écart entre son revenu actuel et ce qu\'il serait en cas de CLM/CLD (60 % du traitement après an 1). La prévoyance vient combler cet écart. Plus les charges fixes sont importantes (prêt immobilier, loyer), plus la prévoyance est utile.' },
          { num: 2, titre: 'Choisir son contrat', texte: 'Se référer au contrat collectif proposé par l\'administration pour bénéficier de la participation employeur. Vérifier les garanties : délai de carence, niveau d\'indemnisation, durée de versement, couverture décès.' },
          { num: 3, titre: 'S\'affilier via le service RH', texte: 'L\'affiliation se fait auprès du service RH qui transmet à l\'organisme désigné. C\'est le RH qui gère l\'ensemble du processus d\'affiliation collective.' },
        ],
        pieges: [
          'Beaucoup d\'agents pensent que le statut de fonctionnaire protège suffisamment. C\'est partiellement vrai pour les arrêts courts, mais en CLM/CLD prolongé, la perte de revenus peut être très significative.',
          'Les contrats individuels souscrits sans passer par le dispositif collectif de son administration ne bénéficient pas de la participation employeur.',
          'Vérifier le délai de carence du contrat de prévoyance : certains contrats ne versent les prestations qu\'après 30, 60 ou 90 jours de maladie — la prévoyance ne couvre pas le début d\'un arrêt.',
          'En cas de changement d\'administration ou de départ à la retraite, la prévoyance peut ne plus être active — anticiper la portabilité ou la résiliation.',
        ],
        recours: 'Litige avec l\'organisme de prévoyance : recours gracieux, puis médiation, puis tribunal judiciaire. Pour la participation employeur : voir le service RH.',
        sources: [
          { texte: 'Ordonnance n° 2021-175 du 17 février 2021 (PSC dans la FP)' },
          { texte: 'Art. L. 827-1 et suivants CGFP (protection sociale complémentaire)' },
          { texte: 'Accord interministériel du 20 octobre 2023 (prévoyance FPE)' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 10 — ACTION SOCIALE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'action-sociale',
    updatedAt: 'Avr. 2025',
    title: 'Action sociale',
    icon: '🤝',
    color: '#C4673A',
    bgColor: '#F0D5C4',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'CESU, aides au logement, chèques-vacances, délégations sociales',
    fiches: [
      {
        id: 'cesu',
        titre: 'CESU fonctionnaire',
        categorie: 'Action sociale',
        chips: ['Tous agents', 'Participation employeur', 'Sous conditions'],
        resume: 'Le CESU préfinancé permet aux agents publics de financer des services à la personne avec une participation de l\'employeur public.',
        ciblePublic: 'Agents publics titulaires et contractuels, sous conditions de ressources.',
        droits: [
          { label: 'CESU garde d\'enfants', valeur: 'Participation employeur', detail: 'Aide pour la garde d\'enfants de moins de 6 ans. Montant selon les ressources.' },
          { label: 'Services couverts', valeur: 'Large', detail: 'Assistantes maternelles, crèches, garde à domicile, aide aux personnes âgées.' },
        ],
        etapes: [
          { num: 1, titre: 'Se renseigner auprès du service RH', texte: 'Contacter le service RH ou la délégation sociale de son administration pour connaître le barème et les conditions d\'éligibilité (ressources, nombre d\'enfants, type de garde).' },
          { num: 2, titre: 'Constituer le dossier', texte: 'Fournir les pièces justificatives : avis d\'imposition, justificatif de garde, contrat avec l\'assistante maternelle ou la structure d\'accueil.' },
          { num: 3, titre: 'Recevoir les CESU', texte: 'Les CESU préfinancés sont envoyés à l\'agent (format papier ou dématérialisé). Ils peuvent être utilisés directement auprès des prestataires agréés.' },
          { num: 4, titre: 'Renouveler chaque année', texte: 'La demande n\'est pas automatiquement reconduite. Il faut la renouveler chaque année en fournissant les justificatifs mis à jour.' },
        ],
        pieges: [
          'Les CESU ont une date de péremption — ils doivent être utilisés dans l\'année civile.',
          'Le dispositif n\'est pas automatique — en faire la demande chaque année.',
        ],
        recours: 'En cas de refus injustifié, recours gracieux auprès du service RH.',
        sources: [
          { texte: 'Art. L. 155-1 CGFP (action sociale)' },
        ],
      },
      {
        id: 'aides-logement',
        titre: 'Aides au logement',
        categorie: 'Action sociale',
        chips: ['Tous agents', 'PAS', 'AIP'],
        resume: 'Les agents publics peuvent bénéficier de plusieurs dispositifs d\'aide au logement : prêt à taux zéro, aide à l\'installation, réservations de logements sociaux.',
        ciblePublic: 'Agents publics titulaires et contractuels.',
        droits: [
          { label: 'AIP (Aide à l\'installation)', valeur: 'Forfait primo-installation', detail: "Aide pour les primo-arrivants dans l'administration, sous conditions de ressources. Demande auprès de la délégation sociale ministérielle.", versants: ['fpe'] },
          { label: 'Aides disponibles', valeur: 'Selon la collectivité', detail: "CNAS, prêts à taux réduit, réservations logements sociaux, aides au déménagement. Renseignez-vous auprès du service RH.", versants: ['fpt'] },
          { label: 'Aides disponibles', valeur: 'Selon l\'établissement', detail: "Dispositifs variables selon l'établissement. Se renseigner auprès de la DRH ou du service social.", versants: ['fph'] },
          { label: 'Logements réservés', valeur: 'Action sociale', detail: "Certaines administrations disposent de logements réservés pour leurs agents." },
        ],
        etapes: [
          { num: 1, titre: 'Identifier les aides disponibles', texte: 'Contacter le service RH ou l\'assistant de service social du personnel pour connaître les dispositifs d\'aide au logement propres à son administration.' },
          { num: 2, titre: 'Déposer la demande d\'AIP', texte: 'Remplir le formulaire auprès de la délégation sociale ministérielle avec les justificatifs (contrat de bail, avis d\'imposition, justificatif de primo-installation).', versants: ['fpe'] },
          { num: 2, titre: 'Se renseigner auprès du CNAS ou de la DRH', texte: 'Le Centre National d\'Action Sociale (CNAS) ou la DRH de la collectivité gère les aides disponibles. Les dispositifs varient selon la collectivité.', versants: ['fpt'] },
          { num: 3, titre: 'Solliciter l\'assistant social', texte: 'L\'assistant de service social du personnel peut accompagner les démarches pour le logement et orienter vers les partenaires.' },
        ],
        pieges: [
          'Les aides au logement de la FP sont distinctes des APL de la CAF — cumul possible sous conditions.',
          'Ne pas attendre d\'être en difficulté pour contacter l\'assistant social.',
        ],
        recours: 'Recours gracieux en cas de refus injustifié.',
        sources: [
          { texte: 'Portail FP — aides au logement' },
        ],
      },
      {
        id: 'cheques-vacances',
        titre: 'Chèques-vacances ANCV',
        categorie: 'Action sociale',
        chips: ['Tous agents', 'Co-financement', 'Sous conditions ressources'],
        resume: 'Les chèques-vacances ANCV financent des dépenses de loisirs et de vacances avec une participation de l\'employeur public.',
        ciblePublic: 'Agents publics titulaires et contractuels.',
        droits: [
          { label: 'Co-financement', valeur: 'Agent + employeur', detail: 'La contribution patronale est exonérée de cotisations sociales. Son montant varie selon les ressources.' },
          { label: 'Utilisation', valeur: 'Transport, hébergement, loisirs', detail: 'Utilisables en France et en Europe chez les prestataires affiliés ANCV.' },
        ],
        etapes: [
          { num: 1, titre: 'Vérifier l\'éligibilité', texte: 'Les conditions d\'accès varient selon les ressources du foyer (quotient familial ou revenu fiscal). Se renseigner auprès du service RH ou de la délégation sociale.' },
          { num: 2, titre: 'Faire la demande', texte: 'La demande se fait auprès du service RH ou de la délégation sociale, généralement en début d\'année civile. Les délais de commande sont souvent fixés (ex : avant mars pour les chèques de l\'année).' },
          { num: 3, titre: 'Payer sa part', texte: 'L\'agent verse sa contribution (déduite du bulletin de paie ou par prélèvement). L\'employeur ajoute sa participation exonérée.' },
          { num: 4, titre: 'Recevoir et utiliser les chèques', texte: 'Les chèques-vacances sont reçus en format papier ou dématérialisé (application ANCV Connect). Utilisables dans tous les prestataires affiliés ANCV (hôtels, campings, Sncf, parcs de loisirs…).' },
        ],
        pieges: [
          'Les chèques-vacances ont une durée de validité de 2 ans — ne pas laisser périmer.',
          'La contribution de l\'employeur varie selon les revenus.',
        ],
        recours: 'En cas de refus injustifié, recours gracieux auprès du service RH.',
        sources: [
          { texte: 'ANCV — chèques-vacances fonctionnaires' },
        ],
      },
      {
        id: 'delegations-sociales',
        titre: 'Délégations sociales ministérielles et interministérielles',
        categorie: 'Action sociale',
        chips: ['FPE principalement', 'Prestations sociales', 'Contact RH'],
        resume: 'Les délégations sociales ministérielles et interministérielles sont des structures qui pilotent et mettent en œuvre la politique d\'action sociale en faveur des agents publics. Elles coordonnent l\'ensemble des prestations sociales disponibles.',
        ciblePublic: 'Principalement FPE. La FPT et la FPH disposent de leurs propres structures d\'action sociale (CNAS, associations départementales, CGOS…).',
        droits: [
          { label: 'Délégation ministérielle', valeur: 'Par ministère', detail: 'Chaque ministère dispose d\'un service d\'action sociale propre (ex : SRIAS en région, bureaux d\'action sociale centraux) qui gère les prestations spécifiques au ministère.', versants: ['fpe'] },
          { label: 'FSIP (interministériel)', valeur: 'Mutualisation', detail: 'Le Fonds de Service Interministériel de Prévention (ou équivalents régionaux) mutualise certaines prestations entre ministères implantés sur un même territoire.', versants: ['fpe'] },
          { label: 'CNAS', valeur: 'Centre National d\'Action Sociale', detail: 'Le CNAS gère les prestations d\'action sociale pour les agents de la FPT. Loisirs, vacances, aides aux familles, billetterie…', versants: ['fpt'] },
          { label: 'CGOS', valeur: 'Comité de Gestion des Œuvres Sociales', detail: 'Le CGOS gère les prestations d\'action sociale pour les agents de la FPH : aides, loisirs, vacances, prêts…', versants: ['fph'] },
          { label: 'Prestations communes', valeur: 'Large panel', detail: 'CESU, chèques-vacances, aides au logement, aide à la restauration, aides d\'urgence, secours exceptionnels…' },
        ],
        etapes: [
          { num: 1, titre: 'Identifier la structure compétente', texte: 'La délégation sociale compétente dépend de votre ministère et de votre lieu d\'affectation. Les coordonnées figurent sur l\'intranet ministériel ou peuvent être obtenues auprès du service RH.' },
          { num: 2, titre: 'Exemples d\'actions concrètes', texte: 'Organisation de colonies de vacances pour les enfants d\'agents, aide financière pour la rentrée scolaire, prêt social en cas de difficultés financières passagères, tarifs préférentiels pour des loisirs ou vacances, aide à l\'adaptation du logement pour les agents en situation de handicap.' },
          { num: 3, titre: 'Contacter l\'assistant social du personnel', texte: 'L\'assistant de service social du personnel est l\'interlocuteur privilégié pour orienter vers les bonnes prestations. Il connaît l\'offre disponible dans votre administration et peut aider à constituer les dossiers.' },
          { num: 4, titre: 'Déposer une demande de prestation', texte: 'Chaque prestation fait l\'objet d\'un formulaire spécifique. Les conditions d\'éligibilité (ressources, situation familiale, ancienneté) varient selon les prestations.' },
        ],
        pieges: [
          'Les prestations d\'action sociale ne sont pas automatiques — il faut en faire la demande. Beaucoup d\'agents ne sollicitent pas des aides auxquelles ils auraient droit.',
          'Les délégations sociales ministérielles ont des budgets limités et certaines prestations sont soumises à des critères de ressources stricts — ne pas hésiter à solliciter même si on pense ne pas être éligible.',
          'En cas de mutation vers un autre ministère, les prestations accessibles peuvent changer. Se renseigner auprès du nouveau service RH dès la prise de poste.',
          'Les agents contractuels ont accès aux prestations d\'action sociale dans les mêmes conditions que les titulaires — la distinction titulaire/contractuel ne justifie pas un refus.',
        ],
        recours: 'En cas de refus d\'une prestation : recours gracieux auprès de la délégation sociale concernée. L\'assistant de service social du personnel peut appuyer la démarche.',
        sources: [
          { texte: 'Art. L. 155-1 CGFP (action sociale dans la FP)' },
          { texte: 'Circulaire du 14 décembre 2006 (action sociale interministérielle)' },
          { texte: 'Portail de la Fonction publique — action sociale' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 11 — VIE AU TRAVAIL & PROTECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'vieau-travail',
    updatedAt: 'Avr. 2025',
    title: 'Vie au travail & Protections',
    icon: '⚖️',
    color: '#2D3748',
    bgColor: '#E2E8F0',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Télétravail, protection fonctionnelle, harcèlement, fiche de signalement',
    fiches: [
      {
        id: 'teletravail',
        titre: 'Télétravail dans la fonction publique',
        categorie: 'Vie au travail & Protections',
        chips: ['Tous agents', '3 jours max', 'Refus motivé obligatoire'],
        resume: 'Le télétravail est un droit encadré. L\'administration ne peut le refuser que pour des motifs liés aux nécessités du service.',
        ciblePublic: 'Fonctionnaires titulaires et agents contractuels.',
        droits: [
          { label: 'Maximum', valeur: '3 jours par semaine', detail: 'Ou 207 jours par an.' },
          { label: 'Refus', valeur: 'Motivé obligatoirement', detail: 'Les motifs doivent être liés aux nécessités du service.' },
          { label: 'Matériel', valeur: 'À la charge de l\'admin', detail: 'L\'employeur fournit les équipements nécessaires.' },
        ],
        etapes: [
          { num: 1, titre: 'Faire la demande écrite', texte: 'La demande de télétravail se fait par écrit auprès du chef de service, en précisant le(s) jour(s) souhaité(s), le lieu de télétravail, et les équipements disponibles.' },
          { num: 2, titre: 'Entretien avec le supérieur', texte: 'Un entretien est organisé pour examiner la compatibilité du poste avec le télétravail. Tous les postes ne sont pas éligibles (accueil du public, manipulation de matériaux…).' },
          { num: 3, titre: 'Décision formalisée', texte: 'L\'accord prend la forme d\'un avenant au contrat ou d\'un arrêté. Il précise les jours de télétravail, les plages horaires et les conditions d\'utilisation du matériel.' },
          { num: 4, titre: 'En cas de refus', texte: 'Le refus doit être motivé par des nécessités de service. Un refus non motivé est illégal et contestable par recours gracieux sous 2 mois.' },
        ],
        pieges: [
          'Le télétravail n\'est pas un droit absolu : des nécessités de service peuvent justifier un refus.',
          'Les accidents survenant en télétravail au domicile peuvent être reconnus comme accidents de service.',
        ],
        recours: 'Refus non motivé : recours gracieux, puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 2021-1123 du 26 août 2021 (télétravail FP)' },
        ],
      },
      {
        id: 'protection-fonctionnelle',
        titre: 'Protection fonctionnelle',
        categorie: 'Vie au travail & Protections',
        chips: ['Tous agents', 'Droit quasi absolu', 'Frais pris en charge'],
        resume: 'La protection fonctionnelle oblige l\'administration à protéger et défendre l\'agent victime d\'attaques dans l\'exercice de ses fonctions.',
        ciblePublic: 'Tous les fonctionnaires titulaires et agents contractuels.',
        droits: [
          { label: 'Victime d\'attaque', valeur: 'Protection due', detail: 'Violences, harcèlement, menaces, diffamation liés aux fonctions.' },
          { label: 'Mis en cause', valeur: 'Si acte de service', detail: 'Si l\'agent est poursuivi pour un acte accompli dans ses fonctions sans faute personnelle, l\'admin prend en charge sa défense.' },
          { label: 'Frais de défense', valeur: 'Pris en charge', detail: 'Les honoraires d\'avocat sont remboursés si la protection est accordée.' },
        ],
        etapes: [
          { num: 1, titre: 'Agir dès les premiers faits', texte: 'Ne pas attendre — la demande de protection fonctionnelle doit être faite dès que les faits surviennent, même si une procédure judiciaire n\'est pas encore engagée.' },
          { num: 2, titre: 'Demande écrite à l\'administration', texte: 'Adresser une demande écrite et circonstanciée au chef de service ou à la DRH, en décrivant les faits et les préjudices subis. Joindre tous les éléments de preuve disponibles.' },
          { num: 3, titre: 'Décision de l\'administration', texte: 'L\'administration dispose d\'un délai de 2 mois pour répondre. Elle est tenue d\'accorder la protection sauf faute personnelle de l\'agent. Le refus doit être motivé.' },
          { num: 4, titre: 'Prise en charge des frais', texte: 'Si la protection est accordée, les honoraires d\'avocat, les frais de procédure et les dépenses liées à la défense sont remboursés. Le remboursement se fait sur présentation des justificatifs.' },
        ],
        pieges: [
          'Le refus de protection fonctionnelle est fréquent et souvent illégal — le contester systématiquement.',
          'Ne pas attendre la fin de la procédure judiciaire — demander la protection dès que les faits surviennent.',
        ],
        recours: 'Refus : recours gracieux immédiat, puis référé devant le tribunal administratif (urgence).',
        sources: [
          { texte: 'Art. L. 134-1 CGFP (protection fonctionnelle)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
      {
        id: 'harcelement',
        titre: 'Harcèlement moral et sexuel',
        categorie: 'Vie au travail & Protections',
        chips: ['Tous agents', 'Interdiction absolue', 'Protection victimes'],
        resume: 'Le harcèlement moral et sexuel est formellement interdit dans la fonction publique. L\'agent victime bénéficie de protections spécifiques et de voies de recours multiples.',
        ciblePublic: 'Tous les agents publics (victimes et témoins).',
        droits: [
          { label: 'Interdiction absolue', valeur: 'CGFP et Code pénal', detail: 'Le harcèlement est interdit par le statut général et par le Code pénal.' },
          { label: 'Protection fonctionnelle', valeur: 'Due automatiquement', detail: 'L\'agent victime a droit à la protection fonctionnelle.' },
          { label: 'Signalement protégé', valeur: 'Aucune sanction possible', detail: 'Aucune sanction ne peut être prise contre un agent ayant signalé de bonne foi.' },
        ],
        etapes: [
          { num: 1, titre: 'Documenter les faits', texte: 'Consigner chaque incident par écrit (date, heure, lieu, témoins). Conserver tous les écrits.' },
          { num: 2, titre: 'Signalement interne', texte: 'Signaler au référent harcèlement, au service RH ou à l\'assistant social du personnel.' },
          { num: 3, titre: 'Demander la protection fonctionnelle', texte: 'Demande écrite à l\'administration.' },
          { num: 4, titre: 'Saisir les instances externes', texte: 'Défenseur des droits, inspection du travail, plainte pénale, tribunal administratif.' },
        ],
        pieges: [
          'Ne pas attendre que la situation devienne insupportable — agir tôt préserve les preuves.',
          'L\'agent harceleur peut être sanctionné disciplinairement et pénalement, y compris si c\'est le supérieur hiérarchique.',
        ],
        recours: 'Signalement au Défenseur des droits. Plainte pénale. Recours devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L. 133-1 à L. 133-4 CGFP (harcèlement)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
          { texte: 'Art. 222-33-2 Code pénal (harcèlement moral)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043908313' },
        ],
      },
      {
        id: 'fiche-signalement',
        titre: 'Fiche de signalement — procédure et rôle',
        categorie: 'Vie au travail & Protections',
        chips: ['Tous agents', 'Risques professionnels', 'Procédure formelle'],
        resume: 'La fiche de signalement est un outil formel permettant à tout agent de signaler une situation dangereuse, un risque professionnel, un incident ou une situation de mal-être au travail. Elle déclenche une procédure obligatoire de traitement.',
        ciblePublic: 'Tous les agents publics, en tant qu\'auteurs ou destinataires d\'un signalement.',
        droits: [
          { label: 'Droit de signaler', valeur: 'Garanti', detail: 'Tout agent a le droit — et dans certains cas l\'obligation — de signaler une situation à risque ou un incident. Ce droit est protégé : aucune sanction ne peut être prise contre un agent ayant signalé de bonne foi.' },
          { label: 'Traitement obligatoire', valeur: 'Par le chef de service', detail: 'Tout signalement doit faire l\'objet d\'un accusé de réception et d\'un traitement dans un délai raisonnable. Le chef de service est tenu de répondre et de prendre les mesures appropriées.' },
          { label: 'Registre de signalement', valeur: 'Document officiel', detail: 'Chaque service doit tenir un registre des signalements. La fiche remplie est conservée et peut être consultée par les membres de la formation spécialisée du CSA (ex-CHSCT).' },
        ],
        etapes: [
          { num: 1, titre: 'Identifier la situation à signaler', texte: 'La fiche de signalement peut concerner : un accident de travail ou de trajet, un incident sans accident, une situation dangereuse (risque physique, chimique, psychosocial), une situation de mal-être au travail, un comportement potentiellement harcelant, ou tout autre fait portant atteinte à la santé ou à la sécurité.' },
          { num: 2, titre: 'Remplir la fiche de signalement', texte: 'La fiche comprend l\'identité de l\'agent (qui peut choisir de rester anonyme pour certains signalements), la description précise des faits (date, lieu, circonstances, personnes présentes), les conséquences constatées ou potentielles, et les mesures déjà prises le cas échéant.' },
          { num: 3, titre: 'Transmettre la fiche', texte: 'La fiche est remise au supérieur hiérarchique direct ET à l\'assistant de prévention du service. Elle peut également être transmise directement au représentant du SPST (médecin de prévention) ou au référent harcèlement si les faits le justifient.' },
          { num: 4, titre: 'Suivi du signalement', texte: 'Le chef de service accuse réception et indique les mesures prises ou envisagées. En cas d\'inaction ou de réponse insatisfaisante, l\'agent peut saisir la formation spécialisée du CSA, l\'inspecteur santé et sécurité au travail, ou le Défenseur des droits selon la nature des faits.' },
        ],
        pieges: [
          'Un signalement de bonne foi ne peut jamais être utilisé contre l\'agent. Toute mesure de rétorsion constitue une faute grave de l\'administration.',
          'Ne pas confondre fiche de signalement (procédure interne administrative) et dépôt de plainte pénale (procédure judiciaire). Les deux peuvent coexister.',
          'L\'anonymat du signalement n\'est pas toujours possible — certains signalements nécessitent d\'être nominatifs pour déclencher une procédure disciplinaire contre la personne mise en cause.',
          'Le délai de prescription pour les faits signalés commence à courir dès que l\'agent a connaissance des faits. Agir sans délai.',
        ],
        recours: 'Absence de traitement du signalement : saisine de la formation spécialisée du CSA. Saisine de l\'inspection du travail compétente pour la FP. Recours devant le tribunal administratif si l\'inaction de l\'administration cause un préjudice. Signalement au Défenseur des droits.',
        sources: [
          { texte: 'Art. L. 4131-1 et suivants Code du travail (droit de retrait — applicable par renvoi)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902840' },
          { texte: 'Décret n° 82-453 du 28 mai 1982 modifié (registre de signalement FPE)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509290' },
          { texte: 'Art. L. 135-1 CGFP (lanceurs d\'alerte dans la FP)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000044416551' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 13 — RETRAITE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'retraite',
    updatedAt: 'Avr. 2025',
    title: 'Retraite',
    icon: '🎯',
    color: '#D4972A',
    bgColor: '#FBF0D6',
    count: 4,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'CNRACL, SRE, retraite pour invalidité, RAFP',
    fiches: [
      {
        id: 'retraite-cnracl',
        titre: 'Retraite CNRACL — FPT et FPH',
        categorie: 'Retraite',
        chips: ['FPT & FPH', 'CNRACL', 'Réforme 2023'],
        resume: 'La CNRACL gère la retraite des fonctionnaires territoriaux et hospitaliers. La réforme du 14 avril 2023 a modifié les règles de départ (âge légal porté à 64 ans, 43 annuités pour le taux plein).',
        ciblePublic: 'Fonctionnaires titulaires de la FPT et de la FPH.',
        droits: [
          { label: 'Âge légal de départ', valeur: '64 ans', detail: 'Depuis la réforme du 14 avril 2023. Départ anticipé possible pour carrière longue, handicap ou invalidité.' },
          { label: 'Durée de cotisation', valeur: '43 ans (172 trimestres)', detail: 'Pour une pension à taux plein. Progressif selon l\'année de naissance.' },
          { label: 'Taux de pension', valeur: '75 % du dernier traitement', detail: '75 % du traitement indiciaire brut des 6 derniers mois. Primes exclues.' },
          { label: 'Minimum garanti', valeur: 'Protection plancher', detail: 'Si la pension calculée est inférieure au minimum garanti, ce dernier s\'applique.' },
        ],
        etapes: [
          { num: 1, titre: "Reconstituer sa carrière", texte: "Vérifier son relevé de carrière CNRACL sur le portail info-retraite.fr. Signaler toute anomalie à la DRH au moins 5 ans avant le départ prévu." },
          { num: 2, titre: "Demander un bilan retraite", texte: "À partir de 45 ans, demander un entretien retraite auprès du service RH. La CNRACL propose également un simulateur en ligne sur son portail." },
          { num: 3, titre: "Déposer la demande de liquidation", texte: "La demande doit être déposée auprès de l'administration au moins 6 mois avant la date de départ. Elle est transmise à la CNRACL pour calcul et liquidation." },
          { num: 4, titre: "Réception et vérification", texte: "La CNRACL notifie le montant de la pension. Un délai de recours est ouvert en cas d'erreur. Le premier versement intervient le mois suivant le départ." },
        ],
        pieges: [
          'Les primes ne sont pas prises en compte dans le calcul de la pension de base.',
          'Les congés CLM, CLD et CITIS sont assimilés à des périodes d\'activité — ils génèrent des droits à retraite.',
        ],
        recours: 'Contestation du montant devant la CNRACL. Recours gracieux puis tribunal administratif.',
        sources: [
          { texte: 'Décret n° 2003-1306 du 26 décembre 2003 (CNRACL)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000237342' },
          { texte: 'Loi n° 2023-270 du 14 avril 2023 (réforme retraites)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047528765' },
        ],
      },
      {
        id: 'retraite-sre',
        titre: 'Retraite SRE — FPE',
        categorie: 'Retraite',
        chips: ['FPE', 'Code des pensions', 'Réforme 2023'],
        resume: 'Le Service des Retraites de l\'État gère la pension des fonctionnaires civils de l\'État. Les règles sont proches de la CNRACL mais relèvent d\'un régime distinct.',
        ciblePublic: 'Fonctionnaires titulaires de la FPE.',
        droits: [
          { label: 'Âge légal de départ', valeur: '64 ans', detail: 'Identique à la CNRACL depuis 2023.' },
          { label: 'Taux de pension', valeur: '75 % du dernier traitement', detail: 'Calculé sur le traitement indiciaire brut des 6 derniers mois.' },
          { label: 'Catégorie active', valeur: 'Départ anticipé possible', detail: 'Certains emplois permettent un départ à 57 ans.' },
        ],
        etapes: [
          { num: 1, titre: "Consulter son relevé de carrière", texte: "Disponible sur info-retraite.fr. Vérifier la cohérence et signaler toute anomalie à la DRH sans attendre." },
          { num: 2, titre: "Simuler sa pension", texte: "Le simulateur du SRE sur retraite.gouv.fr permet d'estimer le montant selon différentes dates de départ." },
          { num: 3, titre: "Déposer la demande", texte: "La demande de mise à la retraite se fait auprès de la DRH, qui la transmet au SRE. Délai recommandé : 6 mois avant la date souhaitée." },
          { num: 4, titre: "Liquidation et premier versement", texte: "Le SRE notifie le montant définitif. Le premier versement intervient le mois suivant la cessation de fonctions." },
        ],
        pieges: [
          { texte: 'Vous cotisez également au RAFP sur vos primes — cette retraite complémentaire s\'ajoute à la pension principale du SRE.', versants: ['fpe'] },
          'Une carrière incomplète entraîne une décote — anticiper avec un bilan retraite.',
        ],
        recours: 'Contestation : recours gracieux auprès du SRE, puis tribunal administratif.',
        sources: [
          { texte: 'Code des pensions civiles et militaires de retraite', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006063009' },
          { texte: 'Loi n° 2023-270 du 14 avril 2023 (réforme retraites)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047528765' },
        ],
      },
      {
        id: 'retraite-invalidite',
        titre: 'Retraite pour invalidité',
        categorie: 'Retraite',
        chips: ['Titulaires', 'Anticipée', 'Sans condition d\'âge'],
        resume: 'Un fonctionnaire définitivement inapte peut être admis à la retraite pour invalidité, sans condition d\'âge ni de durée de service.',
        ciblePublic: 'Fonctionnaires titulaires dans l\'impossibilité permanente de continuer leurs fonctions.',
        droits: [
          { label: 'Âge', valeur: 'Aucune condition', detail: 'La retraite pour invalidité peut être accordée à tout âge.' },
          { label: 'Taux de pension', valeur: '50 % minimum', detail: 'Si l\'invalidité résulte de l\'exercice des fonctions.' },
          { label: 'Majoration pour tierce personne', valeur: '+ 40 % de la pension', detail: 'Si l\'état de santé nécessite l\'assistance constante d\'une tierce personne. Voir fiche dédiée.' },
        ],
        etapes: [
          { num: 1, titre: "Saisine du conseil médical", texte: "Le conseil médical (formation plénière) est saisi pour constater l'inaptitude définitive. Le médecin agréé peut être sollicité au préalable." },
          { num: 2, titre: "Avis et transmission", texte: "Le conseil médical rend un avis sur l'inaptitude et l'imputabilité. L'administration transmet le dossier au SRE ou à la CNRACL selon le versant." },
          { num: 3, titre: "Calcul de la pension", texte: "La pension est calculée en fonction de la durée de services, du taux d'invalidité et de l'imputabilité au service. En cas d'imputabilité, elle est majorée." },
          { num: 4, titre: "Mise en paiement", texte: "La pension est versée dès la cessation de fonctions, sans condition d'âge. L'agent est informé du montant par notification écrite." },
        ],
        pieges: [
          'L\'agent ne peut pas être mis à la retraite pour invalidité sans avis du conseil médical.',
          'Si l\'invalidité est imputable au service, la pension est plus favorable — vérifier systématiquement.',
        ],
        recours: 'Contestation : recours gracieux, puis tribunal administratif.',
        sources: [
          { texte: 'Art. L. 29 Code des pensions civiles (retraite invalidité FPE)', url: 'https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006063009' },
        ],
      },
      {
        id: 'rafp',
        titre: 'RAFP — Régime Additionnel de la Fonction Publique',
        categorie: 'Retraite',
        chips: ['Tous titulaires', 'Sur les primes', 'Complément pension'],
        resume: 'Le RAFP est un régime de retraite complémentaire obligatoire qui permet de constituer des droits à la retraite sur les primes et indemnités.',
        ciblePublic: 'Fonctionnaires titulaires des trois versants.',
        droits: [
          { label: 'Assiette', valeur: 'Primes et indemnités', detail: 'Dans la limite de 20 % du traitement indiciaire brut.' },
          { label: 'Cotisation', valeur: '10 % (5 % agent + 5 % employeur)', detail: 'Partagée à égalité entre l\'agent et l\'administration.' },
        ],
        etapes: [
          { num: 1, titre: "Cotisation automatique", texte: "Les cotisations au RAFP sont prélevées automatiquement chaque mois sur les primes et indemnités. Aucune démarche n'est requise pendant la carrière." },
          { num: 2, titre: "Consulter ses droits", texte: "Les droits accumulés sont consultables sur rafp.fr. Une estimation est également fournie lors de l'entretien retraite." },
          { num: 3, titre: "Liquidation automatique", texte: "La liquidation du RAFP est déclenchée lors de la mise à la retraite principale. Aucune demande séparée n'est nécessaire dans la plupart des cas." },
          { num: 4, titre: "Versement", texte: "Versé en rente mensuelle si les droits dépassent le seuil, ou en capital si insuffisants. Le versement commence en même temps que la pension principale." },
        ],
        pieges: [
          'Les contractuels ne cotisent pas au RAFP — ils cotisent à l\'IRCANTEC.',
          'En cas de décès avant la liquidation, des droits RAFP peuvent être transmis aux ayants droit.',
        ],
        recours: 'Contestation : recours gracieux auprès de la CNRACL (gestionnaire du RAFP), puis tribunal administratif.',
        sources: [
          { texte: 'Loi n° 2003-775 du 21 août 2003 (création du RAFP)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000424993' },
          { texte: 'RAFP — portail officiel', url: 'https://www.rafp.fr' },
        ],
      },
    ],
  },
// ─────────────────────────────────────────────────────────────────────────────
  // MODULE 14 — CONGÉS SPÉCIFIQUES (maternité, paternité, adoption, parental)
  // À insérer dans MODULES[] juste avant le ]; de fermeture du tableau
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'conges-specifiques',
    updatedAt: 'mai 2026',
    title: 'Congés spécifiques',
    icon: '👶',
    color: '#a5537d',
    bgColor: '#f5d0e8',
    count: 5,
    versants: ['fpe', 'fpt', 'fph'],
    description: 'Maternité, pathologique, paternité, adoption, parental',
    fiches: [

      // ── 1. Congé de maternité ───────────────────────────────────────────────
      {
        id: 'conge-maternite',
        titre: 'Congé de maternité',
        categorie: 'Congés spécifiques',
        chips: ['Femmes', '100 % traitement', 'Titulaires & contractuelles', 'Droits préservés'],
        resume: 'Toute agente enceinte — titulaire ou contractuelle — bénéficie d\'un congé de maternité rémunéré à 100 %, avec maintien intégral des droits statutaires. La durée varie selon le rang de l\'enfant et le type de naissance.',
        ciblePublic: 'Toutes les agentes publiques titulaires et contractuelles des trois versants.',
        droits: [
          { label: '1er ou 2e enfant', valeur: '16 semaines', detail: '6 semaines prénatales + 10 semaines postnatales. Le congé prénatal peut être réduit de 3 semaines maximum sur prescription médicale, reportées en postnatal.' },
          { label: '3e enfant ou plus', valeur: '26 semaines', detail: '8 semaines prénatales + 18 semaines postnatales.' },
          { label: 'Jumeaux', valeur: '34 semaines', detail: '12 semaines prénatales + 22 semaines postnatales.' },
          { label: 'Triplés ou plus', valeur: '46 semaines', detail: '24 semaines prénatales + 22 semaines postnatales.' },
          { label: 'Rémunération', valeur: '100 % — aucun jour de carence', detail: 'Traitement indiciaire, NBI et régime indemnitaire maintenus à 100 %. Aucun jour de carence.' },
          { label: 'Droits statutaires', valeur: 'Entièrement préservés', detail: 'Avancement d\'échelon, de grade et droits à retraite (CNRACL/SRE/RAFP) maintenus. Les congés annuels acquis non pris avant la maternité sont reportables (Loi 2024-364).' },
        ],
        etapes: [
          { num: 1, titre: 'Déclaration de grossesse', texte: 'Informer le service RH dès la déclaration de grossesse. Fournir le certificat médical précisant la date présumée d\'accouchement.' },
          { num: 2, titre: 'Report possible du prénatal', texte: 'Sur prescription médicale, il est possible de réduire le congé prénatal de 3 semaines (1er/2e enfant), reportées en postnatal.' },
          { num: 3, titre: 'Après l\'accouchement', texte: 'Au moins 8 semaines de postnatal obligatoires, dont 6 immédiatement après l\'accouchement. Ce minimum est incontournable.' },
        ],
        pieges: [
          'Accouchement prématuré : si l\'accouchement survient avant le début du congé prénatal, le postnatal est prolongé d\'autant — la durée totale ne diminue pas.',
          'Hospitalisation du nourrisson : en cas d\'hospitalisation prolongée du nouveau-né, le congé postnatal peut être suspendu et repris à la sortie de l\'hôpital.',
          { texte: 'Contractuelles FPT : la rémunération est versée par la CPAM selon les règles d\'ancienneté du régime général. Vérifier auprès du service RH.', versants: ['fpt'] },
        ],
        recours: 'Tout refus ou retard d\'accès au congé de maternité est contestable en référé devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L.631-1 CGFP (congé de maternité)' },
          { texte: 'Décret n°85-986 du 16/09/1985 (FPE)' },
          { texte: 'Loi n°2024-364 du 22/04/2024 (report congés annuels)' },
        ],
      },

      // ── 2. Congé pathologique ───────────────────────────────────────────────
      {
        id: 'conge-patho',
        titre: 'Congé pathologique (prénatal & postnatal)',
        categorie: 'Congés spécifiques',
        chips: ['Femmes', 'Sur prescription', '100 % traitement', 'Réforme mars 2026'],
        resume: 'En cas de complications médicales liées à la grossesse ou à l\'accouchement, l\'agente peut bénéficier d\'un congé pathologique supplémentaire qui s\'ajoute au congé de maternité légal. Depuis le 1er mars 2026, le congé prénatal est porté à 21 jours.',
        ciblePublic: 'Fonctionnaires titulaires des 3 versants. Les contractuelles indemnisées par la CPAM relèvent du régime général (14 jours).',
        droits: [
          { label: 'Congé prénatal — depuis 01/03/2026', valeur: '21 jours calendaires', detail: 'Porté de 14 à 21 jours par l\'art. 174 de la LFI 2026. Fractionnable et mobilisable à tout moment entre la déclaration de grossesse et le début du congé maternité légal.' },
          { label: 'Congé postnatal', valeur: '4 semaines maximum', detail: 'Après le congé de maternité, sur prescription médicale, en cas de complications post-accouchement.' },
          { label: 'Rémunération', valeur: '100 % — assimilé maternité', detail: 'Traitement maintenu à 100 %. Assimilé à un congé de maternité pour tous ses effets. Aucun jour de carence.' },
          { label: 'Contractuelles CPAM', valeur: '14 jours (régime général)', detail: 'Les contractuelles dont les IJ sont versées par la CPAM restent au régime général. La réforme 2026 ne leur est pas applicable.' },
        ],
        etapes: [
          { num: 1, titre: 'Prescription médicale', texte: 'Un certificat médical attestant l\'état pathologique lié à la grossesse est obligatoire. Le médecin précise la durée dans la limite légale.' },
          { num: 2, titre: 'Remise au service RH', texte: 'Remettre le certificat médical au service RH. Le congé est accordé de droit, sans passage en conseil médical.' },
          { num: 3, titre: 'Fractionnement possible', texte: 'Les 21 jours prénatals n\'ont pas à être pris d\'un seul tenant. Ils sont mobilisables progressivement selon l\'évolution de l\'état de santé.' },
        ],
        pieges: [
          'Depuis le 1er mars 2026 uniquement pour les titulaires — les contractuelles indemnisées par la CPAM restent à 14 jours prénatal.',
          'Le congé pathologique s\'ajoute au congé de maternité — il ne se décompte pas de sa durée.',
        ],
        recours: 'Refus contestable par recours gracieux (2 mois) puis tribunal administratif.',
        sources: [
          { texte: 'Art. L.631-3 CGFP (congé pathologique)' },
          { texte: 'Art. 174 Loi n°2026-103 du 19/02/2026 — LFI 2026 (extension à 21 jours)' },
          { texte: 'service-public.fr — mise à jour février 2026' },
        ],
      },

      // ── 3. Congé de paternité et d'accueil de l'enfant ─────────────────────
      {
        id: 'conge-paternite',
        titre: 'Congé de paternité et d\'accueil de l\'enfant',
        categorie: 'Congés spécifiques',
        chips: ['Second parent', '25 jours', 'Titulaires & contractuels', '100 % traitement'],
        resume: 'Tout agent public a droit à un congé de paternité et d\'accueil de l\'enfant lors de la naissance. 25 jours pour une naissance simple, dont 4 jours obligatoires immédiatement après la naissance, sans condition d\'ancienneté.',
        ciblePublic: 'Père ou conjoint/partenaire PACS/concubin de la mère, quel que soit son sexe. Titulaires, stagiaires et contractuels, sans condition d\'ancienneté.',
        droits: [
          { label: 'Naissance simple', valeur: '25 jours calendaires', detail: '4 jours obligatoires immédiatement après la naissance + 21 jours à prendre dans les 6 mois. Les 4 jours s\'ajoutent aux 3 jours d\'ASA pour naissance (7 jours minimum consécutifs).' },
          { label: 'Naissances multiples', valeur: '32 jours calendaires', detail: '4 jours obligatoires + 28 jours à prendre dans les 6 mois.' },
          { label: 'Rémunération', valeur: '100 % — temps plein', detail: 'Traitement et régime indemnitaire maintenus à 100 %. En cas de temps partiel, l\'agent est rémunéré à temps plein pendant le congé.' },
          { label: 'Sans condition d\'ancienneté', valeur: 'Depuis Loi 2025-1403', detail: 'La condition de 6 mois d\'ancienneté a été supprimée pour tous les agents. Source : Loi n°2025-1403 du 30/12/2025 art. 99.' },
          { label: 'Droits statutaires', valeur: 'Préservés', detail: 'Avancement et droits à retraite maintenus. Congés annuels acquis reportables (Loi 2024-364).' },
        ],
        etapes: [
          { num: 1, titre: 'Informer le service RH avant la naissance', texte: 'Les 4 jours obligatoires débutent immédiatement après la naissance — prévenir le service RH à l\'avance.' },
          { num: 2, titre: 'Fournir l\'acte de naissance', texte: 'Transmettre l\'acte de naissance dès que disponible.' },
          { num: 3, titre: 'Prendre les 21 jours restants', texte: 'Fractionnables en 2 périodes minimum de 5 jours, à prendre dans les 6 mois suivant la naissance. Passé ce délai, les jours sont perdus.' },
        ],
        pieges: [
          'Les 4 jours obligatoires s\'ajoutent aux 3 jours d\'ASA pour naissance — ne pas les confondre. L\'agent bénéficie donc d\'au moins 7 jours.',
          'Délai de 6 mois impératif pour les 21 jours restants. Aucune dérogation possible.',
          'En cas de décès de la mère, le second parent peut reprendre tout ou partie du congé de maternité non pris.',
        ],
        recours: 'Refus ou entrave contestable en référé devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L.631-9 CGFP (congé de paternité et d\'accueil)' },
          { texte: 'Décret n°2021-1552 du 01/12/2021' },
          { texte: 'Loi n°2025-1403 du 30/12/2025 art. 99 (suppression condition ancienneté)' },
        ],
      },

      // ── 4. Congé d'adoption ─────────────────────────────────────────────────
      {
        id: 'conge-adoption',
        titre: 'Congé d\'adoption',
        categorie: 'Congés spécifiques',
        chips: ['Parents adoptants', '100 % traitement', 'Partageable', 'Titulaires & contractuels'],
        resume: 'Tout agent public accueillant un enfant en vue de son adoption bénéficie d\'un congé d\'adoption rémunéré à 100 %. La durée varie selon le rang de l\'enfant. Le congé peut être partagé entre les deux parents adoptants.',
        ciblePublic: 'Tout agent public (titulaire ou contractuel) accueillant un enfant en vue d\'adoption.',
        droits: [
          { label: '1er ou 2e enfant au foyer', valeur: '10 semaines', detail: 'À compter de l\'arrivée de l\'enfant au foyer.' },
          { label: '3e enfant ou plus', valeur: '18 semaines', detail: 'À compter de l\'arrivée de l\'enfant.' },
          { label: 'Adoptions multiples', valeur: '22 semaines', detail: 'Pour l\'accueil simultané de plusieurs enfants.' },
          { label: 'Partage entre parents', valeur: 'Congé augmenté + 18 j', detail: 'Si les deux parents partagent, le congé est augmenté de 18 jours (25 j pour une adoption multiple). Chaque parent prend au minimum 25 jours.' },
          { label: 'Rémunération', valeur: '100 % — droits préservés', detail: 'Traitement maintenu à 100 %. Avancement et retraite préservés.' },
        ],
        etapes: [
          { num: 1, titre: 'Informer le service RH', texte: 'Dès que la date d\'arrivée de l\'enfant est connue. Fournir le jugement d\'adoption ou la décision d\'agrément.' },
          { num: 2, titre: 'Choisir le mode de prise', texte: 'Le congé peut être pris seul ou partagé entre les deux parents. Le partage doit être acté par les deux services RH respectifs.' },
          { num: 3, titre: 'Prise simultanée ou alternative', texte: 'Les deux parents peuvent prendre leur congé d\'adoption simultanément ou en alternance.' },
        ],
        pieges: [
          'Le congé débute à l\'arrivée de l\'enfant au foyer, pas à la date du jugement — anticiper la démarche auprès du service RH.',
          'En cas d\'adoption internationale, un congé sans traitement supplémentaire peut être accordé pour les démarches administratives à l\'étranger.',
        ],
        recours: 'Refus contestable devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L.631-4 CGFP (congé d\'adoption)' },
          { texte: 'Art. L.631-5 CGFP (partage du congé d\'adoption)' },
          { texte: 'Loi n°2024-364 du 22/04/2024' },
        ],
      },

      // ── 5. Congé parental ───────────────────────────────────────────────────
      {
        id: 'conge-parental',
        titre: 'Congé parental',
        categorie: 'Congés spécifiques',
        chips: ['Père & mère', 'Non rémunéré', 'De plein droit', 'Jusqu\'aux 3 ans de l\'enfant'],
        resume: 'Tout fonctionnaire peut bénéficier d\'un congé parental non rémunéré pour élever son enfant jusqu\'à ses 3 ans. Accordé de plein droit, les droits à avancement sont partiellement conservés et les congés annuels acquis sont reportables depuis 2024.',
        ciblePublic: 'Fonctionnaires titulaires et stagiaires, père ou mère. Les deux parents peuvent en bénéficier successivement, pas simultanément.',
        droits: [
          { label: 'Durée', valeur: 'Jusqu\'aux 3 ans de l\'enfant', detail: 'Ou jusqu\'au 3e anniversaire de l\'adoption. Renouvelable par périodes de 6 mois à 1 an. Accordé de plein droit sur simple demande.' },
          { label: 'Rémunération', valeur: 'Aucune — allocations CAF', detail: 'L\'agent ne perçoit plus de traitement. Il peut percevoir les allocations CAF (PreParE, CMG) selon sa situation familiale et ses revenus.' },
          { label: 'Avancement', valeur: 'Conservé — limite 5 ans/carrière', detail: 'Droits à avancement d\'échelon et de grade maintenus, dans la limite totale de 5 ans sur l\'ensemble de la carrière.' },
          { label: 'Congés annuels', valeur: 'Reportables 15 mois', detail: 'Les congés annuels acquis avant le congé parental et non pris sont reportables jusqu\'à 15 mois après la reprise. Source : Loi 2024-364 + Décret 2025-564.' },
          { label: 'Réintégration', valeur: 'De plein droit', detail: 'Réintégration dans son ancien emploi ou équivalent à l\'issue du congé. Aucune visite médicale préalable.' },
        ],
        etapes: [
          { num: 1, titre: 'Demande écrite au service RH', texte: 'Au moins 2 mois avant la date de début. Le congé est accordé de plein droit — l\'administration ne peut pas le refuser.' },
          { num: 2, titre: 'Renouvellements', texte: 'Chaque renouvellement se demande au moins 1 mois avant l\'expiration de la période en cours.' },
          { num: 3, titre: 'Fin anticipée possible', texte: 'L\'agent peut mettre fin au congé parental à tout moment, sans justification de motif grave (depuis Loi 2016-483).' },
          { num: 4, titre: 'Demande de réintégration', texte: 'À formuler au moins 2 mois avant la fin du congé. Réintégration de plein droit dans l\'emploi occupé ou équivalent.' },
        ],
        pieges: [
          'Le congé parental n\'est pas cotisé pour la retraite CNRACL. La période peut être partiellement rachetée, mais à un coût significatif — anticiper dans les projections retraite.',
          'Ne pas confondre congé parental (hors service, non rémunéré) et temps partiel de droit pour élever un enfant (maintien de rémunération au prorata, agent reste en activité).',
          'L\'agente enceinte pendant le congé parental peut y mettre fin de manière anticipée pour son congé de maternité — le congé parental cesse automatiquement à cette date.',
        ],
        recours: 'Refus de congé parental ou de réintégration : recours gracieux immédiat, puis référé devant le tribunal administratif.',
        sources: [
          { texte: 'Art. L.515-1 à L.515-11 CGFP (congé parental)' },
          { texte: 'Décret n°86-68 du 13/01/1986 (FPE)' },
          { texte: 'Décret n°2025-564 du 21/06/2025 (report congés annuels)' },
          { texte: 'Loi n°2024-364 du 22/04/2024 art. 36' },
        ],
      },

    ],
  },
];
// ─── Utilitaires ──────────────────────────────────────────────────────────────

export const getFicheById = (ficheId) => {
  for (const module of MODULES) {
    const fiche = module.fiches?.find(f => f.id === ficheId);
    if (fiche) return { ...fiche, moduleColor: module.color, moduleBg: module.bgColor };
  }
  return null;
};

export const getModuleById = (moduleId) => {
  return MODULES.find(m => m.id === moduleId) || null;
};

export const searchFiches = (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];
  for (const module of MODULES) {
    for (const fiche of (module.fiches || [])) {
      if (
        fiche.titre.toLowerCase().includes(q) ||
        fiche.resume.toLowerCase().includes(q) ||
        fiche.chips.some(c => c.toLowerCase().includes(q))
      ) {
        results.push({ ...fiche, moduleColor: module.color, moduleTitle: module.title });
      }
    }
  }
  return results;
};
