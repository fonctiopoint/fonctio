// src/navigation/AppNavigator.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useTheme } from '../theme';
import { MONO_LEGER, T, couleurs, filets } from '../theme/registre';

import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ModuleScreen from '../screens/ModuleScreen';
import FicheRegistreScreen from '../screens/FicheRegistreScreen';
import SimulateurScreen from '../screens/SimulateurScreen';
import ProfilScreen from '../screens/ProfilScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
// Réexporté pour les imports existants ; la déclaration est dans son propre
// fichier, hors du cycle AppNavigator ↔ écrans.
import { VersantContext } from './VersantContext';
export { VersantContext };

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const HomeStack = ({ versant, setVersant }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain">
      {props => <HomeScreen {...props} versant={versant} setVersant={setVersant} />}
    </Stack.Screen>
    <Stack.Screen name="Module" component={ModuleScreen} />
    <Stack.Screen name="FicheDetail" component={FicheRegistreScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);

const SimulateurStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SimulateurMain" component={SimulateurScreen} />
    <Stack.Screen name="FicheDetail" component={FicheRegistreScreen} />
  </Stack.Navigator>
);

const ProfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfilMain" component={ProfilScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

// La barre d'onglets, dans la direction « Registre » : fond sable comme les
// bandes de section, un filet qui la sépare du contenu, et un TRAIT DE 2 dp au-
// dessus de l'onglet courant. Le point sous l'icône a disparu — la couleur et
// le trait disaient déjà la même chose trois fois.
const CustomTabBar = ({ state, navigation }) => {
  const theme = useTheme();
  const F = filets(theme.isDark);
  const C = couleurs(theme.isDark);
  const tabs = [
    { name: 'HomeTabs', label: 'Accueil', icon: 'home', iconOutline: 'home-outline' },
    { name: 'SimulateurTabs', label: 'Simulateur', icon: 'calculator', iconOutline: 'calculator-outline' },
    { name: 'ProfilTabs', label: 'À propos', icon: 'person', iconOutline: 'person-outline' },
  ];

  // Toucher l'onglet COURANT ramène à sa racine. C'est le geste que tout le
  // monde connaît, et il ne faisait rien : la barre se contentait d'ignorer un
  // appui sur l'onglet déjà actif. Depuis une fiche, il n'y avait donc aucun
  // moyen évident de revenir à l'accueil, sinon la petite flèche du fil.
  const retourOuAller = (route, actif) => {
    if (!actif) { navigation.navigate(route.name); return; }
    // route.state n'existe que si la pile a déjà été rendue ; sans elle, on est
    // déjà à la racine et il n'y a rien à dépiler.
    const pile = route.state;
    if (pile && pile.index > 0) {
      navigation.dispatch({ ...StackActions.popToTop(), target: pile.key });
    }
  };

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.bgWarm, borderTopColor: F.rubrique }]}>
      {state.routes.map((route, index) => {
        const tab = tabs[index];
        const actif = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, { borderTopColor: actif ? C.valeur : 'transparent' }]}
            onPress={() => retourOuAller(route, actif)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={actif ? tab.icon : tab.iconOutline}
              size={21}
              color={actif ? C.valeur : theme.textMuted}
            />
            <Text style={[styles.tabLabel, { color: actif ? C.valeur : theme.textMuted }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function MainTabs({ versant, setVersant }) {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTabs">
        {() => <HomeStack versant={versant} setVersant={setVersant} />}
      </Tab.Screen>
      <Tab.Screen name="SimulateurTabs" component={SimulateurStack} />
      <Tab.Screen name="ProfilTabs" component={ProfilStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [versant, setVersant] = useState(null);
  const appOpacity = useRef(new Animated.Value(0)).current;

  const handleVersantSelected = (v) => {
    setVersant(v);
    Animated.timing(appOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  if (!versant) return <WelcomeScreen onVersantSelected={handleVersantSelected} />;

  return (
    <VersantContext.Provider value={{ versant, setVersant }}>
      <Animated.View style={{ flex: 1, opacity: appOpacity }}>
        <MainTabs versant={versant} setVersant={setVersant} />
      </Animated.View>
    </VersantContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingHorizontal: 8,
  },
  // Le trait de l'onglet courant est la bordure haute de l'onglet lui-même : il
  // touche ainsi le filet de la barre, sans intercalaire à positionner.
  tabItem: { flex: 1, alignItems: 'center', gap: 4, paddingTop: 9, borderTopWidth: 2 },
  tabLabel: { fontFamily: MONO_LEGER, fontSize: T.num, letterSpacing: 0.5 },
});
