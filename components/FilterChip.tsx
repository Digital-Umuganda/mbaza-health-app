import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}

export default function FilterChip({
  label,
  count,
  active,
  onPress,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.activeChipText]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeChip: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeChipText: {
    color: "white",
  },
});
