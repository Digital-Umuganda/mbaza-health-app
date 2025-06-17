import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PatientInfoCardProps {
  patient: {
    patientName: string;
    patientId: string;
    patientAge: number;
    patientGender: string;
    patientLocation: string;
    assignedTo: string;
    priority: string;
    submissionDate: string;
    lastUpdated: string;
  };
}

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Amakuru y&apos;umurwayi</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Imyaka</Text>
            <Text style={styles.infoValue}>{patient.patientAge}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="transgender-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Igitsina</Text>
            <Text style={styles.infoValue}>{patient.patientGender}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItemFull}>
          <Ionicons
            name="location-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Aho atuye</Text>
            <Text style={styles.infoValue}>{patient.patientLocation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Itariki yatangiweho</Text>
            <Text style={styles.infoValue}>{patient.submissionDate}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="time-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Ivugururwa</Text>
            <Text style={styles.infoValue}>{patient.lastUpdated}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Ushinzwe</Text>
            <Text style={styles.infoValue}>{patient.assignedTo}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="flag-outline"
            size={18}
            color="#4a90e2"
            style={styles.infoIcon}
          />
          <View>
            <Text style={styles.infoLabel}>Uburemere</Text>
            <Text style={styles.infoValue}>{patient.priority}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
  },
  infoItemFull: {
    flex: 1,
    flexDirection: "row",
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
