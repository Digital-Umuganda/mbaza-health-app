import { followupQuestions } from "@/assets/data/questions";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Question, Response } from "../types/question";

interface FollowupContextType {
  questions: Question[];
  responses: Record<number, Response>;
  setResponse: (
    questionId: number,
    value: string,
    additionalData?: any,
    parentId?: number
  ) => void;
  resetFollowup: () => void;
  currentSubQuestion: Question | null;
  setCurrentSubQuestion: (question: Question | null) => void;
  setQuestions: (questions: Question[]) => void;
}

const FollowupContext = createContext<FollowupContextType | undefined>(
  undefined
);

export function FollowupProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(followupQuestions);
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

  const resetFollowup = () => {
    setResponses({});
    setCurrentSubQuestion(null);
  };

  return (
    <FollowupContext.Provider
      value={{
        questions,
        responses,
        setResponse,
        resetFollowup,
        currentSubQuestion,
        setCurrentSubQuestion,
        setQuestions,
      }}
    >
      {children}
    </FollowupContext.Provider>
  );
}

export function useFollowup() {
  const context = useContext(FollowupContext);
  if (context === undefined) {
    throw new Error("useFollowup must be used within a FollowupProvider");
  }
  return context;
}
