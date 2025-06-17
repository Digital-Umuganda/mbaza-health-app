import { conversationQuestions } from "@/assets/data/questions";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Question, Response } from "../types/question";

interface ConversationContextType {
  questions: Question[];
  responses: Record<number, Response>;
  setResponse: (
    questionId: number,
    value: string,
    additionalData?: any,
    parentId?: number
  ) => void;
  resetConversation: () => void;
  currentSubQuestion: Question | null;
  setCurrentSubQuestion: (question: Question | null) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(conversationQuestions);
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

  const resetConversation = () => {
    setResponses({});
    setCurrentSubQuestion(null);
  };

  return (
    <ConversationContext.Provider
      value={{
        questions,
        responses,
        setResponse,
        resetConversation,
        currentSubQuestion,
        setCurrentSubQuestion,
        setQuestions,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
}
