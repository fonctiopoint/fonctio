// src/utils/lienFiche.js
// Ouvrir une fiche depuis n'importe quel écran, avec son module et son rang.
//
// L'écran de fiche attend `moduleTitle`, `ficheIndex` et `ficheTotal` pour
// afficher son bandeau de module et son « 05 / 06 ». Une navigation qui les
// oublie produit une fiche sans bandeau et sans compteur — d'où ce calcul
// centralisé plutôt que des paramètres recopiés à la main d'un écran à l'autre.
//
// Volontairement ici et non dans src/data/fiches.js : ce fichier-là est sous
// empreinte SHA-256 pour suivi_fiches.py, qui repère les fiches modifiées
// depuis le tournage d'un épisode. On ne l'ouvre que pour du contenu.
import { MODULES } from '../data/fiches';

// La fiche de l'assistant de service social du personnel. C'est la porte de
// sortie de toute l'application : chaque encart « Se faire accompagner » y
// renvoie, parce qu'aucune fiche ne remplace un entretien.
export const FICHE_ASS = 'role-ass';

export const paramsDeLaFiche = (ficheId) => {
  for (const module of MODULES) {
    const i = module.fiches ? module.fiches.findIndex(f => f.id === ficheId) : -1;
    if (i >= 0) {
      return {
        ficheId,
        moduleId: module.id,
        ficheIndex: i,
        ficheTotal: module.fiches.length,
        moduleTitle: module.title,
      };
    }
  }
  return null;
};
