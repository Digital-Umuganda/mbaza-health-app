export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  RADIO = "radio",
  TEXT_INPUT = "text_input",
  VOICE_RECORDING = "voice_recording",
}

export interface Question {
  id: number;
  title: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  description?: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  multiline?: boolean;
  recordingPrompt?: string;
  subQuestions?: Question[];
  parentId?: number;
  conditionalValue?: string;
}

export interface Response {
  value: string;
  additionalData?: any;
  parentId?: number;
}
