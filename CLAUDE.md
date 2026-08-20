# Fonctio — application

App mobile Expo/React Native sur les droits des agents publics français.
Compte GitHub `fonctiopoint`, package `com.theguy03.fonctio`.
Freemium : app gratuite + module Retraite Pro annoncé à 1,99 €/mois.

> Projet **sans aucun rapport** avec AMAROK (rations pour chiens, `Desktop\AMAROK`).
> Ne jamais mélanger les deux, ni leurs mémoires, ni leurs artifacts.

## Où vit le contenu

Tout le contenu juridique tient dans `src/data/fiches.js` — 1 979 lignes, 209 Ko,
**10 modules, 43 fiches** (l'app a été recentrée depuis 14 modules / 58 fiches).

Le fichier est **autonome** : aucun `import`, du pur data plus trois utilitaires.
Il peut donc être évalué tel quel par un script Node, ce qui permet d'en extraire
une fiche exacte sans regex. C'est la propriété sur laquelle reposent tous les
outils d'écriture de l'admin — ne pas la casser en y ajoutant un import.

`src/data/veille.js` est la **surcouche de veille** : entrées append-only affichées
en tête des fiches concernées. Écrite par l'admin entre les marqueurs
`@veille:start` / `@veille:end`. Champ `integre` : `false` = bandeau ambre
« évolution à connaître », `true` = marqueur de fraîcheur discret.

## Les trois versants — le piège central

Le versant actif vient de `VersantContext` (AppNavigator). Chaque fiche décline :

- `droits[]`, `etapes[]`, `pieges[]` acceptent un tag `versants: ['fpt','fph']` ;
  sans tag = visible partout
- `versantNotes: { fpe, fpt, fph }` → encart « Pour vous »
- Tableaux : `tableaux[versant]`, puis `tableauFpe`/`Fpt`/`Fph`, puis `tableau`
  avec `versants: []` — résolus dans cet ordre par `resolveTableau()`
- `resume` et `ciblePublic` **ne sont pas filtrables** par versant → toujours les
  rédiger en neutre
- `pieges` est soit une chaîne, soit `{texte, versants}` — toute itération doit
  normaliser, sinon `[object Object]`

**Le décret 2024-641 du 27 juin 2024 ne s'applique QU'À L'ÉTAT** (son titre dit
« des fonctionnaires et des agents contractuels de l'État »). Ne jamais l'étendre
à la FPT ni à la FPH. Textes propres à chaque versant :

| Sujet | FPE | FPT | FPH |
|---|---|---|---|
| Titulaires, congés de santé | 86-442 | 87-602 | **88-386** |
| Contractuels | 86-83 | 88-145 | **91-155** (art. 10 CMO, 11 CGM, 12 AT/MP) |
| Conseil médical (11/03/2022) | 2022-353 | 2022-350 | **2022-351** |
| CITIS | 2019-122 | 2019-301 | **2020-566** |
| Positions | 85-986 | 86-68 | 88-976 |
| Reclassement | 84-1051 | 85-1054 | 89-376 |

Conséquence : contractuels FPT **et** FPH partagent le régime progressif
(4 mois → 1+1, 2 ans → 2+2, 3 ans → 3+3) ; seule la FPE est à 3 mois + 9 mois.
Le CGM est à 50 % en années 2-3 partout sauf FPE (60 %).

Les lois 84-16 / 84-53 / 86-33 sont **abrogées depuis le 01/03/2022** (CGFP,
ord. 2021-1574). Codification à droit constant : le fond reste juste, mais toute
source doit être citée en articles du CGFP (L. 822-x congés santé, L. 823-x TPT,
L. 826-x inaptitude/ATI, L. 522-x avancement).

## Le simulateur

`src/screens/SimulateurScreen.js` — 1 016 lignes. Deux natures de valeurs :

- **Données modifiables** : `MAX_MOIS` (8 durées) et 11 constantes `TAUX_*`,
  `SMIC_MENSUEL`, `PLAFOND_*`, `JOURS_MOIS`. L'admin sait les écrire en sécurité.
- **Logique de calcul** : les `case 'cmo':` de `calculerProjection`. Flux de
  contrôle — à modifier à la main uniquement.

Le SMIC n'intervient QUE pour les contractuels dont l'employeur ne verse plus
rien : ils basculent sur les IJ de la Sécurité sociale, plafonnées à 1,4 SMIC
depuis le 01/04/2025. Un titulaire n'atteint jamais cette branche.

## Vérifier un changement de contenu

Pas de suite de tests. Le réflexe utile : un script Node ponctuel qui évalue
`src/data/fiches.js` et boucle sur les 43 fiches × 3 versants pour détecter
sections vides, tableaux manquants, numérotation d'étapes trouée, fuites
inter-versants et `[object Object]`.

Puis `npx expo export --platform android` pour confirmer que ça bundle
(~3,2 MB Hermes). **Attention** : bundle et tsc ne prouvent RIEN du rendu ni du
comportement runtime RN. Présenter comme « compile », jamais comme « vérifié ».

## Niveau de validation attendu

Proposer des options — jamais trancher seul — pour une **direction visuelle** ou
un choix de produit. Trancher seul, sans demander, pour un **correctif dans une
direction déjà actée**.

## Déploiement

`.github/workflows/eas-update.yml` est en `workflow_dispatch` **seul** — pousser
sur `main` ne livre rien aux utilisateurs. Il faut déclencher le workflow (bouton
« Déployer » de l'admin). Marge utile : on peut pousser du code sans risque.

## OneDrive

Le dossier est synchronisé OneDrive : des fichiers
`nom (# Name clash <date> <hash> #).js` apparaissent pendant les sessions
d'édition intensive, en laissant l'original privé des dernières modifications.
Arrivé sur `fiches.js` le 14/08/2026. Toujours `find src -name "*Name clash*"`
avant un build, et **differ avant de supprimer**.
