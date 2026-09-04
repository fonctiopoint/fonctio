// src/utils/recherche.js
// ─────────────────────────────────────────────────────────────────────────────
// La recherche de fiches.
//
// Elle vivait dans src/data/fiches.js. Elle en est sortie le 04/09/2026 pour
// deux raisons : fiches.js est le TEXTE de référence et n'a pas à contenir de
// logique, et toute retouche du moteur y changeait les empreintes SHA-256 que
// suivi_fiches.py compare pour repérer les fiches modifiées depuis le tournage
// d'un épisode vidéo.
//
// Ce qu'elle sait faire, et que l'ancienne ne savait pas :
//   — chercher MOT À MOT. « conge maternite » ne trouvait rien, parce que la
//     requête entière était cherchée comme une seule sous-chaîne et qu'aucun
//     texte ne contient ces deux mots collés dans cet ordre. Chaque mot est
//     désormais cherché séparément, et tous doivent être trouvés.
//   — tolérer les FAUTES DE FRAPPE, par distance d'édition : « maladei »
//     trouve « maladie », « reclasement » trouve « reclassement ».
//   — trouver sur un DÉBUT de mot, pour que les résultats arrivent pendant la
//     frappe : « mater » trouve « maternité ».
//   — chercher AU-DELÀ du titre et du résumé : libellés des droits et titres
//     des étapes sont indexés, si bien que « carence » ou « cure » mènent au
//     congé maladie ordinaire.
//   — CLASSER : ce qui est trouvé dans un titre passe devant ce qui est trouvé
//     dans une explication.
// ─────────────────────────────────────────────────────────────────────────────

// Compare sans tenir compte des accents : sur un clavier de téléphone, on tape
// « disponibilite » et non « disponibilité ».
//
// normalize('NFD') sépare la lettre de son diacritique, qu'on retire ensuite.
// Hermes ne fournit normalize() que si le support Intl est compilé : le repli
// couvre le français, car une recherche muette serait pire qu'une recherche
// approchée.
const ACCENTS = {
  'à': 'a', 'â': 'a', 'ä': 'a', 'á': 'a', 'ã': 'a', 'å': 'a',
  'ç': 'c',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'î': 'i', 'ï': 'i', 'ì': 'i', 'í': 'i',
  'ô': 'o', 'ö': 'o', 'ò': 'o', 'ó': 'o', 'õ': 'o',
  'ù': 'u', 'û': 'u', 'ü': 'u', 'ú': 'u',
  'ÿ': 'y', 'ý': 'y', 'ñ': 'n', 'œ': 'oe', 'æ': 'ae',
};

// Les deux plages sont construites à partir de leurs codes, jamais écrites en
// clair : un caractère combinant tapé littéralement dans une expression
// régulière est invisible à la relecture et se fait détruire au premier outil
// qui recode le fichier.
const DIACRITIQUES = new RegExp('[\\u0300-\\u036f]', 'g');
const HORS_ASCII = new RegExp('[^\\u0000-\\u007f]', 'g');

export const nu = (s) => {
  const bas = (s || '').toLowerCase();
  if (typeof bas.normalize === 'function') {
    return bas.normalize('NFD').replace(DIACRITIQUES, '');
  }
  return bas.replace(HORS_ASCII, (c) => (c in ACCENTS ? ACCENTS[c] : c));
};

const motsDe = (s) => nu(s).split(/[^a-z0-9]+/).filter(Boolean);

// Combien de fautes on pardonne, selon la longueur du mot cherché. Aucune sur
// un mot court : à trois lettres, une faute pardonnée ferait de « cmo » un
// synonyme de « clm », de « cld » et de « cgm ».
const fautesTolerees = (mot) => (mot.length <= 4 ? 0 : mot.length <= 7 ? 1 : 2);

