import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BottomTabBarProps {
  notificationCount?: number;
}

export default function BottomTabBar({
  notificationCount = 0,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Ionicons name="grid-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          router.replace("/(tabs)/conversations");
        }}
      >
        <View style={styles.notificationContainer}>
          <Ionicons name="list" size={24} color="white" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          router.replace("/(tabs)/profile");
        }}
      >
        <Ionicons name="person-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#3a80d2",
  },
  tabButton: {
    padding: 10,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#ff4d4f",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
