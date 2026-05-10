import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "./Avatar";
import { AvatarStack } from "./AvatarStack";
import { CarIcon, ChevronRightIcon, PinIcon, StarIcon, UsersIcon } from "../icons";
import { colors, fonts, radius } from "../theme";

const TONES = {
  mustard: {
    bg: colors.mustard,
    fg: colors.warmDark,
    soft: "rgba(74,53,16,0.18)",
    line: "rgba(74,53,16,0.18)",
  },
  leaf: {
    bg: colors.leaf,
    fg: colors.cream,
    soft: "rgba(251,243,230,0.18)",
    line: "rgba(251,243,230,0.22)",
  },
  coral: {
    bg: colors.coral,
    fg: colors.cream,
    soft: "rgba(251,243,230,0.18)",
    line: "rgba(251,243,230,0.22)",
  },
};

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

export const TripCard = ({ trip, expanded = false, onToggle, onViewDetails }) => {
  const t = TONES[trip.tone] || TONES.mustard;
  const isDriver = trip.role === "driver";
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onToggle}
      style={[
        styles.card,
        { backgroundColor: t.bg },
        expanded && styles.cardExpanded,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.roleTag, { backgroundColor: t.soft }]}>
          {isDriver ? (
            <CarIcon size={13} color={t.fg} />
          ) : (
            <UsersIcon size={13} color={t.fg} />
          )}
          <Text style={[styles.roleTagText, { color: t.fg }]}>
            {isDriver ? "Conductor" : "Pasajero"}
          </Text>
        </View>
        <Avatar
          initials={trip.driver.avatar}
          color={colors.cream}
          size={34}
          textColor={colors.ink}
        />
      </View>

      <View style={styles.routeRow}>
        <View style={styles.timeCol}>
          <Text style={[styles.timeMain, { color: t.fg }]}>{trip.depart}</Text>
          <Text style={[styles.timeSub, { color: t.fg }]}>{trip.arrive}</Text>
        </View>

        <View style={styles.dotCol}>
          <View style={[styles.dot, { backgroundColor: t.fg }]} />
          <View style={[styles.line, { backgroundColor: t.fg }]} />
          <PinIcon size={16} color={t.fg} filled />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.placeMain, { color: t.fg }]}>{trip.from}</Text>
          <Text style={[styles.placeSub, { color: t.fg }]}>
            Salida · {trip.nextDate}
          </Text>
          <View style={{ height: 14 }} />
          <Text style={[styles.placeMain, { color: t.fg }]}>{trip.to}</Text>
          <Text style={[styles.placeSub, { color: t.fg }]}>
            Vuelta · {trip.returnTime}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: t.line }]} />

      <View style={styles.footerRow}>
        <View style={styles.daysRow}>
          {DAYS.map((d) => {
            const on = trip.days.includes(d);
            return (
              <View
                key={d}
                style={[
                  styles.dayPill,
                  on
                    ? { backgroundColor: t.fg, borderColor: t.fg }
                    : { borderColor: t.fg, opacity: 0.45 },
                ]}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    { color: on ? t.bg : t.fg },
                  ]}
                >
                  {d}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.priceCol}>
          <AvatarStack
            users={[trip.driver, ...trip.passengers]}
            size={22}
            max={3}
          />
          <Text style={[styles.price, { color: t.fg }]}>
            {trip.monthly.toFixed(2)}€
            <Text style={[styles.priceUnit, { color: t.fg }]}>/mes</Text>
          </Text>
        </View>
      </View>

      {expanded && (
        <View style={[styles.expandedSection, { borderTopColor: t.line }]}>
          <View style={styles.statsRow}>
            <Stat tone={t} label="Distancia" value={`${trip.distanceKm} km`} />
            <Stat tone={t} label="Duracion" value={`${trip.durationMin} min`} />
            <Stat tone={t} label="Por dia" value={`${trip.perDay.toFixed(2)}€`} />
          </View>
          <View style={[styles.driverCard, { backgroundColor: t.soft }]}>
            <Avatar
              initials={trip.driver.avatar}
              color={colors.cream}
              size={36}
              textColor={colors.ink}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.driverName, { color: t.fg }]}>
                {trip.driver.name}
              </Text>
              <View style={styles.driverMeta}>
                <StarIcon size={12} color={t.fg} />
                <Text style={[styles.driverMetaText, { color: t.fg }]}>
                  {trip.driver.rating} · {trip.driver.car}
                </Text>
              </View>
            </View>
          </View>

          {onViewDetails && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                onViewDetails();
              }}
              style={[styles.detailsBtn, { backgroundColor: t.fg }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.detailsBtnText, { color: t.bg }]}>
                Ver detalles
              </Text>
              <ChevronRightIcon size={14} color={t.bg} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const Stat = ({ tone, label, value }) => (
  <View style={[styles.stat, { backgroundColor: tone.soft }]}>
    <Text style={[styles.statLabel, { color: tone.fg }]}>{label.toUpperCase()}</Text>
    <Text style={[styles.statValue, { color: tone.fg }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
  },
  cardExpanded: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  roleTagText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  routeRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4,
  },
  timeCol: { minWidth: 50, alignItems: "flex-end", paddingTop: 2 },
  timeMain: { fontSize: 20, fontFamily: fonts.monoBold, lineHeight: 22 },
  timeSub: {
    fontSize: 12,
    fontFamily: fonts.mono,
    opacity: 0.6,
    marginTop: 26,
  },
  dotCol: { width: 16, alignItems: "center", paddingTop: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, flex: 1, marginVertical: 2, opacity: 0.35 },
  placeMain: {
    fontSize: 15,
    fontFamily: fonts.sansBold,
    lineHeight: 19,
  },
  placeSub: {
    fontSize: 11,
    fontFamily: fonts.sans,
    opacity: 0.7,
    marginTop: 2,
  },
  divider: { height: 1, marginVertical: 14 },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  daysRow: { flexDirection: "row", gap: 4 },
  dayPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayPillText: { fontSize: 10, fontFamily: fonts.sansBold },
  priceCol: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 13, fontFamily: fonts.monoBold },
  priceUnit: { fontSize: 10, fontFamily: fonts.mono, opacity: 0.6 },
  expandedSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  stat: { flex: 1, padding: 10, borderRadius: 12 },
  statLabel: {
    fontSize: 9,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.6,
    opacity: 0.75,
  },
  statValue: {
    fontSize: 14,
    fontFamily: fonts.monoBold,
    marginTop: 2,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  driverName: { fontSize: 13, fontFamily: fonts.sansBold },
  driverMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
    opacity: 0.85,
  },
  driverMetaText: { fontSize: 11, fontFamily: fonts.sans },
  detailsBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  detailsBtnText: {
    fontSize: 14,
    fontFamily: fonts.sansBold,
  },
});
