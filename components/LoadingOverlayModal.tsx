import { BlurView } from "expo-blur";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = {
  visible: boolean;
  text?: string;
  useBlur?: boolean;
};

// Method 1: Using Modal with Expo BlurView (Recommended)
export const LoadingOverlayModal = ({
  visible,
  text = "Tegereza...",
  useBlur = true,
}: Props) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      {useBlur ? (
        <BlurView intensity={20} style={styles.blurOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            {text && <Text style={styles.loadingText}>{text}</Text>}
          </View>
        </BlurView>
      ) : (
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            {text && <Text style={styles.loadingText}>{text}</Text>}
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Blur overlay styles (Expo specific)
  blurOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  absoluteBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },

  // Modal overlay styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Absolute overlay styles
  absoluteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },

  // Common loading container
  loadingContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 120,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },

  // Custom spinner styles
  customSpinner: {
    justifyContent: "center",
    alignItems: "center",
  },

  spinnerBorder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 4,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },

  // Pulse loader styles
  pulseLoader: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  // Example app styles
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },

  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 15,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryButton: {
    backgroundColor: "#34C759",
  },

  tertiaryButton: {
    backgroundColor: "#FF9500",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
