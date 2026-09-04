// src/theme/index.js
import { useColorScheme } from 'react-native';
import { useContext } from 'react';
import { SettingsContext, FONT_SCALES } from '../utils/SettingsContext';

export const Palette = {
  terracotta: '#C4673A', terracottaLight: '#F0D5C4', terracottaDark: '#8B3E1F',
  sky: '#3A7CA5', skyLight: '#D6EAF4',
  olive: '#5C6B45', oliveLight: '#E8EDDF',
  amber: '#D4972A', amberLight: '#FBF0D6',
  danger: '#C0392B', dangerLight: '#FDECEA',
};

// L'encre est CHAUDE, et c'est le point. Elle était en ardoise bleutée
// (#2D3748) sur un fond crème : deux températures opposées, et l'app se lisait
// comme un formulaire administratif. Le brun-gris ci-dessous appartient à la
// même famille que le fond, le terracotta et le sable — l'écran se lit comme
// une page imprimée plutôt que comme une interface.
// Contrastes vérifiés sur le fond crème : 13:1 pour l'encre pleine, 7:1 pour
// la secondaire, 4,3:1 pour l'atténuée — au moins autant qu'avant.
const light = {
  bg: '#FAF7F2', bgWarm: '#F5EFE4', bgSand: '#E8DECE', bgCard: '#FFFFFF', bgHeader: '#2D3748',
  textPrimary: '#332F29', textSecondary: '#57524A', textMuted: '#7C766C', textInverse: '#FFFFFF',
  border: 'rgba(51,47,41,0.10)', statusBar: 'dark-content', tabBg: '#FFFFFF', tabBorder: 'rgba(51,47,41,0.10)',
};

const dark = {
  bg: '#1A1A2E', bgWarm: '#16213E', bgSand: '#0F3460', bgCard: '#1E1E3A', bgHeader: '#12122A',
  textPrimary: '#F0EEE9', textSecondary: '#C5C3BE', textMuted: '#8A8880', textInverse: '#FFFFFF',
  border: 'rgba(255,255,255,0.10)', statusBar: 'light-content', tabBg: '#1E1E3A', tabBorder: 'rgba(255,255,255,0.08)',
};

export function useTheme() {
  const systemScheme = useColorScheme();
  const { settings } = useContext(SettingsContext);

  // Dark mode : auto (système) | light | dark
  const mode = settings?.darkMode || 'auto';
  const isDark = mode === 'dark' || (mode === 'auto' && systemScheme === 'dark');
  const theme = isDark ? dark : light;

  // Font scale
  const scale = FONT_SCALES[settings?.fontSize || 'normal'] || 1.0;
  const fs = (base) => Math.round(base * scale);

  return { ...theme, isDark, fs };
}

export const Colors = {
  ...Palette,
  cream: '#FAF7F2', warm: '#F5EFE4', sand: '#E8DECE',
  slate: '#2D3748', slateMid: '#4A5568', slateLight: '#718096',
  white: '#FFFFFF', border: 'rgba(0,0,0,0.08)',
};

export const Typography = {
  xs: 11, sm: 12, base: 14, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 28,
  light: '300', regular: '400', medium: '500', semibold: '600', bold: '700',
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const Radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
export const Shadow = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
};
