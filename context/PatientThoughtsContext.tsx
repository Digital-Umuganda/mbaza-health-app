import { patientThoughtsQuestions } from "@/assets/data/questions";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Question, Response } from "../types/question";

interface PatientThoughtsContextType {
  questions: Question[];
  responses: Record<number, Response>;
  setResponse: (
    questionId: number,
    value: string,
    additionalData?: any,
    parentId?: number
  ) => void;
  resetThoughts: () => void;
  currentSubQuestion: Question | null;
  setCurrentSubQuestion: (question: Question | null) => void;
  setQuestions: (questions: Question[]) => void;
}

const PatientThoughtsContext = createContext<PatientThoughtsContextType | undefined>(
  undefined
);

export function PatientThoughtsProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(patientThoughtsQuestions);
  const [responses, setResponses] = useState<Record<number, Response>>({});
  const [currentSubQuestion, setCurrentSubQuestion] = useState<Question | null>(
    null
  );

  const setResponse = (
    questionId: number,
    value: string,
    additionalData?: any,
    parentId?: number
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { value, additionalData, parentId },
    }));
  };

  const resetThoughts = () => {
    setResponses({});
    setCurrentSubQuestion(null);
  };

  return (
    <PatientThoughtsContext.Provider
      value={{
        questions,
        responses,
        setResponse,
        resetThoughts,
        currentSubQuestion,
        setCurrentSubQuestion,
        setQuestions,
      }}
    >
      {children}
    </PatientThoughtsContext.Provider>
  );
}

export function useThoughts() {
  const context = useContext(PatientThoughtsContext);
  if (context === undefined) {
    throw new Error("useThoughts must be used within a PatientThoughtsProvider");
  }
  return context;
}
