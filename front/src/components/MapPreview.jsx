import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export const MapPreview = ({ height = 220 }) => (
  <View style={{ height, backgroundColor: "#ECE1D5", overflow: "hidden" }}>
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 390 220"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path
        d="M -20 30 C 60 10, 130 30, 170 80 C 200 130, 130 170, 60 170 C 0 170, -20 100, -20 30 Z"
        fill="#D9C6A5"
        opacity={0.5}
      />
      <Path
        d="M 250 -10 C 320 10, 400 50, 410 110 C 410 160, 320 160, 260 130 C 220 105, 220 30, 250 -10 Z"
        fill="#D9C6A5"
        opacity={0.5}
      />

      <Circle cx={120} cy={180} rx={35} ry={22} fill="#C4D6B2" opacity={0.7} />
      <Circle cx={290} cy={170} rx={28} ry={18} fill="#C4D6B2" opacity={0.7} />

      <Path
        d="M -20 100 L 410 80"
        stroke="#FBF3E6"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <Path
        d="M 100 -10 L 130 230"
        stroke="#FBF3E6"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Path
        d="M 280 -10 L 320 230"
        stroke="#FBF3E6"
        strokeWidth={8}
        strokeLinecap="round"
      />

      <Path
        d="M 60 180 C 130 130, 220 100, 320 50"
        stroke="#141A45"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 60 180 C 130 130, 220 100, 320 50"
        stroke="#FBF3E6"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="3 5"
      />

      <Circle
        cx={60}
        cy={180}
        r={10}
        fill="#E9B949"
        stroke="#141A45"
        strokeWidth={2}
      />
      <Circle cx={60} cy={180} r={3.5} fill="#141A45" />

      <Path
        d="M 320 30 C 330 30, 334 38, 334 44 C 334 52, 326 58, 320 70 C 314 58, 306 52, 306 44 C 306 38, 310 30, 320 30 Z"
        fill="#E26B5A"
        stroke="#141A45"
        strokeWidth={2}
      />
      <Circle cx={320} cy={42} r={3.5} fill="#FBF3E6" />
    </Svg>
  </View>
);
