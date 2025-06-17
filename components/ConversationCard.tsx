import { formatKinyarwandaDate, getStatusInfo } from "@/utilities/helpers";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ConversationResponse } from "../types/conversation";

interface ConversationCardProps {
  conversation: ConversationResponse;
  onFollowUp?: (status: string) => void;
  onViewDetails: () => void;
}

export default function ConversationCard({
  conversation,
  onFollowUp,
  onViewDetails,
}: ConversationCardProps) {
  const { status, statusType, color } = getStatusInfo(conversation);
  const isFollowUpDisabled = [
    "followed_up_5days",
    "followed_up_14days",
    "completed"
  ].includes(statusType);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>
            <Text style={styles.label}>Cyatanzwe: </Text>
            <Text style={styles.value}>
              {formatKinyarwandaDate(conversation.created_at)}
            </Text>
          </Text>
        </View>
      </View>

      <Text style={styles.patientInfo}>
        <Text style={styles.label}>Umurwayi: </Text>
        <Text style={styles.value}>{conversation.patient_info?.name}</Text>
      </Text>

      <Text style={styles.statusInfo}>
        <Text style={styles.label}>Aho bigeze: </Text>
        <Text style={[styles.statusValue, { color }]}>{status}</Text>
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          disabled={isFollowUpDisabled}
          style={[
            styles.followUpButton,
            isFollowUpDisabled && { opacity: 0.5 },
          ]}
          onPress={() => onFollowUp?.(statusType)}
        >
          <Text style={styles.followUpButtonText}>Kurikirana</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
          <Text style={styles.detailsButtonText}>Ibyerekeye ikiganiro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusInfo: {
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    color: "#4a90e2",
    fontWeight: "500",
  },
  value: {
    color: "#333",
    fontWeight: "400",
  },
  statusValue: {
    fontWeight: "500",
  },
  notificationBadge: {
    backgroundColor: "#f44336",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  negativeBadge: {
    backgroundColor: "#ff9800",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  followUpButton: {
    flex: 1,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  followUpButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsButton: {
    flex: 1,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
