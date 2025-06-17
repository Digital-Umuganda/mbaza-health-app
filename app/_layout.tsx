import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { ConversationProvider } from "@/context/ConversationContext";
import { FollowupProvider } from "@/context/FollowupContext";
import { PatientThoughtsProvider } from "@/context/PatientThoughtsContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <PatientThoughtsProvider>
          <ConversationProvider>
            <FollowupProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen
                  name="forgot-pin"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="verify-code"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="help"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen
                  name="help-detail"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen name="verify" options={{ headerShown: false }} />

                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                    headerBackVisible: false,
                  }}
                />

                <Stack.Screen
                  name="consultation/voice-chat"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen
                  name="consultation/complete"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen
                  name="consultation/[id]/index"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen
                  name="consultation/[id]/details"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "Ibyerekeye Ikiganiro",
                  }}
                />
                <Stack.Screen
                  name="consultation/[id]/patient-thoughts"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "Ibyiyumvo by’umurwayi",
                  }}
                />
                <Stack.Screen
                  name="consultation/[id]/follow-up/[followUpId]"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "Kurikirana Umurwayi",
                  }}
                />
                <Stack.Screen
                  name="consultation/[id]/follow-up/complete"
                  options={{
                    headerStyle: {
                      backgroundColor: "#478CCA",
                    },
                    headerTintColor: "#F7BB3A",
                    headerTitleStyle: {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: 18,
                    },
                    headerTitle: "RBC | MBAZA",
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              {/* <StatusBar style="light" /> */}
            </FollowupProvider>
          </ConversationProvider>
        </PatientThoughtsProvider>
      </SettingsProvider>
      <Toast topOffset={100} />
    </ThemeProvider>
  );
}
