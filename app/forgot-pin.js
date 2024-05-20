import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { url } from "../utilities";
import Button from "../Button";

const ForgotPinScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [errorBag, setErrorBag] = useState({});

  const onSubmit = async () => {
    if (isLoading) return;
    if (!phoneNumber) {
      setErrorBag({ phoneNumber: "Nimero ya telefoni irakenewe" });
      return;
    }
    if (phoneNumber.length < 9 || !phoneNumber.startsWith("07")) {
      setErrorBag({
        phoneNumber:
          "Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.",
      });
      return;
    }
    setErrorBag({});

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${url}/api/v1/auth/send-code/25${phoneNumber}?field=phone`
      );
      Toast.show({
        type: "success",
        text1: "PIN Wibagiwe",
        text2: data.message,
        visibilityTime: 4000,
        autoHide: true,
      });
      router.replace({
        pathname: "/verify-code",
        params: { phoneNumber: `25${phoneNumber}`, type: "phone" },
      });
    } catch (error) {
      const message = error?.response?.data?.message || error?.message;
      Toast.show({
        type: "error",
        text1: "PIN Wibagiwe",
        text2: message,
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
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
            onPress={() => router.replace('/login')}
          />
        </View>
      </View>
      <StatusBar style="light" />
      <Toast />
    </>
  );
};

export default ForgotPinScreen;
