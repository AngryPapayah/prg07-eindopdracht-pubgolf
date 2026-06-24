import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { useSettings } from '../context/SettingsContext';

export default function HoleMarker({ hole, onPress }) {
  const { colors, t } = useSettings();

  return (
    <Marker
      coordinate={{ latitude: hole.lat, longitude: hole.lng }}
      onPress={() => onPress(hole)}
    >
      <View style={[styles.markerContainer, { borderColor: colors.accent }]}>
        <Text style={styles.markerNumber}>{hole.hole}</Text>
      </View>
      <Callout tooltip>
        <View style={[styles.callout, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.calloutHole, { color: colors.accent }]}>
            {t.map.hole} {hole.hole}
          </Text>
          <Text style={[styles.calloutName, { color: colors.text }]}>{hole.name}</Text>
          <Text style={[styles.calloutDrink, { color: colors.subtext }]}>
            🍺 {hole.drink} · {t.map.par} {hole.par}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerNumber: {
    color: '#1B4332',
    fontWeight: '800',
    fontSize: 16,
  },
  callout: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutHole: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutDrink: {
    fontSize: 12,
  },
});
