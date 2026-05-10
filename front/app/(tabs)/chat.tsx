import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Avatar } from "../../src/components/Avatar";
import { AvatarStack } from "../../src/components/AvatarStack";
import { ChatIcon } from "../../src/icons";
import { fetchMyThreads } from "../../src/api/threads";
import { colors, fonts, radius } from "../../src/theme";

const initials = (u: any) => {
  const n = (u?.name?.[0] || "").toUpperCase();
  const s = (u?.surname?.[0] || "").toUpperCase();
  return n + s || "?";
};

const fullName = (u: any) =>
  `${u?.name || ""} ${u?.surname || ""}`.trim() || "Usuario";

const formatTime = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const same = d.toDateString() === now.toDateString();
  if (same) {
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
};

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const { threads } = await fetchMyThreads();
      setThreads(threads);
    } catch (err) {
      console.warn("[chat] load", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>
          Coordinate con tus grupos de trayecto
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      ) : threads.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconBox}>
            <ChatIcon size={36} color={colors.inkMuted} />
          </View>
          <Text style={styles.emptyTitle}>Aun no tienes conversaciones</Text>
          <Text style={styles.emptySub}>
            Cuando te unas a un trayecto o publiques uno, aparecera aqui un chat
            con el grupo.
          </Text>
        </View>
      ) : (
        <ScrollView
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
          {threads.map((th) => {
            const others = (th.members || []).filter(
              (m: any) => String(m._id) !== String(user?._id)
            );
            const title = th.trip
              ? `${th.trip.from} → ${th.trip.to}`
              : "Conversacion";
            const last = th.lastMessage;
            const lastFrom =
              last?.from && th.members.find((m: any) => String(m._id) === String(last.from));
            const lastPreview = last
              ? last.system
                ? last.text
                : `${
                    String(last.from) === String(user?._id)
                      ? "Tu"
                      : lastFrom?.name || "Alguien"
                  }: ${last.text}`
              : "Sin mensajes aun";
            return (
              <TouchableOpacity
                key={th._id}
                onPress={() => router.push(`/chat/${th._id}`)}
                activeOpacity={0.85}
                style={styles.row}
              >
                <View style={styles.avatarBox}>
                  {others.length > 0 ? (
                    <AvatarStack users={others.map((o: any) => ({
                      id: o._id,
                      avatar: initials(o),
                      color: o.avatarColor || colors.mustard,
                    }))} size={42} max={2} />
                  ) : (
                    <Avatar
                      initials="?"
                      color={colors.mustard}
                      size={42}
                      border
                    />
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.threadTitle} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.timeText}>
                      {formatTime(last?.createdAt || th.updatedAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.preview,
                      last?.system && { fontStyle: "italic" },
                    ]}
                    numberOfLines={1}
                  >
                    {lastPreview}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8 },
  title: {
    fontSize: 32,
    fontFamily: fonts.serif,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 4,
  },
  scroll: { paddingVertical: 6 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(20,26,69,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.serif,
    color: colors.ink,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 17,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  avatarBox: { width: 70 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  threadTitle: {
    fontSize: 14,
    fontFamily: fonts.sansBold,
    color: colors.ink,
    flex: 1,
  },
  timeText: { fontSize: 11, fontFamily: fonts.sans, color: colors.inkMuted },
  preview: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 3,
  },
});
