import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { geocode } from "../lib/geocode";
import { colors, fonts } from "../theme";

const MADRID = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

const computeRegion = (a, b) => {
  if (a && b) {
    const midLat = (a.latitude + b.latitude) / 2;
    const midLng = (a.longitude + b.longitude) / 2;
    const latDelta = Math.max(
      Math.abs(a.latitude - b.latitude) * 1.6 + 0.04,
      0.05
    );
    const lngDelta = Math.max(
      Math.abs(a.longitude - b.longitude) * 1.6 + 0.04,
      0.05
    );
    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }
  if (a)
    return { ...a, latitudeDelta: 0.06, longitudeDelta: 0.06 };
  if (b)
    return { ...b, latitudeDelta: 0.06, longitudeDelta: 0.06 };
  return MADRID;
};

export const TripMap = ({ from, to, height = 220, debounceMs = 700 }) => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!from && !to) {
      setFromCoords(null);
      setToCoords(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    const handle = setTimeout(async () => {
      const [f, t] = await Promise.all([
        from ? geocode(from) : Promise.resolve(null),
        to ? geocode(to) : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setFromCoords(f);
      setToCoords(t);
      setNotFound(!f && !t && (!!from || !!to));
      setLoading(false);
    }, debounceMs);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [from, to, debounceMs]);

  const region = computeRegion(fromCoords, toCoords);

  return (
    <View style={[styles.wrap, { height }]}>
      <MapView style={StyleSheet.absoluteFill} region={region}>
        {fromCoords && (
          <Marker
            coordinate={fromCoords}
            title="Origen"
            description={from}
            pinColor={colors.mustard}
          />
        )}
        {toCoords && (
          <Marker
            coordinate={toCoords}
            title="Destino"
            description={to}
            pinColor={colors.coral}
          />
        )}
        {fromCoords && toCoords && (
          <Polyline
            coordinates={[fromCoords, toCoords]}
            strokeColor={colors.ink}
            strokeWidth={3}
            lineDashPattern={[6, 4]}
          />
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.ink} size="small" />
          <Text style={styles.overlayText}>Buscando lugares...</Text>
        </View>
      )}
      {!loading && notFound && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            No encontramos esas direcciones
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: colors.paper,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.inkBorder,
  },
  overlayText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.ink,
  },
});
