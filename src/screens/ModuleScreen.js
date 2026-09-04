// src/screens/ModuleScreen.js
// La liste des fiches d'un module, dans la direction « Registre ».
//
// Les fiches se présentent exactement comme les étapes d'une démarche : un
// numéro en chasse fixe, un titre, et le résumé en dessous. C'est le même objet
// visuel, donc rien de nouveau à apprendre en passant d'un écran à l'autre.
//
// Le bloc « Module Pro » de la version précédente a disparu : aucun module ne
// porte `isPro` dans fiches.js, c'était du code mort.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistre } from '../theme/registreStyles';
import { Fil, TeteDePage, Numerote } from '../components/registre';
import { T, V, MONO_LEGER } from '../theme/registre';
import { getModuleById } from '../data/fiches';

const deuxChiffres = (n) => String(n).padStart(2, '0');

export default function ModuleScreen({ navigation, route }) {
  const { moduleId } = route.params;
  const module = getModuleById(moduleId);
  const ui0 = useRegistre();

  if (!module) return null;

  const { th, t, F } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };
  const fiches = module.fiches || [];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <Fil ui={ui} titre="Accueil" onRetour={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContenu} showsVerticalScrollIndicator={false}>
        <TeteDePage
          ui={ui}
          module={`${deuxChiffres(fiches.length)} fiches`}
          couleurModule={module.color}
          icone={module.icon}
          titre={module.title}
          lede={module.description}
          enfants={!!module.updatedAt && (
            <Text style={[s.oeil, s.maj, { fontSize: t(T.oeil) }]}>
              À jour — {module.updatedAt}
            </Text>
          )}
        />

        <View style={s.liste}>
          {fiches.map((fiche, index) => (
            <Numerote
              key={fiche.id}
              ui={ui}
              style={[s.ligne, index === fiches.length - 1 && s.ligneSansFilet]}
              num={deuxChiffres(index + 1)}
              titre={fiche.titre}
              texte={fiche.resume}
              fleche
              onPress={() => navigation.navigate('FicheDetail', {
                ficheId: fiche.id,
                moduleId: module.id,
                ficheIndex: index,
                ficheTotal: fiches.length,
                moduleTitle: module.title,
              })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const propre = (th, F) => StyleSheet.create({
  maj: { fontFamily: MONO_LEGER, fontWeight: '400', letterSpacing: 0.8, marginBottom: 4 },
  // Le filet franc qui ouvre la liste joue le rôle d'un titre de section : la
  // page n'en a qu'une, la nommer serait redire le titre.
  liste: { marginTop: V.section, borderTopWidth: 2, borderTopColor: F.section },
});
