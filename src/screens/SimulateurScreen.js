// src/screens/SimulateurScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, TextInput, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, useTheme } from '../theme';

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

// ── Sélecteur de date mois/année ────────────────────────────────────────────
function DateSelector({ value, onChange, theme }) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <>
      <TouchableOpacity
        style={[ds.btn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
        onPress={() => setOpen(true)} activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={16} color={Colors.sky} />
        <Text style={[ds.btnText, { color: value ? theme.textPrimary : theme.textMuted }]}>
          {value ? `${MOIS_LABELS[value.mois - 1]} ${value.annee}` : 'Choisir une date de début'}
        </Text>
        <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={ds.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={[ds.modal, { backgroundColor: theme.bgCard }]}>
            <Text style={[ds.modalTitle, { color: theme.textPrimary }]}>Date de début de l'arrêt</Text>
            {years.map(annee => (
              <View key={annee}>
                <Text style={[ds.yearLabel, { color: theme.textMuted }]}>{annee}</Text>
                <View style={ds.monthGrid}>
                  {MOIS_LABELS.map((ml, idx) => {
                    const isSelected = value?.annee === annee && value?.mois === idx + 1;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[ds.monthBtn, { borderColor: theme.border }, isSelected && { backgroundColor: Colors.sky, borderColor: Colors.sky }]}
                        onPress={() => { onChange({ mois: idx + 1, annee }); setOpen(false); }}
                        activeOpacity={0.75}
                      >
                        <Text style={[ds.monthText, { color: theme.textSecondary }, isSelected && { color: 'white', fontWeight: '700' }]}>
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

const ds = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: Radius.md, padding: 11 },
  btnText: { flex: 1, fontSize: Typography.sm },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: Spacing.lg },
  modal: { borderRadius: Radius.lg, padding: Spacing.xl, ...Shadow.lg, maxHeight: '80%' },
  modalTitle: { fontSize: Typography.base, fontWeight: '700', marginBottom: Spacing.lg },
  yearLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8, marginTop: 4 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  monthBtn: { width: '23%', alignItems: 'center', paddingVertical: 8, borderRadius: Radius.sm, borderWidth: 1 },
  monthText: { fontSize: 12 },
});

// ── Barre de progression étapes ────────────────────────────────────────────
const ETAPES_LABELS = ['Statut', 'Versant', 'Rémunération', 'Régime'];

const ProgressBar = ({ current, theme }) => (
  <View style={[pb.container, { backgroundColor: theme.bgCard, borderBottomColor: theme.border }]}>
    <View style={pb.steps}>
      {ETAPES_LABELS.map((label, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <React.Fragment key={i}>
            <View style={pb.step}>
              <View style={[pb.circle,
                done   && { backgroundColor: Colors.olive,    borderColor: Colors.olive },
                active && { backgroundColor: Colors.terracotta, borderColor: Colors.terracotta },
                !done && !active && { backgroundColor: 'transparent', borderColor: theme.border },
              ]}>
                {done
                  ? <Ionicons name="checkmark" size={11} color="white" />
                  : <Text style={[pb.num, (done || active) && { color: 'white' }, !done && !active && { color: theme.textMuted }]}>{i + 1}</Text>
                }
              </View>
              <Text style={[pb.label, active && { color: Colors.terracotta, fontWeight: '600' }, !active && { color: theme.textMuted }]}>
                {label}
              </Text>
            </View>
            {i < ETAPES_LABELS.length - 1 && (
              <View style={[pb.connector, { backgroundColor: done ? Colors.olive : theme.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
    <View style={[pb.track, { backgroundColor: theme.border }]}>
      <View style={[pb.fill, { width: `${((current - 1) / 3) * 100}%`, backgroundColor: Colors.terracotta }]} />
    </View>
  </View>
);

const pb = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, paddingVertical: 12, borderBottomWidth: 0.5 },
  steps: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  step: { alignItems: 'center', gap: 4 },
  circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 11, fontWeight: '600' },
  label: { fontSize: 9, textAlign: 'center', width: 55 },
  connector: { flex: 1, height: 1.5, marginTop: -14 },
  track: { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
});

// ── Composants formulaire ───────────────────────────────────────────────────
const OptionBtn = ({ label, sub, selected, onPress, right, theme }) => (
  <TouchableOpacity
    style={[styles.optBtn, { borderColor: theme.border, backgroundColor: theme.bgCard },
      selected && { borderColor: Colors.sky, backgroundColor: Colors.skyLight + '33' }]}
    onPress={onPress} activeOpacity={0.75}
  >
    <View style={styles.optBtnLeft}>
      <Text style={[styles.optBtnLabel, { color: theme.textPrimary }, selected && { color: Colors.sky, fontWeight: '600' }]}>{label}</Text>
      {sub && <Text style={[styles.optBtnSub, { color: theme.textMuted }]}>{sub}</Text>}
    </View>
    {right && <Text style={[styles.optBtnRight, { color: theme.textMuted }]}>{right}</Text>}
    {selected && <Ionicons name="checkmark-circle" size={18} color={Colors.sky} style={{ marginLeft: 4 }} />}
  </TouchableOpacity>
);

const StepCard = ({ title, children, theme }) => (
  <View style={[styles.stepCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
    <Text style={[styles.stepTitle, { color: theme.textSecondary }]}>{title}</Text>
    {children}
  </View>
);

const InputRow = ({ label, value, onChange, placeholder, suffix, theme }) => (
  <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{label}</Text>
    <View style={styles.inputWrap}>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.bg }]}
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor={theme.textMuted} keyboardType="numeric"
      />
      {suffix && <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>{suffix}</Text>}
    </View>
  </View>
);

// ── Graphique en barres ─────────────────────────────────────────────────────
const BarChart = ({ data, maxVal, dateDebut, theme }) => {
  const max = maxVal || Math.max(...data.map(d => d.total), 1);
  // Afficher max 12 barres visible, scroll si plus
  const visible = data.slice(0, 24);

  const getMoisLabel = (idx) => {
    if (!dateDebut) return `M${idx + 1}`;
    let m = dateDebut.mois - 1 + idx;
    const annee = dateDebut.annee + Math.floor(m / 12);
    const moisIdx = m % 12;
    return `${MOIS_LABELS[moisIdx].slice(0,3)}\n${String(annee).slice(2)}`;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.chartContainer, { width: Math.max(visible.length * 38, 300) }]}>
        <View style={styles.chartBars}>
          {visible.map((d, i) => (
            <View key={i} style={styles.chartBarWrap}>
              <Text style={[styles.chartBarVal, { color: theme.textMuted }]}>
                {d.total > 0 ? `${Math.round(d.total / 100) * 100}` : '—'}
              </Text>
              <View style={styles.chartBarOuter}>
                <View style={[styles.chartBarInner, {
                  height: `${Math.max((d.total / max) * 100, d.total > 0 ? 4 : 0)}%`,
                  backgroundColor: d.couleur,
                }]} />
              </View>
              <Text style={[styles.chartBarMonth, { color: theme.textMuted }]}>{getMoisLabel(i)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ── Calcul date de fin ──────────────────────────────────────────────────────
function getDateFin(dateDebut, nbMois) {
  if (!dateDebut) return null;
  let m = dateDebut.mois - 1 + nbMois - 1;
  const annee = dateDebut.annee + Math.floor(m / 12);
  const moisIdx = m % 12;
  return `${MOIS_LABELS[moisIdx]} ${annee}`;
}

// ── Écran principal ─────────────────────────────────────────────────────────
export default function SimulateurScreen({ navigation }) {
  const theme = useTheme();
  const [statut,     setStatut]     = useState(null);
  const [versant,    setVersant]    = useState(null);
  const [regime,     setRegime]     = useState(null);
  const [traitement, setTraitement] = useState('');
  const [primes,     setPrimes]     = useState('');
  const [quotite,    setQuotite]    = useState('100');
  const [anciennete, setAnciennete] = useState(null);
  const [dateDebut,  setDateDebut]  = useState(null);

  const currentStep = !statut ? 1 : !versant ? 2 : !traitement ? 3 : 4;
  const regimes = statut === 'titulaire' ? REGIMES_TITULAIRE : REGIMES_CONTRACTUEL;
  // FPT et FPH partagent le régime progressif : l'ancienneté conditionne le calcul
  // dans les deux versants (Décret 88-145 art. 7 / Décret 91-155 art. 10).
  const showAnciennete = statut === 'contractuel' && (versant === 'fpt' || versant === 'fph') && regime === 'cmo_c';
  // L'accident du travail des contractuels dépend aussi de l'ancienneté, dans
  // les trois versants — mais avec des paliers différents de ceux du CMO.
  const showAncienneteAt = statut === 'contractuel' && regime === 'at_c';
  const ancienneteRequise = showAnciennete || showAncienneteAt;
  const ficheId = regimes.find(r => r.id === regime)?.ficheId;
  const nbMoisMax = regime ? (MAX_MOIS[regime] || 12) : 12;
  const canCompute = statut && versant && regime && parseFloat(traitement) > 0 && (!ancienneteRequise || anciennete);

  const projection = useMemo(() => {
    if (!canCompute) return null;
    return calculerProjection({ statut, versant, traitement, primes, quotite, regime, anciennete, nbMois: nbMoisMax });
  }, [statut, versant, regime, traitement, primes, quotite, anciennete, canCompute, nbMoisMax]);

  const tq = (parseFloat(traitement) || 0) * ((parseFloat(quotite) || 100) / 100);
  const pq = (parseFloat(primes) || 0) * ((parseFloat(quotite) || 100) / 100);
  const baseTotal = Math.round(tq + pq);
  const baseNet = estimerNet(tq, pq);
  const dateFin = getDateFin(dateDebut, nbMoisMax);
  const perteTotal = projection ? projection.reduce((acc, m) => acc + (baseTotal - m.total), 0) : 0;
  const perteNette = projection ? projection.reduce((acc, m) => acc + (baseNet - m.net), 0) : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.sky }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.sky} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simulateur</Text>
        <Text style={styles.headerSub}>Projection sur toute la durée de l'arrêt</Text>
      </View>

      <ProgressBar current={currentStep} theme={theme} />

      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Étape 1 — Statut */}
        <StepCard title="1 · Votre statut" theme={theme}>
          {STATUTS.map(s => (
            <OptionBtn key={s.id} label={s.label} selected={statut === s.id}
              onPress={() => { setStatut(s.id); setRegime(null); setAnciennete(null); }} theme={theme} />
          ))}
        </StepCard>

        {/* Étape 2 — Versant */}
        {statut && (
          <StepCard title="2 · Versant de la fonction publique" theme={theme}>
            {VERSANTS.map(v => (
              <OptionBtn key={v.id} label={v.label} selected={versant === v.id}
                onPress={() => { setVersant(v.id); setRegime(null); setAnciennete(null); }} theme={theme} />
            ))}
          </StepCard>
        )}

        {/* Étape 3 — Rémunération */}
        {versant && (
          <StepCard title="3 · Rémunération mensuelle brute" theme={theme}>
            <InputRow label="Traitement indiciaire brut" value={traitement} onChange={setTraitement} placeholder="Ex : 2 200" suffix="€ / mois" theme={theme} />
            <InputRow label="Primes et indemnités" value={primes} onChange={setPrimes} placeholder="Ex : 450" suffix="€ / mois" theme={theme} />
            <InputRow label="Quotité de travail" value={quotite} onChange={setQuotite} placeholder="100" suffix="%" theme={theme} />
            <Text style={[styles.inputHint, { color: theme.textMuted }]}>
              💡 Traitement brut = ligne « Traitement » de votre fiche de paie. Ne pas inclure le supplément familial ni l'indemnité de résidence, qui restent versés en entier.
            </Text>
            <Text style={[styles.inputHint, { color: theme.textMuted }]}>
              💡 Quotité = votre temps de travail habituel, avant l'arrêt. Pour un temps partiel thérapeutique, indiquez bien votre quotité habituelle : le TPT maintient l'intégralité du traitement, quelle que soit la quotité travaillée pendant la reprise.
            </Text>
          </StepCard>
        )}

        {/* Étape 4 — Régime */}
        {versant && parseFloat(traitement) > 0 && (
          <StepCard title="4 · Régime statutaire de l'arrêt" theme={theme}>
            {regimes.map(r => (
              <OptionBtn key={r.id} label={r.label} right={r.maxLabel} selected={regime === r.id}
                onPress={() => { setRegime(r.id); setAnciennete(null); }} theme={theme} />
            ))}
          </StepCard>
        )}

        {/* Ancienneté — FPT et FPH (régime progressif) */}
        {showAnciennete && (
          <StepCard title={versant === 'fph' ? "5 · Ancienneté dans l'établissement" : '5 · Ancienneté dans la collectivité'} theme={theme}>
            {ANCIENNETES_PROGRESSIF.map(a => (
              <OptionBtn key={a.id} label={a.label}
                sub={a.plein === 0 ? 'Aucun maintien — IJ CPAM uniquement' : `${a.plein} mois à 90 % + ${a.demi} mois à 50 %`}
                selected={anciennete === a.id} onPress={() => setAnciennete(a.id)} theme={theme} />
            ))}
          </StepCard>
        )}

        {/* Ancienneté — accident du travail des contractuels */}
        {showAncienneteAt && (
          <StepCard title="5 · Ancienneté chez cet employeur" theme={theme}>
            {(ANCIENNETES_AT[versant] || ANCIENNETES_AT.fpe).map(a => (
              <OptionBtn key={a.id} label={a.label}
                sub={`${a.plein} mois à plein traitement, puis IJ seules`}
                selected={anciennete === a.id} onPress={() => setAnciennete(a.id)} theme={theme} />
            ))}
          </StepCard>
        )}

        {/* Date de début */}
        {canCompute && (
          <StepCard title={ancienneteRequise ? "6 · Date de début de l'arrêt (optionnel)" : "5 · Date de début de l'arrêt (optionnel)"} theme={theme}>
            <DateSelector value={dateDebut} onChange={setDateDebut} theme={theme} />
            {dateDebut && dateFin && (
              <View style={[styles.dateRange, { backgroundColor: theme.bgWarm }]}>
                <View style={styles.dateRangeItem}>
                  <Text style={[styles.dateRangeLabel, { color: theme.textMuted }]}>Début</Text>
                  <Text style={[styles.dateRangeVal, { color: Colors.sky }]}>
                    {MOIS_LABELS[dateDebut.mois - 1]} {dateDebut.annee}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
                <View style={styles.dateRangeItem}>
                  <Text style={[styles.dateRangeLabel, { color: theme.textMuted }]}>Fin estimée</Text>
                  <Text style={[styles.dateRangeVal, { color: Colors.terracotta }]}>{dateFin}</Text>
                </View>
                <View style={styles.dateRangeItem}>
                  <Text style={[styles.dateRangeLabel, { color: theme.textMuted }]}>Durée max.</Text>
                  <Text style={[styles.dateRangeVal, { color: theme.textPrimary }]}>{nbMoisMax} mois</Text>
                </View>
              </View>
            )}
            {!dateDebut && (
              <Text style={[styles.inputHint, { color: theme.textMuted, marginTop: 6 }]}>
                Sans date, la projection affiche les mois M1, M2… Avec une date, les noms réels des mois s'affichent.
              </Text>
            )}
          </StepCard>
        )}

        {/* Note primes CMO hors FPE : la projection retient 0 € par prudence */}
        {regime === 'cmo' && versant !== 'fpe' && (
          <View style={[styles.infoCard, { backgroundColor: theme.bgWarm, borderColor: theme.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.sky} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {versant === 'fpt'
                ? 'FPT — Le maintien des primes au prorata du traitement (90 % puis 50 %) suppose une délibération de la collectivité ; sans elle, elles peuvent être suspendues. Cette projection retient 0 € de primes : si la délibération existe, votre revenu réel sera supérieur. Source : CE n°462452 du 4 juillet 2024.'
                : 'FPH — Il n’existe pas de règle nationale alignant les primes sur le traitement comme à l’État. Chaque prime suit son propre texte, et la prime de service est réduite à proportion des jours d’absence. Cette projection retient 0 € de primes : demandez le détail à votre DRH.'}
            </Text>
          </View>
        )}

        {/* Note primes CLM/CGM hors FPE : la projection retient 0 € par prudence */}
        {(regime === 'clm' || regime === 'cgm') && versant !== 'fpe' && (
          <View style={[styles.infoCard, { backgroundColor: theme.bgWarm, borderColor: theme.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.sky} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {versant === 'fpt'
                ? 'FPT — Le maintien partiel des primes (33 % puis 60 %) prévu par le Décret 2024-641 ne vaut que pour l’État. Il peut être transposé par délibération de la collectivité, sans pouvoir aller au-delà. Cette projection retient 0 € de primes : si une délibération existe, votre revenu réel sera supérieur.'
                : 'FPH — Le Décret 2024-641 ne s’applique pas à la fonction publique hospitalière et aucun texte national n’organise le maintien des primes pendant ces congés. Cette projection retient donc 0 € de primes ; faites confirmer par écrit par votre DRH si votre établissement prévoit mieux.'}
            </Text>
          </View>
        )}

        {/* Note primes CLD : suspendues dans les 3 versants */}
        {regime === 'cld' && (
          <View style={[styles.infoCard, { backgroundColor: theme.bgWarm, borderColor: theme.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.sky} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              En CLD, le régime indemnitaire est suspendu dans les trois versants. Le Décret 2024-641 a ouvert le maintien partiel des primes en CLM et CGM uniquement — il laisse le CLD en dehors du dispositif.
            </Text>
          </View>
        )}

        {/* Résultats */}
        {projection && (
          <>
            {/* Résumé 3 chiffres clés */}
            <View style={[styles.resumeCard, { backgroundColor: Colors.slate }]}>
              <View style={styles.resumeRow}>
                <View style={styles.resumeItem}>
                  <Text style={styles.resumeLabel}>Rémunération de base</Text>
                  <Text style={styles.resumeVal}>{baseTotal.toLocaleString('fr-FR')} €</Text>
                  <Text style={styles.resumeSub}>brut / mois</Text>
                  <Text style={styles.resumeNet}>≈ {baseNet.toLocaleString('fr-FR')} € net</Text>
                </View>
                <View style={styles.resumeSep} />
                <View style={styles.resumeItem}>
                  <Text style={styles.resumeLabel}>Minimum projeté</Text>
                  <Text style={[styles.resumeVal, { color: projection[projection.length - 1].couleur }]}>
                    {projection[projection.length - 1].total.toLocaleString('fr-FR')} €
                  </Text>
                  <Text style={styles.resumeSub}>dernier mois</Text>
                  <Text style={styles.resumeNet}>≈ {projection[projection.length - 1].net.toLocaleString('fr-FR')} € net</Text>
                </View>
                <View style={styles.resumeSep} />
                <View style={styles.resumeItem}>
                  <Text style={styles.resumeLabel}>Perte totale cumulée</Text>
                  <Text style={[styles.resumeVal, { color: Colors.danger }]}>
                    -{perteTotal.toLocaleString('fr-FR')} €
                  </Text>
                  <Text style={styles.resumeSub}>brut sur {nbMoisMax} mois</Text>
                  <Text style={styles.resumeNet}>≈ -{perteNette.toLocaleString('fr-FR')} € net</Text>
                </View>
              </View>
            </View>

            {/* Détail chiffré du mois le plus défavorable */}
            {(() => {
              const m = projection[projection.length - 1];
              const L = ({ label, val, negatif, fort }) => (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: fort ? theme.textPrimary : theme.textSecondary }, fort && { fontWeight: '700' }]}>{label}</Text>
                  <Text style={[styles.detailVal, { color: negatif ? Colors.danger : (fort ? theme.textPrimary : theme.textSecondary) }, fort && { fontWeight: '700' }]}>
                    {negatif ? '-' : ''}{Math.abs(val).toLocaleString('fr-FR')} €
                  </Text>
                </View>
              );
              return (
                <View style={[styles.chartCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                  <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>
                    Détail du mois {m.mois} — le plus défavorable
                  </Text>
                  <View style={styles.detailBlock}>
                    {m.traitMaintenu > 0 && <L label="Traitement maintenu" val={m.traitMaintenu} />}
                    {m.primesMaintenues > 0 && <L label="Primes maintenues" val={m.primesMaintenues} />}
                    {m.ij > 0 && <L label={regime === 'at_c' ? 'IJ accident du travail' : 'IJ maladie (sécurité sociale)'} val={m.ij} />}
                    {m.total === 0 && <L label="Aucun versement" val={0} />}
                    <View style={[styles.detailSep, { backgroundColor: theme.border }]} />
                    <L label="Total brut" val={m.total} fort />
                    {m.retenues.pension > 0 && <L label="Retenue pension (11,10 %)" val={m.retenues.pension} negatif />}
                    {m.retenues.csgCrds > 0 && <L label="CSG + CRDS (9,70 %)" val={m.retenues.csgCrds} negatif />}
                    {m.retenues.rafp > 0 && <L label="RAFP (5 % des primes)" val={m.retenues.rafp} negatif />}
                    <View style={[styles.detailSep, { backgroundColor: theme.border }]} />
                    <L label="Net estimé" val={m.net} fort />
                  </View>
                  {projection[0].carence > 0 && (
                    <Text style={[styles.detailNote, { color: theme.textMuted }]}>
                      Un jour de carence de {projection[0].carence.toLocaleString('fr-FR')} € a été retenu sur le premier mois. Il ne s'applique pas si vous êtes en affection de longue durée déjà décomptée depuis moins de trois ans, ni si vous reprenez moins de 48 heures entre deux arrêts de même cause.
                    </Text>
                  )}
                  {m.ij > 0 && (
                    <Text style={[styles.detailNote, { color: theme.textMuted }]}>
                      Les indemnités journalières sont estimées à partir de votre brut habituel{regime === 'at_c' ? ', à 60 % le premier mois puis 80 %' : ', à 50 % d’un salaire de base plafonné à 1,4 SMIC'}. Le montant réel dépend de vos trois derniers bulletins de paie.
                    </Text>
                  )}
                </View>
              );
            })()}

            {/* Ce que recouvre — et ne recouvre pas — l'estimation nette */}
            <View style={[styles.infoCard, { backgroundColor: theme.bgWarm, borderColor: theme.border }]}>
              <Ionicons name="calculator-outline" size={16} color={Colors.sky} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Le net affiché est un ordre de grandeur. Il déduit la retenue pour pension (11,10 % du traitement indiciaire), la CSG et la CRDS (9,70 % sur 98,25 % du brut) et la RAFP (5 % des primes, plafonnée). Il n’intègre ni votre mutuelle, ni l’impôt prélevé à la source, ni les cotisations propres à certains corps : votre net réel sera un peu inférieur.
              </Text>
            </View>

            {/* Mois non rémunérés par l'employeur : les IJ ne sont pas modélisées */}
            {projection.some(m => m.total === 0) && (
              <View style={[styles.infoCard, { backgroundColor: theme.bgWarm, borderColor: theme.border }]}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.amber} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Les mois affichés à 0 € ne signifient pas un revenu nul : votre employeur ne vous verse plus rien, mais la sécurité sociale prend le relais avec des indemnités journalières. Leur montant dépend de votre salaire et n’est pas calculé ici.
                </Text>
              </View>
            )}

            {/* Info durée maximale */}
            <View style={[styles.dureeBanner, { backgroundColor: Colors.skyLight, borderColor: Colors.sky + '55' }]}>
              <Ionicons name="time-outline" size={15} color={Colors.sky} />
              <Text style={[styles.dureeText, { color: Colors.sky }]}>
                Durée maximale réglementaire : <Text style={{ fontWeight: '700' }}>{nbMoisMax} mois</Text>
                {dateFin && dateDebut ? ` — jusqu'en ${dateFin}` : ''}
                {regime === 'citis' ? ' (illimité en pratique)' : ''}
                {regime === 'tpt' ? ' par autorisation — renouvelable après 1 an d\'activité, sans limite de nombre.' : ''}
              </Text>
            </View>

            {/* Graphique */}
            <View style={[styles.chartCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>
                Projection sur {nbMoisMax} mois
                {dateDebut ? ` — à partir de ${MOIS_LABELS[dateDebut.mois - 1]} ${dateDebut.annee}` : ''}
              </Text>
              <Text style={[styles.chartSub, { color: theme.textMuted }]}>
                Montant brut estimé (traitement + primes maintenues). Défiler horizontalement si besoin.
              </Text>
              <BarChart data={projection} maxVal={baseTotal * 1.1} dateDebut={dateDebut} theme={theme} />
              <View style={styles.legendRow}>
                {[
                  { c: Colors.terracotta, l: '90 %' },
                  { c: Colors.amber,      l: '50-60 %' },
                  { c: Colors.sky,        l: '100 %' },
                  { c: Colors.olive,      l: 'Plein + primes' },
                  { c: Colors.slateLight, l: 'IJ CPAM' },
                ].map((item, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.c }]} />
                    <Text style={[styles.legendText, { color: theme.textMuted }]}>{item.l}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tableau détaillé */}
            <View style={[styles.tableCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>Détail mois par mois</Text>
              <View style={[styles.tableHeader, { backgroundColor: Colors.slate }]}>
                {['Mois','Période','Traitement','Primes','Total','%'].map((h, i) => (
                  <Text key={i} style={[styles.tableCell, styles.tableCellHead,
                    { flex: [0.5, 1.4, 1, 0.8, 1, 0.5][i] }]}>{h}</Text>
                ))}
              </View>
              {projection.map((m, i) => {
                const moisLabel = dateDebut
                  ? `${MOIS_LABELS[(dateDebut.mois - 1 + i) % 12]} ${dateDebut.annee + Math.floor((dateDebut.mois - 1 + i) / 12)}`
                  : `M${m.mois}`;
                return (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 && { backgroundColor: theme.bgWarm }]}>
                    <Text style={[styles.tableCell, { flex: 0.5, color: theme.textMuted }]}>{m.mois}</Text>
                    <Text style={[styles.tableCell, { flex: 1.4, color: Colors.sky, fontWeight: '500' }]} numberOfLines={1}>{moisLabel}</Text>
                    <Text style={[styles.tableCell, { flex: 1, color: theme.textSecondary }]}>{m.traitMaintenu.toLocaleString('fr-FR')} €</Text>
                    <Text style={[styles.tableCell, { flex: 0.8, color: theme.textMuted }]}>{m.primesMaintenues > 0 ? `${m.primesMaintenues.toLocaleString('fr-FR')} €` : '—'}</Text>
                    <Text style={[styles.tableCell, { flex: 1, fontWeight: '600', color: m.couleur }]}>{m.total.toLocaleString('fr-FR')} €</Text>
                    <Text style={[styles.tableCell, { flex: 0.5, color: m.pct < 75 ? Colors.danger : Colors.olive }]}>{m.pct}%</Text>
                  </View>
                );
              })}
            </View>

            {/* Avertissement rouge */}
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={18} color={Colors.danger} />
              <Text style={styles.warningText}>
                Projection indicative à titre informatif uniquement. Les montants réels dépendent de votre situation individuelle (SFT, IR, NBI, primes spécifiques, jours de carence, IJ CPAM, délibération FPT…). Pour une information concrète, rapprochez-vous impérativement de votre service RH.
              </Text>
            </View>

            {ficheId && (
              <TouchableOpacity
                style={[styles.ficheLink, { backgroundColor: theme.bgCard, borderColor: Colors.terracottaLight }]}
                onPress={() => navigation.navigate('FicheDetail', { ficheId })} activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={16} color={Colors.terracotta} />
                <Text style={styles.ficheLinkText}>Consulter la fiche détaillée →</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.noteCard}>
          <Text style={[styles.noteText, { color: theme.textMuted }]}>
            CMO : primes au prorata du traitement (Décret 2010-997 + Loi 2025-127).
            CLM/CGM FPE : 33 % an 1, 60 % ans 2-3 (Décret 2024-641).
            CITIS : toutes primes maintenues (Art. L.822-21 CGFP). FPT : primes CMO selon délibération.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { backgroundColor: Colors.sky, paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  headerTitle: { fontSize: Typography.xxl, color: Colors.white, fontWeight: '700' },
  headerSub: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100, gap: 12 },
  stepCard: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 0.5, ...Shadow.sm, gap: 8 },
  stepTitle: { fontSize: Typography.sm, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.04 },
  optBtn: { borderWidth: 1.5, borderRadius: Radius.md, padding: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optBtnLeft: { flex: 1 },
  optBtnLabel: { fontSize: Typography.sm },
  optBtnSub: { fontSize: 11, marginTop: 2 },
  optBtnRight: { fontSize: 11, marginRight: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5 },
  inputLabel: { fontSize: Typography.sm, flex: 1.2 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: { borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 7, fontSize: Typography.base, width: 90, textAlign: 'right' },
  inputSuffix: { fontSize: 11, width: 50 },
  inputHint: { fontSize: 11, lineHeight: 16, marginTop: 4, fontStyle: 'italic' },
  dateRange: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, padding: Spacing.md, marginTop: 8, gap: 4 },
  dateRangeItem: { alignItems: 'center', flex: 1 },
  dateRangeLabel: { fontSize: 10, marginBottom: 2 },
  dateRangeVal: { fontSize: 13, fontWeight: '600' },
  infoCard: { borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', gap: 8, alignItems: 'flex-start', borderWidth: 0.5 },
  infoText: { fontSize: Typography.sm, lineHeight: 18, flex: 1 },
  resumeCard: { borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.md },
  resumeRow: { flexDirection: 'row', alignItems: 'center' },
  resumeItem: { flex: 1, alignItems: 'center', gap: 2 },
  resumeLabel: { fontSize: 9, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  resumeVal: { fontSize: 16, fontWeight: '700', color: 'white', textAlign: 'center' },
  resumeSub: { fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  resumeNet: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.72)', textAlign: 'center', marginTop: 3 },
  detailBlock: { marginTop: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: 5 },
  detailLabel: { fontSize: 13, flex: 1, paddingRight: 10 },
  detailVal: { fontSize: 13.5, fontVariant: ['tabular-nums'] },
  detailSep: { height: 1, marginVertical: 6, opacity: 0.7 },
  detailNote: { fontSize: 11.5, lineHeight: 16, marginTop: 10, fontStyle: 'italic' },
  resumeSep: { width: 0.5, height: 44, backgroundColor: 'rgba(255,255,255,0.15)' },
  dureeBanner: { borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', gap: 8, alignItems: 'center', borderWidth: 1 },
  dureeText: { fontSize: Typography.sm, flex: 1, lineHeight: 18 },
  chartCard: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 0.5, ...Shadow.sm },
  chartTitle: { fontSize: Typography.base, fontWeight: '600', marginBottom: 2 },
  chartSub: { fontSize: 11, marginBottom: 12 },
  chartContainer: { height: 150 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: '100%', gap: 2, paddingBottom: 18 },
  chartBarWrap: { width: 34, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  chartBarVal: { fontSize: 7, marginBottom: 2, textAlign: 'center', width: 34 },
  chartBarOuter: { width: 28, height: '75%', justifyContent: 'flex-end' },
  chartBarInner: { width: '100%', borderRadius: 2, minHeight: 2 },
  chartBarMonth: { fontSize: 7, marginTop: 3, textAlign: 'center', width: 34, lineHeight: 10 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 11 },
  tableCard: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 0.5, ...Shadow.sm, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', marginHorizontal: -Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: 8, marginTop: 10 },
  tableRow: { flexDirection: 'row', paddingVertical: 6 },
  tableCell: { fontSize: 10, paddingHorizontal: 2 },
  tableCellHead: { fontSize: 9, color: 'white', fontWeight: '600' },
  warningCard: { backgroundColor: Colors.dangerLight, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: Colors.danger },
  warningText: { fontSize: Typography.sm, color: Colors.danger, lineHeight: 19, flex: 1, fontWeight: '500' },
  ficheLink: { borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1 },
  ficheLinkText: { fontSize: Typography.sm, color: Colors.terracotta, fontWeight: '500' },
  noteCard: { paddingVertical: Spacing.sm },
  noteText: { fontSize: 10, textAlign: 'center', lineHeight: 15, fontStyle: 'italic' },
});
