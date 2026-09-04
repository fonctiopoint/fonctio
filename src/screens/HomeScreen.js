// src/screens/HomeScreen.js
// L'accueil, dans la direction « Registre ».
//
// Trois choses restent fixes en haut, parce qu'on y revient sans cesse : le
// mot-symbole, la recherche et le versant. Tout le reste défile.
//
// Le sélecteur de versant ne prend PAS les couleurs des versants. Terracotta,
// ciel et olive ont déjà un rôle dans cette direction — valeur, note de
// versant, action — et les réemployer ici pour dire autre chose casserait la
// seule règle de couleur du système. Le versant actif se lit à son encre pleine
// et à son filet ; les autres sont en encre atténuée.
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRegistre, FILET } from '../theme/registreStyles';
import { Section, BlocFilet, Paragraphe, Numerote, Action } from '../components/registre';
import { SERIF, MONO, MONO_LEGER, T, V } from '../theme/registre';
import { Palette } from '../theme';
import { useSettings } from '../utils/SettingsContext';
import { MODULES, NOUVEAUTES, getFicheById } from '../data/fiches';
import { iconeDeModule } from '../theme/icones';
import { chercherFiches } from '../utils/recherche';
import {
  getFavoris, getRecent, isNouveautesDismissed, dismissNouveautes,
} from '../utils/storage';

const VERSANTS = [
  { id: 'fpe', court: 'FPE', long: "Fonction publique de l'État" },
  { id: 'fpt', court: 'FPT', long: 'Fonction publique territoriale' },
  { id: 'fph', court: 'FPH', long: 'Fonction publique hospitalière' },
];
const LONG = Object.fromEntries(VERSANTS.map(v => [v.id, v.long]));

const deuxChiffres = (n) => String(n).padStart(2, '0');

// Combien de favoris et de fiches récentes on montre. Au-delà, la liste
// pousserait les modules hors de l'écran d'ouverture.
const MAX_RACCOURCIS = 4;

