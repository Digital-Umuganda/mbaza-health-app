import { StyleSheet, TextInput, View } from "react-native";

interface TextInputQuestionProps {
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

export default function TextInputQuestion({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  readOnly = false,
  keyboardType = "default",
}: TextInputQuestionProps) {
  return (
    <View style={styles.container}>
      <TextInput
        editable={!readOnly}
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderColor: "#B1C6DA",
    borderWidth: 1,
    padding: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 2,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
});
