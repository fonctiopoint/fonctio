// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/utils/SettingsContext';
import AnimatedSplash from './src/screens/SplashScreen';

// Maintenir le splash natif affiché jusqu'à ce qu'on soit prêts
SplashScreen.preventAutoHideAsync();

const SlateTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#2D3748', card: '#2D3748' },
};

const SlateDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#1A1A2E', card: '#1E1E3A' },
};

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimDone, setSplashAnimDone] = useState(false);
  const { settings, loaded } = useSettings();
  const systemScheme = useColorScheme();

  const isDark = settings.darkMode === 'dark' ||
    (settings.darkMode === 'auto' && systemScheme === 'dark');

  // Dès que les settings sont chargés, on est prêts
  useEffect(() => {
    if (loaded) setAppReady(true);
  }, [loaded]);

  // Cacher le splash natif quand on est prêts → laisser notre splash animé prendre le relais
  const onLayoutReady = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  const bgColor = isDark ? '#1A1A2E' : '#2D3748';

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
