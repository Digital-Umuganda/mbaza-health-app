import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { storeData, url } from "../utilities";
import Button from "../Button";
import ContentBackground from "./components/ContentBackground";

const VerifyCodeScreen = () => {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [errorBag, setErrorBag] = useState({});
  const [pin, setPin] = useState();

  const onSubmit = async () => {
    if (isLoading) return;
    if (!verificationCode || verificationCode.length < 6) {
      setErrorBag({ verificationCode: "Kode ntabwo ariyo" });
      return;
    }

    if (!pin || pin.length < 5) {
      setErrorBag({
        pin: "PIN igomba kuba igizwe n' imibare itari munsi y' itanu",
      });
      return;
    }

    setErrorBag({});

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${url}/api/v1/auth/reset-password/${params.phoneNumber}`,
        {
          verification_code: verificationCode,
          password: pin,
        }
      );
      Toast.show({
        type: "success",
        text1: "PIN Wibagiwe",
        text2: data.message,
        visibilityTime: 4000,
        autoHide: true,
      });
      storeData("access_token", data.access_token).then(() =>
        storeData("phone_number", params.phoneNumber).then(() =>
          router.replace("/home")
        )
      );
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

  const handleResendCode = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await axios.post(
        `${url}/api/v1/auth/send-code/${params.phoneNumber}?field=phone`
      );
      Toast.show({
        type: "success",
        text1: "PIN Wibagiwe",
        text2: "Kode yoherejwe kuri telefoni yawe.",
        visibilityTime: 4000,
        autoHide: true,
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
  }
  return (
    <ContentBackground>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            color: "#478CCA",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
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
          }}
        >
          Uzuzamo kode wakiriye ndetse na PIN shya.
        </Text>
        <TextInput
          placeholder="Kode"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 15,
            borderRadius: 8,
            width: "80%",
            backgroundColor: 'white'
          }}
          inputMode="numeric"
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text)}
        />
        {errorBag.verificationCode && (
          <Text
            style={{
              color: "red",
              textAlign: "left",
              marginTop: 2,
              width: "80%",
              marginBottom: 20,
            }}
          >
            {errorBag.verificationCode}
          </Text>
        )}

        <View style={{ marginBottom: 48, marginTop: 20, width: "80%" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#478CCA3D",
              paddingHorizontal: 15,
              alignItems: "center",
              backgroundColor: 'white'
            }}
          >
            <Image
              source={require("../assets/key-line.png")}
              style={{ height: 17, width: 18 }}
            />
            <TextInput
              placeholder="PIN Shya"
              placeholderTextColor="#3D576F8E"
              style={{ fontSize: 14, marginLeft: 10, flex: 1, paddingVertical: 15 }}
              keyboardType="numeric"
              onChangeText={setPin}
              secureTextEntry={false}
            />
          </View>

          {errorBag.pin && (
            <Text style={{ color: "red", textAlign: "left", marginTop: 2 }}>
              {errorBag.pin}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#478CCA",
            padding: 10,
            borderRadius: 8,
            width: "80%",
            paddingVertical: 15,
          }}
          onPress={onSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{ color: "white", textAlign: "center" }}>Emeza</Text>
          )}
        </TouchableOpacity>

        <View
          style={{ marginTop: 32 }}

        >
          <Button
            title="Ntabwo wabonye kode?"
            backgroundColor="transparent"
            textColor="#478CCA"
            underlineText={true}
            onPress={handleResendCode}
          />
        </View>

        <View style={{ marginTop: 64 }}>
          <Button
            title="Subira Inyuma"
            backgroundColor="transparent"
            textColor="#3D576F"
            underlineText={true}
            onPress={router.back}
          />
        </View>
      </View>
      <StatusBar style="light" />
      <Toast />
    </ContentBackground>
  );
};

export default VerifyCodeScreen;
