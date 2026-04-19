// Register.js
import React, { useState, useEffect } from "react";
// Añade useRouter a los imports de React

import { useRouter } from "expo-router";  // ← añade esta línea

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated
} from "react-native";

export default function Register({ navigation }) {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [dni, setDni] = useState("");
  const [plate, setPlate] = useState("");

  // Animación
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);

  // Validación edad
  const isAdult = () => {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 18;
  };

  const nextStep = () => {

    // VALIDACIONES POR PASO
    if (step === 1 && (!email || !password)) {
      alert("Completa email y contraseña");
      return;
    }

    if (step === 2 && !phone) {
      alert("Introduce tu teléfono");
      return;
    }

    if (step === 3 && !role) {
      alert("Selecciona una opción");
      return;
    }

    if (step === 4 && (!name || !surname)) {
      alert("Introduce nombre y apellidos");
      return;
    }

    if (step === 5) {
      if (!birthdate) {
        alert("Introduce tu fecha de nacimiento");
        return;
      }
      if (!isAdult()) {
        alert("Debes ser mayor de 18 años");
        return;
      }
    }

    if (step === 6 && !gender) {
      alert("Selecciona género");
      return;
    }

    if (step === 7 && role === "conductor" && (!dni || !plate)) {
      alert("Completa DNI y matrícula");
      return;
    }

    // FINAL
    if (step === 7) {
      console.log("DATOS REGISTRO:", {
        email,
        password,
        phone,
        role,
        name,
        surname,
        birthdate,
        gender,
        dni,
        plate
      });

      alert("Registro completado");

      // Aquí luego irá:
      // navigation.navigate("Home");

      return;
    }

    setStep(step + 1);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Text style={styles.title}>Teléfono</Text>

            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <Text style={styles.title}>¿Cómo usarás la app?</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setRole("conductor")}
            >
              <Text>Conductor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setRole("pasajero")}
            >
              <Text>Pasajero</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <Text style={styles.title}>Tu nombre</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={surname}
              onChangeText={setSurname}
            />
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <Text style={styles.title}>Fecha de nacimiento</Text>

            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={birthdate}
              onChangeText={setBirthdate}
            />
          </>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <>
            <Text style={styles.title}>Género</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setGender("hombre")}
            >
              <Text>Hombre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setGender("mujer")}
            >
              <Text>Mujer</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <>
            <Text style={styles.title}>Documentación</Text>

            {role === "conductor" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="DNI"
                  value={dni}
                  onChangeText={setDni}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Matrícula"
                  value={plate}
                  onChangeText={setPlate}
                />
              </>
            ) : (
              <Text>No necesitas documentación extra</Text>
            )}
          </>
        )}

        {/* Botón volver — añádelo justo antes del botón Continuar */}
{step > 1 && (
  <TouchableOpacity onPress={() => setStep(step - 1)}>
    <Text style={styles.backText}>← Atrás</Text>
  </TouchableOpacity>
)}

        {/* BOTÓN */}
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6d5c3",
    padding: 20,
    justifyContent: "center"
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center"
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10
  },

  button: {
    backgroundColor: "#1c2451",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  option: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center"
  }
  
});