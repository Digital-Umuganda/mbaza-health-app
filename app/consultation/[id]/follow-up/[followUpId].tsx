"use client";

import ContentBackground from "@/components/ContentBackground";
import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import NavigationButtons from "@/components/NavigationButtons";
import ProgressIndicator from "@/components/ProgressIndicator";
import QuestionRenderer from "@/components/QuestionRenderer";
import { Keys } from "@/constants/keys";
import { useFollowup } from "@/context/FollowupContext";
import type { Question } from "@/types/question";
import instance from "@/utilities";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function FollowupScreen() {
  const [isPending, setIsPending] = useState(false);
  const { followUpId, id } = useLocalSearchParams<{
    followUpId: string;
    id: string;
  }>();
  const questionId = Number.parseInt(followUpId as string);
  const router = useRouter();
  const {
    questions,
    responses,
    setResponse,
    resetFollowup,
    currentSubQuestion,
    setCurrentSubQuestion,
  } = useFollowup();
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
        router.replace(`/consultation/${id}/follow-up/${nextQuestionId}`);
      } else {
        // Survey completed
        setIsPending(true);
        try {
          const processedResponses = Object.entries(responses).reduce(
            (acc, [key, response]) => {
              const question = questions.find((q) => q.id === Number(key));
              if (!question) return acc;
              acc[question.title] = response.value;
              return acc;
            },
            {} as Record<string, string>
          );
          await instance.post(`${Keys.API_URL}/api/v1/messages/random/${id}`, {
            follow_up_info: processedResponses,
          });
          Toast.show({
            type: "success",
            text1: "Amakuru yoherejwe neza",
            visibilityTime: 3000,
            autoHide: true,
          });
          resetFollowup();
          router.replace(`/consultation/${id}/follow-up/complete`);
        } catch (error) {
          console.error("Error submitting follow-up responses:", error);
          Toast.show({
            type: "error",
            text1: "Hari ibitagenze neza",
            text2: "Mwihangane mugerageze.",
            visibilityTime: 5000,
            autoHide: true,
          });
        } finally {
          setIsPending(false);
        }
      }
    }
  };

  const handlePrevious = async () => {
    // If we're showing sub-questions and not on the first one
    if (subQuestions.length > 0 && subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
      setCurrentSubQuestion(subQuestions[subQuestionIndex - 1]);
    } else {
      // Move to the previous main question
      const prevQuestionId = questionId - 1;
      if (prevQuestionId >= 1) {
        router.push(`/consultation/${id}/follow-up/${prevQuestionId}`);
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
      {isPending && (
        <LoadingOverlayModal visible={isPending} useBlur text="Kohereza..." />
      )}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* <Header /> */}
        <View style={{ marginTop: 8 }} />
        <ProgressIndicator
          totalSteps={questions.length}
          currentStep={questionId}
          subSteps={subQuestions.length}
          currentSubStep={subQuestionIndex}
          path={`consultation/${id}/follow-up`}
        />

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
            canGoNext={!!responses[displayQuestion.id]?.value && !isPending}
            canGoPrevious={
              (questionId > 1 || subQuestionIndex > 0) && !isPending
            }
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
});
