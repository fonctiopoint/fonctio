// src/utils/partageFiche.js
// Construction du texte partagé d'une fiche. Extrait de FicheDetailScreen pour
// que la présentation « Registre » et la présentation historique partagent le
// même texte : deux copies auraient divergé à la première correction.
import { Share } from 'react-native';

export const VERSANT_LABELS = { fpe: 'État (FPE)', fpt: 'Territoriale (FPT)', fph: 'Hospitalière (FPH)' };

export const texteDePartage = (fiche, versant) => {
  // Le texte partagé doit refléter le MÊME versant que l'écran : sans ce filtre,
  // un agent hospitalier partagerait les règles FPT et FPE mélangées aux siennes.
  const pourCeVersant = (arr) =>
    (arr || []).filter(x => !x || typeof x !== 'object' || !x.versants || x.versants.includes(versant));
  // Les pièges sont soit une chaîne, soit { texte, versants } — normaliser avant affichage,
  // sinon l'interpolation produit "[object Object]".
  const texteDuPiege = (p) => (typeof p === 'object' && p !== null ? p.texte : p);

  const lines = [];
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`FONCTIO. — Fiche pratique`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);
  lines.push(`📋 ${fiche.titre}`);
  lines.push(`📁 ${fiche.categorie}`);
  lines.push(``);

  if (fiche.chips?.length) {
    lines.push(`🏷️  ${fiche.chips.join(' · ')}`);
    lines.push(``);
  }

  lines.push(`EN RÉSUMÉ`);
  lines.push(`─────────`);
  lines.push(fiche.resume);
  lines.push(``);

  if (fiche.ciblePublic) {
    lines.push(`👥 Concerne : ${fiche.ciblePublic}`);
    lines.push(``);
  }

  // Rappeler le versant : le contenu ci-dessous en dépend.
  lines.push(`🏛️  Versant : FP ${VERSANT_LABELS[versant] || versant}`);
  lines.push(``);

  const versantNoteShare = fiche.versantNotes?.[versant];
  if (versantNoteShare) {
    lines.push(`POUR VOTRE VERSANT`);
    lines.push(`──────────────────`);
    lines.push(versantNoteShare);
    lines.push(``);
  }

  const droitsShare = pourCeVersant(fiche.droits);
  if (droitsShare.length) {
    lines.push(`DROITS & DURÉES`);
    lines.push(`───────────────`);
    droitsShare.forEach(d => {
      lines.push(`• ${d.label} : ${d.valeur}`);
      if (d.detail) lines.push(`  ${d.detail}`);
    });
    lines.push(``);
  }

  const etapesShare = pourCeVersant(fiche.etapes);
  if (etapesShare.length) {
    lines.push(`LES ÉTAPES`);
    lines.push(`──────────`);
    etapesShare.forEach((e, i) => {
      // Renuméroter : les étapes déclinées par versant laissent des trous dans e.num.
      lines.push(`${i + 1}. ${e.titre}`);
      lines.push(`   ${e.texte}`);
    });
    lines.push(``);
  }

  const piegesShare = pourCeVersant(fiche.pieges);
  if (piegesShare.length) {
    lines.push(`⚠️  POINTS D'ATTENTION`);
    lines.push(`─────────────────────`);
    piegesShare.forEach(p => lines.push(`→ ${texteDuPiege(p)}`));
    lines.push(``);
  }

  if (fiche.recours) {
    lines.push(`EN CAS DE REFUS`);
    lines.push(`───────────────`);
    lines.push(fiche.recours);
    lines.push(``);
  }

  if (fiche.sources?.length) {
    lines.push(`SOURCES JURIDIQUES`);
    lines.push(`──────────────────`);
    fiche.sources.forEach(s => lines.push(`§ ${s.texte}`));
    lines.push(``);
  }

  lines.push(`─────────────────────────`);
  lines.push(`Fonctio. — Application informative.`);
  lines.push(`Cette fiche ne remplace pas un conseil juridique.`);
  lines.push(`Rapprochez-vous de votre assistant de service social du personnel.`);

  return lines.join('\n');
};

export const partagerFiche = async (fiche, versant) => {
  await Share.share({
    message: texteDePartage(fiche, versant),
    title: fiche.titre,
  });
};
