import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Chip } from "../../src/components/Chip";
import { TripMap } from "../../src/components/TripMap";
import {
  CarIcon,
  ChatIcon,
  ChevronLeftIcon,
  PinIcon,
  StarIcon,
} from "../../src/icons";
import {
  cancelReservation,
  cancelTrip as cancelTripApi,
  fetchTrip,
} from "../../src/api/trips";
import { colors, fonts, radius } from "../../src/theme";

const fullName = (u: any) =>
  `${u?.name || ""} ${u?.surname || ""}`.trim() || "Sin nombre";

const initials = (u: any) => {
  const n = (u?.name?.[0] || "").toUpperCase();
  const s = (u?.surname?.[0] || "").toUpperCase();
  return n + s || "?";
};

const carLabel = (car: any) =>
  car ? [car.make, car.color].filter(Boolean).join(" · ") : "";

const DAY_LABELS: Record<string, string> = {
  L: "L",
  M: "M",
  X: "X",
  J: "J",
  V: "V",
  S: "S",
  D: "D",
};

export default function TripDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const { trip: data } = await fetchTrip(id);
        setTrip(data);
      } catch (err: any) {
        Alert.alert(
          "Error",
          err?.response?.data?.message || err?.message || "No se pudo cargar"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Trayecto no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isMyTrip = String(trip.driver?._id) === String(user?._id);
  const isPassenger = trip.passengers?.some(
    (p: any) => String(p._id) === String(user?._id)
  );
  const seatsTaken = trip.seatsTaken ?? trip.passengers?.length ?? 0;

  const handleCancelReservation = () => {
    Alert.alert(
      "Cancelar reserva",
      "¿Seguro que quieres dejar este trayecto?",
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Si, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              await cancelReservation(id!);
              router.back();
            } catch (err: any) {
              Alert.alert(
                "Error",
                err?.response?.data?.message || err?.message
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelTrip = () => {
    Alert.alert(
      "Cancelar trayecto",
      "El trayecto se cancela para todos los pasajeros. Esta accion no se puede deshacer.",
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar trayecto",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              await cancelTripApi(id!);
              router.back();
            } catch (err: any) {
              Alert.alert(
                "Error",
                err?.response?.data?.message || err?.message
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleChat = () => {
    if (trip?.threadId) {
      router.push(`/chat/${trip.threadId}`);
    } else {
      Alert.alert(
        "Sin chat",
        "Este trayecto no tiene chat asociado (probablemente fue creado antes de la Fase 6)."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeftIcon size={18} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del trayecto</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusBlock}>
          {isMyTrip ? (
            <Chip tone="ink">CONDUCTOR · TU TRAYECTO</Chip>
          ) : isPassenger ? (
            <Chip tone="leaf">RESERVADO</Chip>
          ) : (
            <Chip tone="ghost">DISPONIBLE</Chip>
          )}
          <Text style={styles.heroTitle}>
            {trip.from} → {trip.to}
          </Text>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeHead}>
            <Text style={styles.routeHeadText}>
              DIARIO {trip.days.join(" · ")}
            </Text>
            <Text style={styles.routeHeadId}>
              #{String(trip._id).slice(-6).toUpperCase()}
            </Text>
          </View>

          <View style={styles.routeTimes}>
            <View style={styles.routeTimeCol}>
              <Text style={styles.routeTimeMain}>{trip.departTime}</Text>
              <Text style={styles.routeTimeLabel}>SALIDA</Text>
            </View>
            <View style={styles.routeMiddleCol}>
              <View style={styles.routeMiddleLine}>
                <View style={styles.routeDot} />
                <View style={styles.routeLine} />
                <CarIcon size={16} color={colors.warmDark} />
                <View style={styles.routeLine} />
                <PinIcon size={14} color={colors.warmDark} filled />
              </View>
              {(trip.distanceKm || trip.durationMin) && (
                <Text style={styles.routeMeta}>
                  {trip.durationMin ? `${trip.durationMin} min` : ""}
                  {trip.distanceKm && trip.durationMin ? " · " : ""}
                  {trip.distanceKm ? `${trip.distanceKm} km` : ""}
                </Text>
              )}
            </View>
            <View style={styles.routeTimeCol}>
              <Text style={styles.routeTimeMain}>{trip.arriveTime || "—"}</Text>
              <Text style={styles.routeTimeLabel}>LLEGADA</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routePlaces}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routePlaceLabel}>RECOGIDA</Text>
              <Text style={styles.routePlace}>{trip.from}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routePlaceLabel}>DESTINO</Text>
              <Text style={styles.routePlace}>{trip.to}</Text>
            </View>
          </View>

          {trip.returnTime && (
            <View style={[styles.routeDivider, { marginVertical: 12 }]} />
          )}
          {trip.returnTime && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.routePlaceLabel}>VUELTA</Text>
              <Text style={styles.routePlace}>{trip.returnTime}</Text>
            </View>
          )}
        </View>

        <View style={styles.mapWrap}>
          <TripMap from={trip.from} to={trip.to} height={180} />
        </View>

        <Section title="Conductor">
          <View style={styles.driverRow}>
            <Avatar
              initials={initials(trip.driver)}
              color={trip.driver?.avatarColor || colors.mustard}
              size={48}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{fullName(trip.driver)}</Text>
              <View style={styles.driverMetaRow}>
                <StarIcon size={11} color={colors.mustard} />
                <Text style={styles.driverMeta}>
                  {(trip.driver?.rating ?? 5).toFixed(1)} ·{" "}
                  {carLabel(trip.driver?.car) || "Sin coche"}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleChat} style={styles.chatBtn}>
              <ChatIcon size={18} color={colors.cream} />
            </TouchableOpacity>
          </View>
        </Section>

        <Section
          title="Pasajeros"
          right={`${seatsTaken}/${trip.seatsTotal}`}
        >
          {trip.passengers && trip.passengers.length > 0 ? (
            trip.passengers.map((p: any, i: number) => {
              const me = String(p._id) === String(user?._id);
              return (
                <View
                  key={p._id}
                  style={[
                    styles.passengerRow,
                    i < trip.passengers.length - 1 && styles.rowDivider,
                  ]}
                >
                  <Avatar
                    initials={initials(p)}
                    color={p.avatarColor || colors.mustard}
                    size={32}
                  />
                  <Text style={styles.passengerName}>
                    {fullName(p)}
                    {me ? " (tu)" : ""}
                  </Text>
                  {me && <Chip tone="mustard">TU</Chip>}
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyPax}>Aun no hay pasajeros</Text>
          )}
        </Section>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>PRECIO</Text>
          <Text style={styles.priceAmount}>
            {trip.perDay.toFixed(2)}€
            <Text style={styles.priceUnit}> / dia</Text>
          </Text>
          <Text style={styles.priceSub}>
            ~{(trip.monthlyEstimate || 0).toFixed(2)}€ estimados al mes
          </Text>
        </View>

        <View style={styles.actions}>
          {isMyTrip && (
            <Button
              block
              variant="danger"
              onPress={handleCancelTrip}
              loading={actionLoading}
            >
              Cancelar trayecto
            </Button>
          )}
          {isPassenger && (
            <Button
              block
              variant="danger"
              onPress={handleCancelReservation}
              loading={actionLoading}
            >
              Cancelar mi reserva
            </Button>
          )}
          {!isMyTrip && !isPassenger && (
            <Text style={styles.viewerNote}>
              No estas inscrita en este trayecto.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, right, children }: any) => (
  <View style={{ marginTop: 16 }}>
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {right && <Text style={styles.sectionRight}>{right}</Text>}
    </View>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
  },
  scroll: { padding: 18, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: colors.coral, fontFamily: fonts.sansMedium },

  statusBlock: { alignItems: "center", marginBottom: 14 },
  heroTitle: {
    fontSize: 22,
    fontFamily: fonts.serif,
    color: colors.ink,
    textAlign: "center",
    letterSpacing: -0.4,
    marginTop: 10,
    paddingHorizontal: 20,
  },

  routeCard: {
    backgroundColor: colors.mustard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(20,26,69,0.18)",
  },
  routeHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  routeHeadText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
    letterSpacing: 1.2,
    opacity: 0.75,
  },
  routeHeadId: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.warmDark,
    opacity: 0.65,
  },
  routeTimes: { flexDirection: "row", gap: 12, alignItems: "center" },
  routeTimeCol: { alignItems: "center", minWidth: 60 },
  routeTimeMain: {
    fontSize: 26,
    fontFamily: fonts.monoBold,
    color: colors.warmDark,
    lineHeight: 28,
  },
  routeTimeLabel: {
    fontSize: 9,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
    letterSpacing: 1,
    marginTop: 4,
    opacity: 0.7,
  },
  routeMiddleCol: { flex: 1, alignItems: "center" },
  routeMiddleLine: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 4,
  },
  routeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.warmDark,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.warmDark,
    opacity: 0.35,
  },
  routeMeta: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.warmDark,
    opacity: 0.75,
    marginTop: 6,
  },
  routeDivider: {
    height: 1,
    backgroundColor: colors.warmDark,
    opacity: 0.2,
    marginVertical: 14,
  },
  routePlaces: { flexDirection: "row", gap: 14 },
  routePlaceLabel: {
    fontSize: 9,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
    letterSpacing: 1,
    opacity: 0.7,
    marginBottom: 4,
  },
  routePlace: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
    lineHeight: 17,
  },

  mapWrap: {
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
  },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1.2,
  },
  sectionRight: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    opacity: 0.7,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.inkLine,
    padding: 12,
  },
  driverRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  driverName: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  driverMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  driverMeta: { fontSize: 11, fontFamily: fonts.sans, color: colors.inkSoft },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.inkLine },
  passengerName: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.ink,
  },
  emptyPax: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkMuted,
    textAlign: "center",
    paddingVertical: 8,
  },

  priceCard: {
    marginTop: 16,
    backgroundColor: colors.ink,
    borderRadius: 18,
    padding: 16,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: "rgba(251,243,230,0.65)",
    letterSpacing: 1.2,
  },
  priceAmount: {
    fontSize: 28,
    fontFamily: fonts.monoBold,
    color: colors.cream,
    marginTop: 6,
  },
  priceUnit: {
    fontSize: 13,
    fontFamily: fonts.mono,
    color: "rgba(251,243,230,0.65)",
  },
  priceSub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: "rgba(251,243,230,0.7)",
    marginTop: 4,
  },

  actions: { marginTop: 18 },
  viewerNote: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkMuted,
    paddingVertical: 14,
  },
});
