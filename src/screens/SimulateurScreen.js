// src/screens/SimulateurScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, TextInput, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { useRegistre, FILET } from '../theme/registreStyles';
import { Fil, TeteDePage, Section, BlocFilet, Paragraphe, Action } from '../components/registre';
import { SERIF, MONO, MONO_LEGER, T, V } from '../theme/registre';

// ── Durées maximales réglementaires par régime ─────────────────────────────
// Sources référencées dans les commentaires de chaque cas
const MAX_MOIS = {
  cmo: 12,      // Art. L.822-1 à L.822-5 CGFP : 3 mois à 90 % + 9 mois à 50 %
  clm: 36,      // Art. L.822-6 et suivants CGFP : 3 ans
  cld: 60,      // Art. L.822-6 à L.822-11 CGFP : 5 ans par groupe d'affections
                // (8 ans si l'affection est imputable au service — non modélisé,
                //  cela supposerait une question de plus dans le parcours)
  citis: 36,    // Art. L.822-18 CGFP : illimité — on affiche 36 mois par défaut
  tpt: 12,      // Art. L.823-5 CGFP : 1 an max par autorisation, renouvelable
                // après 1 an d'activité, sans limite de nombre ni d'affection
  cmo_c: 12,    // Décret 86-83 art. 12 (FPE) · 88-145 art. 7 (FPT) · 91-155 art. 10 (FPH)
  cgm: 36,      // Décret 86-83 art. 13 (FPE) · 88-145 art. 8 (FPT) · 91-155 art. 11 (FPH)
  at_c: 12,     // Maintien employeur de 1 à 3 mois selon l'ancienneté, puis IJ
                // seules : on projette 12 mois pour rendre la bascule visible
};

const MOIS_LABELS = ['Jan.','Fév.','Mar.','Avr.','Mai','Jun.','Jul.','Aoû.','Sep.','Oct.','Nov.','Déc.'];

const STATUTS = [
  { id: 'titulaire', label: 'Fonctionnaire titulaire' },
  { id: 'contractuel', label: 'Agent contractuel' },
];
const VERSANTS = [
  { id: 'fpe', label: 'État (FPE)' },
  { id: 'fpt', label: 'Territoriale (FPT)' },
  { id: 'fph', label: 'Hospitalière (FPH)' },
];
const REGIMES_TITULAIRE = [
  { id: 'cmo',   label: 'CMO — Congé maladie ordinaire',     ficheId: 'cmo',         maxLabel: '12 mois' },
  { id: 'clm',   label: 'CLM — Congé de longue maladie',     ficheId: 'clm',         maxLabel: '3 ans' },
  { id: 'cld',   label: 'CLD — Congé de longue durée',       ficheId: 'cld',         maxLabel: '5 ans' },
  { id: 'citis', label: 'CITIS — Accident de service',       ficheId: 'at-service',  maxLabel: 'Illimité' },
  { id: 'tpt',   label: 'TPT — Temps partiel thérapeutique', ficheId: 'tpt',         maxLabel: '1 an / autorisation' },
];
const REGIMES_CONTRACTUEL = [
  { id: 'cmo_c', label: 'CMO — Congé maladie ordinaire', ficheId: 'cmo-contractuels', maxLabel: '12 mois' },
  { id: 'cgm',   label: 'CGM — Congé grave maladie',     ficheId: 'cgm',              maxLabel: '3 ans' },
  { id: 'at_c',  label: 'AT — Accident du travail',      ficheId: 'at-contractuels',  maxLabel: '24 mois' },
];
// Régime progressif des contractuels — s'applique à la FPT (Décret 88-145 art. 7)
// ET à la FPH (Décret 91-155 art. 10), qui prévoient les mêmes seuils.
const ANCIENNETES_PROGRESSIF = [
  { id: 'moins4mois', label: '< 4 mois', plein: 0, demi: 0 },
  { id: '4mois',      label: '4 mois – 2 ans', plein: 1, demi: 1 },
  { id: '2ans',       label: '2 – 3 ans', plein: 2, demi: 2 },
  { id: '3ans',       label: '≥ 3 ans', plein: 3, demi: 3 },
];

// Accident du travail des contractuels : l'employeur porte les IJ au niveau du
// plein traitement pendant une durée qui dépend de l'ancienneté — ce n'est PAS
// un plein traitement illimité. Les seuils diffèrent selon le versant :
//  · FPE — Décret 86-83 art. 14 : 1 mois dès l'entrée, 2 mois après DEUX ans,
//    3 mois après trois ans.
//  · FPT — Décret 88-145 art. 9 : 1 mois dès l'entrée, 2 mois après UN an,
//    3 mois après trois ans.
//  · FPH — Décret 91-155 art. 12 : mêmes seuils que la FPT.
// La territoriale s'aligne donc sur l'hospitalière, pas sur l'État : un
// contractuel territorial avec 18 mois d'ancienneté a droit à 2 mois, là où
// son homologue de l'État n'en a qu'un.
const AT_PALIERS_ETAT = [
  { id: 'moins2ans', label: 'Moins de 2 ans', plein: 1 },
  { id: '2a3ans',    label: '2 à 3 ans',      plein: 2 },
  { id: 'plus3ans',  label: '3 ans et plus',  plein: 3 },
];
const AT_PALIERS_1AN = [
  { id: 'moins1an',  label: "Moins d'un an",  plein: 1 },
  { id: '1a3ans',    label: '1 à 3 ans',      plein: 2 },
  { id: 'plus3ans',  label: '3 ans et plus',  plein: 3 },
];
const ANCIENNETES_AT = {
  fpe: AT_PALIERS_ETAT,
  fpt: AT_PALIERS_1AN,
  fph: AT_PALIERS_1AN,
};

// ── Estimation du net ───────────────────────────────────────────────────────
// Ordre de grandeur, pas un calcul de paie. Trois prélèvements structurants :
//  · retenue pour pension civile / CNRACL : 11,10 % du seul traitement indiciaire
//  · CSG (9,20 %) + CRDS (0,50 %) : 9,70 % sur 98,25 % du brut total
//  · RAFP : 5 % des primes, dans la limite de 20 % du traitement indiciaire
// Volontairement exclus : mutuelle, prélèvement à la source, cotisations
// spécifiques à certains corps. Le ratio obtenu tombe autour de 78-85 % du
// brut, ce qui correspond aux ordres de grandeur observés dans la FP.
const TAUX_PENSION = 0.1110;
const TAUX_CSG_CRDS = 0.0970;
const ASSIETTE_CSG = 0.9825;
const TAUX_RAFP = 0.05;
const PLAFOND_RAFP = 0.20;

