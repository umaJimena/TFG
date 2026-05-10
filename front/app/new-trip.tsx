import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { Button } from "../src/components/Button";
import { DaysPill } from "../src/components/DaysPill";
import { TripMap } from "../src/components/TripMap";
import { createTrip } from "../src/api/trips";
import {
  ChevronLeftIcon,
  ClockIcon,
  EuroIcon,
  PinIcon,
  SearchIcon,
} from "../src/icons";
import { colors, fonts, radius } from "../src/theme";

export default function NewTrip() {
  const router = useRouter();
  const { user } = useAuth();
  const isDriver = user?.role === "driver";
  const maxSeats = user?.car?.seats || 4;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departTime, setDepartTime] = useState("8:15");
  const [returnTime, setReturnTime] = useState("17:30");
  const [days, setDays] = useState(["L", "M", "X", "J", "V"]);
  const [seats, setSeats] = useState(Math.min(2, maxSeats));
  const [perDay, setPerDay] = useState("3.50");
  const [submitting, setSubmitting] = useState(false);

  const toggleDay = (d: string) =>
    setDays((curr) =>
      curr.includes(d) ? curr.filter((x) => x !== d) : [...curr, d]
    );

  const validate = () => {
    if (!from.trim() || !to.trim()) {
      Alert.alert("Faltan datos", "Indica origen y destino");
      return false;
    }
    if (!departTime.trim()) {
      Alert.alert("Faltan datos", "Indica la hora de salida");
      return false;
    }
    if (!days.length) {
      Alert.alert("Faltan datos", "Selecciona al menos un dia");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (isDriver) {
      const perDayNum = parseFloat(perDay.replace(",", "."));
      if (isNaN(perDayNum) || perDayNum < 0) {
        Alert.alert("Precio invalido", "Introduce un numero positivo");
        return;
      }
      try {
        setSubmitting(true);
        await createTrip({
          from: from.trim(),
          to: to.trim(),
          departTime: departTime.trim(),
          returnTime: returnTime.trim(),
          days,
          seatsTotal: seats,
          perDay: perDayNum,
        });
        router.back();
      } catch (err: any) {
        Alert.alert(
          "No se pudo publicar",
          err?.response?.data?.message || err?.message || "Error"
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      router.push({
        pathname: "/matches",
        params: {
          from: from.trim(),
          to: to.trim(),
          departTime: departTime.trim(),
          returnTime: returnTime.trim(),
          days: days.join(","),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeftIcon size={18} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDriver ? "Publicar trayecto" : "Buscar trayecto"}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <TripMap from={from} to={to} height={200} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {isDriver ? "Tu ruta diaria" : "Tu trayecto deseado"}
          </Text>
          <Text style={styles.desc}>
            {isDriver
              ? "Indica tu ruta y se publicara para que otras personas se unan."
              : "Te mostraremos coincidencias cercanas."}
          </Text>

          <View style={styles.fromToBox}>
            <FromToRow
              icon={
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.mustard,
                    borderWidth: 2,
                    borderColor: colors.ink,
                  }}
                />
              }
              label="Desde"
              value={from}
              onChange={setFrom}
              placeholder="Punto de origen"
            />
            <View style={styles.divider} />
            <FromToRow
              icon={<PinIcon size={16} color={colors.coral} filled />}
              label="Hacia"
              value={to}
              onChange={setTo}
              placeholder="Destino"
            />
          </View>

          <View style={styles.timeRow}>
            <TimeCard
              label="Salida"
              value={departTime}
              onChange={setDepartTime}
            />
            <TimeCard
              label="Vuelta"
              value={returnTime}
              onChange={setReturnTime}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardLabel}>Dias de la semana</Text>
              <TouchableOpacity onPress={() => setDays(["L", "M", "X", "J", "V"])}>
                <Text style={styles.cardLink}>L-V</Text>
              </TouchableOpacity>
            </View>
            <DaysPill days={days} onToggle={toggleDay} size="lg" />
          </View>

          {isDriver && (
            <>
              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.cardLabel}>Plazas ofrecidas</Text>
                  <Text style={styles.cardHint}>Max. {maxSeats} (tu coche)</Text>
                </View>
                <View style={styles.seatsRow}>
                  {[1, 2, 3, 4].map((n) => {
                    const disabled = n > maxSeats;
                    const on = seats === n;
                    return (
                      <TouchableOpacity
                        key={n}
                        onPress={() => !disabled && setSeats(n)}
                        disabled={disabled}
                        style={[
                          styles.seatBtn,
                          on && {
                            backgroundColor: colors.ink,
                            borderColor: colors.ink,
                          },
                          disabled && { opacity: 0.3 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.seatBtnText,
                            on && { color: colors.cream },
                          ]}
                        >
                          {n}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.cardLabel}>Precio por dia</Text>
                  <Text style={styles.cardHint}>Se cobrara por viaje realizado</Text>
                </View>
                <View style={styles.priceRow}>
                  <View style={styles.eurosBox}>
                    <EuroIcon size={20} color={colors.warmDark} />
                  </View>
                  <TextInput
                    value={perDay}
                    onChangeText={setPerDay}
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    placeholder="0.00"
                    placeholderTextColor="rgba(20,26,69,0.35)"
                  />
                  <Text style={styles.priceUnit}>€/dia</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button block size="lg" loading={submitting} onPress={handleSubmit}>
          {isDriver ? "Publicar trayecto" : "Buscar coincidencias"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const FromToRow = ({ icon, label, value, onChange, placeholder }: any) => (
  <View style={styles.fromToRow}>
    <View style={styles.fromToIcon}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.miniLabel}>{label.toUpperCase()}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(20,26,69,0.35)"
        style={styles.fromToInput}
      />
    </View>
    <SearchIcon size={16} color={colors.inkMuted} />
  </View>
);

const TimeCard = ({ label, value, onChange }: any) => (
  <View style={[styles.card, { flex: 1 }]}>
    <View style={styles.cardHead}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <ClockIcon size={14} color={colors.inkSoft} />
        <Text style={styles.cardLabel}>{label.toUpperCase()}</Text>
      </View>
    </View>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="HH:MM"
      placeholderTextColor="rgba(20,26,69,0.35)"
      style={styles.timeInput}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
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
  scroll: { padding: 20, paddingBottom: 30, gap: 14 },
  title: {
    fontSize: 24,
    fontFamily: fonts.serif,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  desc: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
    marginBottom: 8,
  },
  fromToBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.ink,
    padding: 4,
  },
  fromToRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  fromToIcon: { width: 24, alignItems: "center", justifyContent: "center" },
  miniLabel: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1,
  },
  fromToInput: {
    fontSize: 14,
    color: colors.ink,
    fontFamily: fonts.sansBold,
    paddingVertical: 0,
    marginTop: 2,
  },
  divider: { height: 1, backgroundColor: colors.inkLine, marginHorizontal: 14 },
  timeRow: { flexDirection: "row", gap: 10 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.ink,
    padding: 14,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1,
  },
  cardHint: { fontSize: 11, color: colors.inkMuted, fontFamily: fonts.sans },
  cardLink: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.ink,
    textDecorationLine: "underline",
  },
  timeInput: {
    fontSize: 24,
    fontFamily: fonts.monoBold,
    color: colors.ink,
    paddingVertical: 0,
    paddingTop: 4,
  },
  seatsRow: { flexDirection: "row", gap: 8 },
  seatBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  seatBtnText: {
    fontSize: 16,
    fontFamily: fonts.serifBold,
    color: colors.ink,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(233,185,73,0.18)",
    borderRadius: 12,
    padding: 12,
  },
  eurosBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mustard,
    alignItems: "center",
    justifyContent: "center",
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: fonts.monoBold,
    color: colors.ink,
    paddingVertical: 0,
  },
  priceUnit: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
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
