import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { Field } from "../src/components/Field";
import { Button } from "../src/components/Button";
import { BrandLogo } from "../src/components/BrandLogo";
import { CheckIcon } from "../src/icons";
import { colors, fonts } from "../src/theme";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Introduce email y contrasena");
      return;
    }
    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      router.replace("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Error";
      Alert.alert("No se pudo entrar", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.linkBold}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.brand}>
            <BrandLogo />
            <Text style={styles.greeting}>Bienvenida a</Text>
            <Text style={styles.brandName}>Conect_Car</Text>
          </View>

          <View style={styles.form}>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              suffix={
                /^\S+@\S+\.\S+$/.test(email) ? (
                  <CheckIcon size={16} color={colors.leaf} />
                ) : null
              }
            />
            <View style={{ height: 14 }} />
            <Field
              label="Contrasena"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimo 6 caracteres"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Proximamente",
                "Recuperacion de contrasena disponible cuando integremos el envio de emails."
              )
            }
            style={{ marginTop: 12, alignSelf: "flex-end" }}
          >
            <Text style={styles.linkSoft}>¿Olvidaste tu contrasena?</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 22 }}>
            <Button block size="lg" onPress={handleLogin} loading={submitting}>
              Entrar
            </Button>
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={{ alignItems: "center", marginTop: 30 }}
          >
            <Text style={styles.bottomLink}>
              ¿Eres nuevo/a?{" "}
              <Text style={styles.linkBold}>Registrate aqui</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            Al continuar, aceptas los Terminos y la Politica de Privacidad.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 24 },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 4,
  },
  brand: { alignItems: "center", marginTop: 26 },
  greeting: {
    fontSize: 30,
    color: colors.ink,
    marginTop: 20,
    fontFamily: fonts.serif,
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: 40,
    color: colors.ink,
    marginTop: 2,
    fontFamily: fonts.serifBold,
    letterSpacing: -1,
  },
  form: { marginTop: 28 },
  linkBold: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fonts.sansBold,
    fontWeight: "600",
  },
  linkSoft: {
    color: colors.inkSoft,
    fontSize: 12,
    fontFamily: fonts.sansMedium,
  },
  bottomLink: {
    fontSize: 13,
    color: colors.inkSoft,
    fontFamily: fonts.sansMedium,
  },
  terms: {
    textAlign: "center",
    fontSize: 11,
    color: colors.inkMuted,
    marginTop: 18,
    lineHeight: 16,
    fontFamily: fonts.sans,
  },
});
