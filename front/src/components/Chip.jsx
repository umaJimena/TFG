import { View, Text } from "react-native";
import { colors, fonts } from "../theme";

const TONES = {
  ink: { bg: colors.ink, fg: colors.cream, border: null },
  mustard: { bg: colors.mustard, fg: colors.warmDark, border: null },
  leaf: { bg: colors.leaf, fg: colors.cream, border: null },
  coral: { bg: colors.coral, fg: colors.cream, border: null },
  ghost: { bg: "rgba(20,26,69,0.08)", fg: colors.ink, border: null },
  cream: { bg: colors.cream, fg: colors.ink, border: colors.inkBorder },
};

export const Chip = ({ children, tone = "ink", icon = null, style = {} }) => {
  const t = TONES[tone];
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 999,
          backgroundColor: t.bg,
          borderWidth: t.border ? 1 : 0,
          borderColor: t.border || "transparent",
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={{
          fontSize: 11,
          fontFamily: fonts.sansBold,
          color: t.fg,
          letterSpacing: 0.4,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Text>
    </View>
  );
};
