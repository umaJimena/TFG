import Svg, { Circle, Path } from "react-native-svg";
import { View } from "react-native";
import { colors } from "../theme";

export const BrandLogo = ({ size = 66, iconSize = 36 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 20,
      backgroundColor: colors.ink,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Svg width={iconSize} height={iconSize} viewBox="0 0 32 32">
      <Circle cx={8} cy={9} r={2} stroke={colors.cream} strokeWidth={2} fill="none" />
      <Circle cx={24} cy={23} r={2} stroke={colors.cream} strokeWidth={2} fill="none" />
      <Path
        d="M8 11v6a6 6 0 0 0 6 6h10"
        stroke={colors.cream}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  </View>
);
