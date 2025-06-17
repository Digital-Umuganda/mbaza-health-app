import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface TimelineItem {
  id: number;
  date: string;
  time: string;
  action: string;
  description: string;
  user: string;
}

interface ConversationTimelineProps {
  timeline: TimelineItem[];
}

export default function ConversationTimeline({
  timeline,
}: ConversationTimelineProps) {
  return (
    <View style={styles.container}>
      {timeline.map((item, index) => (
        <View key={item.id} style={styles.timelineItem}>
          <View style={styles.timelineLine}>
            <View style={styles.timelineDot} />
            {index < timeline.length - 1 && (
              <View style={styles.timelineConnector} />
            )}
          </View>
          <View style={styles.timelineContent}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineAction}>{item.action}</Text>
              <Text style={styles.timelineTime}>
                {item.date} • {item.time}
              </Text>
            </View>
            <Text style={styles.timelineDescription}>{item.description}</Text>
            <View style={styles.timelineUser}>
              <Ionicons name="person-circle-outline" size={16} color="#666" />
              <Text style={styles.timelineUserText}>{item.user}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  timelineLine: {
    width: 24,
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4a90e2",
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 4,
    marginBottom: -15,
    marginLeft: 5,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  timelineTime: {
    fontSize: 12,
    color: "#666",
  },
  timelineDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  timelineUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineUserText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});
