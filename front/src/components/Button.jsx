import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { colors, fonts, radius } from "../theme";

const VARIANTS = {
  primary: { bg: colors.ink, fg: colors.cream, border: null },
  secondary: { bg: colors.cream, fg: colors.ink, border: colors.ink },
  ghost: { bg: "transparent", fg: colors.ink, border: null },
  danger: { bg: colors.coral, fg: colors.cream, border: null },
  mustard: { bg: colors.mustard, fg: colors.ink, border: null },
};

const SIZES = {
  sm: { h: 36, fontSize: 13, padX: 14 },
  md: { h: 46, fontSize: 15, padX: 20 },
  lg: { h: 54, fontSize: 16, padX: 22 },
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  disabled = false,
  icon = null,
  onPress,
  style,
}) => {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          height: s.h,
          paddingHorizontal: s.padX,
          backgroundColor: v.bg,
          borderRadius: radius.md,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border || "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: block ? "stretch" : "flex-start",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon}
          <Text
            style={{
              color: v.fg,
              fontSize: s.fontSize,
              fontFamily: fonts.sansBold,
              fontWeight: "600",
            }}
          >
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
