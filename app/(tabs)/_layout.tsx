import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
              backgroundColor: "#478CCA",
            },
            default: {
              backgroundColor: "#478CCA",
            },
          }),
          tabBarLabel: ({ focused, children }) => (
            <Text
              style={{
                color: focused ? "white" : "#86C4FF",
                fontWeight: focused ? "bold" : "normal",
                fontSize: 10,
              }}
            >
              {children}
            </Text>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ahabanza",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={28}
                name="grid-outline"
                color={focused ? "white" : "#86C4FF"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="conversations"
          options={{
            title: "Ibiganiro",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={28}
                name="list"
                color={focused ? "white" : "#86C4FF"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Umwirondoro",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={28}
                color={focused ? "white" : "#86C4FF"}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </>
  );
}
