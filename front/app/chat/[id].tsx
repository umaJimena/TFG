import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Avatar } from "../../src/components/Avatar";
import { ChevronLeftIcon, PlusIcon, RouteIcon } from "../../src/icons";
import { fetchThread, sendMessage } from "../../src/api/threads";
import { colors, fonts, radius } from "../../src/theme";

const POLL_INTERVAL_MS = 5000;

const initials = (u: any) => {
  const n = (u?.name?.[0] || "").toUpperCase();
  const s = (u?.surname?.[0] || "").toUpperCase();
  return n + s || "?";
};

const fullName = (u: any) =>
  `${u?.name || ""} ${u?.surname || ""}`.trim() || "Usuario";

const formatTime = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatThread() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [thread, setThread] = useState<any>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const lastCountRef = useRef(0);

  const load = async (silent = false) => {
    if (!id) return;
    if (!silent) setLoading(true);
    try {
      const { thread: data } = await fetchThread(id);
      setThread(data);
      const newCount = data.messages?.length || 0;
      if (newCount > lastCountRef.current) {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
      }
      lastCountRef.current = newCount;
    } catch (err: any) {
      if (!silent) {
        Alert.alert(
          "Error",
          err?.response?.data?.message || err?.message || "No se pudo cargar"
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    try {
      setSending(true);
      await sendMessage(id!, text);
      setDraft("");
      await load(true);
    } catch (err: any) {
      Alert.alert(
        "No se envio",
        err?.response?.data?.message || err?.message || "Error"
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      </SafeAreaView>
    );
  }

  if (!thread) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Conversacion no disponible</Text>
        </View>
      </SafeAreaView>
    );
  }

  const others = thread.members.filter(
    (m: any) => String(m._id) !== String(user?._id)
  );
  const title = thread.trip
    ? `${thread.trip.from} → ${thread.trip.to}`
    : "Conversacion";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeftIcon size={18} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.threadTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.threadSub}>
            {thread.members.length}{" "}
            {thread.members.length === 1 ? "persona" : "personas"} ·{" "}
            {thread.trip?.days?.join(" ") || ""}
          </Text>
        </View>
        {thread.trip && (
          <TouchableOpacity
            onPress={() => router.push(`/trip/${thread.trip._id}`)}
            style={styles.routeBtn}
          >
            <RouteIcon size={16} color={colors.ink} />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          <Text style={styles.dateLabel}>— inicio de la conversacion —</Text>
          {thread.messages.map((msg: any, i: number) => (
            <Bubble
              key={msg._id || i}
              msg={msg}
              mine={String(msg.from?._id) === String(user?._id)}
            />
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.plusBtn}>
            <PlusIcon size={18} color={colors.inkMuted} />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Mensaje..."
              placeholderTextColor="rgba(20,26,69,0.35)"
              style={styles.input}
              multiline
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!draft.trim() || sending}
            style={[
              styles.sendBtn,
              (!draft.trim() || sending) && { opacity: 0.5 },
            ]}
          >
            {sending ? (
              <ActivityIndicator color={colors.cream} size="small" />
            ) : (
              <Text style={styles.sendText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Bubble = ({ msg, mine }: any) => {
  if (msg.system) {
    return (
      <View style={styles.systemRow}>
        <Text style={styles.systemText}>{msg.text}</Text>
      </View>
    );
  }
  const author = msg.from;
  return (
    <View
      style={[
        styles.msgRow,
        { flexDirection: mine ? "row-reverse" : "row" },
      ]}
    >
      {!mine && author && (
        <Avatar
          initials={initials(author)}
          color={author.avatarColor || colors.mustard}
          size={28}
        />
      )}
      {!mine && !author && <View style={{ width: 28 }} />}
      <View style={{ maxWidth: "75%" }}>
        {!mine && author && (
          <Text style={styles.authorName}>{fullName(author)}</Text>
        )}
        <View
          style={[
            styles.bubble,
            mine ? styles.bubbleMine : styles.bubbleOther,
            mine
              ? { borderTopRightRadius: 4 }
              : { borderTopLeftRadius: 4 },
          ]}
        >
          <Text style={[styles.bubbleText, mine && { color: colors.cream }]}>
            {msg.text}
          </Text>
        </View>
        <Text
          style={[styles.time, { textAlign: mine ? "right" : "left" }]}
        >
          {formatTime(msg.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: colors.coral, fontFamily: fonts.sansMedium },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.inkLine,
    backgroundColor: colors.cream,
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
  threadTitle: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  threadSub: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
  },
  routeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  messages: { padding: 14, gap: 10 },
  dateLabel: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: colors.inkMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  systemRow: { alignItems: "center", paddingVertical: 4 },
  systemText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkMuted,
    backgroundColor: "rgba(20,26,69,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontStyle: "italic",
  },
  msgRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  authorName: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    color: colors.inkSoft,
    marginBottom: 3,
    marginLeft: 10,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleMine: { backgroundColor: colors.ink },
  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inkLine,
  },
  bubbleText: { fontSize: 14, color: colors.ink, lineHeight: 19 },
  time: {
    fontSize: 10,
    color: colors.inkMuted,
    marginTop: 3,
    paddingHorizontal: 6,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.inkLine,
    backgroundColor: colors.cream,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    color: colors.ink,
    fontFamily: fonts.sansMedium,
    padding: 0,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    color: colors.cream,
    fontSize: 22,
    fontFamily: fonts.serifBold,
    marginTop: -2,
  },
});
