# Fonctio — Guide de mise en production

## L'app en chiffres
- **10 modules**, **43 fiches** sourcées sur Légifrance et le portail de la fonction publique
- **Chaque réponse déclinée par versant** — État, Territoriale, Hospitalière
- **1 simulateur** de rémunération : CMO, CLM, CLD, CITIS, TPT, contractuels — avec jour de carence, indemnités journalières et estimation du net
- **À jour au 15 août 2026**, décret n° 2026-705 du 29 juillet inclus
- Modèle **freemium** : app gratuite + module Retraite Pro (1,99 €/mois)

---

## Installation & lancement

### Prérequis
- Node.js 18+ ([télécharger](https://nodejs.org))
- Git ([télécharger](https://git-scm.com))
- Un terminal (invite de commandes sous Windows, Terminal sous Mac)

### Étape 1 — Installer les dépendances
```bash
cd fonctio
npm install
```

### Étape 2 — Lancer en mode développement
```bash
npm start
```
Scanne le QR code avec l'app **Expo Go** sur ton téléphone Android.

---

## Publication sur le Play Store

### Créer un compte Google Developer (une seule fois)
1. Aller sur [play.google.com/console](https://play.google.com/console)
2. Créer un compte développeur : **25$ de frais uniques**
3. Accepter les conditions d'utilisation

### Compiler l'app avec EAS Build (sans Android Studio)

#### Installer EAS CLI
```bash
npm install -g eas-cli
eas login
```

#### Configurer EAS dans le projet
```bash
eas build:configure
```

#### Lancer la compilation Android
```bash
eas build --platform android --profile production
```
→ La compilation se fait dans le cloud (~15 min). Tu reçois un lien pour télécharger l'APK/AAB.

### Publier sur le Play Store
1. Télécharger le fichier `.aab` généré par EAS
2. Dans la Console Play : **Créer une application**
3. Remplir les métadonnées (titre, description, captures d'écran)
4. Uploader l'AAB dans **Versions > Production**
5. Soumettre pour examen (~2-3 jours)

---

## Métadonnées Play Store (à copier)

### Titre
```
Fonctio — Droits des fonctionnaires
```

### Description courte (80 caractères max)
```
Vos droits quand la santé s'en mêle — dans votre versant
```
*(55 caractères)*

### Description longue
```
Arrêt maladie, longue maladie, accident de service, inaptitude, congé maternité : Fonctio vous dit ce à quoi vous avez droit, et le dit pour VOTRE versant.

Les règles ne sont pas les mêmes à l'État, dans une collectivité et à l'hôpital. Un contractuel hospitalier n'a pas les droits d'un contractuel de l'État. Un agent territorial en longue maladie ne touche pas le même pourcentage qu'un agent d'État. Fonctio est construite autour de ces différences, au lieu de les gommer.

CE QUE VOUS Y TROUVEZ

✅ 43 fiches sourcées sur Légifrance et le portail de la fonction publique
✅ Chaque réponse déclinée pour l'État, la Territoriale et l'Hospitalière
✅ Un simulateur de rémunération mois par mois — jour de carence, indemnités journalières, estimation du net
✅ Congés maladie : CMO, CLM, CLD, temps partiel thérapeutique
✅ Accidents de service, maladies professionnelles, CITIS
✅ Inaptitude, reclassement, RQTH
✅ Droits des contractuels, dans les trois versants
✅ Congés familiaux : maternité, paternité, naissance, adoption, parental
✅ Protection fonctionnelle, harcèlement, signalement

POUR QUI ?
— Agents publics des trois versants, titulaires comme contractuels
— Gestionnaires RH et représentants du personnel
— Assistants de service social du personnel

POURQUOI FONCTIO ?
Comprendre ses droits ne devrait pas obliger à lire un décret de quarante pages, ni à deviner si l'article trouvé en ligne s'applique vraiment à son versant. Fonctio traduit le droit en langage clair, indique la source, et signale les pièges — ceux qui coûtent un délai forclos ou plusieurs centaines d'euros.

À JOUR
Contenu vérifié au 15 août 2026, décret n° 2026-705 du 29 juillet inclus.

Sources : Code général de la fonction publique, Légifrance, portail de la fonction publique.
Application informative : elle ne remplace pas un conseil juridique.
```

### Mots-clés
```
fonction publique, fonctionnaire, agent public, contractuel, congé maladie, CLM, CLD, CITIS, arrêt de travail, inaptitude, reclassement, FPH, FPT, hospitalier, territorial
```

### Notes de version (texte du release)
```
Mise à jour majeure du contenu juridique.

• Contenu vérifié fiche par fiche sur les trois versants
• Décret du 29 juillet 2026 intégré : temps partiel thérapeutique et arrêts de travail
• Nouveau : congé supplémentaire de naissance
• Nouveau : se former pendant un congé de santé
• Simulateur enrichi : jour de carence, indemnités journalières, estimation du net et détail mois par mois
• Navigation resserrée en 10 rubriques
```

---

## Architecture du code

```
fonctio/
├── App.js                          # Point d'entrée + purge des favoris obsolètes
├── app.json                        # Config Expo (permissions bloquées incluses)
├── eas.json                        # Profils de build — versionCode géré en remote
├── src/
│   ├── theme/index.js              # Couleurs, typo, espacement
│   ├── navigation/AppNavigator.js  # Navigation + VersantContext
│   ├── data/fiches.js              # Tout le contenu juridique (43 fiches, 10 modules)
│   ├── utils/
│   │   ├── storage.js              # Favoris, récents, réglages, purge
│   │   └── SettingsContext.js      # Taille de police, thème
│   └── screens/
│       ├── SplashScreen.js         # Splash animé
│       ├── WelcomeScreen.js        # Choix du versant au premier lancement
│       ├── HomeScreen.js           # Accueil, recherche, modules
│       ├── ModuleScreen.js         # Liste des fiches d'un module
│       ├── FicheDetailScreen.js    # Fiche complète, filtrée par versant
│       ├── SimulateurScreen.js     # Projection de rémunération brut/net
│       ├── SearchScreen.js         # Recherche dans toutes les fiches
│       ├── ProfilScreen.js         # Profil, Pro, informations
│       └── SettingsScreen.js       # Réglages
```

### Le versant, principe central

Le versant actif vient de `VersantContext`. Dans `fiches.js`, chaque entrée de
`droits`, `etapes` et `pieges` accepte un tag `versants: ['fpt','fph']` ; sans
tag, elle s'affiche partout. S'y ajoutent `versantNotes` pour l'encart « Pour
vous » et trois formes de tableaux (`tableaux`, `tableauFpe`/`Fpt`/`Fph`, ou
`tableau` avec un champ `versants`).

Deux règles à ne jamais oublier :
- `resume` et `ciblePublic` ne sont PAS filtrables — les rédiger en neutre.
- Un `piege` est soit une chaîne, soit `{texte, versants}` : toute itération
  doit normaliser, sinon on affiche `[object Object]`.

⚠️ Le décret 2024-641 ne vise QUE la fonction publique de l'État. Ne jamais
l'étendre à la territoriale ou à l'hospitalière, qui relèvent respectivement
des décrets 87-602 / 88-145 et 88-386 / 91-155.

---

## Pour mettre à jour les fiches

Toute la base de données des fiches est dans **`src/data/fiches.js`**.

Pour modifier ou ajouter une fiche :
1. Ouvrir `src/data/fiches.js`
2. Trouver le module concerné dans `MODULES`
3. Modifier le contenu (titre, résumé, droits, étapes, pièges, sources)
4. **Vérifier les trois versants** — voir ci-dessous
5. Tester avec `npm start`
6. Recompiler avec `eas build` et publier une mise à jour

### Contrôle avant publication

Il n'y a pas de tests automatisés. Le réflexe qui rattrape l'essentiel est un
script Node ponctuel qui parcourt les 43 fiches pour les 3 versants et vérifie :
sections vides, tableau manquant, numérotation d'étapes trouée, `count` de
module faux, `categorie` incohérente, piège non normalisé.

```bash
npx expo export --platform android --output-dir /tmp/check --clear
```

Ce bundle est le contrôle le plus proche d'un vrai build. Vérifier aussi
l'absence de fichiers `*Name clash*` : le dossier est synchronisé OneDrive et
des doublons apparaissent pendant les sessions d'édition intensive, en laissant
l'original privé des dernières modifications.

### Vérifier la signature avant d'envoyer un .aab

L'app a été suspendue trois mois en 2026 pour un `.aab` signé avec une keystore
qui ne correspondait pas à celle enregistrée par Google. Avant tout envoi :

```bash
keytool -printcert -jarfile chemin/vers/build.aab
```

Le SHA-1 obtenu doit être identique à celui du **certificat de clé
d'importation** affiché dans la Play Console (Intégrité de l'application).
EAS signe avec la keystore stockée sur ses serveurs — `eas.json` ne fixe aucun
`credentialsSource`, donc les `.jks` présents localement ne sont PAS ceux
utilisés par le build.

---

## Prochaines étapes recommandées

1. **Intégrer RevenueCat** pour la gestion des abonnements Pro
2. **Ajouter les notifications** (Expo Notifications) pour les alertes réglementaires
3. **Firebase Analytics** pour comprendre quelles fiches sont les plus consultées
4. **Compléter le module Retraite** (Pro) avec les simulateurs CNRACL/SRE

---

## Support

Pour toute question technique, ouvrir une issue ou me contacter.
