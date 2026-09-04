// src/components/registre.js
// ─────────────────────────────────────────────────────────────────────────────
// Les blocs de la direction « Registre », partagés par tous les écrans.
//
// Tous prennent `ui`, l'objet rendu par useRegistre() :
//     { th, t, inter, F, C, s }
// où `s` peut être la feuille commune enrichie des styles propres à l'écran.
//
// Ils sont définis au niveau du module, jamais dans un composant : un composant
// redéfini à chaque rendu est un type neuf pour React, qui démonte puis remonte
// tout son sous-arbre.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from '../theme/registre';

// ── Fil d'Ariane ────────────────────────────────────────────────────────────
// `droite` reçoit les boutons propres à l'écran (favori, partage…).
export const Fil = ({ ui, titre, onRetour, versant, droite }) => {
  const { s, t, th } = ui;
  return (
    <View style={s.fil}>
      <TouchableOpacity style={s.filRetour} onPress={onRetour} activeOpacity={0.7} disabled={!onRetour}>
        {!!onRetour && <Ionicons name="arrow-back" size={15} color={th.textMuted} />}
        <Text style={[s.filTexte, { fontSize: t(T.fil) }]} numberOfLines={1}>{titre}</Text>
      </TouchableOpacity>
      <View style={s.filDroite}>
        {!!versant && (
          <Text style={[s.filVersant, { fontSize: t(T.num) }]}>{versant}</Text>
        )}
        {droite}
      </View>
    </View>
  );
};

// ── Tête de page : filet de module, titre, chapeau ──────────────────────────
export const TeteDePage = ({ ui, module, couleurModule, rang, titre, lede, enfants }) => {
  const { s, t, inter } = ui;
  return (
    <View style={s.tete}>
      {!!module && (
        <View style={s.moduleRang}>
          <View style={s.moduleGauche}>
            <View style={[s.moduleFilet, { backgroundColor: couleurModule }]} />
            <Text style={[s.moduleNom, { color: couleurModule, fontSize: t(T.oeil) }]}>{module}</Text>
          </View>
          {!!rang && <Text style={[s.moduleRangNum, { fontSize: t(T.num) }]}>{rang}</Text>}
        </View>
      )}
      <Text style={[s.titre, { fontSize: t(T.titre), lineHeight: t(T.titre) * 1.14 }]}>{titre}</Text>
      {!!lede && (
        <Text style={[s.lede, { fontSize: t(T.lede), lineHeight: inter(T.lede) }]}>{lede}</Text>
      )}
      {enfants}
    </View>
  );
};

// ── Titre de section ────────────────────────────────────────────────────────
// Prévu pour être COLLANT : il doit rester un enfant direct du ScrollView, et
// son écart supérieur est porté par <EspaceSection/>, jamais par une marge —
// React Native fige le titre avec sa marge, et le contenu défilerait alors
// visiblement dans cet interstice.
export const EspaceSection = ({ ui }) => <View style={ui.s.espaceSection} />;

export const Section = ({ ui, titre, compte }) => {
  const { s, t } = ui;
  return (
    <View style={s.section}>
      <Text style={[s.sectionTitre, { fontSize: t(T.section), lineHeight: t(T.section) * 1.25 }]}>
        {titre}
      </Text>
      {compte != null && <Text style={[s.sectionCompte, { fontSize: t(T.num) }]}>{compte}</Text>}
    </View>
  );
};

// ── Bloc à filet latéral ────────────────────────────────────────────────────
export const BlocFilet = ({ ui, couleur, titre, compte, children }) => {
  const { s, t } = ui;
  return (
    <View style={[s.blocFilet, { borderLeftColor: couleur }]}>
      <View style={s.blocFiletTete}>
        <Text style={[s.blocFiletTitre, { color: couleur, fontSize: t(T.oeil) }]}>{titre}</Text>
        {compte != null && <Text style={[s.sectionCompte, { fontSize: t(T.num) }]}>{compte}</Text>}
      </View>
      {children}
    </View>
  );
};

// ── Paragraphe de lecture ───────────────────────────────────────────────────
export const Paragraphe = ({ ui, style, children }) => {
  const { s, t, inter } = ui;
  return (
    <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }, style]}>
      {children}
    </Text>
  );
};

// ── Une entrée numérotée : étape, point d'attention, fiche d'un module ──────
export const Numerote = ({ ui, num, titre, texte, style, onPress, fleche }) => {
  const { s, t, inter, th } = ui;
  const contenu = (
    <>
      <View style={s.numerote}>
        <Text style={[s.numeroteNum, { fontSize: t(T.valeur) }]}>{num}</Text>
        <Text style={[s.numeroteTitre, { fontSize: t(T.etapeTitre), lineHeight: t(T.etapeTitre) * 1.3 }]}>
          {titre}
        </Text>
        {!!fleche && <Ionicons name="chevron-forward" size={15} color={th.textMuted} />}
      </View>
      {!!texte && (
        <Text style={[s.detail, s.numeroteDetail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>
          {texte}
        </Text>
      )}
    </>
  );
  return onPress
    ? <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.6}>{contenu}</TouchableOpacity>
    : <View style={style}>{contenu}</View>;
};

// ── Action : les seuls objets de l'app à porter un fond ─────────────────────
// C'est délibéré : ils ne se lisent pas, ils se font, et rien autour d'eux n'a
// de contenant qui pourrait les banaliser.
export const Action = ({ ui, titre, texte, onPress }) => {
  const { s, t, inter, C } = ui;
  const contenu = (
    <>
      <View style={s.actionTexte}>
        <Text style={[s.actionTitre, { fontSize: t(T.action), lineHeight: t(T.action) * 1.25 }]}>
          {titre}
        </Text>
        {!!texte && (
          <Text style={[s.detail, { fontSize: t(T.detail), lineHeight: inter(T.detail) }]}>{texte}</Text>
        )}
      </View>
      {!!onPress && <Ionicons name="arrow-forward" size={18} color={C.action} />}
    </>
  );
  return onPress
    ? (
      <TouchableOpacity style={[s.action, { borderLeftColor: C.action }]} onPress={onPress} activeOpacity={0.7}>
        {contenu}
      </TouchableOpacity>
    )
    : <View style={[s.action, { borderLeftColor: C.action }]}>{contenu}</View>;
};
