// src/screens/SearchScreen.js - kept minimal, main search is now in HomeScreen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, useTheme } from '../theme';

export default function SearchScreen({ navigation }) {
  const theme = useTheme();
  // Navigation vers home avec focus sur la recherche
  React.useEffect(() => {
    navigation.goBack();
  }, []);
  return null;
}
