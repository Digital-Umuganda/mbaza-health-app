import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchProfile } from "@/utilities";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { checkSession } from "./profile";

export default function HomeScreen() {
  const [isPending, setPending] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>();
  const router = useRouter();
  useEffect(() => {
    checkSession().then(() => {
      setPending(true);
      setTheProfileUp().finally(() => {
        setPending(false);
      });
    });
  }, []);

  const setTheProfileUp = async () => {
    const profile = await fetchProfile();
    setProfile(profile);
  };
  return (
    <ParallaxScrollView profile={profile} isLoading={isPending}>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: 20,
          paddingTop: 20,
          marginBottom: 28,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.activityContainer}
          onPress={() => router.push("/(tabs)/conversations?filter=all")}
        >
          <ThemedText type="title">
            {profile?.total_consultations || 0}
          </ThemedText>
          <ThemedText style={{ color: "#478CCA" }}>
            Ibiganiro byatanzwe
          </ThemedText>
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#F6BA15",
              borderTopLeftRadius: 50,
              padding: 5,
              width: 64,
              height: 64,
              alignItems: "flex-end",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.activityContainer}
          onPress={() =>
            router.push("/(tabs)/conversations?filter=pending_5days")
          }
        >
          <ThemedText type="title">
            {profile?.total_consultations_in_progress_5days || 0}
          </ThemedText>
          <ThemedText style={{ color: "#478CCA" }}>
            Ibiganiro bikeneye gukurikiranwa nyuma y&apos; iminsi 5
          </ThemedText>
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#F6BA15",
              borderTopLeftRadius: 50,
              padding: 5,
              width: 64,
              height: 64,
              alignItems: "flex-end",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.activityContainer}
          onPress={() =>
            router.push("/(tabs)/conversations?filter=pending_14days")
          }
        >
          <ThemedText type="title">
            {profile?.total_consultations_in_progress_14days || 0}
          </ThemedText>
          <ThemedText style={{ color: "#478CCA" }}>
            Ibiganiro bikeneye gukurikiranwa nyuma y’iminsi 14
          </ThemedText>
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#F6BA15",
              borderTopLeftRadius: 50,
              padding: 5,
              width: 64,
              height: 64,
              alignItems: "flex-end",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.activityContainer}
          onPress={() =>
            router.push("/(tabs)/conversations?filter=followed_up_5days")
          }
        >
          <ThemedText type="title">
            {profile?.total_consultations_followed_5days || 0}
          </ThemedText>
          <ThemedText style={{ color: "#478CCA" }}>
            ibiganiro byakurikiranwe nyuma y’iminsi 5
          </ThemedText>
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#F6BA15",
              borderTopLeftRadius: 50,
              padding: 5,
              width: 64,
              height: 64,
              alignItems: "flex-end",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.activityContainer}
          onPress={() =>
            router.push("/(tabs)/conversations?filter=followed_up_14days")
          }
        >
          <ThemedText type="title">
            {profile?.total_consultations_followed_14days || 0}
          </ThemedText>
          <ThemedText style={{ color: "#478CCA" }}>
            Ibiganiro byakurikiranwe nyuma y’iminsi 14
          </ThemedText>
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#F6BA15",
              borderTopLeftRadius: 50,
              padding: 5,
              width: 64,
              height: 64,
              alignItems: "flex-end",
            }}
          />
        </TouchableOpacity>
      </ScrollView>

      <ThemedView
        style={{
          paddingHorizontal: 20,
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/consultation/voice-chat");
          }}
          style={{
            backgroundColor: "#478CCA",
            bottom: 24,
            width: "100%",
            height: 64,
            borderRadius: 8,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <ThemedView
            style={{ flexDirection: "row", backgroundColor: "transparent" }}
          >
            <ThemedView
              style={{
                alignItems: "center",
                flex: 1,
                backgroundColor: "transparent",
              }}
            >
              <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
                Ikiganiro Gishya
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  activityContainer: {
    gap: 8,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    position: "relative",
    width: "100%",
    backgroundColor: "white",
  },
});
