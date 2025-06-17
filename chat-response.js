import { ActivityIndicator, Text, View } from "react-native";
import AudioPlayer from "./app/components/AudioPlayer";
import { url } from "./utilities";
import Markdown from 'react-native-markdown-display';
import appDayjs, { dateTimeWithSpaceFormat } from "./app/utils/date";
import SkeletonLoader from "./app/components/SkeletonLoader";

export default function ChatResponse({ content, isTranslating, isLastTranslating }) {

  const audioUrls = content.audio_responses?.map((item) => `${url}/uploads/${item}`);

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
            {!!content &&
              !!content?.created_at && appDayjs(content.created_at).format(dateTimeWithSpaceFormat)}
          </Text>
          {isTranslating ? <ActivityIndicator size="small" color="#3D576F" />
            : audioUrls?.length ?
              <AudioPlayer audioUri={audioUrls[0]} noSlider /> : null}
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
      {isLastTranslating ? <SkeletonLoader /> : null}
    </View>
  );
}
