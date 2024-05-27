import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../Button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { getData, storeData, url } from "../utilities";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function Verify() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOTP] = useState();

  const verifyOTP = async () => {
    if (isLoading || !otp) return;
    const phoneNumber = await getData("phone_number");

    setIsLoading(true);
    axios({
      method: "post",
      url: `${url}/api/v1/auth/verify-user/${phoneNumber}/code/${otp}`,
      params: {
        field: "phone",
      },
    })
      .then(function (response) {
        storeData("access_token", response.data.access_token).then(() =>
          router.push("/home")
        );
      })
      .catch(function (error) { })
      .finally(() => setIsLoading(false));
  };

  const handleResendCode = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const phoneNumber = await getData("phone_number");
      await axios.post(
        `${url}/api/v1/auth/send-code/${phoneNumber}?field=phone`
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
    <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 40 }}>
      <Text style={{ color: "#478CCA", fontSize: 36, marginTop: 100 }}>
        Umubarebanga
      </Text>
      <Text
        style={{
          color: "#3D576F",
          fontSize: 20,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Uzuzamo umubarebanga wohererejwe mu butumwa bugufi.
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          width: "100%",
          borderRadius: 8,
          borderColor: "#478CCA3D",
          padding: 15,
          alignItems: "center",
          marginBottom: 20,
          marginTop: 60,
        }}
      >
        <Image
          source={require("../assets/key-line.png")}
          style={{ height: 22, width: 20 }}
        />
        <TextInput
          placeholder="OTP"
          placeholderTextColor="#3D576F8E"
          style={{ fontSize: 14, marginLeft: 10, flex: 1 }}
          keyboardType="numeric"
          onChangeText={(text) => setOTP(text)}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#478CCA",
          padding: 10,
          borderRadius: 8,
          width: "100%",
          paddingVertical: 15,
        }}
        onPress={verifyOTP}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>OHEREZA</Text>
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
          onPress={() => router.back()}
        />
      </View>

      <StatusBar style="dark" />
    </View>
  );
}
