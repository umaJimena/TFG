import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function Login() {
  
  const router = useRouter();
  // Estados para guardar lo que escribe el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función que se ejecuta al pulsar login
  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.title}>Log in</Text>

      {/* Input Email */}
      <Text style={styles.label}>Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="hello@gmail.com"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.footer}>
          ¿Eres nuevo/a? Regístrate aquí
        </Text>
      </TouchableOpacity>

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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 20,
    paddingVertical: 8
  },

  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  footer: {
    textAlign: "center",
    marginTop: 30,
    color: "#555"
  }
});