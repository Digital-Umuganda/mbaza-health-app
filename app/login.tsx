import ContentBackground from "@/components/ContentBackground";
import Button from "@/components/ui/Button";
import instance, { storeData } from "@/utilities";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [errorBag, setErrorBag] = useState<Record<string, boolean>>({});

  const logIn = () => {
    if (isLoading) {
      return;
    }
    let bag = validate();

    if (bag.phoneNumber === true || bag.pin === true) {
      setErrorBag(bag);
      return;
    }

    setErrorBag({});

    const data: Record<string, string> = {
      username: phoneNumber,
      password: pin,
    };

    if (data.username.startsWith("0")) {
      data.username = `25${data.username}`;
    } else if (data.username.startsWith("7")) {
      data.username = `250${data.username}`;
    }

    setIsLoading(true);
    instance
      .post(`/api/v1/auth/login`, data)
      .then(function (response) {
        storeData("access_token", response.data.access_token).then(() =>
          storeData("phone_number", phoneNumber!).then(() =>
            router.replace("/(tabs)")
          )
        );
      })
      .catch(function (error) {
        const message = error?.response?.data?.message || error?.message;
        Toast.show({
          type: "error",
          text1: "Kwinjiri ntibyagenze neza",
          text2: message.includes("Invalid")
            ? "Shyiramo telefone n'umubare w'ibanga wanyawo."
            : message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validate = () => {
    const data: Record<string, string | undefined> = {
      username: phoneNumber,
      password: pin,
    };

    let bag: Record<string, boolean> = {};

    if (
      !data?.username ||
      !data.username.startsWith("07") ||
      data.username.length !== 10
    ) {
      bag.phoneNumber = true;
    }

    if (
      data?.password === null ||
      typeof data.password != "string" ||
      data.password.length < 5
    ) {
      bag.pin = true;
    }

    return bag;
  };

  const handleForgotPin = () => {
    router.replace("/forgot-pin");
  };

  return (
    <ContentBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{ flex: 1, alignItems: "center", paddingHorizontal: 40 }}
            >
              <Text style={{ color: "#478CCA", fontSize: 36, marginTop: 100 }}>
                Aho Kwinjirira
              </Text>
              <Text
                style={{
                  color: "#3D576F",
                  fontSize: 20,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Uzuzamo nimero yawe ya telefoni na PIN ubundi winjire.
              </Text>
              <View style={{ marginBottom: 20, marginTop: 60, width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "#478CCA3D",
                    paddingHorizontal: 15,
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    source={require("../assets/phone.png")}
                    style={{ height: 22, width: 14 }}
                  />
                  <TextInput
                    placeholder="Nimero ya Telefoni (078----)"
                    placeholderTextColor="#3D576F8E"
                    style={{
                      fontSize: 14,
                      marginLeft: 10,
                      flex: 1,
                      paddingVertical: 15,
                    }}
                    keyboardType="numeric"
                    onChangeText={(text) => setPhoneNumber(text)}
                  />
                </View>
                {errorBag.phoneNumber === true && (
                  <Text
                    style={{ color: "red", textAlign: "left", marginTop: 2 }}
                  >
                    Tangiza 07 kuri nimero. Igomba kuba igizwe n&apos; imibare
                    icumi.
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 48, width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "#478CCA3D",
                    paddingHorizontal: 15,
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    source={require("../assets/key-line.png")}
                    style={{ height: 17, width: 18 }}
                  />
                  <TextInput
                    placeholder="PIN (- - - - -)"
                    placeholderTextColor="#3D576F8E"
                    style={{
                      fontSize: 14,
                      marginLeft: 10,
                      flex: 1,
                      paddingVertical: 15,
                    }}
                    keyboardType="numeric"
                    onChangeText={(text) => setPin(text)}
                    secureTextEntry={true}
                  />
                </View>

                {errorBag.pin === true && (
                  <Text
                    style={{ color: "red", textAlign: "left", marginTop: 2 }}
                  >
                    PIN igomba kuba igizwe n&apos; imibare itari munsi y&apos;
                    itanu
                  </Text>
                )}

                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity onPress={handleForgotPin}>
                    <Text
                      style={{
                        color: "#478CCA",
                        fontSize: 14,
                        textAlign: "right",
                      }}
                    >
                      Wibagiwe PIN?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Button
                loading={isLoading}
                title={"INJIRA"}
                backgroundColor="#478CCA"
                textColor="white"
                onPress={() => logIn()}
              />
              <View style={{ marginTop: 20 }} />
              <Button
                title="UBUFASHA"
                backgroundColor="transparent"
                textColor="#3D576F"
                underlineText={true}
                onPress={() => router.push("/help")}
              />
              <View style={{ marginTop: 64 }}></View>
              <Button
                title="Subira Inyuma"
                backgroundColor="transparent"
                textColor="#3D576F"
                underlineText={true}
                onPress={() => router.replace("/")}
              />
              <StatusBar style="dark" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ContentBackground>
  );
}
