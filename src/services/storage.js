import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: 'pubgolf_favorites',
  NOTES: 'pubgolf_notes',
  PHOTOS: 'pubgolf_photos',
  CACHE: 'pubgolf_holes_cache',
};

// --- Favorites ---

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavorite(holeId) {
  const favorites = await getFavorites();
  const index = favorites.indexOf(holeId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(holeId);
  }
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  return favorites;
}

// --- Notes ---

export async function getNotes() {
  const raw = await AsyncStorage.getItem(KEYS.NOTES);
  return raw ? JSON.parse(raw) : {};
}

export async function saveNote(holeId, text) {
  const notes = await getNotes();
  notes[holeId] = text;
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
}

export async function deleteNote(holeId) {
  const notes = await getNotes();
  delete notes[holeId];
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
}

// --- Photos ---

export async function getPhotos() {
  const raw = await AsyncStorage.getItem(KEYS.PHOTOS);
  return raw ? JSON.parse(raw) : {};
}

export async function savePhoto(holeId, uri) {
  const photos = await getPhotos();
  photos[holeId] = uri;
  await AsyncStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
}

export async function deletePhoto(holeId) {
  const photos = await getPhotos();
  delete photos[holeId];
  await AsyncStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
}

// --- Holes cache (offline fallback) ---

export async function cacheHoles(holes) {
  await AsyncStorage.setItem(KEYS.CACHE, JSON.stringify(holes));
}

export async function getCachedHoles() {
  const raw = await AsyncStorage.getItem(KEYS.CACHE);
  return raw ? JSON.parse(raw) : null;
}
