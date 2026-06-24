import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Share,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSettings } from '../context/SettingsContext';
import { useGame } from '../context/GameContext';
import {
  getFavorites,
  toggleFavorite,
  getNotes,
  saveNote,
  deleteNote,
  getPhotos,
  savePhoto,
  deletePhoto,
} from '../services/storage';

export default function HoleDetailScreen({ route, navigation }) {
  const { hole } = route.params;
  const { colors, t } = useSettings();
  const { players, scores, gameActive, setScore } = useGame();

  const [isFavorite, setIsFavorite] = useState(false);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [sipsInput, setSipsInput] = useState({});

  useEffect(() => {
    navigation.setOptions({ title: `Hole ${hole.hole} – ${hole.name}` });

    getFavorites().then((favs) => setIsFavorite(favs.includes(hole.id)));
    getNotes().then((notes) => {
      const n = notes[hole.id] || '';
      setNote(n);
      setSavedNote(n);
    });
    getPhotos().then((photos) => setPhotoUri(photos[hole.id] || null));

    if (gameActive) {
      const initialSips = {};
      players.forEach((p) => {
        initialSips[p] = scores[p]?.[hole.id]?.toString() || '';
      });
      setSipsInput(initialSips);
    }
  }, [hole.id]);

  const handleToggleFavorite = async () => {
    const updated = await toggleFavorite(hole.id);
    setIsFavorite(updated.includes(hole.id));
  };

  const handleSaveNote = async () => {
    await saveNote(hole.id, note);
    setSavedNote(note);
  };

  const handleDeleteNote = async () => {
    await deleteNote(hole.id);
    setNote('');
    setSavedNote('');
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', 'Camera permissie vereist');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await savePhoto(hole.id, uri);
      setPhotoUri(uri);
    }
  };

  const handleDeletePhoto = async () => {
    await deletePhoto(hole.id);
    setPhotoUri(null);
  };

  const handleSaveScores = () => {
    players.forEach((p) => {
      const sips = parseInt(sipsInput[p], 10);
      if (!isNaN(sips) && sips > 0) {
        setScore(p, hole.id, sips);
      }
    });
    Alert.alert('', 'Scores opgeslagen!');
  };

  const handleShare = async () => {
    const text = t.detail.shareText
      .replace('{hole}', hole.hole)
      .replace('{name}', hole.name)
      .replace('{address}', hole.address)
      .replace('{drink}', hole.drink)
      .replace('{par}', hole.par)
      .replace('{note}', savedNote || '—');

    await Share.share({ message: text, title: hole.name });
  };

  const sectionStyle = [styles.section, { backgroundColor: colors.card, borderColor: colors.border }];
  const labelStyle = [styles.label, { color: colors.accent }];
  const textStyle = [styles.bodyText, { color: colors.text }];
  const subStyle = [styles.subText, { color: colors.subtext }];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.headerTop}>
            <View style={[styles.holeBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.holeBadgeText}>{hole.hole}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.holeName, { color: colors.text }]}>{hole.name}</Text>
              <Text style={subStyle}>{hole.address}</Text>
            </View>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favBtn}>
              <Text style={[styles.favIcon, { color: isFavorite ? '#E63946' : colors.subtext }]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.drinkRow, { borderTopColor: colors.border }]}>
            <View style={[styles.parPill, { backgroundColor: colors.primary }]}>
              <Text style={styles.parPillLabel}>Par</Text>
              <Text style={styles.parPillValue}>{hole.par}</Text>
            </View>
            <Text style={[styles.drinkText, { color: colors.text }]}>🍺 {hole.drink}</Text>
            <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { borderColor: colors.accent }]}>
              <Text style={[styles.shareBtnText, { color: colors.accent }]}>↑ {t.detail.share}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.description, { color: colors.subtext }]}>{hole.description}</Text>
        </View>

        {/* Foto */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>📷 {t.detail.photo}</Text>
          {photoUri ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <View style={styles.photoBtns}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.primary }]}
                  onPress={handleTakePhoto}
                >
                  <Text style={styles.btnText}>{t.detail.changePhoto}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.danger }]}
                  onPress={handleDeletePhoto}
                >
                  <Text style={styles.btnText}>{t.detail.deletePhoto}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.photoPlaceholder, { borderColor: colors.border }]}
              onPress={handleTakePhoto}
            >
              <Text style={[styles.photoPlaceholderText, { color: colors.subtext }]}>
                📷 {t.detail.takePhoto}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notitie */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>📝 {t.detail.notes}</Text>
          <TextInput
            style={[styles.noteInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            value={note}
            onChangeText={setNote}
            placeholder={t.detail.notesPlaceholder}
            placeholderTextColor={colors.subtext}
            multiline
            numberOfLines={4}
          />
          <View style={styles.noteBtns}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary }]}
              onPress={handleSaveNote}
            >
              <Text style={styles.btnText}>{t.detail.saveNote}</Text>
            </TouchableOpacity>
            {savedNote.length > 0 && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.danger }]}
                onPress={handleDeleteNote}
              >
                <Text style={styles.btnText}>{t.detail.deleteNote}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Score invoer */}
        <View style={sectionStyle}>
          <Text style={labelStyle}>🏌️ {t.detail.score}</Text>
          {!gameActive ? (
            <Text style={subStyle}>{t.detail.noActiveGame}</Text>
          ) : (
            <>
              {players.map((player) => (
                <View key={player} style={styles.playerScoreRow}>
                  <Text style={[styles.playerScoreName, { color: colors.text }]}>{player}</Text>
                  <TextInput
                    style={[styles.sipsInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    value={sipsInput[player] || ''}
                    onChangeText={(val) => setSipsInput((prev) => ({ ...prev, [player]: val }))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.subtext}
                    maxLength={2}
                  />
                  <Text style={subStyle}>{t.detail.enterSips}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.accent, marginTop: 8 }]}
                onPress={handleSaveScores}
              >
                <Text style={[styles.btnText, { color: '#1B4332' }]}>{t.detail.saveScore}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 12,
    gap: 12,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  holeBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holeBadgeText: {
    color: '#1B4332',
    fontWeight: '800',
    fontSize: 18,
  },
  holeName: {
    fontSize: 17,
    fontWeight: '700',
  },
  favBtn: {
    padding: 6,
  },
  favIcon: {
    fontSize: 26,
  },
  drinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  parPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  parPillLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  parPillValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  drinkText: {
    flex: 1,
    fontSize: 14,
  },
  shareBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 14,
  },
  subText: {
    fontSize: 13,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  photoBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  photoPlaceholder: {
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 14,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  noteBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  playerScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  playerScoreName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  sipsInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    width: 56,
  },
});
