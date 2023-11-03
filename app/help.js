import { ScrollView, Text, View } from "react-native";
import Button from "../Button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { helpData } from "../assets/data/help";

export default function Help() {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 40, paddingVertical: 64 }}>
      <Text
        style={{
          color: "#478CCA",
          textAlign: "center",
          fontSize: 36,
        }}
      >
        Ubufasha
      </Text>
      <Text
        style={{
          color: "#3D576F",
          fontSize: 20,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Tubafashe gute?
      </Text>
      <View style={{ marginTop: 20 }}></View>
      {helpData.map((item, index) => (
        <View key={item.title} style={{ marginBottom: 10 }}>
          <Button
            title={item.title}
            backgroundColor="transparent"
            textColor="#3D576F"
            borderColor="#478CCA3D"
            fontSize={16}
            onPress={() => {
              router.push({
                pathname: "help-detail",
                params: { id: index },
              });
            }}
          />
        </View>
      ))}
      <StatusBar style="light" />
    </ScrollView>
  );
}