// Distance de Damerau-Levenshtein, abandonnée dès qu'elle dépasse `max` :
// inutile de calculer au juste l'écart entre deux mots qui n'ont rien à voir.
//
// Damerau et non Levenshtein simple : l'INVERSION de deux lettres voisines y
// coûte 1 et non 2. C'est la faute de frappe la plus courante, et sans elle
// « maladei » ne trouvait pas « maladie » — deux fautes pour une seule frappe
// de travers.
const distance = (a, b, max) => {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let avantAvant = null;
  let avant = new Array(b.length + 1);
  let courante = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) avant[j] = j;
  for (let i = 1; i <= a.length; i++) {
    courante[0] = i;
    let minimum = i;
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      let valeur = Math.min(avant[j] + 1, courante[j - 1] + 1, avant[j - 1] + cout);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        valeur = Math.min(valeur, avantAvant[j - 2] + 1);
      }
      courante[j] = valeur;
      if (valeur < minimum) minimum = valeur;
    }
    if (minimum > max) return max + 1;
    avantAvant = avant;
    avant = courante;
    courante = avantAvant === courante ? new Array(b.length + 1) : new Array(b.length + 1);
  }
  return avant[b.length];
};

// Ce que vaut la rencontre d'un mot de la requête dans une liste de mots :
// 1 s'il y est tel quel, 0,8 s'il n'en est qu'un début, 0,45 ou 0,25 s'il faut
// pardonner une ou deux fautes, 0 sinon.
const qualite = (cherche, mots) => {
  const max = fautesTolerees(cherche);
  let meilleure = 0;
  for (const mot of mots) {
    if (mot === cherche) return 1;
    if (mot.length > cherche.length && mot.startsWith(cherche)) {
      meilleure = Math.max(meilleure, 0.8);
      continue;
    }
    if (max > 0) {
      const d = distance(cherche, mot, max);
      if (d <= max) meilleure = Math.max(meilleure, d === 1 ? 0.45 : 0.25);
    }
  }
  return meilleure;
};

// Les champs fouillés, et ce qu'ils pèsent. Le titre l'emporte largement : une
// fiche qui porte le mot dans son nom est presque toujours la bonne.
const POIDS = { titre: 6, chips: 4, categorie: 3, resume: 2, corps: 1 };

// L'index d'une fiche, calculé une fois pour toutes. Le jeu de données est figé
// à la compilation : il n'a pas à être reconstruit à chaque frappe.
const index = new WeakMap();

const indexer = (fiche) => {
  let entree = index.get(fiche);
  if (entree) return entree;
  const corps = [];
  for (const d of (fiche.droits || [])) { corps.push(d.label); corps.push(d.valeur); }
  for (const e of (fiche.etapes || [])) corps.push(e.titre);
  entree = {
    titre: motsDe(fiche.titre),
    chips: motsDe((fiche.chips || []).join(' ')),
    categorie: motsDe(fiche.categorie || ''),
    resume: motsDe(fiche.resume || ''),
    corps: motsDe(corps.join(' ')),
  };
  index.set(fiche, entree);
  return entree;
};

// Renvoie les fiches qui répondent, les plus pertinentes d'abord. Chaque mot de
// la requête doit être trouvé quelque part : sinon « congé maternité » ramènerait
// toutes les fiches qui parlent de congé.
export const chercherFiches = (modules, requete) => {
  const mots = motsDe(requete || '');
  if (!mots.length || (mots.length === 1 && mots[0].length < 2)) return [];

  const trouves = [];
  for (const module of modules) {
    for (const fiche of (module.fiches || [])) {
      const idx = indexer(fiche);
      let score = 0;
      let complet = true;
      for (const mot of mots) {
        let meilleur = 0;
        for (const champ of Object.keys(POIDS)) {
          const q = qualite(mot, idx[champ]);
          if (q > 0) meilleur = Math.max(meilleur, q * POIDS[champ]);
        }
        if (meilleur === 0) { complet = false; break; }
        score += meilleur;
      }
      if (complet) {
        trouves.push({
          ...fiche,
          moduleColor: module.color,
          moduleTitle: module.title,
          _score: score,
        });
      }
    }
  }
  return trouves.sort((a, b) => b._score - a._score);
};
