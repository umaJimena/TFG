import { View, Text } from "react-native";
import { colors, fonts } from "../theme";

export const Avatar = ({
  initials,
  color = colors.mustard,
  size = 40,
  border = false,
  textColor = colors.ink,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: border ? 1.5 : 0,
      borderColor: colors.ink,
    }}
  >
    <Text
      style={{
        color: textColor,
        fontSize: size * 0.36,
        fontFamily: fonts.serifBold,
        letterSpacing: -0.3,
      }}
    >
      {initials}
    </Text>
  </View>
);
