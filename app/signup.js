import { Image, StatusBar, Text, TextInput, View } from "react-native";
import Button from "../Button";
import { router } from "expo-router";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { storeData, url } from "../utilities";
import Toast from "react-native-toast-message";
import ContentBackground from "./components/ContentBackground";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [district, setDistrict] = useState();
  const [names, setNames] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [pin, setPin] = useState();
  const [errorBag, setErrorBag] = useState({});

  const signUp = () => {
    if (isLoading) {
      return;
    }
    let bag = validate();

    if (
      bag.phoneNumber == true ||
      bag.pin == true ||
      bag.district == true ||
      bag.names == true
    ) {
      setErrorBag(bag);
      return;
    }

    setErrorBag({});

    const data = {
      name: names,
      phone_number: phoneNumber,
      address: district,
      password: pin,
    };

    if (data.phone_number.startsWith("0")) {
      data.phone_number = `25${data.phone_number}`;
    } else if (data.phone_number.startsWith("7")) {
      data.phone_number = `250${data.phone_number}`;
    }

    setIsLoading(true);
    axios
      .post(`${url}/api/v1/auth/signup`, data)
      .then(function (response) {
        storeData("phone_number", data.phone_number).then(() => router.push("/verify"));
      })
      .catch(function (error) {
        const message = error?.response?.data?.message || error?.message;
        Toast.show({
          type: "error",
          text1: "Signup Failed",
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
      name: names,
      phone_number: phoneNumber,
      address: district,
      password: pin,
    };

    let bag = {};

    if (
      !data?.phone_number ||
      !data.phone_number.startsWith("07") ||
      data.phone_number.length !== 10
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

    if (data?.address == null || typeof data.address != "string") {
      bag.district = true;
    }

    if (
      data?.name == null ||
      typeof data.name != "string" ||
      data.name?.trim()?.length == 0
    ) {
      bag.names = true;
    }

    return bag;
  };

  return (
    <ContentBackground>
      <KeyboardAwareScrollView>
        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 40 }}>
          <Text style={{ color: "#478CCA", fontSize: 36, marginTop: 100 }}>
            Kwiyandikisha
          </Text>
          <Text
            style={{
              color: "#3D576F",
              fontSize: 20,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Duhe amakuru akurikira maze ubashe kwiyandikisha.
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
                backgroundColor: 'white'
              }}
            >
              <Image
                source={require("../assets/person.png")}
                style={{ height: 17, width: 17 }}
              />
              <TextInput
                placeholder="Amazina yanyu"
                placeholderTextColor="#3D576F8E"
                style={{ fontSize: 14, marginLeft: 10, flex: 1, paddingVertical: 15 }}
                onChangeText={(text) => setNames(text)}
              />
            </View>
            {errorBag.names == true && (
              <Text style={{ color: "red" }}>Uzuzamo amazina yawe.</Text>
            )}
          </View>
          <View style={{ marginBottom: 20, width: "100%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingVertical: 15,
                alignItems: "center",
                backgroundColor: 'white'
              }}
            >
              <Image
                source={require("../assets/phone.png")}
                style={{ height: 22, width: 14 }}
              />
              <TextInput
                placeholder="Nimero ya Telefoni (078----)"
                placeholderTextColor="#3D576F8E"
                style={{ fontSize: 14, marginLeft: 10, flex: 1, paddingVertical: 15 }}
                keyboardType="numeric"
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>
            {errorBag.phoneNumber == true && (
              <Text style={{ color: "red" }}>
                Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.
              </Text>
            )}
          </View>
          <View style={{ marginBottom: 20, width: "100%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingVertical: 7,
                paddingHorizontal: 15,
                backgroundColor: 'white',
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/location.png")}
                style={{ height: 20, width: 16 }}
              />
              <SelectDropdown
                data={["MUSANZE", "GICUMBI", "NYANZA"]}
                onSelect={(selectedItem, index) => {
                  setDistrict(selectedItem);
                }}
                buttonStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: 'white'
                }}
                defaultButtonText="Hitamo aho mutuye"
                buttonTextStyle={{ color: "#3D576F", textAlign: "left" }}
              />
            </View>
            {errorBag.district == true && (
              <Text style={{ color: "red" }}>Hitamo akarere ukoreramo.</Text>
            )}
          </View>
          <View style={{ marginBottom: 20, width: "100%" }}>
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
                placeholder="PIN uzajya winjiriraho"
                placeholderTextColor="#3D576F8E"
                style={{ fontSize: 14, marginLeft: 10, flex: 1, paddingVertical: 15 }}
                keyboardType="numeric"
                onChangeText={(text) => setPin(text)}
                secureTextEntry={true}
              />
            </View>
            {errorBag.pin == true && (
              <Text style={{ color: "red" }}>
                PIN igomba kuba igizwe n' imibare itari munsi y' itanu
              </Text>
            )}
          </View>
          <Button
            onPress={signUp}
            title="EMEZA"
            backgroundColor="#478CCA"
            textColor="white"
            loading={isLoading}
          />
          <View style={{ marginTop: 40 }}></View>
          <Button
            title="Subira Inyuma"
            backgroundColor="transparent"
            textColor="#3D576F"
            underlineText={true}
            onPress={() => router.replace("/")}
          />
          <StatusBar style="light" />
          <Toast />
        </View>
      </KeyboardAwareScrollView>
    </ContentBackground>
  );
}
