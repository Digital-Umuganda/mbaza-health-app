"use client";

import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  subSteps?: number;
  currentSubStep?: number;
  path: "consultation" | `consultation/${string}/follow-up` | `consultation/${string}/patient-thoughts`;
}

export default function ProgressIndicator({
  totalSteps,
  currentStep,
  subSteps = 0,
  currentSubStep = 0,
  path,
}: ProgressIndicatorProps) {
  const router = useRouter();

  const navigateToStep = (step: number) => {
    if (step <= currentStep) {
      router.replace(`/${path}/${step}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <TouchableOpacity
            key={`main-${step}`}
            style={[
              styles.stepButton,
              currentStep === step ? styles.activeStep : {},
              step < currentStep ? styles.completedStep : {},
            ]}
            onPress={() => navigateToStep(step)}
            disabled={step > currentStep}
          >
            <Text
              style={[
                styles.stepText,
                currentStep === step ? styles.activeStepText : {},
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {subSteps > 0 && (
        <View style={styles.subStepsContainer}>
          <View style={styles.triangle} />
          <View style={styles.subStepsRow}>
            {Array.from({ length: subSteps }, (_, i) => i + 1).map(
              (subStep) => (
                <View
                  key={`sub-${subStep}`}
                  style={[
                    styles.subStepButton,
                    currentSubStep === subStep - 1 ? styles.activeSubStep : {},
                    subStep - 1 < currentSubStep ? styles.completedSubStep : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.subStepText,
                      currentSubStep === subStep - 1
                        ? styles.activeSubStepText
                        : {},
                    ]}
                  >
                    {subStep}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#d9e6f7",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: "#4a90e2",
  },
  completedStep: {
    backgroundColor: "#a0c5f0",
  },
  stepText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a90e2",
  },
  activeStepText: {
    color: "white",
  },
  subStepsContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#e0e9f5",
    marginBottom: -1,
  },
  subStepsRow: {
    flexDirection: "row",
    backgroundColor: "#e0e9f5",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  subStepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#d9e6f7",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  activeSubStep: {
    backgroundColor: "#4a90e2",
  },
  completedSubStep: {
    backgroundColor: "#a0c5f0",
  },
  subStepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a90e2",
  },
  activeSubStepText: {
    color: "white",
  },
});
