"use client";

import ContentBackground from "@/components/ContentBackground";
import NavigationButtons from "@/components/NavigationButtons";
import ProgressIndicator from "@/components/ProgressIndicator";
import QuestionRenderer from "@/components/QuestionRenderer";
import { useConversation } from "@/context/ConversationContext";
import type { Question } from "@/types/question";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const getConversationFieldName = (index: number) => {
  switch (index) {
    case 0:
      return "audio";
    case 1:
      return "name";
    case 2:
      return "age";
    case 3:
      return "gender";
    case 4:
      return "profession";
    case 5:
      return "eduction";
    case 6:
      return "marital_status";
    case 7:
      return "transferred";
    case 8:
      return "other_diseases";
    default:
      return null;
  }
};

export default function ConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const questionId = Number.parseInt(id as string);
  const router = useRouter();
  const {
    questions,
    responses,
    setResponse,
    currentSubQuestion,
    setQuestions,
    setCurrentSubQuestion,
  } = useConversation();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [subQuestions, setSubQuestions] = useState<Question[]>([]);
  const [subQuestionIndex, setSubQuestionIndex] = useState<number>(0);

  useEffect(() => {
    // Find the main question
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      setCurrentQuestion(question);

      // Check if this question has sub-questions and if they should be shown
      if (question.subQuestions && responses[question.id]?.value === "Yego") {
        setSubQuestions(question.subQuestions);
        // Set the current sub-question if not already set
        if (
          !currentSubQuestion ||
          currentSubQuestion.parentId !== question.id
        ) {
          setCurrentSubQuestion(question.subQuestions[0]);
          setSubQuestionIndex(0);
        }
      } else {
        setSubQuestions([]);
        setCurrentSubQuestion(null);
        setSubQuestionIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, questions, responses, currentSubQuestion]);

  const handleNext = async () => {
    // If we're showing sub-questions and there are more
    if (subQuestions.length > 0 && subQuestionIndex < subQuestions.length - 1) {
      setSubQuestionIndex(subQuestionIndex + 1);
      setCurrentSubQuestion(subQuestions[subQuestionIndex + 1]);
    } else {
      // Move to the next main question
      const nextQuestionId = questionId + 1;
      if (nextQuestionId <= questions.length) {
        router.replace(`/consultation/${nextQuestionId}`);
      } else {
        router.replace("/consultation/0/patient-thoughts");
      }
    }
  };

  const handlePrevious = () => {
    // If we're showing sub-questions and not on the first one
    if (subQuestions.length > 0 && subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
      setCurrentSubQuestion(subQuestions[subQuestionIndex - 1]);
    } else {
      // Move to the previous main question
      const prevQuestionId = questionId - 1;
      if (prevQuestionId >= 1) {
        router.replace(`/consultation/${prevQuestionId}`);
      }
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading question...</Text>
      </View>
    );
  }

  const displayQuestion = currentSubQuestion || currentQuestion;
  const isLastQuestion =
    questionId === questions.length &&
    (!subQuestions.length || subQuestionIndex === subQuestions.length - 1);

  return (
    <ContentBackground>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => router.replace("/consultation/voice-chat")}
            >
              <Text style={[styles.tabText]}>Ikiganiro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Ibyerekeye Umurwayi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab]}>
              <Text style={[styles.tabText]}>Ibyiyumvo by’umurwayi</Text>
            </TouchableOpacity>
          </View>
          {/* <Header /> */}
          <ProgressIndicator
            totalSteps={questions.length}
            currentStep={questionId}
            subSteps={subQuestions.length}
            currentSubStep={subQuestionIndex}
            path="consultation"
          />
        </View>

        <SafeAreaView style={styles.container} edges={["top"]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <QuestionRenderer
              question={displayQuestion}
              response={
                responses[displayQuestion.id] || {
                  value: "",
                  additionalData: null,
                }
              }
              onResponseChange={(value, additionalData) => {
                setResponse(
                  displayQuestion.id,
                  value,
                  additionalData,
                  currentSubQuestion ? currentQuestion.id : undefined
                );
              }}
            />
          </ScrollView>

          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoNext={!!responses[displayQuestion.id]?.value}
            canGoPrevious={questionId > 1 || subQuestionIndex > 0}
            isLastQuestion={isLastQuestion}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f0f6ff",
    paddingBottom: 64,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "white",
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: "#478CCA",
  },
  tabText: {
    fontSize: 16,
    color: "#9BB2C8",
    textAlign: "center",
  },
  activeTabText: {
    color: "#478CCA",
    fontWeight: "600",
  },
});
