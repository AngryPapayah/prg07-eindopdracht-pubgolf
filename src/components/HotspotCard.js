import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function HotspotCard({ hole, isFavorite, photoUri, onPress, compact }) {
  const { colors, t } = useSettings();

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.holeNumberBadge, { backgroundColor: colors.accent }]}>
          <Text style={styles.holeNumberText}>{hole.hole}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>
            {hole.name}
          </Text>
          <Text style={[styles.compactAddress, { color: colors.subtext }]} numberOfLines={1}>
            {hole.address}
          </Text>
        </View>
        <View style={[styles.parBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.parLabel}>{t.course.par}</Text>
          <Text style={styles.parValue}>{hole.par}</Text>
        </View>
        {isFavorite && <Text style={styles.favoriteIcon}>♥</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.fullCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.fullHeader}>
        <View style={[styles.holeNumberBadge, { backgroundColor: colors.accent }]}>
          <Text style={styles.holeNumberText}>{hole.hole}</Text>
        </View>
        <View style={styles.fullTitleBlock}>
          <Text style={[styles.fullName, { color: colors.text }]} numberOfLines={1}>
            {hole.name}
          </Text>
          <Text style={[styles.fullAddress, { color: colors.subtext }]} numberOfLines={1}>
            {hole.address}
          </Text>
        </View>
        {isFavorite && <Text style={styles.favoriteIcon}>♥</Text>}
      </View>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : null}

      <View style={[styles.drinkRow, { borderTopColor: colors.border }]}>
        <View style={[styles.parBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.parLabel}>{t.course.par}</Text>
          <Text style={styles.parValue}>{hole.par}</Text>
        </View>
        <Text style={[styles.drinkText, { color: colors.subtext }]} numberOfLines={1}>
          🍺 {hole.drink}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  fullTitleBlock: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '700',
  },
  fullAddress: {
    fontSize: 12,
    marginTop: 2,
  },
  photo: {
    width: '100%',
    height: 140,
  },
  drinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  drinkText: {
    fontSize: 13,
    flex: 1,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  compactAddress: {
    fontSize: 11,
    marginTop: 1,
  },
  holeNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holeNumberText: {
    color: '#1B4332',
    fontWeight: '800',
    fontSize: 15,
  },
  parBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  parLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  parValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#E63946',
  },
});
