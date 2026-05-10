import { View, Text } from "react-native";
import { Avatar } from "./Avatar";
import { colors, fonts } from "../theme";

export const AvatarStack = ({ users = [], size = 28, max = 3 }) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  const overlap = size * 0.35;
  return (
    <View style={{ flexDirection: "row" }}>
      {shown.map((u, i) => (
        <View
          key={u.id || i}
          style={{ marginLeft: i === 0 ? 0 : -overlap }}
        >
          <Avatar initials={u.avatar} color={u.color} size={size} border />
        </View>
      ))}
      {extra > 0 && (
        <View
          style={{
            marginLeft: -overlap,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.cream,
            borderWidth: 1.5,
            borderColor: colors.ink,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.ink,
              fontSize: size * 0.32,
              fontFamily: fonts.sansBold,
            }}
          >
            +{extra}
          </Text>
        </View>
      )}
    </View>
  );
};
