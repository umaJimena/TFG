import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { Button } from "../../src/components/Button";
import { CarIcon, LogoutIcon, UsersIcon } from "../../src/icons";
import { colors, fonts, radius } from "../../src/theme";

const formatDate = (d?: string) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const genderLabel = (g?: string) =>
  g === "female" ? "Mujer" : g === "male" ? "Hombre" : "—";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name?.[0] || "U").toUpperCase()}
              {(user?.surname?.[0] || "").toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {user?.name} {user?.surname}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.roleCard}>
          <Text style={styles.roleLabel}>ROL</Text>
          <View style={styles.roleRow}>
            <View style={styles.roleIconBox}>
              {user?.role === "driver" ? (
                <CarIcon size={22} color={colors.cream} />
              ) : (
                <UsersIcon size={22} color={colors.cream} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>
                {user?.role === "driver" ? "Conductor" : "Pasajero"}
              </Text>
              <Text style={styles.roleHint}>
                Esta eleccion es permanente.
              </Text>
            </View>
          </View>
        </View>

        <Section title="Datos personales">
          <Row label="Nombre" value={`${user?.name || ""} ${user?.surname || ""}`.trim() || "—"} />
          <Row label="Fecha de nacimiento" value={formatDate(user?.birthDate)} />
          <Row label="Genero" value={genderLabel(user?.gender)} />
          <Row label="DNI / NIE" value={user?.dni || "—"} />
          <Row label="Email verificado" value={user?.emailVerified ? "Si" : "No"} />
        </Section>

        {user?.role === "driver" && user?.car && (
          <Section title="Mi coche">
            <Row label="Matricula" value={user.car.plate || "—"} />
            <Row label="Marca y modelo" value={user.car.make || "—"} />
            <Row label="Color" value={user.car.color || "—"} />
            <Row label="Plazas" value={String(user.car.seats || "—")} />
          </Section>
        )}

        <View style={{ marginTop: 24 }}>
          <Button
            block
            variant="secondary"
            onPress={handleLogout}
            icon={<LogoutIcon size={16} color={colors.ink} />}
          >
            Cerrar sesion
          </Button>
        </View>

        <Text style={styles.version}>Conect_Car · v0.1 · TFG</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: any) => (
  <View style={{ marginTop: 18 }}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 22, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mustard,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontFamily: fonts.serifBold,
    color: colors.ink,
  },
  name: {
    fontSize: 22,
    fontFamily: fonts.serif,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  email: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
  },
  roleCard: {
    marginTop: 18,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: 14,
  },
  roleLabel: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: "rgba(251,243,230,0.65)",
    letterSpacing: 1.4,
  },
  roleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  roleIconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: "rgba(251,243,230,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    color: colors.cream,
  },
  roleHint: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: "rgba(251,243,230,0.65)",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.inkLine,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.inkLine,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
  },
  rowValue: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.ink,
    maxWidth: "60%",
    textAlign: "right",
  },
  version: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 11,
    color: colors.inkMuted,
    fontFamily: fonts.sans,
  },
});
