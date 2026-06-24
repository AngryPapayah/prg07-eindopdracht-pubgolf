import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { fetchHoles } from '../services/api';
import { getFavorites, getPhotos } from '../services/storage';
import HotspotCard from '../components/HotspotCard';

export default function CourseScreen({ navigation }) {
  const { colors, listView, t } = useSettings();
  const [holes, setHoles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState(null);

  const loadHoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHoles();
      setHoles(result.holes);
      setFromCache(result.fromCache);
    } catch {
      setError(t.course.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
      getPhotos().then(setPhotos);
    }, []),
  );

  const handlePress = (hole) => {
    navigation.navigate('HoleDetail', { hole });
  };

  const handleShowOnMap = (hole) => {
    navigation.navigate('Kaart', {
      screen: 'MapScreen',
      params: { focusHoleId: hole.id },
    });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>{t.course.loading}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={loadHoles}
        >
          <Text style={styles.retryBtnText}>{t.course.retry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {fromCache && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.cardAlt, borderColor: colors.accent }]}>
          <Text style={[styles.offlineText, { color: colors.accent }]}>📶 {t.course.offline}</Text>
        </View>
      )}
      <FlatList
        data={holes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HotspotCard
            hole={item}
            isFavorite={favorites.includes(item.id)}
            photoUri={photos[item.id]}
            onPress={() => handlePress(item)}
            compact={listView === 'compact'}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subtext }]}>{t.course.noHoles}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  offlineBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
