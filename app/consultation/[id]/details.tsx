"use client";

import AudioPlayer from "@/components/AudioPlayer";
import ContentBackground from "@/components/ContentBackground";
import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import RadioQuestion from "@/components/questions/RadioQuestion";
import TextInputQuestion from "@/components/questions/TextInputQuestion";
import { ConversationResponse } from "@/types/conversation";
import instance from "@/utilities";
import { formatKinyarwandaDate, getStatusInfo } from "@/utilities/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConversationDetailsScreen() {
  const [pending, setPending] = useState(false);
  const [conversation, setConversation] = useState<ConversationResponse>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleFollowUp = () => {
    router.push(`/consultation/${id}/follow-up/1`);
  };

  async function fetchConversation() {
    setPending(true);
    try {
      const { data } = await instance.get<ConversationResponse>(
        `/api/v1/messages/${id}`
      );
      setConversation(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // Handle error appropriately, e.g., show a toast or alert
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pending) {
    return <LoadingOverlayModal visible />;
  }

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text>Ikiganiro nticyabonetse</Text>
      </View>
    );
  }

  const { status, statusType } = getStatusInfo(conversation);
  const isFollowUpDisabled = [
    "followed_up_5days",
    "followed_up_14days",
    "completed",
  ].includes(statusType);

  return (
    <ContentBackground>
      <ScrollView
        style={[styles.content, isFollowUpDisabled && { marginBottom: 0 }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Conversation Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ibyerekeye ikiganiro</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cyatanzwe:</Text>
            <Text style={styles.infoValue}>
              {formatKinyarwandaDate(conversation?.created_at)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aho bigeze:</Text>
            <Text style={styles.infoValue}>{status}</Text>
          </View>

          <View style={styles.audioSection}>
            <Text style={styles.infoLabel}>Ikiganiro:</Text>
            <AudioPlayer audioUri={conversation?.audio_url || ""} />
          </View>
        </View>

        {/* Patient Information Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ibyerekeye umurwayi</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amazina</Text>
            <TextInputQuestion
              readOnly
              value={conversation?.patient_info?.name || ""}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Imyaka</Text>
            <TextInputQuestion
              readOnly
              value={conversation?.patient_info?.age || ""}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Igitsina</Text>
            <View style={styles.radioGroup}>
              <RadioQuestion
                selectedOption={conversation?.patient_info.gender || ""}
                options={["Gabo", "Gore"]}
                isRow
                readOnly
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Umurwayi yahawe taransiferi</Text>
            <View style={styles.radioGroup}>
              <RadioQuestion
                selectedOption={conversation?.patient_info.transferred || ""}
                options={["Yego", "Oya"]}
                isRow
                readOnly
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Umwuga akora</Text>
            <TextInputQuestion
              readOnly
              value={conversation?.patient_info?.profession || ""}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amashuri yize</Text>
            <TextInputQuestion
              readOnly
              value={conversation?.patient_info?.eduction || ""}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Imiterere y’abashakanye</Text>
            <MultipleChoiceQuestion
              selectedOption={conversation?.patient_info.marital_status || ""}
              options={[conversation?.patient_info.marital_status || ""]}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Indwara zidakira</Text>
            <TextInputQuestion
              multiline
              readOnly
              value={conversation?.patient_info?.other_diseases || ""}
            />
          </View>
        </View>
      </ScrollView>
      {/* Follow-up Button */}
      {!isFollowUpDisabled && (
        <View
          style={{
            bottom: 48,
            position: "absolute",
            width: "auto",
            left: 20,
            right: 20,
          }}
        >
          <TouchableOpacity
            style={[styles.followUpButton]}
            onPress={handleFollowUp}
            disabled={isFollowUpDisabled}
          >
            <Text style={styles.followUpButtonText}>Kurikirana umurwayi</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="light" />
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 80,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a90e2",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: "#9BB2C8",
    fontWeight: "500",
    marginRight: 8,
    marginBottom: 16,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  audioSection: {
    marginTop: 10,
  },
  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    width: 45,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3D576F",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
  },
  radioButton: {
    marginRight: 20,
  },
  followUpButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  followUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
