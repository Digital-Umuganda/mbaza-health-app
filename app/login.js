import {
  ActivityIndicator,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../Button";
import { router } from "expo-router";
import { useState } from "react";
import { storeData, url } from "../utilities";
import axios from "axios";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [pin, setPin] = useState();
  const [errorBag, setErrorBag] = useState({});

  const logIn = () => {
    if (isLoading) {
      return;
    }
    let bag = validate();

    if (bag.phoneNumber == true || bag.pin == true) {
      setErrorBag(bag);
      return;
    }

    setErrorBag({});

    const data = {
      username: phoneNumber,
      password: pin,
    };

    if (data.username.startsWith("0")) {
      data.username = `25${data.username}`;
    } else if (data.username.startsWith("7")) {
      data.username = `250${data.username}`;
    }

    setIsLoading(true);
    console.log({ data });
    axios
      .post(`${url}/api/v1/auth/login`, data)
      .then(function (response) {
        console.log({ response });
        storeData("access_token", response.data.access_token).then(() =>
          storeData("phone_number", phoneNumber).then(() =>
            router.replace("/home")
          )
        );
      })
      .catch(function (error) {
        const message = error?.response?.data?.message || error?.message;
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: message,
          position: "bottom",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validate = () => {
    const data = {
      username: phoneNumber,
      password: pin,
    };

    let bag = {};

    if (
      !data?.username ||
      !data.username.startsWith("07") ||
      data.username.length !== 10
    ) {
      bag.phoneNumber = true;
    }

    if (
      data?.password == null ||
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
    <KeyboardAwareScrollView>
      <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 40 }}>
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
              padding: 15,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/phone.png")}
              style={{ height: 22, width: 14 }}
            />
            <TextInput
              placeholder="Nimero ya Telefoni (078----)"
              placeholderTextColor="#3D576F8E"
              style={{ fontSize: 14, marginLeft: 10, flex: 1 }}
              keyboardType="numeric"
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          {errorBag.phoneNumber == true && (
            <Text style={{ color: "red", textAlign: "left", marginTop: 2 }}>
              Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.
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
              padding: 15,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/key-line.png")}
              style={{ height: 17, width: 18 }}
            />
            <TextInput
              placeholder="PIN (- - - - -)"
              placeholderTextColor="#3D576F8E"
              style={{ fontSize: 14, marginLeft: 10, flex: 1 }}
              keyboardType="numeric"
              onChangeText={(text) => setPin(text)}
              secureTextEntry={true}
            />
          </View>

          {errorBag.pin == true && (
            <Text style={{ color: "red", textAlign: "left", marginTop: 2 }}>
              PIN igomba kuba igizwe n' imibare itari munsi y' itanu
            </Text>
          )}

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={handleForgotPin}>
              <Text
                style={{ color: "#478CCA", fontSize: 14, textAlign: "right" }}
              >
                Wibagiwe PIN?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title={
            isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              "INJIRA"
            )
          }
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
          onPress={() => router.back()}
        />
        <StatusBar style="light" />
        <Toast />
      </View>
    </KeyboardAwareScrollView>
  );
}
