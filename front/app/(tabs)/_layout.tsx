import { Tabs } from "expo-router";
import { ChatIcon, HomeIcon, UserIcon } from "../../src/icons";
import { colors, fonts } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: "rgba(20,26,69,0.4)",
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.inkLine,
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 22,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansBold,
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <ChatIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
