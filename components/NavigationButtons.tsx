import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, TouchableOpacity, View } from "react-native"

interface NavigationButtonsProps {
  onPrevious: () => void
  onNext: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion?: boolean
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
  isLastQuestion = false,
}: NavigationButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, !canGoPrevious && styles.disabledButton]}
        onPress={onPrevious}
        disabled={!canGoPrevious}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      {isLastQuestion ? (
        <TouchableOpacity
          style={[styles.submitButton, !canGoNext && styles.disabledButton]}
          onPress={onNext}
          disabled={!canGoNext}
        >
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.navButton, !canGoNext && styles.disabledButton]}
          onPress={onNext}
          disabled={!canGoNext}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: "100%",
  },
  navButton: {
    backgroundColor: "#4a90e2",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#b3cef2",
    shadowOpacity: 0.1,
  },
})
