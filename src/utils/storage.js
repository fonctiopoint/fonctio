// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFicheById } from '../data/fiches';

const KEYS = {
  FAVORIS: 'fonctio_favoris',
  NOUVEAUTES_DISMISSED: 'fonctio_nouveautes_dismissed',
  RECENT: 'fonctio_recent',
  SETTINGS: 'fonctio_settings',
  PURGE: 'fonctio_purge',
};

// ── Purge des références obsolètes ─────────────────────────────────────────
// La refonte d'août 2026 a supprimé ou fusionné 15 fiches. Les favoris et les
// fiches récentes enregistrés sur les appareils pointent vers des identifiants
// qui n'existent plus : sans nettoyage, l'ouverture d'un favori donne un écran
// vide. On purge une seule fois, puis le filtrage ci-dessous suffit.
const PURGE_VERSION = '2026-08-refonte';

export async function purgeObsolete() {
  try {
    const done = await AsyncStorage.getItem(KEYS.PURGE);
    if (done === PURGE_VERSION) return false;
    await AsyncStorage.multiRemove([KEYS.FAVORIS, KEYS.RECENT]);
    await AsyncStorage.setItem(KEYS.PURGE, PURGE_VERSION);
    return true;
  } catch { return false; }
}

// Filet permanent : ne jamais renvoyer un identifiant qui n'existe plus,
// quelle que soit la raison (purge non passée, restauration de sauvegarde…).
function garderExistantes(ids) {
  return (Array.isArray(ids) ? ids : []).filter(id => !!getFicheById(id));
}

// ── Favoris ────────────────────────────────────────────────────────────────
export async function getFavoris() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORIS);
    return garderExistantes(raw ? JSON.parse(raw) : []);
  } catch { return []; }
}

export async function addFavori(ficheId) {
  try {
    const current = await getFavoris();
    if (!current.includes(ficheId)) {
      await AsyncStorage.setItem(KEYS.FAVORIS, JSON.stringify([ficheId, ...current]));
    }
  } catch {}
}

export async function removeFavori(ficheId) {
  try {
    const current = await getFavoris();
    await AsyncStorage.setItem(KEYS.FAVORIS, JSON.stringify(current.filter(id => id !== ficheId)));
  } catch {}
}

export async function isFavori(ficheId) {
  const list = await getFavoris();
  return list.includes(ficheId);
}

// ── Fiches récentes ────────────────────────────────────────────────────────
const MAX_RECENT = 5;

export async function addRecent(ficheId) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECENT);
    const current = raw ? JSON.parse(raw) : [];
    const updated = [ficheId, ...current.filter(id => id !== ficheId)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(KEYS.RECENT, JSON.stringify(updated));
  } catch {}
}

export async function getRecent() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECENT);
    return garderExistantes(raw ? JSON.parse(raw) : []);
  } catch { return []; }
}

// ── Bannière Nouveautés ────────────────────────────────────────────────────
export async function isNouveautesDismissed(version) {
  try {
    const val = await AsyncStorage.getItem(KEYS.NOUVEAUTES_DISMISSED);
    return val === version;
  } catch { return false; }
}

export async function dismissNouveautes(version) {
  try {
    await AsyncStorage.setItem(KEYS.NOUVEAUTES_DISMISSED, version);
  } catch {}
}

// ── Réglages (clés unifiées) ───────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  fontSize: 'normal',       // 'small' | 'normal' | 'large'
  darkMode: 'auto',         // 'auto' | 'light' | 'dark'
  showNouveautes: true,     // boolean — UNE SEULE CLÉ pour toute l'app
};

export async function getSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    // Fusionner avec les défauts pour les nouvelles clés
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { return DEFAULT_SETTINGS; }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}
