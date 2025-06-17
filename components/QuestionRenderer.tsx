"use client";
import { StyleSheet, Text, View } from "react-native";
import { type Question, QuestionType, type Response } from "../types/question";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import RadioQuestion from "./questions/RadioQuestion";
import TextInputQuestion from "./questions/TextInputQuestion";
import RecordAudio from "./RecordAudio";

interface QuestionRendererProps {
  question: Question;
  response: Response;
  onResponseChange: (value: string, additionalData?: any) => void;
}

export default function QuestionRenderer({
  question,
  response,
  onResponseChange,
}: QuestionRendererProps) {
  const renderQuestionComponent = () => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            selectedOption={response.value}
            onSelect={(value) => onResponseChange(value)}
          />
        );
      case QuestionType.RADIO:
        return (
          <RadioQuestion
            options={question.options || []}
            selectedOption={response.value}
            onSelect={(value) => onResponseChange(value)}
          />
        );
      case QuestionType.TEXT_INPUT:
        return (
          <TextInputQuestion
            placeholder={question.placeholder || "Andika hano"}
            value={response.value}
            onChangeText={(value) => onResponseChange(value)}
            multiline={question.multiline}
            keyboardType={question.keyboardType}
          />
        );
      case QuestionType.VOICE_RECORDING:
        return (
          <RecordAudio
            onSubmit={(uri) => onResponseChange(uri)}
            recordingUri={response.value}
          />
        );
      default:
        return (
          <Text style={styles.errorText}>Question type not supported</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}
      {renderQuestionComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4a90e2",
    textAlign: "center",
    marginBottom: 20,
  },
  questionDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
