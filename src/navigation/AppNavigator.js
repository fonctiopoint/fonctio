// src/navigation/AppNavigator.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, useTheme } from '../theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ModuleScreen from '../screens/ModuleScreen';
import FicheDetailScreen from '../screens/FicheDetailScreen';
import SimulateurScreen from '../screens/SimulateurScreen';
import ProfilScreen from '../screens/ProfilScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const VersantContext = React.createContext({ versant: 'fpe', setVersant: () => {} });

const HomeStack = ({ versant, setVersant }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain">
      {props => <HomeScreen {...props} versant={versant} setVersant={setVersant} />}
    </Stack.Screen>
    <Stack.Screen name="Module" component={ModuleScreen} />
    <Stack.Screen name="FicheDetail" component={FicheDetailScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);

const SimulateurStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SimulateurMain" component={SimulateurScreen} />
    <Stack.Screen name="FicheDetail" component={FicheDetailScreen} />
  </Stack.Navigator>
);

const ProfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfilMain" component={ProfilScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const CustomTabBar = ({ state, navigation }) => {
  const theme = useTheme();
  const tabs = [
    { name: 'HomeTabs', label: 'Accueil', icon: 'home', iconOutline: 'home-outline' },
    { name: 'SimulateurTabs', label: 'Simulateur', icon: 'calculator', iconOutline: 'calculator-outline' },
    { name: 'ProfilTabs', label: 'À propos', icon: 'person', iconOutline: 'person-outline' },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.tabBg, borderTopColor: theme.tabBorder }]}>
      {state.routes.map((route, index) => {
        const tab = tabs[index];
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
            activeOpacity={0.7}
          >
            <Ionicons name={isFocused ? tab.icon : tab.iconOutline} size={22} color={isFocused ? Colors.terracotta : theme.textMuted} />
            {isFocused && <View style={styles.tabDot} />}
            <Text style={[styles.tabLabel, { color: isFocused ? Colors.terracotta : theme.textMuted }, isFocused && styles.tabLabelActive]}>
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
    borderTopWidth: 0.5,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.terracotta, marginTop: 1 },
  tabLabel: { fontSize: 10, fontWeight: '400', marginTop: 1 },
  tabLabelActive: { fontWeight: '500' },
});
