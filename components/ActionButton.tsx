import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  primary?: boolean;
}

export default function ActionButton({
  icon,
  label,
  onPress,
  primary = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={primary ? "white" : "#4a90e2"}
        style={styles.buttonIcon}
      />
      <Text
        style={[
          styles.buttonText,
          primary ? styles.primaryButtonText : styles.secondaryButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: "#4a90e2",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4a90e2",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#4a90e2",
  },
});