function detailNet(traitementBrut, primesBrut) {
  const t = Math.max(0, traitementBrut || 0);
  const p = Math.max(0, primesBrut || 0);
  if (t + p === 0) return { pension: 0, csgCrds: 0, rafp: 0, net: 0 };
  const pension = t * TAUX_PENSION;
  const csgCrds = (t + p) * ASSIETTE_CSG * TAUX_CSG_CRDS;
  const rafp = Math.min(p, t * PLAFOND_RAFP) * TAUX_RAFP;
  return {
    pension: Math.round(pension),
    csgCrds: Math.round(csgCrds),
    rafp: Math.round(rafp),
    net: Math.max(0, Math.round(t + p - pension - csgCrds - rafp)),
  };
}
function estimerNet(t, p) { return detailNet(t, p).net; }

// ── Jour de carence ─────────────────────────────────────────────────────────
// Un jour non rémunéré au début de chaque congé de maladie ordinaire, pour les
// titulaires comme pour les contractuels (art. 115 de la loi de finances 2018).
// Il ne s'applique PAS au CLM, au CLD, au CGM, au CITIS et aux accidents du
// travail, ni aux congés liés à la maternité.
// Deux exceptions à connaître, non modélisées car elles dépendent de
// l'historique de l'agent : en affection de longue durée, la carence n'est
// retenue qu'une fois par période de trois ans ; et elle ne s'applique pas au
// second arrêt lorsque la reprise entre deux congés de même cause n'a pas
// dépassé 48 heures.
const REGIMES_AVEC_CARENCE = ['cmo', 'cmo_c'];

// ── Indemnités journalières de la sécurité sociale ──────────────────────────
// Réservées aux agents CONTRACTUELS : les titulaires relèvent d'un régime
// spécial et ne perçoivent pas d'IJ — quand leurs droits statutaires sont
// épuisés, ils basculent en disponibilité d'office, sans traitement.
//  · Maladie : 50 % du salaire journalier de base. Le salaire de base est la
//    somme des trois derniers bruts divisée par 91,25, et il est plafonné à
//    1,4 SMIC depuis le 1er avril 2025 (c'était 1,8 SMIC avant).
//  · Accident du travail : 60 % du salaire journalier pendant 28 jours, puis
//    80 % à partir du 29e.
const SMIC_MENSUEL = 1867.02;      // au 1er juin 2026
const PLAFOND_IJ_MALADIE = 1.4;    // en nombre de SMIC mensuels
const TAUX_IJ_MALADIE = 0.50;
const TAUX_IJ_AT_DEBUT = 0.60;
const TAUX_IJ_AT_APRES = 0.80;
const JOURS_MOIS = 30;

function estimerIJ({ regime, brutMensuelHabituel, moisDArret }) {
  const brut = Math.max(0, brutMensuelHabituel || 0);
  if (brut === 0) return 0;
  if (regime === 'at_c') {
    const sjb = brut / 30.42;
    const taux = moisDArret === 1 ? TAUX_IJ_AT_DEBUT : TAUX_IJ_AT_APRES;
    return Math.round(sjb * taux * JOURS_MOIS);
  }
  const basePlafonnee = Math.min(brut, SMIC_MENSUEL * PLAFOND_IJ_MALADIE);
  const sjb = (basePlafonnee * 3) / 91.25;
  return Math.round(sjb * TAUX_IJ_MALADIE * JOURS_MOIS);
}

// Nombre de mois pendant lesquels l'employeur verse encore quelque chose —
// sert à savoir depuis combien de temps l'agent est aux seules IJ, le taux de
// l'IJ accident du travail passant de 60 à 80 % après 28 jours.
function moisMaintenus(regime, versant, anciennete) {
  if (regime === 'at_c') {
    const a = (ANCIENNETES_AT[versant] || ANCIENNETES_AT.fpe).find(x => x.id === anciennete);
    return a ? a.plein : 1;
  }
  if (regime === 'cmo_c') {
    if (versant === 'fpe') return 12;
    const a = ANCIENNETES_PROGRESSIF.find(x => x.id === anciennete);
    return a ? a.plein + a.demi : 0;
  }
  return 0;
}

