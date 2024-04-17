import { ActivityIndicator, Text, View } from "react-native";
import AudioPlayList from "./app/components/AudioPlayList";
import { url } from "./utilities";
import Markdown from 'react-native-markdown-display';
import { useEffect, useState } from "react";
import { downloadAndCacheAudio } from "./utilities/helpers";

export default function ChatResponse({ content, isTranslating }) {
  const [audioResponses, setAudioResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const audioUrls = content.audio_responses?.map((item) => `${url}/uploads/${item}`);

  const downloadAudios = async () => {
    setIsLoading(true);
    const audioFiles = (await Promise.all(
      content.audio_responses.map(async (item) => {
        return await downloadAndCacheAudio(`${url}/uploads/${item}`);
      })
    )).filter((item) => item !== null);
    setIsLoading(false);
    setAudioResponses(audioFiles);
  }

  // useEffect(() => {
  //   if (content.audio_responses?.length) {
  //     downloadAudios();
  //   }
  // }, [content.audio_responses])


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
          {isTranslating || isLoading ? <ActivityIndicator size="small" color="#3D576F" />
            : audioUrls?.length ?
              <AudioPlayList playlist={audioUrls} noSlider /> : null}
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
