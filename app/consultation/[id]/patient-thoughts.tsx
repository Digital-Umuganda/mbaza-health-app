"use client";

import ContentBackground from "@/components/ContentBackground";
import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import NavigationButtons from "@/components/NavigationButtons";
import ProgressIndicator from "@/components/ProgressIndicator";
import QuestionRenderer from "@/components/QuestionRenderer";
import { Keys } from "@/constants/keys";
import { useConversation } from "@/context/ConversationContext";
import { useThoughts } from "@/context/PatientThoughtsContext";
import type { Question } from "@/types/question";
import instance from "@/utilities";
import { loadAudioFile } from "@/utilities/audioUtils";
import * as Location from "expo-location";
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
import Toast from "react-native-toast-message";
import { getConversationFieldName } from ".";

const getSurveillanceFieldName = (index: number) => {
  switch (index) {
    case 1:
      return "surveillanceFear";
    case 2:
      return "comfortDespiteRecording";
    case 3:
      return "improvedEvaluationPerception";
    case 4:
      return "unaffectedEvaluationProcess";
    default:
      return null;
  }
};

export default function PatientThoughtsScreen() {
  const [isPending, setIsPending] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const questionId = Number.parseInt(id as string);
  const router = useRouter();
  const { responses: conversation, resetConversation } = useConversation();
  const {
    questions,
    responses,
    setResponse,
    resetThoughts,
    currentSubQuestion,
    setCurrentSubQuestion,
  } = useThoughts();
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
    if (!currentQuestion) {
      router.replace("/consultation/1/patient-thoughts");
      return;
    }
    // If we're showing sub-questions and there are more
    if (subQuestions.length > 0 && subQuestionIndex < subQuestions.length - 1) {
      setSubQuestionIndex(subQuestionIndex + 1);
      setCurrentSubQuestion(subQuestions[subQuestionIndex + 1]);
    } else {
      // Move to the next main question
      const nextQuestionId = questionId + 1;
      if (nextQuestionId <= questions.length) {
        router.replace(`/consultation/${nextQuestionId}/patient-thoughts`);
      } else {
        const conversationValues = Object.values(conversation);
        const values = Object.values(responses);
        // Reduce to their fields
        const fieldValues = values.reduce(
          (acc: Record<string, string>, response, index) => {
            const field = getSurveillanceFieldName(index);
            if (field) {
              acc[field] = response.value;
            }

            return acc;
          },
          {}
        );

        const conversationFieldValues = conversationValues.reduce(
          (acc: Record<string, string>, response, index) => {
            const field = getConversationFieldName(index);
            if (field) {
              acc[field] = response.value;
            }

            return acc;
          },
          {}
        );

        const { audio, ...rest } = conversationFieldValues;
        setIsPending(true);
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Toast.show({
              type: "error",
              text1: "Permission denied",
              text2: "Location permission is required to submit your thoughts.",
              visibilityTime: 5000,
              autoHide: true,
            });
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          const audioInfo = await loadAudioFile(audio);
          if (!audioInfo) {
            throw new Error("Failed to load audio file"); // Handle this error as needed
          }
          const formData = new FormData();
          formData.append("audio_file", {
            uri: audioInfo.uri,
            type: audioInfo.type,
            name: audioInfo.name,
          } as any);
          formData.append(
            "patient_info",
            JSON.stringify({
              ...rest,
              surveillance: fieldValues,
              location: JSON.stringify(location),
            })
          );
          await instance.post(
            `${Keys.API_URL}/api/v1/chatbot-audio`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          Toast.show({
            type: "success",
            text1: "Ikiganiro cyanyu cyakiriwe neza",
            text2: "Murakoze kohereza ikiganiro cyanyu",
            visibilityTime: 3000,
            autoHide: true,
          });
          resetThoughts();
          resetConversation();
          router.replace("/consultation/complete");
        } catch (error) {
          console.log(error);
          // alert("An error occurred. Please try again.");
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

  const handlePrevious = () => {
    // If we're showing sub-questions and not on the first one
    if (subQuestions.length > 0 && subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
      setCurrentSubQuestion(subQuestions[subQuestionIndex - 1]);
    } else {
      // Move to the previous main question
      const prevQuestionId = questionId - 1;
      if (prevQuestionId >= 1) {
        router.replace(`/consultation/${prevQuestionId}/patient-thoughts`);
      }
    }
  };

  if (!currentQuestion && questionId !== 0) {
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
        <View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => router.replace("/consultation/voice-chat")}
            >
              <Text style={[styles.tabText]}>Ikiganiro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => router.replace("/consultation/1")}
            >
              <Text style={[styles.tabText]}>Ibyerekeye Umurwayi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Ibyiyumvo by’umurwayi
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Header /> */}
          {currentQuestion && (
            <ProgressIndicator
              totalSteps={questions.length}
              currentStep={questionId}
              subSteps={subQuestions.length}
              currentSubStep={subQuestionIndex}
              path={`consultation/${id}/patient-thoughts`}
            />
          )}
        </View>

        <SafeAreaView style={styles.container} edges={["top"]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {displayQuestion && currentQuestion ? (
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
            ) : (
              <Text
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 4,
                  fontSize: 16,
                  lineHeight: 24,
                }}
              >
                Ubushakashatsi burimo gukusanya ibitekerezo by’abarwayi ku
                bijyanye no gufatwa amajwi mu gihe baganiraga n’abajyanama
                b’ubuzima. Intego ni ukumenya niba gufata amajwi byagize
                ingaruka ku buryo baganiriye no ku mutekano wabo.
              </Text>
            )}
          </ScrollView>

          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoNext={
              ((displayQuestion && !!responses[displayQuestion.id]?.value) ||
                !currentQuestion) &&
              !isPending
            }
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
