import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RadioQuestionProps {
  options: string[];
  selectedOption: string;
  onSelect?: (option: string) => void;
  isRow?: boolean;
  readOnly?: boolean;
}

export default function RadioQuestion({
  options,
  selectedOption,
  onSelect,
  isRow,
  readOnly = false,
}: RadioQuestionProps) {
  return (
    <View
      style={[
        styles.container,
        isRow && { flexDirection: "row", flexWrap: "wrap", gap: 10 },
      ]}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => onSelect?.(option)}
          disabled={selectedOption === option || readOnly}
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
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 2,
    borderWidth: 1,
    borderColor: "#B1C6DA",
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
  },
});
