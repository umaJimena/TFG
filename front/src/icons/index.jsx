import Svg, { Circle, Path } from "react-native-svg";

const INK = "#141A45";

export const CheckIcon = ({ size = 16, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="m5 12 4.5 4.5L19 7"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const ChevronLeftIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const ChevronRightIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9 6l6 6-6 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const SearchIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.75} fill="none" />
    <Path
      d="m20 20-3.5-3.5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
    />
  </Svg>
);

export const UsersIcon = ({ size = 22, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={9} cy={8} r={3.25} stroke={color} strokeWidth={1.75} fill="none" />
    <Path
      d="M3 19c.5-3 3-5 6-5s5.5 2 6 5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M15 11a3 3 0 1 0 0-6"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M18 19c-.3-2-1.5-3.5-3-4.3"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const CarIcon = ({ size = 22, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 14v3a1 1 0 0 0 1 1h2v-2h10v2h2a1 1 0 0 0 1-1v-3"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M4 14l2-5a2 2 0 0 1 2-1.5h8a2 2 0 0 1 2 1.5l2 5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle cx={7.5} cy={14.5} r={1.2} stroke={color} strokeWidth={1.75} fill="none" />
    <Circle cx={16.5} cy={14.5} r={1.2} stroke={color} strokeWidth={1.75} fill="none" />
  </Svg>
);

export const HomeIcon = ({ size = 24, color = INK, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3.5 10.5 12 3.5l8.5 7M5 9.5V20h14V9.5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Path
      d="M10 20v-5h4v5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? "#FBF3E6" : "none"}
    />
  </Svg>
);

export const ChatIcon = ({ size = 24, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-4.5L7.5 21v-3H7a3 3 0 0 1-3-3V6.5Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const UserIcon = ({ size = 24, color = INK, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle
      cx={12}
      cy={8.5}
      r={4}
      stroke={color}
      strokeWidth={1.75}
      fill={filled ? color : "none"}
    />
    <Path
      d="M4 20c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </Svg>
);

export const BellIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M10 20a2 2 0 0 0 4 0"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const PlusIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const LogoutIcon = ({ size = 18, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9 5H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="m15 8 4 4-4 4M9 12h10"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const StarIcon = ({ size = 14, color = INK, filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1-6.3L3 9.7l6.2-.9L12 3Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </Svg>
);

export const PinIcon = ({ size = 16, color = INK, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Circle
      cx={12}
      cy={10}
      r={2.5}
      stroke={color}
      strokeWidth={1.75}
      fill={filled ? "#FBF3E6" : "none"}
    />
  </Svg>
);

export const RouteIcon = ({ size = 22, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={6} cy={6} r={2.5} stroke={color} strokeWidth={1.75} fill="none" />
    <Circle cx={18} cy={18} r={2.5} stroke={color} strokeWidth={1.75} fill="none" />
    <Path
      d="M6 8.5v5A4.5 4.5 0 0 0 10.5 18H15"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const ClockIcon = ({ size = 16, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.75} fill="none" />
    <Path
      d="M12 7v5l3 2"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const EuroIcon = ({ size = 14, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M17 6.5A7 7 0 0 0 6 12a7 7 0 0 0 11 5.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M4 10h9M4 14h9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const WarningIcon = ({ size = 16, color = INK }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 4 2.5 20h19L12 4Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M12 10v5M12 17.5v.5"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);
