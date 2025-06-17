import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MultipleChoiceQuestionProps {
  options: string[];
  selectedOption: string;
  onSelect?: (option: string) => void;
}

export default function MultipleChoiceQuestion({
  options,
  selectedOption,
  onSelect,
}: MultipleChoiceQuestionProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          disabled={selectedOption === option}
          style={[
            styles.optionContainer,
            selectedOption === option ? styles.selectedOption : {},
          ]}
          onPress={() => onSelect?.(option)}
        >
          <View
            style={[
              styles.radioOuter,
              selectedOption === option ? styles.radioOuterSelected : {},
            ]}
          >
            {selectedOption === option && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#f0f8ff",
    borderColor: "#4a90e2",
    borderWidth: 1,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: "#4a90e2",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#4a90e2",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
});
