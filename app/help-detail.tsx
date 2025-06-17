import { helpData } from "@/assets/data/help";
import ContentBackground from "@/components/ContentBackground";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    color: "#478CCA",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  step: {
    fontSize: 16,
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    marginTop: 20,
    fontStyle: "italic",
  },
});

const HelpDetail = () => {
  const params = useLocalSearchParams();
  const { title, description, notes } = helpData[Number(params.id)];
  const [loading, setLoading] = React.useState(true);

  return (
    <ContentBackground>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{description}</Text>
        <Text style={styles.note}>{notes}</Text>
        {params.id === "0" && (
          <>
            {loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Mutegereze videwo...</Text>
              </View>
            )}
            <View>
              <YoutubePlayer
                height={300}
                videoId={"PNS4yaWwDAw"}
                onReady={() => setLoading(false)}
              />
            </View>
          </>
        )}
      </ScrollView>
    </ContentBackground>
  );
};

export default HelpDetail;
