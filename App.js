// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
// Import PROFOND, graisse par graisse. L'index de ces paquets fait un require()
// de TOUTES les graisses et de toutes les italiques : importer depuis la racine
// embarquait 7,6 Mo de polices au lieu de 388 Ko. Vérifié sur un expo export.
import { Newsreader_500Medium } from '@expo-google-fonts/newsreader/500Medium';
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/utils/SettingsContext';
import { purgeObsolete } from './src/utils/storage';
import AnimatedSplash from './src/screens/SplashScreen';

// Maintenir le splash natif affiché jusqu'à ce qu'on soit prêts
SplashScreen.preventAutoHideAsync();

const SlateTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#2D3748', card: '#2D3748' },
};

const SlateDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#1A1714', card: '#282219' },
};

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimDone, setSplashAnimDone] = useState(false);
  const { settings, loaded } = useSettings();
  const systemScheme = useColorScheme();

  // Les deux familles de la direction « Registre ». Elles sont EMBARQUÉES, et
  // non demandées au système : sur ce Motorola, « serif », « monospace »,
  // « Georgia » et « Roboto Mono » renvoient tous la même police d'interface.
  // Constaté sur l'appareil, le 02/09/2026. Sans ces fichiers, la règle des
  // deux familles ne tient sur aucun téléphone qui substitue ses polices.
  // La police de lecture reste celle du système.
  const [policesPretes] = useFonts({
    Newsreader_500Medium,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  const isDark = settings.darkMode === 'dark' ||
    (settings.darkMode === 'auto' && systemScheme === 'dark');

  // Purge unique des favoris et fiches récentes pointant vers des fiches
  // supprimées par la refonte d'août 2026 (voir storage.js).
  useEffect(() => {
    purgeObsolete();
  }, []);

  // Prêts quand les réglages sont chargés ET les polices disponibles : rendre
  // avant ferait afficher un premier écran dans la police de repli.
  useEffect(() => {
    if (loaded && policesPretes) setAppReady(true);
  }, [loaded, policesPretes]);

  // Cacher le splash natif quand on est prêts → laisser notre splash animé prendre le relais
  const onLayoutReady = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  const bgColor = isDark ? '#1A1714' : '#2D3748';

  // Avant que l'app soit prête : fond ardoise uni (le splash natif est encore affiché par-dessus)
  if (!appReady) {
    return <View style={{ flex: 1, backgroundColor: bgColor }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }} onLayout={onLayoutReady}>
      {!splashAnimDone ? (
        // Notre splash animé JS prend le relais juste après que le splash natif disparaît
        <AnimatedSplash onReady={() => setSplashAnimDone(true)} />
      ) : (
        <NavigationContainer theme={isDark ? SlateDarkTheme : SlateTheme}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      )}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
