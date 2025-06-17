export type ConversationStatus =
  | "pending"
  | "overdue"
  | "completed"
  | "followed_up";

export interface Conversation {
  id: number;
  patientName: string;
  submissionDate: string;
  status: string;
  statusType: ConversationStatus;
  notificationCount: number;
}

export type ConversationResponse = {
  id: string;
  user_id: string;
  updated_at: string | null;
  follow_up_info: any | null;

  patient_info: {
    age: string;
    name: string;
    gender: string;
    eduction: string;
    profession: string;
    transferred: string;
    status_level: string;
    marital_status: string;
    other_diseases: string;
  };
  audio_url: string;
  created_at: string;
};
