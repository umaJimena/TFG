import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import * as authApi from "../src/api/auth";
import { Field } from "../src/components/Field";
import { Button } from "../src/components/Button";
import {
  CheckIcon,
  ChevronLeftIcon,
  UsersIcon,
  CarIcon,
} from "../src/icons";
import { colors, fonts, radius } from "../src/theme";

const TOTAL_STEPS = 9;

const STEP_TITLES = {
  1: "Tu cuenta",
  2: "Verifica tu email",
  3: "¿Como te llamas?",
  4: "¿Cuando naciste?",
  5: "Sobre ti",
  6: "¿Como vas a usar la app?",
  7: "Documentacion",
  8: "Tu coche",
  9: "¡Cuenta lista!",
};

const STEP_DESCS = {
  1: "Empezamos con tu email y una contrasena.",
  2: "Te hemos enviado un codigo de 6 digitos. Introducelo abajo.",
  3: "Tu nombre y apellidos.",
  4: "Necesitamos saber que eres mayor de edad.",
  5: "Genero.",
  6: "Esta eleccion es permanente, no podras cambiarla luego.",
  7: "Necesitamos tu DNI.",
  8: "Datos del coche que usaras para los trayectos.",
  9: "Todo listo. Ya puedes empezar a usar Conect_Car.",
};

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = dt.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (str) => {
  const m = String(str).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const dt = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString();
};

const isAdult = (str) => {
  const iso = parseDate(str);
  if (!iso) return false;
  const dt = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - dt.getFullYear();
  const m = now.getMonth() - dt.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
  return age >= 18;
};

const determineStartingStep = (user) => {
  if (!user) return 1;
  if (!user.emailVerified) return 2;
  if (!user.name || !user.surname) return 3;
  if (!user.birthDate) return 4;
  if (!user.gender) return 5;
  if (!user.role) return 6;
  if (!user.dni) return 7;
  if (user.role === "driver" && (!user.car || !user.car.plate)) return 8;
  return 9;
};

