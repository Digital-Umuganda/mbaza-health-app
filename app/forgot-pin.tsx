import ContentBackground from "@/components/ContentBackground";
import Button from "@/components/ui/Button";
import instance from "@/utilities";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ForgotPinScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [errorBag, setErrorBag] = useState<Record<string, string>>({});

  const onSubmit = async () => {
    if (isLoading) return;
    if (!phoneNumber) {
      setErrorBag({ phoneNumber: "Nimero ya telefoni irakenewe" });
      return;
    }
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith("07")) {
      setErrorBag({
        phoneNumber:
          "Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.",
      });
      return;
    }
    setErrorBag({});

    try {
      setIsLoading(true);
      const { data } = await instance.post(
        `/api/v1/auth/send-code/25${phoneNumber}?field=phone`
      );
      Toast.show({
        type: "success",
        text1: "PIN Wibagiwe",
        text2: data.message,
        visibilityTime: 4000,
        autoHide: true,
      });
      router.replace(`/verify-code?type=phone&phoneNumber=25${phoneNumber}`);
    } catch (error) {
      const err = error as any;
      const message = err?.response?.data?.message || err?.message;
      Toast.show({
        type: "error",
        text1: "PIN Wibagiwe",
        text2: message.includes("User not found")
          ? "Konti ntabwo yabonetse, Iyandikishe."
          : message,
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ContentBackground>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#478CCA",
            fontSize: 36,
          }}
        >
          Wibagiwe PIN
        </Text>
        <Text
          style={{
            color: "#3D576F",
            fontSize: 20,
            textAlign: "center",
            width: "80%",
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          Uzuzamo nimero yawe ya telefoni wakoresheje wiyandikisha.
        </Text>
        <TextInput
          placeholder="Nimero ya Telefoni (078----)"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            paddingVertical: 15,
            borderRadius: 8,
            width: "80%",
            backgroundColor: "white",
          }}
          inputMode="tel"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {errorBag.phoneNumber && (
          <Text
            style={{
              color: "red",
              textAlign: "left",
              marginTop: 2,
              width: "80%",
              marginBottom: 20,
            }}
          >
            {errorBag.phoneNumber}
          </Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "#478CCA",
            padding: 10,
            borderRadius: 8,
            width: "80%",
            paddingVertical: 18,
            marginTop: 32,
          }}
          onPress={onSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
                textTransform: "uppercase",
              }}
            >
              Ohereza
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ marginTop: 64 }}>
          <Button
            title="Subira Inyuma"
            backgroundColor="transparent"
            textColor="#3D576F"
            underlineText={true}
            onPress={() => router.replace("/login")}
          />
        </View>
      </View>
      <StatusBar style="dark" />
    </ContentBackground>
  );
};

export default ForgotPinScreen;
