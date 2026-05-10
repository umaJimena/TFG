import { useEffect, useMemo, useState } from "react";
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
import { Avatar } from "../src/components/Avatar";
import { Button } from "../src/components/Button";
import {
  CheckIcon,
  ChevronLeftIcon,
  RouteIcon,
  StarIcon,
  UserIcon,
} from "../src/icons";
import { reserveTrip, searchTrips } from "../src/api/trips";
import { colors, fonts, radius } from "../src/theme";

const SORTS = [
  { id: "match", label: "Mejor match" },
  { id: "cheapest", label: "Mas barato" },
];

const fullName = (u: any) =>
  `${u?.name || ""} ${u?.surname || ""}`.trim() || "Sin nombre";

const initials = (u: any) => {
  const n = (u?.name?.[0] || "").toUpperCase();
  const s = (u?.surname?.[0] || "").toUpperCase();
  return n + s || "?";
};

export default function Matches() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    from?: string;
    to?: string;
    departTime?: string;
    days?: string;
  }>();

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [sortBy, setSortBy] = useState("match");

  const reqDays = useMemo(
    () => (params.days || "").split(",").filter(Boolean),
    [params.days]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { trips: results } = await searchTrips({
          from: params.from,
          to: params.to,
          days: params.days,
        });
        const scored = (results || []).map((t: any) => {
          const matched = t.days.filter((d: string) => reqDays.includes(d)).length;
          const score = reqDays.length
            ? Math.round((matched / reqDays.length) * 100)
            : 100;
          return { ...t, _score: score };
        });
        setTrips(scored);
        if (scored.length) setSelected(scored[0]._id);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => {
    const arr = [...trips];
    arr.sort((a, b) =>
      sortBy === "cheapest" ? a.perDay - b.perDay : b._score - a._score
    );
    return arr;
  }, [trips, sortBy]);

  const handleReserve = async () => {
    if (!selected) return;
    try {
      setReserving(true);
      await reserveTrip(selected);
      Alert.alert("¡Reserva confirmada!", "Te has unido al trayecto.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "No se pudo reservar",
        err?.response?.data?.message || err?.message || "Error"
      );
    } finally {
      setReserving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeftIcon size={18} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coincidencias</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>
          {trips.length} {trips.length === 1 ? "conductor" : "conductores"}
          {"\n"}en tu misma ruta
        </Text>
        <View style={styles.titleMeta}>
          <RouteIcon size={13} color={colors.inkSoft} />
          <Text style={styles.titleMetaText}>
            {params.from || "?"} · {params.departTime || "?"} → {params.to || "?"}
          </Text>
        </View>
      </View>

      <View style={styles.sortRow}>
        {SORTS.map((s) => {
          const on = sortBy === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSortBy(s.id)}
              style={[styles.sortPill, on && styles.sortPillOn]}
            >
              <Text style={[styles.sortText, on && styles.sortTextOn]}>
                {s.label}
              </Text>
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
        </View>
      ) : sorted.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Sin coincidencias</Text>
          <Text style={styles.emptySub}>
            No hay trayectos con estos criterios. Prueba a relajar dias u origen.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 12 }}>
            {sorted.map((t) => (
              <MatchCard
                key={t._id}
                trip={t}
                score={t._score}
                selected={selected === t._id}
                onSelect={() => setSelected(t._id)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {sorted.length > 0 && !loading && (
        <View style={styles.footer}>
          <Button
            block
            size="lg"
            loading={reserving}
            disabled={!selected}
            onPress={handleReserve}
          >
            Reservar trayecto
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const MatchCard = ({ trip, score, selected, onSelect }: any) => {
  const seatsTaken = trip.seatsTaken ?? trip.passengers?.length ?? 0;
  const seatsAvailable = trip.seatsTotal - seatsTaken;
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.topRow}>
        <Avatar
          initials={initials(trip.driver)}
          color={trip.driver.avatarColor || colors.mustard}
          size={42}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.driverName} numberOfLines={1}>
              {fullName(trip.driver)}
            </Text>
            {trip.driver?.verified && (
              <View style={styles.verifiedBadge}>
                <CheckIcon size={9} color={colors.cream} />
              </View>
            )}
          </View>
          <View style={styles.driverMetaRow}>
            <StarIcon size={11} color={colors.mustard} />
            <Text style={styles.driverMetaText}>
              {(trip.driver?.rating ?? 5).toFixed(1)} · {trip.driver?.tripsCount ?? 0} viajes
            </Text>
          </View>
        </View>
        <ScorePill score={score} />
      </View>

      <View style={styles.routeBox}>
        <View style={styles.routeLine}>
          <Text style={styles.routeTime}>{trip.departTime}</Text>
          <Text style={styles.routePlace} numberOfLines={1}>
            {trip.from}
          </Text>
        </View>
        <View style={{ height: 6 }} />
        <View style={styles.routeLine}>
          <Text style={[styles.routeTime, { opacity: 0.55 }]}>
            {trip.arriveTime || "—"}
          </Text>
          <Text style={[styles.routePlace, { opacity: 0.7 }]} numberOfLines={1}>
            {trip.to}
          </Text>
        </View>
      </View>

      <View style={styles.footRow}>
        <View style={styles.seatsRow}>
          {Array.from({ length: trip.seatsTotal }).map((_, i) => {
            const taken = i < seatsTaken;
            return (
              <UserIcon
                key={i}
                size={16}
                color={taken ? "rgba(20,26,69,0.45)" : colors.ink}
                filled={taken}
              />
            );
          })}
          <Text style={styles.seatsText}>
            {seatsAvailable} {seatsAvailable === 1 ? "libre" : "libres"}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.priceMain}>
            {trip.perDay.toFixed(2)}€
            <Text style={styles.priceUnit}>/dia</Text>
          </Text>
          <Text style={styles.priceSub}>
            {(trip.monthlyEstimate || 0).toFixed(2)}€/mes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ScorePill = ({ score }: { score: number }) => {
  let bg = "rgba(20,26,69,0.08)";
  let fg = colors.ink;
  if (score >= 95) {
    bg = colors.leaf;
    fg = colors.cream;
  } else if (score >= 90) {
    bg = colors.mustard;
    fg = colors.warmDark;
  }
  return (
    <View style={[styles.scorePill, { backgroundColor: bg }]}>
      <Text style={[styles.scoreNum, { color: fg }]}>
        {score}
        <Text style={styles.scorePct}>%</Text>
      </Text>
      <Text style={[styles.scoreLabel, { color: fg }]}>MATCH</Text>
    </View>
  );
};

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
  titleBlock: { paddingHorizontal: 22, paddingTop: 8 },
  title: {
    fontSize: 26,
    fontFamily: fonts.serif,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  titleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  titleMetaText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    flex: 1,
  },
  sortRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  sortPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inkBorder,
  },
  sortPillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  sortText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
  },
  sortTextOn: { color: colors.cream },
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
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    color: colors.ink,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    color: colors.inkSoft,
    fontFamily: fonts.sans,
    textAlign: "center",
    marginTop: 6,
  },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.inkLine,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.ink,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  driverName: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.leaf,
    alignItems: "center",
    justifyContent: "center",
  },
  driverMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  driverMetaText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
  },
  scorePill: {
    minWidth: 54,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  scoreNum: { fontSize: 16, fontFamily: fonts.monoBold, lineHeight: 18 },
  scorePct: { fontSize: 10, fontFamily: fonts.mono },
  scoreLabel: {
    fontSize: 9,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  routeBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(233,185,73,0.15)",
    borderRadius: radius.md,
  },
  routeLine: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeTime: {
    fontSize: 16,
    fontFamily: fonts.monoBold,
    color: colors.ink,
    minWidth: 50,
  },
  routePlace: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.ink,
    flex: 1,
  },
  footRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seatsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  seatsText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginLeft: 4,
  },
  priceMain: { fontSize: 16, fontFamily: fonts.monoBold, color: colors.ink },
  priceUnit: { fontSize: 10, fontFamily: fonts.mono, color: colors.inkSoft },
  priceSub: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkMuted,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.inkLine,
    backgroundColor: colors.cream,
  },
});
