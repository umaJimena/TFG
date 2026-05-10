import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../src/context/AuthContext";

function profileComplete(user: any): boolean {
  if (!user) return false;
  if (!user.emailVerified) return false;
  if (!user.role) return false;
  if (!user.name || !user.surname || !user.birthDate || !user.gender || !user.dni)
    return false;
  if (user.role === "driver" && (!user.car || !user.car.plate)) return false;
  return true;
}

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FBF3E6",
        }}
      >
        <ActivityIndicator size="large" color="#141A45" />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (!profileComplete(user)) return <Redirect href="/register" />;
  return <Redirect href="/home" />;
}
