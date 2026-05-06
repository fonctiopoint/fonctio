# Fonctio — Guide de mise en production

## L'app en chiffres
- **6 modules** couvrant tout le droit de la santé dans la FP
- **30+ fiches** pédagogiques sourcées sur Légifrance
- **1 simulateur** complet (CMO, CLM, CLD, CITIS, TPT, contractuels)
- **Réforme 2024 intégrée** (Décret n°2024-641 du 27 juin 2024)
- Modèle **freemium** : app gratuite + module Retraite Pro (1,99€/mois)

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
Vos droits dans la fonction publique, clairement expliqués
```

### Description longue
```
Fonctio est l'application de référence pour comprendre ses droits en tant qu'agent public.

✅ 30+ fiches pédagogiques vérifiées et sourcées sur Légifrance
✅ Simulateur de congés maladie (CMO, CLM, CLD, CITIS, TPT)
✅ Droits des contractuels (FPE, FPT, FPH) — réforme 2024 intégrée
✅ Accidents de service et maladies professionnelles
✅ Inaptitude, reclassement professionnel
✅ Médecine statutaire et secret médical

POUR QUI ?
— Fonctionnaires titulaires des 3 versants (État, Territorial, Hospitalier)
— Agents contractuels (CDD, CDI)
— Gestionnaires RH, représentants du personnel

POURQUOI FONCTIO ?
Comprendre ses droits ne devrait pas nécessiter de lire des décrets de 40 pages. 
Fonctio traduit le droit en langage clair, avec les sources pour vérifier.

Sources : Code général de la fonction publique (CGFP), Légifrance, portail de la Fonction publique.
Cette application est informative et ne remplace pas un conseil juridique.
```

### Mots-clés
```
fonction publique, fonctionnaire, droits, congé maladie, CLM, CITIS, contractuel, reclassement
```

---

## Architecture du code

```
fonctio/
├── App.js                          # Point d'entrée
├── app.json                        # Config Expo
├── src/
│   ├── theme/index.js              # Couleurs, typo, espacement
│   ├── navigation/AppNavigator.js  # Navigation tabs + stacks
│   ├── data/fiches.js              # Tout le contenu juridique (30+ fiches)
│   └── screens/
│       ├── HomeScreen.js           # Accueil avec accès rapide
│       ├── FichesScreen.js         # Bibliothèque des modules
│       ├── ModuleScreen.js         # Liste des fiches d'un module
│       ├── FicheDetailScreen.js    # Fiche pédagogique complète
│       ├── SimulateurScreen.js     # Calculateur de droits interactif
│       ├── SearchScreen.js         # Recherche dans toutes les fiches
│       └── ProfilScreen.js         # Profil, Pro, informations
```

---

## Pour mettre à jour les fiches

Toute la base de données des fiches est dans **`src/data/fiches.js`**.

Pour modifier ou ajouter une fiche :
1. Ouvrir `src/data/fiches.js`
2. Trouver le module concerné dans `MODULES`
3. Modifier le contenu de la fiche (titre, résumé, droits, étapes, pièges, sources)
4. Tester avec `npm start`
5. Recompiler avec `eas build` et publier une mise à jour

---

## Prochaines étapes recommandées

1. **Intégrer RevenueCat** pour la gestion des abonnements Pro
2. **Ajouter les notifications** (Expo Notifications) pour les alertes réglementaires
3. **Firebase Analytics** pour comprendre quelles fiches sont les plus consultées
4. **Compléter le module Retraite** (Pro) avec les simulateurs CNRACL/SRE

---

## Support

Pour toute question technique, ouvrir une issue ou me contacter.
