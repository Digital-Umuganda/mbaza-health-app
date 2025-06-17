import AudioPlayer from "@/components/AudioPlayer";
import ContentBackground from "@/components/ContentBackground";
import RecordAudio from "@/components/RecordAudio";
import { useConversation } from "@/context/ConversationContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VoiceChatScreen() {
  const { responses, setResponse, resetConversation } = useConversation();

  const question = responses?.[0];

  return (
    <ContentBackground>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Ikiganiro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => {
            if (question?.value) {
              router.replace("/consultation/1");
            }
          }}
        >
          <Text style={[styles.tabText]}>Ibyerekeye Umurwayi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab]}>
          <Text style={[styles.tabText]}>Ibyiyumvo by’umurwayi</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexGrow: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="people-arrows" size={64} color="#B1C6DA" />
        <Text style={styles.messageText}>Ikiganiro Gishya</Text>
      </View>

      <View style={styles.chatArea}>
        {!question?.value ? (
          <RecordAudio
            onSubmit={(uri) => {
              if (!uri) {
                resetConversation();
              } else {
                setResponse(0, uri);
                router.replace("/consultation/1");
              }
            }}
            recordingUri={question?.value}
          />
        ) : (
          <AudioPlayer
            audioSource={question.value}
            onDelete={resetConversation}
            onNext={() => {
              router.replace("/consultation/1");
            }}
          />
        )}
      </View>
      <StatusBar style="light" />
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "white",
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
    flexShrink: 1,
  },
  activeTabText: {
    color: "#478CCA",
    fontWeight: "600",
  },
  chatArea: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 48,
  },
  messageText: {
    color: "#B1C6DA",
    textAlign: "center",
    fontSize: 16,
  },
});
