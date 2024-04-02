import { Text, View } from "react-native";
import AudioPlayList from "./app/components/AudioPlayList";
import { url } from "./utilities";
import Markdown from 'react-native-markdown-display';

export default function ChatResponse({ content }) {
  const audios = content.audio_responses?.map((item) => `${url}/uploads/${item}`) ?? []

  return (
    <View
      style={{
        justifyContent: "flex-end",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderTopLeftRadius: 0,
        maxWidth: "80%",
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#E0EBF6",
          padding: 10,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#478CCA", fontWeight: "700" }}>
            R
          </Text>
          <Text style={{ fontSize: 12, color: "#F6BA15", fontWeight: "700" }}>
            B
          </Text>
          <Text style={{ fontSize: 12, color: "#3CAF4A", fontWeight: "700" }}>
            C
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: "#3D576F8E", marginRight: 32 }}>
            {content != null &&
              content?.created_at !== undefined &&
              content?.created_at.includes(":") &&
              content.created_at.split(":", 2).join(":")}
          </Text>
          {audios?.length ? <AudioPlayList playlist={audios} noSlider /> : null}
        </View>
      </View>
      <View style={{ padding: 15 }}>
        <Markdown style={{
          color: "#3D576F",
          fontWeight: "500",
          lineHeight: 24,
          marginBottom: 1,
        }}>
          {content?.answer}
        </Markdown>
      </View>
    </View>
  );
}
