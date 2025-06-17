import { StyleSheet, Text, View } from "react-native";

type StatusType = "pending" | "overdue" | "completed" | "followed_up";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return { bg: "#fff3e0", text: "#ff9800" };
      case "overdue":
        return { bg: "#ffebee", text: "#f44336" };
      case "completed":
        return { bg: "#e8f5e9", text: "#4caf50" };
      case "followed_up":
        return { bg: "#e3f2fd", text: "#2196f3" };
      default:
        return { bg: "#f5f5f5", text: "#666666" };
    }
  };

  const colors = getStatusColor();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
