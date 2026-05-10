import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Avatar } from "../../src/components/Avatar";
import { TripCard } from "../../src/components/TripCard";
import { BellIcon, PlusIcon, RouteIcon } from "../../src/icons";
import { fetchMyTrips } from "../../src/api/trips";
import { adaptTrip } from "../../src/lib/adaptTrip";
import { colors, fonts, radius } from "../../src/theme";

const FILTERS = ["Activos", "Esta semana", "Historial"];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState(FILTERS[0]);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const { trips: apiTrips } = await fetchMyTrips();
      const adapted = apiTrips.map((t: any, i: number) =>
        adaptTrip(t, user?._id, i)
      );
      setTrips(adapted);
      if (adapted.length && !expanded) setExpanded(adapted[0].id);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load(false);
  };

  const initials =
    `${(user?.name?.[0] || "").toUpperCase()}${(user?.surname?.[0] || "").toUpperCase()}` ||
    "U";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar
            initials={initials}
            color={user?.avatarColor || colors.mustard}
            size={40}
            border
          />
          <View>
            <Text style={styles.greeting}>HOLA</Text>
            <Text style={styles.name}>{user?.name || "Usuaria"}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <BellIcon size={18} color={colors.ink} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mis proximos{"\n"}trayectos</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: trips.length ? colors.leaf : colors.inkMuted },
              ]}
            />
            <Text style={styles.statusText}>
              {trips.length} {trips.length === 1 ? "activo" : "activos"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push("/new-trip")}
        >
          <PlusIcon size={16} color={colors.cream} />
          <Text style={styles.newBtnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterPill, on && styles.filterPillOn]}
            >
              <Text style={[styles.filterText, on && styles.filterTextOn]}>
                {f}
              </Text>
              {on && trips.length > 0 && (
                <Text style={styles.filterCount}>{trips.length}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => load()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.ink}
            />
          }
        >
          <View style={{ gap: 14 }}>
            {trips.length === 0 && (
              <View style={styles.emptyHero}>
                <Text style={styles.emptyHeroTitle}>
                  Aun no tienes trayectos
                </Text>
                <Text style={styles.emptyHeroSub}>
                  {user?.role === "driver"
                    ? "Publica tu primer trayecto para que otras personas se unan."
                    : "Busca trayectos compatibles con tu ruta diaria."}
                </Text>
              </View>
            )}

            {trips.map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                expanded={expanded === t.id}
                onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
                onViewDetails={() => router.push(`/trip/${t.id}`)}
              />
            ))}

            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBox}>
                <RouteIcon size={22} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.emptyTitle}>
                  {trips.length === 0 ? "Crea tu primer trayecto" : "Anade otro trayecto"}
                </Text>
                <Text style={styles.emptySub}>
                  {user?.role === "driver"
                    ? "Publica una nueva ruta diaria."
                    : "Encuentra mas rutas que encajen."}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => router.push("/new-trip")}
              >
                <PlusIcon size={18} color={colors.ink} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    paddingHorizontal: 22,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  greeting: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1.2,
  },
  name: {
    fontSize: 22,
    fontFamily: fonts.serif,
    color: colors.ink,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 7,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.cream,
  },
  titleRow: {
    paddingHorizontal: 22,
    paddingTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.serif,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontFamily: fonts.sans, color: colors.inkSoft },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  newBtnText: {
    color: colors.cream,
    fontSize: 13,
    fontFamily: fonts.sansBold,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inkBorder,
  },
  filterPillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: {
    fontSize: 12,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
  },
  filterTextOn: { color: colors.cream },
  filterCount: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.cream,
    opacity: 0.7,
  },
  scroll: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 30 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorText: {
    fontSize: 13,
    color: colors.coral,
    fontFamily: fonts.sansMedium,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  retryText: { color: colors.ink, fontFamily: fonts.sansBold, fontSize: 13 },
  emptyHero: {
    backgroundColor: "rgba(20,26,69,0.04)",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  emptyHeroTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    color: colors.ink,
    textAlign: "center",
  },
  emptyHeroSub: {
    fontSize: 13,
    color: colors.inkSoft,
    fontFamily: fonts.sans,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    borderStyle: "dashed",
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(233,185,73,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  emptySub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
  },
  emptyAddBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
});