export default function Register() {
  const router = useRouter();
  const auth = useAuth();
  const u = auth.user;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState(u?.email || "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [shownCode, setShownCode] = useState("");
  const [resending, setResending] = useState(false);
  const [name, setName] = useState(u?.name || "");
  const [surname, setSurname] = useState(u?.surname || "");
  const [birthDate, setBirthDate] = useState(
    u?.birthDate ? formatDate(u.birthDate) : ""
  );
  const [gender, setGender] = useState(u?.gender || null);
  const [role, setRole] = useState(u?.role || null);
  const [dni, setDni] = useState(u?.dni || "");
  const [car, setCar] = useState({
    plate: u?.car?.plate || "",
    make: u?.car?.make || "",
    color: u?.car?.color || "",
    seats: u?.car?.seats || 4,
  });

  useEffect(() => {
    setStep(determineStartingStep(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 2 && !shownCode && u && !u.emailVerified) {
      handleResend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleResend = async () => {
    if (resending) return;
    try {
      setResending(true);
      const { verificationCode } = await authApi.resendCode();
      setShownCode(verificationCode);
    } catch (err) {
      errAlert(err);
    } finally {
      setResending(false);
    }
  };

  const showBack = step !== 9;
  const back = () => {
    if (step === 1) {
      router.back();
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const errAlert = (err) => {
    const msg = err?.response?.data?.message || err?.message || "Error";
    Alert.alert("Error", msg);
  };

  const handleNext = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      switch (step) {
        case 1: {
          if (u) {
            setStep(2);
            break;
          }
          if (!email.trim() || !password) {
            Alert.alert("Faltan datos", "Email y contrasena obligatorios");
            break;
          }
          if (password.length < 6) {
            Alert.alert("Contrasena muy corta", "Minimo 6 caracteres");
            break;
          }
          const res = await auth.register({
            email: email.trim(),
            password,
          });
          if (res?.verificationCode) setShownCode(res.verificationCode);
          setStep(2);
          break;
        }
        case 2: {
          if (u?.emailVerified) {
            setStep(3);
            break;
          }
          if (!/^\d{6}$/.test(code)) {
            Alert.alert("Codigo invalido", "Debe ser de 6 digitos");
            break;
          }
          await auth.verifyEmail(code);
          setStep(3);
          break;
        }
        case 3: {
          if (!name.trim() || !surname.trim()) {
            Alert.alert("Faltan datos", "Nombre y apellidos obligatorios");
            break;
          }
          await auth.updateMe({
            name: name.trim(),
            surname: surname.trim(),
          });
          setStep(4);
          break;
        }
        case 4: {
          const iso = parseDate(birthDate);
          if (!iso) {
            Alert.alert("Fecha invalida", "Formato DD/MM/AAAA");
            break;
          }
          if (!isAdult(birthDate)) {
            Alert.alert("Edad insuficiente", "Debes ser mayor de 18 anos");
            break;
          }
          await auth.updateMe({ birthDate: iso });
          setStep(5);
          break;
        }
        case 5: {
          if (!gender) {
            Alert.alert("Selecciona una opcion");
            break;
          }
          await auth.updateMe({ gender });
          setStep(6);
          break;
        }
        case 6: {
          if (!role) {
            Alert.alert("Selecciona un rol");
            break;
          }
          if (!u?.role) {
            await auth.setRole(role);
          }
          setStep(7);
          break;
        }
        case 7: {
          if (!dni.trim()) {
            Alert.alert("DNI requerido");
            break;
          }
          await auth.updateMe({ dni: dni.trim() });
          if ((u?.role || role) === "driver") {
            setStep(8);
          } else {
            setStep(9);
          }
          break;
        }
        case 8: {
          if (!car.plate || !car.make || !car.color || !car.seats) {
            Alert.alert("Faltan datos", "Completa todos los campos del coche");
            break;
          }
          await auth.updateMe({
            car: {
              plate: car.plate.trim(),
              make: car.make.trim(),
              color: car.color.trim(),
              seats: Number(car.seats),
            },
          });
          setStep(9);
          break;
        }
        case 9: {
          router.replace("/home");
          break;
        }
      }
    } catch (err) {
      errAlert(err);
    } finally {
      setSubmitting(false);
    }
  };

  const ctaLabel =
    step === 9 ? "Empezar a usar Conect_Car" : "Continuar";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {showBack ? (
            <TouchableOpacity onPress={back} style={styles.backBtn}>
              <ChevronLeftIcon size={18} color={colors.ink} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}
          <Text style={styles.stepCounter}>
            {step} / {TOTAL_STEPS}
          </Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.progress}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSeg, i < step && styles.progressSegOn]}
            />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>Paso {step}</Text>
          <Text style={styles.title}>{STEP_TITLES[step]}</Text>
          <Text style={styles.desc}>{STEP_DESCS[step]}</Text>

          <View style={{ marginTop: 22 }}>
            {step === 1 && (
              <StepEmailPassword
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            )}
            {step === 2 && (
              <StepVerifyEmail
                code={code}
                setCode={setCode}
                shownCode={shownCode}
                email={email}
                onResend={handleResend}
                resending={resending}
              />
            )}
            {step === 3 && (
              <StepName
                name={name}
                setName={setName}
                surname={surname}
                setSurname={setSurname}
              />
            )}
            {step === 4 && (
              <StepBirthDate value={birthDate} onChange={setBirthDate} />
            )}
            {step === 5 && (
              <StepGender value={gender} onChange={setGender} />
            )}
            {step === 6 && (
              <StepRole value={role} onChange={setRole} locked={!!u?.role} />
            )}
            {step === 7 && <StepDni value={dni} onChange={setDni} />}
            {step === 8 && <StepCar value={car} onChange={setCar} />}
            {step === 9 && <StepDone name={name || u?.name} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button block size="lg" loading={submitting} onPress={handleNext}>
          {ctaLabel}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const StepEmailPassword = ({ email, setEmail, password, setPassword }) => (
  <View style={{ gap: 14 }}>
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
    <Field
      label="Contrasena"
      value={password}
      onChangeText={setPassword}
      placeholder="Minimo 6 caracteres"
      secureTextEntry
    />
  </View>
);

const StepVerifyEmail = ({ code, setCode, shownCode, email, onResend, resending }) => (
  <View style={{ gap: 14 }}>
    <Text style={styles.helper}>
      Enviamos un codigo a{" "}
      <Text style={{ fontFamily: fonts.sansBold }}>{email}</Text>
    </Text>
    <Field
      label="Codigo"
      value={code}
      onChangeText={setCode}
      placeholder="6 digitos"
      keyboardType="number-pad"
    />
    {shownCode ? (
      <View style={styles.demoBanner}>
        <Text style={styles.demoLabel}>MODO DEMO</Text>
        <Text style={styles.demoCode}>{shownCode}</Text>
        <Text style={styles.demoHint}>
          En la version final este codigo se enviara a tu email. Para esta
          demo se muestra aqui directamente.
        </Text>
      </View>
    ) : null}
    <TouchableOpacity onPress={onResend} disabled={resending} style={{ alignSelf: "center", padding: 6 }}>
      <Text style={styles.resendLink}>
        {resending ? "Generando codigo..." : "Reenviar codigo"}
      </Text>
    </TouchableOpacity>
  </View>
);

const StepName = ({ name, setName, surname, setSurname }) => (
  <View style={{ gap: 14 }}>
    <Field
      label="Nombre"
      value={name}
      onChangeText={setName}
      placeholder="Como te llamamos"
    />
    <Field
      label="Apellidos"
      value={surname}
      onChangeText={setSurname}
      placeholder="Tus apellidos"
    />
  </View>
);

const StepBirthDate = ({ value, onChange }) => (
  <Field
    label="Fecha de nacimiento"
    value={value}
    onChangeText={onChange}
    placeholder="DD/MM/AAAA"
    keyboardType="numbers-and-punctuation"
  />
);

const StepGender = ({ value, onChange }) => (
  <View style={{ gap: 12 }}>
    <ChoiceCard
      label="Mujer"
      selected={value === "female"}
      onPress={() => onChange("female")}
    />
    <ChoiceCard
      label="Hombre"
      selected={value === "male"}
      onPress={() => onChange("male")}
    />
  </View>
);

const StepRole = ({ value, onChange, locked }) => (
  <View style={{ gap: 12 }}>
    <RoleCard
      icon={<UsersIcon size={26} color={colors.ink} />}
      title="Pasajero"
      desc="Te unes a trayectos publicados por conductores."
      selected={value === "passenger"}
      onPress={() => !locked && onChange("passenger")}
      disabled={locked && value !== "passenger"}
    />
    <RoleCard
      icon={<CarIcon size={26} color={colors.ink} />}
      title="Conductor"
      desc="Publicas tu trayecto y recoges a otros."
      selected={value === "driver"}
      onPress={() => !locked && onChange("driver")}
      disabled={locked && value !== "driver"}
    />
    {locked && (
      <Text style={styles.helper}>
        El rol ya esta establecido y no se puede cambiar.
      </Text>
    )}
  </View>
);

const StepDni = ({ value, onChange }) => (
  <Field
    label="DNI / NIE"
    value={value}
    onChangeText={onChange}
    placeholder="12345678Z"
    autoCapitalize="characters"
  />
);

const StepCar = ({ value, onChange }) => {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <View style={{ gap: 14 }}>
      <Field
        label="Matricula"
        value={value.plate}
        onChangeText={(v) => set("plate", v)}
        placeholder="1234 ABC"
        autoCapitalize="characters"
      />
      <Field
        label="Marca y modelo"
        value={value.make}
        onChangeText={(v) => set("make", v)}
        placeholder="Seat Leon"
      />
      <Field
        label="Color"
        value={value.color}
        onChangeText={(v) => set("color", v)}
        placeholder="Gris"
      />
      <View>
        <Text style={styles.fieldLabel}>Plazas (sin contar conductor)</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[1, 2, 3, 4].map((n) => {
            const on = value.seats === n;
            return (
              <TouchableOpacity
                key={n}
                onPress={() => set("seats", n)}
                style={[
                  styles.seatBtn,
                  on && {
                    backgroundColor: colors.ink,
                    borderColor: colors.ink,
                  },
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
    </View>
  );
};

const StepDone = ({ name }) => (
  <View style={{ alignItems: "center", paddingVertical: 30 }}>
    <View style={styles.doneCircle}>
      <CheckIcon size={50} color={colors.ink} />
    </View>
    <Text style={[styles.title, { textAlign: "center", marginTop: 22 }]}>
      ¡Bienvenida{name ? `, ${name}` : ""}!
    </Text>
    <Text style={[styles.desc, { textAlign: "center", marginTop: 8 }]}>
      Tu cuenta esta lista. Ya puedes buscar o publicar tu primer trayecto.
    </Text>
  </View>
);

const ChoiceCard = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.choiceCard, selected && styles.choiceCardOn]}
  >
    <Text
      style={[styles.choiceLabel, selected && { color: colors.cream }]}
    >
      {label}
    </Text>
    {selected && <CheckIcon size={18} color={colors.cream} />}
  </TouchableOpacity>
);

const RoleCard = ({ icon, title, desc, selected, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
    style={[
      styles.roleCard,
      selected && styles.roleCardOn,
      disabled && { opacity: 0.4 },
    ]}
  >
    <View
      style={[
        styles.roleIconBox,
        selected && { backgroundColor: "rgba(251,243,230,0.2)" },
      ]}
    >
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.roleTitle, selected && { color: colors.cream }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.roleDesc,
          selected && { color: "rgba(251,243,230,0.75)" },
        ]}
      >
        {desc}
      </Text>
    </View>
    {selected && <CheckIcon size={18} color={colors.cream} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  headerRow: {
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
  stepCounter: {
    fontSize: 12,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 1,
  },
  progress: { flexDirection: "row", gap: 4, marginTop: 14 },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inkLine,
  },
  progressSegOn: { backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkMuted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 6,
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.serif,
    color: colors.ink,
    marginTop: 4,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  desc: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 18,
  },
  helper: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
  },
  demoBanner: {
    backgroundColor: colors.mustard,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  demoLabel: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: colors.warmDark,
    letterSpacing: 1.6,
  },
  demoCode: {
    fontSize: 32,
    fontFamily: fonts.monoBold,
    color: colors.ink,
    letterSpacing: 4,
    marginVertical: 4,
  },
  demoHint: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.warmDark,
    textAlign: "center",
    lineHeight: 15,
  },
  resendLink: {
    fontSize: 13,
    fontFamily: fonts.sansBold,
    color: colors.ink,
    textDecorationLine: "underline",
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  choiceCardOn: { backgroundColor: colors.ink },
  choiceLabel: {
    fontSize: 16,
    fontFamily: fonts.sansBold,
    color: colors.ink,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.lg,
    padding: 14,
  },
  roleCardOn: { backgroundColor: colors.ink },
  roleIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(20,26,69,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  roleTitle: {
    fontSize: 17,
    fontFamily: fonts.serifBold,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  roleDesc: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
  },
  seatBtn: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  seatBtnText: {
    fontSize: 18,
    fontFamily: fonts.serifBold,
    color: colors.ink,
  },
  doneCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.mustard,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.inkLine,
    backgroundColor: colors.cream,
  },
});
