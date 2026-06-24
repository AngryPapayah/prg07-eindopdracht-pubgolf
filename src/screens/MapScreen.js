import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useSettings } from '../context/SettingsContext';
import { fetchHoles } from '../services/api';
import HoleMarker from '../components/HoleMarker';

const LEIDEN_REGION = {
  latitude: 52.1568,
  longitude: 4.4881,
  latitudeDelta: 0.03,
  longitudeDelta: 0.02,
};

export default function MapScreen({ navigation, route }) {
  const { colors, t } = useSettings();
  const mapRef = useRef(null);
  const [holes, setHoles] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const focusHoleId = route?.params?.focusHoleId;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t.map.locationError);
      }
    })();
    fetchHoles().then(({ holes: h }) => setHoles(h));
  }, []);

  useEffect(() => {
    if (!focusHoleId || holes.length === 0) return;
    const hole = holes.find((h) => h.id === focusHoleId);
    if (!hole || !mapRef.current) return;
    mapRef.current.animateCamera(
      { center: { latitude: hole.lat, longitude: hole.lng }, zoom: 17 },
      { duration: 800 },
    );
  }, [focusHoleId, holes]);

  const handleMarkerPress = (hole) => {
    navigation.navigate('HoleDetail', { hole });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={LEIDEN_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {holes.map((hole) => (
          <HoleMarker key={hole.id} hole={hole} onPress={handleMarkerPress} />
        ))}
      </MapView>

      {locationError && (
        <View style={[styles.errorBanner, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{locationError}</Text>
        </View>
      )}

      {holes.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorBanner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
