// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider } from './src/utils/SettingsContext';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <SafeAreaProvider>
          {!splashDone ? (
            <SplashScreen onReady={() => setSplashDone(true)} />
          ) : (
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          )}
        </SafeAreaProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
