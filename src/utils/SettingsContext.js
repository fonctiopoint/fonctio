// src/utils/SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from './storage';

export const FONT_SCALES = {
  small:  0.88,
  normal: 1.0,
  large:  1.14,
};

export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const updateSetting = async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await saveSettings(next);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
