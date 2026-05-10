import { View, Text, TouchableOpacity } from "react-native";
import { colors, fonts } from "../theme";

const ALL = ["L", "M", "X", "J", "V", "S", "D"];

export const DaysPill = ({
  days = [],
  size = "md",
  onToggle = null,
  fg = colors.ink,
  bg = null,
}) => {
  const dim = size === "sm" ? 22 : size === "lg" ? 32 : 28;
  const fs = size === "lg" ? 13 : 11;
  return (
    <View style={{ flexDirection: "row", gap: size === "lg" ? 8 : 6 }}>
      {ALL.map((d) => {
        const on = days.includes(d);
        const Container = onToggle ? TouchableOpacity : View;
        return (
          <Container
            key={d}
            onPress={onToggle ? () => onToggle(d) : undefined}
            activeOpacity={0.7}
            style={{
              width: dim,
              height: dim,
              borderRadius: dim / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: on ? fg : "transparent",
              borderWidth: on ? 0 : 1,
              borderColor: fg,
              opacity: on ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontSize: fs,
                fontFamily: fonts.sansBold,
                color: on ? bg || colors.cream : fg,
              }}
            >
              {d}
            </Text>
          </Container>
        );
      })}
    </View>
  );
};
