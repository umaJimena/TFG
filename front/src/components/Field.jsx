import { View, Text, TextInput } from "react-native";
import { colors, fonts, radius } from "../theme";

export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  icon = null,
  suffix = null,
  error = null,
}) => {
  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 0.8,
            color: colors.inkSoft,
            marginBottom: 6,
            textTransform: "uppercase",
            fontFamily: fonts.sansBold,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: colors.white,
          borderWidth: 1.5,
          borderColor: error ? colors.coral : colors.ink,
          borderRadius: radius.md,
          paddingHorizontal: 14,
          height: 48,
        }}
      >
        {icon}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(20,26,69,0.35)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.ink,
            fontFamily: fonts.sansMedium,
            paddingVertical: 0,
          }}
        />
        {suffix}
      </View>
      {error && (
        <Text style={{ fontSize: 11, color: colors.coral, marginTop: 4, marginLeft: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};