// ── Moteur de calcul ────────────────────────────────────────────────────────
// Retourne un tableau de { mois (1-N), total, traitMaintenu, primesMaintenues, label, couleur, pct }
function calculerProjection({ statut, versant, traitement, primes, quotite, regime, anciennete, nbMois }) {
  const t = parseFloat(traitement) || 0;
  const p = parseFloat(primes) || 0;
  const q = (parseFloat(quotite) || 100) / 100;
  const tBase = t * q;
  const pBase = p * q;
  const result = [];

  for (let i = 1; i <= nbMois; i++) {
    let traitMaintenu = 0, primesMaintenues = 0, label = '', couleur = Colors.terracotta;

    if (statut === 'titulaire') {
      switch (regime) {
        case 'cmo':
          // Traitement : 90 % puis 50 % dans les 3 versants (Loi 2025-127 + Décret 2025-197).
          // Primes : seul l'État les aligne automatiquement sur le traitement
          // (Décret 2010-997). En FPT elles dépendent d'une délibération, en FPH
          // chaque prime suit son propre texte — on retient 0 € par prudence et
          // un encart l'explique sous le graphique.
          if (i <= 3)  { traitMaintenu = tBase * 0.9; primesMaintenues = (versant === 'fpe' ? pBase * 0.9 : 0); label = versant === 'fpe' ? '90 % + 90 % primes' : '90 % du traitement'; couleur = Colors.terracotta; }
          else         { traitMaintenu = tBase * 0.5; primesMaintenues = (versant === 'fpe' ? pBase * 0.5 : 0); label = versant === 'fpe' ? '50 % + 50 % primes' : '50 % du traitement'; couleur = Colors.amber; }
          break;
        case 'clm':
          // FPE : Décret 2024-641 — an 1 : 100 % + 33 % de primes, ans 2-3 : 60 % + 60 %.
          // FPT (Décret 87-602) et FPH (Décret 88-386) : régime inchangé, soit
          // plein traitement 1 an puis DEMI-traitement (50 %) — le relèvement à
          // 60 % ne vise que l'État.
          if (i <= 12) {
            traitMaintenu = tBase;
            primesMaintenues = versant === 'fpe' ? pBase * 0.33 : 0;
            label = versant === 'fpe' ? '100 % + 33 % primes' : '100 %';
            couleur = Colors.sky;
          } else if (versant === 'fpe') {
            traitMaintenu = tBase * 0.6; primesMaintenues = pBase * 0.60; label = '60 % + 60 % primes'; couleur = Colors.amber;
          } else {
            traitMaintenu = tBase * 0.5; primesMaintenues = 0; label = '50 % (demi-traitement)'; couleur = Colors.amber;
          }
          break;
        case 'cld':
          // Art. L.822-6 à L.822-11 CGFP — 3 ans à plein traitement puis 2 ans à demi.
          // Primes : le Décret 2024-641 a ouvert le maintien partiel du régime indemnitaire
          // en CLM et CGM UNIQUEMENT. En CLD, les primes restent suspendues dans les 3 versants.
          if (i <= 36) { traitMaintenu = tBase;        primesMaintenues = 0; label = '100 % · primes suspendues'; couleur = Colors.sky; }
          else         { traitMaintenu = tBase * 0.5;  primesMaintenues = 0; label = '50 % · primes suspendues'; couleur = Colors.amber; }
          break;
        case 'citis':
          // Art. L.822-18 CGFP : plein traitement + toutes primes, illimité
          traitMaintenu = tBase; primesMaintenues = pBase; label = '100 % + primes'; couleur = Colors.olive;
          break;
        case 'tpt':
          // Art. 34-4° bis Loi 84-16 : plein traitement maintenu
          traitMaintenu = tBase; primesMaintenues = pBase; label = 'Plein traitement'; couleur = Colors.olive;
          break;
        default:
          traitMaintenu = tBase; primesMaintenues = pBase; label = '100 %';
      }
    } else {
      switch (regime) {
        case 'cmo_c':
          // FPE : Décret 2024-641 (depuis 01/09/2024) — aligné sur les titulaires.
          // FPT (Décret 88-145 art. 7) ET FPH (Décret 91-155 art. 10) : régime progressif
          // selon l'ancienneté, INCHANGÉ. Le Décret 2024-641 vise les seuls agents
          // contractuels « de l'État » — ne pas y ranger la FPH.
          if (versant === 'fpe') {
            if (i <= 3)  { traitMaintenu = tBase * 0.9; primesMaintenues = pBase * 0.9; label = '90 %'; couleur = Colors.terracotta; }
            else         { traitMaintenu = tBase * 0.5; primesMaintenues = pBase * 0.5; label = '50 %'; couleur = Colors.amber; }
          } else {
            const anc = ANCIENNETES_PROGRESSIF.find(a => a.id === anciennete) || { plein: 0, demi: 0 };
            if (i <= anc.plein)                  { traitMaintenu = tBase * 0.9; primesMaintenues = pBase * 0.9; label = '90 %'; couleur = Colors.terracotta; }
            else if (i <= anc.plein + anc.demi)  { traitMaintenu = tBase * 0.5; primesMaintenues = pBase * 0.5; label = '50 %'; couleur = Colors.amber; }
            else                                 { traitMaintenu = 0; primesMaintenues = 0; label = 'IJ CPAM'; couleur = Colors.slateLight; }
          }
          break;
        case 'cgm':
          // Décret 86-83 art.13 (FPE) + Décret 88-145 art.8 (FPT) + Décret 2024-641
          if (i <= 12) { traitMaintenu = tBase;        primesMaintenues = versant === 'fpe' ? pBase * 0.33 : 0; label = versant === 'fpe' ? '100 % + 33 % primes' : '100 %'; couleur = Colors.sky; }
          else if (versant === 'fpe') { traitMaintenu = tBase * 0.6; primesMaintenues = pBase * 0.6; label = '60 % + 60 % primes'; couleur = Colors.amber; }
          else         { traitMaintenu = tBase * 0.5;  primesMaintenues = 0; label = '50 %'; couleur = Colors.amber; }
          break;
        case 'at_c': {
          // L'employeur complète les IJ jusqu'au plein traitement pendant 1 à
          // 3 mois selon l'ancienneté, puis l'agent ne perçoit plus que les IJ
          // de la sécurité sociale — qui ne sont pas modélisées ici.
          const ancAt = (ANCIENNETES_AT[versant] || ANCIENNETES_AT.fpe).find(a => a.id === anciennete) || { plein: 1 };
          if (i <= ancAt.plein) { traitMaintenu = tBase; primesMaintenues = pBase; label = 'Plein traitement'; couleur = Colors.olive; }
          else                  { traitMaintenu = 0; primesMaintenues = 0; label = 'IJ sécurité sociale'; couleur = Colors.slateLight; }
          break;
        }
        default:
          traitMaintenu = tBase; primesMaintenues = pBase; label = '100 %';
      }
    }

    // Jour de carence : un jour retiré sur le premier mois du congé, et
    // seulement pour les régimes concernés.
    let carence = 0;
    if (i === 1 && REGIMES_AVEC_CARENCE.includes(regime)) {
      carence = Math.round((traitMaintenu + primesMaintenues) / JOURS_MOIS);
      const retire = Math.min(carence, traitMaintenu + primesMaintenues);
      if (traitMaintenu >= retire) traitMaintenu -= retire;
      else { primesMaintenues -= (retire - traitMaintenu); traitMaintenu = 0; }
      carence = retire;
    }

    // Indemnités journalières : uniquement les contractuels, et uniquement
    // quand l'employeur ne verse plus rien.
    let ij = 0;
    if (statut === 'contractuel' && traitMaintenu + primesMaintenues === 0) {
      const moisDepuisFinMaintien = i - moisMaintenus(regime, versant, anciennete);
      ij = estimerIJ({ regime, brutMensuelHabituel: tBase + pBase, moisDArret: moisDepuisFinMaintien });
      label = regime === 'at_c' ? 'IJ accident du travail' : 'IJ maladie';
    }

    const brutEmployeur = Math.round(traitMaintenu + primesMaintenues);
    const total = brutEmployeur + ij;
    const totalBase = Math.round(tBase + pBase);
    const pct = totalBase > 0 ? Math.round((total / totalBase) * 100) : 0;
    // Les IJ ne supportent ni retenue pour pension ni RAFP : on n'applique le
    // calcul de net qu'à ce que verse l'employeur, et on ajoute les IJ telles
    // quelles (elles sont soumises à CSG/CRDS à taux réduit, non modélisé).
    const d = detailNet(traitMaintenu, primesMaintenues);
    const net = d.net + ij;
    result.push({
      mois: i, total, net, ij, carence,
      traitMaintenu: Math.round(traitMaintenu),
      primesMaintenues: Math.round(primesMaintenues),
      retenues: d, label, couleur, pct,
    });
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// LA VUE
//
// Tout ce qui précède est le moteur de calcul et n'a pas bougé. Ci-dessous, la
// présentation, refaite dans la direction « Registre » le 04/09/2026.
//
// Le parcours se lit comme une fiche : des sections en bandes, des lignes à
// filet, aucune carte. Les trois chiffres du résultat reprennent exactement la
// bande de synthèse des fiches — c'est le même objet, il dit la même chose.
// ─────────────────────────────────────────────────────────────────────────────

const ETAPES = ['Statut', 'Versant', 'Rémunération', 'Régime'];

// ── Sélecteur de date mois/année ────────────────────────────────────────────
function SelecteurDeDate({ ui, valeur, onChange }) {
  const { s, t, th, C } = ui;
  const [ouvert, setOuvert] = useState(false);
  const annee = new Date().getFullYear();
  const annees = [annee - 1, annee, annee + 1];

  return (
    <>
      <TouchableOpacity style={s.champDate} onPress={() => setOuvert(true)} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={17} color={th.textMuted} />
        <Text style={[s.champDateTexte, { fontSize: t(T.label) }, !valeur && { color: th.textMuted }]}>
          {valeur ? `${MOIS_LABELS[valeur.mois - 1]} ${valeur.annee}` : 'Choisir un mois de début'}
        </Text>
        <Ionicons name="chevron-down" size={15} color={th.textMuted} />
      </TouchableOpacity>

      <Modal visible={ouvert} transparent animationType="fade" onRequestClose={() => setOuvert(false)}>
        <TouchableOpacity style={s.voile} activeOpacity={1} onPress={() => setOuvert(false)}>
          <View style={s.feuille}>
            <Text style={[s.feuilleTitre, { fontSize: t(T.section), lineHeight: t(T.section) * 1.25 }]}>
              Début de l'arrêt
            </Text>
            {annees.map(a => (
              <View key={a}>
                <Text style={[s.feuilleAnnee, { fontSize: t(T.num) }]}>{a}</Text>
                <View style={s.grilleMois}>
                  {MOIS_LABELS.map((ml, idx) => {
                    const actif = valeur?.annee === a && valeur?.mois === idx + 1;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[s.caseMois, actif && { backgroundColor: C.valeur, borderColor: C.valeur }]}
                        onPress={() => { onChange({ mois: idx + 1, annee: a }); setOuvert(false); }}
                        activeOpacity={0.75}
                      >
                        <Text style={[s.caseMoisTexte, { fontSize: t(T.valeur) }, actif && { color: th.bgCard }]}>
                          {ml}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ── Une option de parcours ──────────────────────────────────────────────────
const Option = ({ ui, label, sub, droite, actif, onPress, derniere }) => {
  const { s, t, inter, th, C } = ui;
  return (
    <TouchableOpacity
      style={[s.option, derniere && s.ligneSansFilet]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={s.optionTexte}>
        <View style={s.optionHaut}>
          <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{label}</Text>
          {!!droite && <Text style={[s.valeur, { color: C.valeur, fontSize: t(T.valeur) }]}>{droite}</Text>}
        </View>
        {!!sub && (
          <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>{sub}</Text>
        )}
      </View>
      <View style={[s.coche, actif && { backgroundColor: C.valeur, borderColor: C.valeur }]}>
        {actif && <Ionicons name="checkmark" size={13} color={th.bgCard} />}
      </View>
    </TouchableOpacity>
  );
};

// ── Un champ chiffré ────────────────────────────────────────────────────────
const Champ = ({ ui, label, valeur, onChange, exemple, suffixe }) => {
  const { s, t, th } = ui;
  return (
    <View style={s.champ}>
      <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>{label}</Text>
      <View style={s.champDroite}>
        <TextInput
          style={[s.champSaisie, { fontSize: t(T.valeur) }]}
          value={valeur}
          onChangeText={onChange}
          placeholder={exemple}
          placeholderTextColor={th.textMuted}
          keyboardType="numeric"
        />
        {!!suffixe && <Text style={[s.champSuffixe, { fontSize: t(T.num) }]}>{suffixe}</Text>}
      </View>
    </View>
  );
};

// ── Graphique en barres ─────────────────────────────────────────────────────
const Graphique = ({ ui, data, maxVal, dateDebut, mode, selection, onSelect }) => {
  const { s, t, th } = ui;
  const valeur = (d) => (mode === 'net' ? d.net : d.total);
  const max = maxVal || Math.max(...data.map(valeur), 1);
  const visible = data.slice(0, 24);

  const etiquette = (idx) => {
    if (!dateDebut) return `M${idx + 1}`;
    const m = dateDebut.mois - 1 + idx;
    return `${MOIS_LABELS[m % 12].slice(0, 3)}\n${String(dateDebut.annee + Math.floor(m / 12)).slice(2)}`;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[s.graphique, { width: Math.max(visible.length * 40, 300) }]}>
        {visible.map((d, i) => {
          const v = valeur(d);
          const actif = selection === i;
          return (
            <TouchableOpacity
              key={i}
              style={s.barre}
              onPress={() => onSelect(i)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Mois ${d.mois}, ${v} euros ${mode === 'net' ? 'net' : 'brut'}`}
            >
              <Text style={[s.barreVal, { fontSize: t(T.num) }, actif && { color: th.textPrimary }]}>
                {v > 0 ? `${Math.round(v / 100) * 100}` : '—'}
              </Text>
              <View style={s.barreFond}>
                <View style={[s.barreRemplie, {
                  height: `${Math.max((v / max) * 100, v > 0 ? 4 : 0)}%`,
                  backgroundColor: d.couleur,
                  opacity: actif || selection === null ? 1 : 0.4,
                }]} />
              </View>
              <Text style={[s.barreMois, { fontSize: t(T.num) }, actif && { color: th.textPrimary }]}>
                {etiquette(i)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

// ── Calcul date de fin ──────────────────────────────────────────────────────
function getDateFin(dateDebut, nbMois) {
  if (!dateDebut) return null;
  const m = dateDebut.mois - 1 + nbMois - 1;
  return `${MOIS_LABELS[m % 12]} ${dateDebut.annee + Math.floor(m / 12)}`;
}

// ── Écran principal ─────────────────────────────────────────────────────────
export default function SimulateurScreen({ navigation }) {
  const ui0 = useRegistre();
  const [statut, setStatut] = useState(null);
  const [versant, setVersant] = useState(null);
  const [regime, setRegime] = useState(null);
  const [traitement, setTraitement] = useState('');
  const [primes, setPrimes] = useState('');
  const [quotite, setQuotite] = useState('100');
  const [anciennete, setAnciennete] = useState(null);
  const [dateDebut, setDateDebut] = useState(null);
  // Mois dont on affiche le détail — null = le dernier, c'est-à-dire le plus
  // défavorable, qui est ce qu'on veut voir en premier.
  const [moisSelectionne, setMoisSelectionne] = useState(null);
  const [modeMontant, setModeMontant] = useState('brut');

  const etape = !statut ? 1 : !versant ? 2 : !traitement ? 3 : 4;
  const regimes = statut === 'titulaire' ? REGIMES_TITULAIRE : REGIMES_CONTRACTUEL;
  // FPT et FPH partagent le régime progressif : l'ancienneté conditionne le calcul
  // dans les deux versants (Décret 88-145 art. 7 / Décret 91-155 art. 10).
  const ancienneteCmo = statut === 'contractuel' && (versant === 'fpt' || versant === 'fph') && regime === 'cmo_c';
  // L'accident du travail des contractuels dépend aussi de l'ancienneté, dans
  // les trois versants — mais avec des paliers différents de ceux du CMO.
  const ancienneteAt = statut === 'contractuel' && regime === 'at_c';
  const ancienneteRequise = ancienneteCmo || ancienneteAt;
  const ficheId = regimes.find(r => r.id === regime)?.ficheId;
  const nbMoisMax = regime ? (MAX_MOIS[regime] || 12) : 12;
  const calculable = statut && versant && regime && parseFloat(traitement) > 0 && (!ancienneteRequise || anciennete);

  const projection = useMemo(() => {
    if (!calculable) return null;
    return calculerProjection({ statut, versant, traitement, primes, quotite, regime, anciennete, nbMois: nbMoisMax });
  }, [statut, versant, regime, traitement, primes, quotite, anciennete, calculable, nbMoisMax]);

  const { th, t, inter, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  const tq = (parseFloat(traitement) || 0) * ((parseFloat(quotite) || 100) / 100);
  const pq = (parseFloat(primes) || 0) * ((parseFloat(quotite) || 100) / 100);
  const baseTotal = Math.round(tq + pq);
  const baseNet = estimerNet(tq, pq);
  const dateFin = getDateFin(dateDebut, nbMoisMax);
  const perteTotal = projection ? projection.reduce((acc, m) => acc + (baseTotal - m.total), 0) : 0;
  const perteNette = projection ? projection.reduce((acc, m) => acc + (baseNet - m.net), 0) : 0;
  // Espace INSÉCABLE avant l'euro : dans la bande de synthèse, « -12 800 € »
  // se coupait après le nombre et le symbole tombait seul à la ligne.
  const euros = (n) => `${Math.round(n).toLocaleString('fr-FR')}\u00a0€`;

  // Le numéro d'une section : les étapes d'ancienneté et de date n'existent pas
  // toujours, et une numérotation figée aurait sauté des chiffres.
  let rang = 0;
  const numero = () => { rang += 1; return `0${rang}`; };

  const section = (titre) => (
    <View style={rang === 0 ? s.premiereSection : s.avantSection}>
      <Section ui={ui} titre={titre} compte={numero()} />
    </View>
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <Fil
        ui={ui}
        titre={projection ? 'Projection prête' : `Étape ${etape} sur ${ETAPES.length} — ${ETAPES[etape - 1]}`}
      />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContenu}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TeteDePage
          ui={ui}
          titre="Simulateur"
          lede="Ce que vous percevrez, mois par mois, sur toute la durée de l'arrêt."
        />

        {section('Votre statut')}
        {STATUTS.map((o, i) => (
          <Option key={o.id} ui={ui} label={o.label} actif={statut === o.id}
            derniere={i === STATUTS.length - 1}
            onPress={() => { setStatut(o.id); setRegime(null); setAnciennete(null); }} />
        ))}

        {!!statut && (
          <>
            {section('Votre versant')}
            {VERSANTS.map((o, i) => (
              <Option key={o.id} ui={ui} label={o.label} actif={versant === o.id}
                derniere={i === VERSANTS.length - 1}
                onPress={() => { setVersant(o.id); setRegime(null); setAnciennete(null); setMoisSelectionne(null); }} />
            ))}
          </>
        )}

        {!!versant && (
          <>
            {section('Votre rémunération brute')}
            <Champ ui={ui} label="Traitement indiciaire" valeur={traitement} onChange={setTraitement}
              exemple="2 200" suffixe="€ / mois" />
            <Champ ui={ui} label="Primes et indemnités" valeur={primes} onChange={setPrimes}
              exemple="450" suffixe="€ / mois" />
            <Champ ui={ui} label="Quotité de travail" valeur={quotite} onChange={setQuotite}
              exemple="100" suffixe="%" />
            <Paragraphe ui={ui} style={s.aide}>
              Le traitement brut est la ligne « Traitement » de votre fiche de paie. N'y
              ajoutez ni le supplément familial ni l'indemnité de résidence : ils restent
              versés en entier.
            </Paragraphe>
            <Paragraphe ui={ui} style={s.aideSuivante}>
              La quotité est votre temps de travail habituel, avant l'arrêt. Pour un temps
              partiel thérapeutique, indiquez bien cette quotité habituelle : le TPT
              maintient l'intégralité du traitement, quelle que soit la quotité travaillée
              pendant la reprise.
            </Paragraphe>
          </>
        )}

        {!!versant && parseFloat(traitement) > 0 && (
          <>
            {section("Le régime de l'arrêt")}
            {regimes.map((r, i) => (
              <Option key={r.id} ui={ui} label={r.label} droite={r.maxLabel} actif={regime === r.id}
                derniere={i === regimes.length - 1}
                onPress={() => { setRegime(r.id); setAnciennete(null); setMoisSelectionne(null); }} />
            ))}
          </>
        )}

        {ancienneteCmo && (
          <>
            {section(versant === 'fph' ? "Votre ancienneté dans l'établissement" : 'Votre ancienneté dans la collectivité')}
            {ANCIENNETES_PROGRESSIF.map((a, i) => (
              <Option key={a.id} ui={ui} label={a.label} actif={anciennete === a.id}
                derniere={i === ANCIENNETES_PROGRESSIF.length - 1}
                sub={a.plein === 0 ? 'Aucun maintien — indemnités journalières seules'
                  : `${a.plein} mois à 90 %, puis ${a.demi} mois à 50 %`}
                onPress={() => setAnciennete(a.id)} />
            ))}
          </>
        )}

        {ancienneteAt && (
          <>
            {section('Votre ancienneté chez cet employeur')}
            {(ANCIENNETES_AT[versant] || ANCIENNETES_AT.fpe).map((a, i, tab) => (
              <Option key={a.id} ui={ui} label={a.label} actif={anciennete === a.id}
                derniere={i === tab.length - 1}
                sub={`${a.plein} mois à plein traitement, puis indemnités journalières seules`}
                onPress={() => setAnciennete(a.id)} />
            ))}
          </>
        )}

        {calculable && (
          <>
            {section("Le début de l'arrêt")}
            <View style={s.zoneDate}>
              <SelecteurDeDate ui={ui} valeur={dateDebut} onChange={setDateDebut} />
              {dateDebut && dateFin ? (
                <View style={s.synthese}>
                  <View style={s.syntheseCase}>
                    <Text style={[s.syntheseN, { color: C.valeur, fontSize: t(T.chiffre) * 0.6 }]}>
                      {MOIS_LABELS[dateDebut.mois - 1]} {String(dateDebut.annee).slice(2)}
                    </Text>
                    <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>début</Text>
                  </View>
                  <View style={s.syntheseCase}>
                    <Text style={[s.syntheseN, { color: C.valeur, fontSize: t(T.chiffre) * 0.6 }]}>{dateFin}</Text>
                    <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>fin des droits</Text>
                  </View>
                  <View style={s.syntheseCase}>
                    <Text style={[s.syntheseN, { color: th.textPrimary, fontSize: t(T.chiffre) * 0.6 }]}>
                      {nbMoisMax} mois
                    </Text>
                    <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>au maximum</Text>
                  </View>
                </View>
              ) : (
                <Paragraphe ui={ui} style={s.aide}>
                  Facultatif. Sans date, la projection parle de M1, M2… ; avec une date, elle
                  nomme les mois réels.
                </Paragraphe>
              )}
            </View>
          </>
        )}

        {/* Ce que la projection ne peut pas savoir, régime par régime. */}
        {regime === 'cmo' && versant !== 'fpe' && (
          <BlocFilet ui={ui} couleur={C.versant} titre="Les primes ne sont pas comptées">
            <Paragraphe ui={ui}>
              {versant === 'fpt'
                ? "En FPT, le maintien des primes au prorata du traitement (90 % puis 50 %) suppose une délibération de la collectivité ; sans elle, elles peuvent être suspendues. Cette projection retient 0 € de primes : si la délibération existe, votre revenu réel sera supérieur. Source : CE n°462452 du 4 juillet 2024."
                : "En FPH, il n'existe pas de règle nationale alignant les primes sur le traitement comme à l'État. Chaque prime suit son propre texte, et la prime de service est réduite à proportion des jours d'absence. Cette projection retient 0 € de primes : demandez le détail à votre DRH."}
            </Paragraphe>
          </BlocFilet>
        )}

        {(regime === 'clm' || regime === 'cgm') && versant !== 'fpe' && (
          <BlocFilet ui={ui} couleur={C.versant} titre="Les primes ne sont pas comptées">
            <Paragraphe ui={ui}>
              {versant === 'fpt'
                ? "Le maintien partiel des primes (33 % puis 60 %) prévu par le Décret 2024-641 ne vaut que pour l'État. Il peut être transposé par délibération de la collectivité, sans pouvoir aller au-delà. Cette projection retient 0 € de primes : si une délibération existe, votre revenu réel sera supérieur."
                : "Le Décret 2024-641 ne s'applique pas à la fonction publique hospitalière, et aucun texte national n'organise le maintien des primes pendant ces congés. Cette projection retient donc 0 € de primes ; faites confirmer par écrit par votre DRH si votre établissement prévoit mieux."}
            </Paragraphe>
          </BlocFilet>
        )}

        {regime === 'cld' && (
          <BlocFilet ui={ui} couleur={C.versant} titre="Les primes sont suspendues">
            <Paragraphe ui={ui}>
              En CLD, le régime indemnitaire est suspendu dans les trois versants. Le Décret
              2024-641 a ouvert le maintien partiel des primes en CLM et CGM uniquement — il
              laisse le CLD en dehors du dispositif.
            </Paragraphe>
          </BlocFilet>
        )}

        {projection && (() => {
          const idx = Math.min(moisSelectionne ?? projection.length - 1, projection.length - 1);
          const m = projection[idx];
          const pire = m.total === Math.min(...projection.map(x => x.total));
          const nomDuMois = dateDebut
            ? `${MOIS_LABELS[(dateDebut.mois - 1 + idx) % 12]} ${dateDebut.annee + Math.floor((dateDebut.mois - 1 + idx) / 12)}`
            : `mois ${m.mois}`;
          const L = ({ label, val, negatif, fort }) => (
            <View style={[s.detailLigne, fort && s.detailLigneForte]}>
              <Text style={[s.detailLabel, { fontSize: t(T.detail) }, fort && s.detailFort]}>{label}</Text>
              <Text style={[
                s.detailVal,
                { fontSize: t(T.valeur) },
                negatif && { color: C.attention },
                fort && s.detailFort,
              ]}>
                {negatif ? '-' : ''}{euros(Math.abs(val))}
              </Text>
            </View>
          );

          return (
            <>
              {section('Ce que vous percevrez')}
              <View style={s.synthese}>
                <View style={s.syntheseCase}>
                  <Text style={[s.syntheseN, { color: th.textPrimary, fontSize: t(T.chiffre) * 0.68 }]}>
                    {euros(baseTotal)}
                  </Text>
                  <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>brut habituel</Text>
                </View>
                <View style={s.syntheseCase}>
                  <Text style={[s.syntheseN, { color: C.valeur, fontSize: t(T.chiffre) * 0.68 }]}>
                    {euros(projection[projection.length - 1].total)}
                  </Text>
                  <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>au plus bas</Text>
                </View>
                <View style={s.syntheseCase}>
                  <Text style={[s.syntheseN, { color: C.attention, fontSize: t(T.chiffre) * 0.68 }]}>
                    -{euros(perteTotal)}
                  </Text>
                  <Text style={[s.syntheseC, { fontSize: t(T.num) }]}>perdus en {nbMoisMax} mois</Text>
                </View>
              </View>
              <Paragraphe ui={ui} style={s.aide}>
                Soit environ {euros(baseNet)} net par mois d'ordinaire, {euros(projection[projection.length - 1].net)} net
                au plus bas, et {euros(perteNette)} net de manque à gagner sur toute la période.
              </Paragraphe>

              {section('Le détail du mois')}
              <View style={s.detailTete}>
                <Text style={[s.label, { fontSize: t(T.label), lineHeight: t(T.label) * 1.3 }]}>
                  {nomDuMois}
                </Text>
                {pire && (
                  <Text style={[s.badge, { color: C.attention, fontSize: t(T.num) }]}>le plus bas</Text>
                )}
              </View>
              <Paragraphe ui={ui} style={s.detailSous}>
                {m.label} · {m.pct} % de votre rémunération habituelle
              </Paragraphe>

              <View style={s.detailBloc}>
                {m.traitMaintenu > 0 && <L label="Traitement maintenu" val={m.traitMaintenu} />}
                {m.primesMaintenues > 0 && <L label="Primes maintenues" val={m.primesMaintenues} />}
                {m.ij > 0 && <L label={regime === 'at_c' ? 'Indemnités journalières AT' : 'Indemnités journalières maladie'} val={m.ij} />}
                {m.total === 0 && <L label="Aucun versement de l'employeur" val={0} />}
                <L label="Total brut" val={m.total} fort />
                {m.retenues.pension > 0 && <L label="Retenue pension (11,10 %)" val={m.retenues.pension} negatif />}
                {m.retenues.csgCrds > 0 && <L label="CSG et CRDS (9,70 %)" val={m.retenues.csgCrds} negatif />}
                {m.retenues.rafp > 0 && <L label="RAFP (5 % des primes)" val={m.retenues.rafp} negatif />}
                <L label="Net estimé" val={m.net} fort />
              </View>

              {m.carence > 0 && (
                <Paragraphe ui={ui} style={s.aide}>
                  Un jour de carence de {euros(m.carence)} a été retenu sur ce mois. Il ne
                  s'applique pas si vous êtes en affection de longue durée déjà décomptée
                  depuis moins de trois ans, ni si vous reprenez moins de 48 heures entre
                  deux arrêts de même cause.
                </Paragraphe>
              )}
              {m.ij > 0 && (
                <Paragraphe ui={ui} style={s.aideSuivante}>
                  Les indemnités journalières sont estimées à partir de votre brut habituel
                  {regime === 'at_c' ? ', à 60 % le premier mois puis 80 %' : ", à 50 % d'un salaire de base plafonné à 1,4 SMIC"}.
                  Le montant réel dépend de vos trois derniers bulletins de paie.
                </Paragraphe>
              )}

              {section('Mois par mois')}
              <Paragraphe ui={ui} style={s.aide}>
                Touchez un mois pour en voir le détail. Faites défiler sur le côté si la
                projection dépasse l'écran.
              </Paragraphe>

              <View style={s.bascule}>
                {[{ id: 'brut', l: 'Brut' }, { id: 'net', l: 'Net estimé' }].map(o => (
                  <TouchableOpacity
                    key={o.id}
                    onPress={() => setModeMontant(o.id)}
                    activeOpacity={0.7}
                    style={[s.basculePart, modeMontant === o.id && s.basculePartActive]}
                  >
                    <Text style={[s.basculeTexte, { fontSize: t(T.valeur) }, modeMontant === o.id && s.basculeTexteActif]}>
                      {o.l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Pas de légende de couleurs sous le graphique : le tableau qui
                  suit décode chaque barre, ligne par ligne, avec son montant et
                  son pourcentage — et toucher une barre en donne le détail
                  complet, poste par poste. */}
              <Graphique
                ui={ui}
                data={projection}
                maxVal={(modeMontant === 'net' ? baseNet : baseTotal) * 1.1}
                dateDebut={dateDebut}
                mode={modeMontant}
                selection={moisSelectionne}
                onSelect={setMoisSelectionne}
              />


              <View style={s.tableau}>
                {/* La colonne du numéro de mois a disparu : elle répétait la
                    période, et sa largeur manquait à « Traitement », que React
                    Native rompait au milieu du mot — « TRAITEMEN / T ». */}
                <View style={[s.tableauLigne, s.tableauTete]}>
                  {['Période', 'Traitement', 'Primes', 'Total', '%'].map((h, i) => (
                    <Text key={i} style={[s.tableauEntete, { flex: [1, 1.25, 0.95, 1.1, 0.6][i], fontSize: t(T.oeil) }]}
                      adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={2}>
                      {h}
                    </Text>
                  ))}
                </View>
                {projection.map((m2, i) => {
                  const nom = dateDebut
                    ? `${MOIS_LABELS[(dateDebut.mois - 1 + i) % 12]} ${String(dateDebut.annee + Math.floor((dateDebut.mois - 1 + i) / 12)).slice(2)}`
                    : `M${m2.mois}`;
                  return (
                    <View key={i} style={[s.tableauLigne, i === projection.length - 1 && s.ligneSansFilet]}>
                      <Text style={[s.tableauCelluleTete, { flex: 1, fontSize: t(T.num) }]} numberOfLines={1}>{nom}</Text>
                      <Text style={[s.tableauCellule, { flex: 1.25, fontSize: t(T.num) }]}>{euros(m2.traitMaintenu)}</Text>
                      <Text style={[s.tableauCellule, { flex: 0.95, fontSize: t(T.num) }]}>
                        {m2.primesMaintenues > 0 ? euros(m2.primesMaintenues) : '—'}
                      </Text>
                      <Text style={[s.tableauCellule, { flex: 1.1, fontSize: t(T.num), color: m2.couleur }]}>{euros(m2.total)}</Text>
                      <Text style={[s.tableauCellule, { flex: 0.6, fontSize: t(T.num) }]}>{m2.pct} %</Text>
                    </View>
                  );
                })}
              </View>

              <BlocFilet ui={ui} couleur={C.versant} titre="Ce que le net recouvre">
                <Paragraphe ui={ui}>
                  Le net affiché est un ordre de grandeur. Il déduit la retenue pour pension
                  (11,10 % du traitement indiciaire), la CSG et la CRDS (9,70 % sur 98,25 % du
                  brut) et la RAFP (5 % des primes, plafonnée). Il n'intègre ni votre mutuelle,
                  ni l'impôt prélevé à la source, ni les cotisations propres à certains corps :
                  votre net réel sera un peu inférieur.
                </Paragraphe>
              </BlocFilet>

              {projection.some(m2 => m2.total === 0) && (
                <BlocFilet ui={ui} couleur={C.attention} titre="Les mois à zéro">
                  <Paragraphe ui={ui}>
                    Un mois affiché à 0 € ne veut pas dire un revenu nul : votre employeur ne
                    vous verse plus rien, mais la sécurité sociale prend le relais avec des
                    indemnités journalières. Leur montant dépend de votre salaire et n'est pas
                    calculé ici.
                  </Paragraphe>
                </BlocFilet>
              )}

              <BlocFilet ui={ui} couleur={C.attention} titre="Une projection, pas un bulletin de paie">
                <Paragraphe ui={ui}>
                  Les montants réels dépendent de votre situation individuelle : supplément
                  familial, indemnité de résidence, NBI, primes propres à votre corps, jours de
                  carence, indemnités journalières, délibération de votre collectivité. Pour un
                  chiffre qui engage, rapprochez-vous de votre service RH.
                </Paragraphe>
              </BlocFilet>

              {!!ficheId && (
                <>
                  {section('Aller plus loin')}
                  <Action
                    ui={ui}
                    titre="Lire la fiche"
                    texte="Le régime en entier : vos droits, la démarche, les points d'attention et les textes."
                    onPress={() => navigation.navigate('FicheDetail', { ficheId })}
                  />
                </>
              )}
            </>
          );
        })()}

        <Text style={[s.mentions, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}>
          CMO : primes au prorata du traitement (Décret 2010-997 et Loi 2025-127). CLM et CGM
          à l'État : 33 % la première année, 60 % les deux suivantes (Décret 2024-641). CITIS :
          toutes primes maintenues (Art. L. 822-21 CGFP). FPT : primes du CMO selon délibération.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const propre = (th, F) => StyleSheet.create({
  premiereSection: { marginTop: 6 },
  avantSection: { marginTop: V.section },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: V.ligne, paddingBottom: V.ligneBas,
    borderBottomWidth: FILET, borderBottomColor: F.ligne,
  },
  optionTexte: { flex: 1 },
  optionHaut: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  coche: {
    width: 22, height: 22, borderRadius: 11, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: FILET, borderColor: F.rubrique,
  },

  champ: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: V.ligne, paddingBottom: V.ligneBas,
    borderBottomWidth: FILET, borderBottomColor: F.ligne,
  },
  champDroite: { flexDirection: 'row', alignItems: 'baseline', gap: 6, flexShrink: 0 },
  champSaisie: {
    fontFamily: MONO, color: th.textPrimary, textAlign: 'right',
    minWidth: 74, padding: 0,
  },
  champSuffixe: { fontFamily: MONO_LEGER, color: th.textMuted, minWidth: 52 },

  zoneDate: { paddingTop: V.ligne },
  champDate: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: th.bgWarm, borderRadius: 4,
    borderWidth: FILET, borderColor: F.rubrique,
    paddingVertical: 14, paddingHorizontal: 14,
  },
  champDateTexte: { flex: 1, color: th.textPrimary },

  voile: { flex: 1, backgroundColor: 'rgba(27,31,38,0.55)', justifyContent: 'center', paddingHorizontal: V.zone },
  feuille: { backgroundColor: th.bgCard, borderRadius: 4, padding: 22, maxHeight: '82%' },
  feuilleTitre: { fontFamily: SERIF, color: th.textPrimary, marginBottom: 16 },
  feuilleAnnee: {
    fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 1.4,
    marginTop: 8, marginBottom: 8,
  },
  grilleMois: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  caseMois: {
    width: '23%', alignItems: 'center', paddingVertical: 10, borderRadius: 3,
    borderWidth: FILET, borderColor: F.rubrique,
  },
  caseMoisTexte: { fontFamily: MONO_LEGER, color: th.textSecondary },

  synthese: {
    flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 15, paddingBottom: 16,
    borderTopWidth: FILET, borderBottomWidth: FILET, borderColor: F.rubrique,
  },
  syntheseCase: { flex: 1, alignItems: 'center' },
  syntheseN: { fontFamily: SERIF, textAlign: 'center' },
  syntheseC: { color: th.textMuted, marginTop: 7, textAlign: 'center' },

  aide: { marginTop: 14 },
  aideSuivante: { marginTop: 10 },

  detailTete: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    gap: 12, paddingTop: V.ligne,
  },
  badge: { fontFamily: MONO_LEGER, letterSpacing: 0.6, textTransform: 'uppercase' },
  detailSous: { marginTop: 5 },
  detailBloc: { marginTop: 14 },
  detailLigne: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    gap: 14, paddingVertical: 7,
  },
  detailLigneForte: { borderTopWidth: FILET, borderTopColor: F.rubrique, paddingTop: 11, marginTop: 4 },
  detailLabel: { color: th.textSecondary, flexShrink: 1 },
  detailVal: { fontFamily: MONO, color: th.textSecondary, flexShrink: 0 },
  detailFort: { color: th.textPrimary, fontWeight: '600' },

  bascule: {
    flexDirection: 'row', marginTop: 16,
    backgroundColor: th.bgWarm, borderRadius: 3,
    borderWidth: FILET, borderColor: F.rubrique, overflow: 'hidden',
  },
  basculePart: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  basculePartActive: { backgroundColor: th.bgCard },
  basculeTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.8 },
  basculeTexteActif: { fontFamily: MONO, color: th.textPrimary },

  graphique: { flexDirection: 'row', alignItems: 'flex-end', height: 210, paddingTop: 16 },
  barre: { flex: 1, alignItems: 'center', height: '100%' },
  barreVal: { fontFamily: MONO_LEGER, color: th.textMuted, marginBottom: 5 },
  barreFond: { flex: 1, width: 20, justifyContent: 'flex-end' },
  barreRemplie: { width: '100%', borderRadius: 1 },
  barreMois: { fontFamily: MONO_LEGER, color: th.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 12 },


  tableau: { marginTop: 18 },
  tableauLigne: { flexDirection: 'row', borderBottomWidth: FILET, borderBottomColor: F.ligne },
  tableauTete: { borderBottomColor: F.rubrique },
  tableauEntete: {
    fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 0.8,
    textTransform: 'uppercase', paddingVertical: 9, paddingRight: 6,
  },
  tableauCellule: { fontFamily: MONO_LEGER, color: th.textSecondary, paddingVertical: 11, paddingRight: 6 },
  tableauCelluleTete: { fontFamily: MONO, color: th.textPrimary, paddingVertical: 11, paddingRight: 6 },
});