export default function HomeScreen({ navigation, versant, setVersant }) {
  const ui0 = useRegistre();
  const { settings } = useSettings();
  const [recherche, setRecherche] = useState('');
  const [nouveautesVisible, setNouveautesVisible] = useState(false);
  const [favoris, setFavoris] = useState([]);
  const [recents, setRecents] = useState([]);

  useFocusEffect(useCallback(() => {
    let monte = true;
    (async () => {
      const [masquee, favs, recs] = await Promise.all([
        isNouveautesDismissed(NOUVEAUTES.version),
        getFavoris(),
        getRecent(),
      ]);
      if (!monte) return;
      setNouveautesVisible(NOUVEAUTES.active && !masquee && settings.showNouveautes !== false);
      setFavoris(favs);
      setRecents(recs);
    })();
    return () => { monte = false; };
  }, [settings.showNouveautes]));

  const { th, t, inter, F, C } = ui0;
  const s = { ...ui0.s, ...propre(th, F) };
  const ui = { ...ui0, s };

  const modules = MODULES.filter(m => !m.versants || m.versants.includes(versant));
  const cherche = recherche.length >= 2;
  const resultats = cherche ? chercherFiches(MODULES, recherche) : [];

  const ouvrirFiche = (ficheId) => navigation.navigate('FicheDetail', { ficheId });
  const ouvrirModule = (moduleId) => navigation.navigate('Module', { moduleId });

  // La première section suit la tête de page, déjà séparée par son filet : elle
  // n'a pas besoin des 40 dp d'air des suivantes. Sans ce calcul, toutes les
  // sections sauf la première se retrouvaient collées à ce qui les précède.
  let premiereFaite = false;
  const espaceDeSection = () => {
    // `espaceSection` de la feuille commune est une HAUTEUR, faite pour un
    // intercalaire à part sur l'écran de fiche, où le titre doit rester
    // collant. Ici il n'y a pas de collage : c'est une marge qu'il faut.
    const style = premiereFaite ? s.avantSection : s.premiereSection;
    premiereFaite = true;
    return style;
  };

  const masquerNouveautes = async () => {
    await dismissNouveautes(NOUVEAUTES.version);
    setNouveautesVisible(false);
  };

  // Un raccourci vers une fiche : son titre, et le module d'où elle vient.
  // C'est une fonction qui rend un élément, pas un composant défini dans le
  // corps du rendu : un composant redéfini à chaque passe est un type neuf pour
  // React, qui démonte puis remonte tout son sous-arbre.
  const raccourci = (ficheId, index, derniere) => {
    const fiche = getFicheById(ficheId);
    if (!fiche) return null;
    return (
      <Numerote
        key={ficheId}
        ui={ui}
        style={[s.ligne, derniere && s.ligneSansFilet]}
        num={deuxChiffres(index + 1)}
        titre={fiche.titre}
        texte={fiche.categorie}
        fleche
        onPress={() => ouvrirFiche(ficheId)}
      />
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: th.bg }]} edges={['top']}>
      <StatusBar barStyle={th.statusBar} backgroundColor={th.bg} />

      <View style={s.tetePage}>
        <Text style={[s.marque, { fontSize: t(T.titre), lineHeight: t(T.titre) * 1.14 }]}>
          Fonctio<Text style={{ color: C.valeur }}>.</Text>
        </Text>
        <Text style={[s.accroche, { fontSize: t(T.lede), lineHeight: inter(T.lede) }]}>
          Pour une carrière plus claire
        </Text>

        <View style={s.recherche}>
          <Ionicons name="search" size={15} color={th.textMuted} />
          <TextInput
            style={[s.rechercheChamp, { fontSize: t(T.label) }]}
            placeholder="Rechercher une fiche, un droit…"
            placeholderTextColor={th.textMuted}
            value={recherche}
            onChangeText={setRecherche}
          />
          {recherche.length > 0 && (
            <TouchableOpacity onPress={() => setRecherche('')} hitSlop={8}>
              <Ionicons name="close" size={15} color={th.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[s.oeil, s.versantsOeil, { fontSize: t(T.oeil) }]}>
          Vous consultez la {LONG[versant].toLowerCase().replace('fonction publique', 'FP')}
        </Text>
        <View style={s.versants}>
          {VERSANTS.map(v => {
            const actif = versant === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[s.versant, actif && s.versantActif]}
                onPress={() => setVersant(v.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: actif }}
                accessibilityLabel={v.long}
              >
                <Text style={[s.versantTexte, { fontSize: t(T.valeur) }, actif && s.versantTexteActif]}>
                  {v.court}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContenu}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {cherche ? (
          <>
            <View style={espaceDeSection()}>
              <Section ui={ui} titre={`« ${recherche} »`} compte={resultats.length} />
            </View>
            {resultats.length === 0 ? (
              <Paragraphe ui={ui} style={s.vide}>
                Aucune fiche ne répond. Essayez un sigle ou un mot du titre : CLM, CMO,
                CITIS, contractuel, reclassement, PSC…
              </Paragraphe>
            ) : resultats.map((fiche, i) => (
              <Numerote
                key={fiche.id}
                ui={ui}
                style={[s.ligne, i === resultats.length - 1 && s.ligneSansFilet]}
                num={deuxChiffres(i + 1)}
                titre={fiche.titre}
                texte={fiche.resume}
                fleche
                onPress={() => ouvrirFiche(fiche.id)}
              />
            ))}
          </>
        ) : (
          <>
            {nouveautesVisible && (
              <View style={espaceDeSection()}>
                <BlocFilet ui={ui} couleur={C.versant} titre={NOUVEAUTES.titre} compte={NOUVEAUTES.version}>
                  {NOUVEAUTES.lignes.map((ligne, i) => (
                    <Paragraphe key={i} ui={ui} style={i > 0 && s.nouveauteSuivante}>{ligne}</Paragraphe>
                  ))}
                  <TouchableOpacity onPress={masquerNouveautes} activeOpacity={0.7} style={s.masquer}>
                    <Text style={[s.navTexte, { fontSize: t(T.num) }]}>Ne plus afficher</Text>
                  </TouchableOpacity>
                </BlocFilet>
              </View>
            )}

            {favoris.length > 0 && (
              <>
                <View style={espaceDeSection()}>
                  <Section ui={ui} titre="Vos favoris" compte={favoris.length} />
                </View>
                {favoris.slice(0, MAX_RACCOURCIS).map((id, i, tab) =>
                  raccourci(id, i, i === tab.length - 1))}
              </>
            )}

            {recents.length > 0 && (
              <>
                <View style={espaceDeSection()}>
                  <Section ui={ui} titre="Consultées récemment" compte={recents.length} />
                </View>
                {recents.slice(0, MAX_RACCOURCIS).map((id, i, tab) =>
                  raccourci(id, i, i === tab.length - 1))}
              </>
            )}

            <View style={espaceDeSection()}>
              <Section ui={ui} titre={LONG[versant]} compte={modules.length} />
            </View>
            {modules.map((module, i) => (
              <Numerote
                key={module.id}
                ui={ui}
                style={[s.ligne, i === modules.length - 1 && s.ligneSansFilet]}
                icone={iconeDeModule(module.id)}
                couleurIcone={module.color}
                titre={module.title}
                texte={module.description}
                fleche
                onPress={() => ouvrirModule(module.id)}
              />
            ))}

            <View style={s.avantSection}>
              <Section ui={ui} titre="Aller plus loin" />
            </View>
            {/* Depuis la refonte d'août 2026, l'assistant de service social n'est
                plus un module : c'est une fiche de « Vos interlocuteurs ». On
                garde sa mise en avant — c'est le point d'entrée humain de l'app,
                et souvent la personne qui la fait connaître. */}
            {!!getFicheById('role-ass') && (
              <Action
                ui={ui}
                titre="L'assistant de service social"
                texte={"Confidentiel, gratuit, indépendant de votre hiérarchie. Il vous accompagne "
                  + "sur toute difficulté, personnelle comme professionnelle."}
                onPress={() => ouvrirFiche('role-ass')}
              />
            )}
            <Action
              ui={ui}
              titre="Fonctio est 100 % gratuit"
              texte="Soutenir le projet sur Tipeee."
              onPress={() => Linking.openURL('https://www.tipeee.com/fonctio')}
            />

            <Text style={[s.mentions, { fontSize: t(T.source), lineHeight: t(T.source) * 1.7 }]}>
              Fiches vérifiées et sourcées · Légifrance
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const propre = (th, F) => StyleSheet.create({
  tetePage: {
    paddingHorizontal: V.zone, paddingTop: 6, paddingBottom: 12,
    borderBottomWidth: FILET, borderBottomColor: F.rubrique,
  },
  marque: { fontFamily: SERIF, color: th.textPrimary },
  accroche: { color: th.textMuted, marginTop: 2 },

  recherche: {
    flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 16,
    paddingBottom: 8, borderBottomWidth: FILET, borderBottomColor: F.rubrique,
  },
  rechercheChamp: { flex: 1, color: th.textPrimary, padding: 0 },

  // Trois parts égales : le sélecteur est ainsi centré par construction, et
  // chaque versant offre une cible de la même taille. En simples mots soulignés
  // il ne se voyait pas et se tassait à gauche.
  //
  // La part active porte l'accent de l'app — le même que l'onglet courant de la
  // barre du bas —, un fond clair et un trait de 2 dp. En simple panneau plus
  // clair, on ne voyait pas lequel des trois était choisi, et rien ne disait ce
  // que « FPE » désignait : d'où la ligne qui l'annonce en toutes lettres.
  versantsOeil: { marginTop: 16, marginBottom: 7 },
  versants: {
    flexDirection: 'row',
    backgroundColor: th.bgWarm, borderRadius: 3,
    borderWidth: FILET, borderColor: F.rubrique, overflow: 'hidden',
  },
  versant: {
    flex: 1, alignItems: 'center', paddingVertical: 11,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  versantActif: { backgroundColor: th.bgCard, borderBottomColor: Palette.terracotta },
  versantTexte: { fontFamily: MONO_LEGER, color: th.textMuted, letterSpacing: 1.8 },
  versantTexteActif: { fontFamily: MONO, color: Palette.terracotta },

  // Le premier titre de section n'a pas besoin des 40 dp d'air réservés aux
  // suivants : la tête de page est déjà séparée par son filet.
  premiereSection: { marginTop: 6 },
  avantSection: { marginTop: V.section },
  vide: { marginTop: 14 },
  nouveauteSuivante: { marginTop: 4 },
  masquer: { marginTop: 12, alignSelf: 'flex-start' },
});
