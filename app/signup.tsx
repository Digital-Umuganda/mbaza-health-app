import Combobox from "@/components/Combobox";
import ContentBackground from "@/components/ContentBackground";
import DependentComboboxes from "@/components/DependentComboboxes";
import Button from "@/components/ui/Button";
import { eligibleDistricts } from "@/constants/districts";
import { healthCenters } from "@/constants/health";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [district, setDistrict] = useState<string>("");
  const [names, setNames] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [errorBag, setErrorBag] = useState<Record<string, boolean>>({});
  const [healthCenter, setHealthCenter] = useState<string>("");

  // New state for complete address
  const [fullAddress, setFullAddress] = useState({
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  const handleLocationChange = (location: {
    district: string;
    sector: string;
    cell: string;
    village: string;
  }) => {
    setFullAddress(location);
  };

  const signUp = () => {
    if (isLoading) {
      return;
    }
    let bag = validate();

    if (
      bag.phoneNumber === true ||
      bag.pin === true ||
      bag.district === true ||
      bag.sector === true ||
      bag.cell === true ||
      bag.village === true ||
      bag.names === true
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
      other_info: {
        full_address: fullAddress,
        health_center: healthCenter,
      },
    };

    if (data.phone_number.startsWith("0")) {
      data.phone_number = `25${data.phone_number}`;
    } else if (data.phone_number.startsWith("7")) {
      data.phone_number = `250${data.phone_number}`;
    }

    setIsLoading(true);
    instance
      .post(`/api/v1/auth/signup`, data)
      .then(function (response) {
        storeData("phone_number", data.phone_number).then(() =>
          router.push("/verify")
        );
      })
      .catch(function (error) {
        const message = error?.response?.data?.message || error?.message;
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2: message,
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
      address: fullAddress,
      password: pin,
      healthCenter: healthCenter,
    };

    let bag: Record<string, boolean> = {};

    if (
      !data?.phone_number ||
      !data.phone_number.startsWith("07") ||
      data.phone_number.length !== 10
    ) {
      bag.phoneNumber = true;
    }

    if (
      data?.password === null ||
      typeof data.password != "string" ||
      data.password.length !== 5
    ) {
      bag.pin = true;
    }

    if (!data?.address?.district || data.address.district.trim().length === 0) {
      bag.district = true;
    }

    if (!data?.address?.sector || data.address.sector.trim().length === 0) {
      bag.sector = true;
    }

    if (!data?.address?.cell || data.address.cell.trim().length === 0) {
      bag.cell = true;
    }

    if (!data?.address?.village || data.address.village.trim().length === 0) {
      bag.village = true;
    }

    if (!data?.healthCenter || data.healthCenter.trim().length === 0) {
      bag.setHealthCenter = true;
    }

    if (
      data?.name === null ||
      typeof data.name != "string" ||
      data.name?.trim()?.length === 0
    ) {
      bag.names = true;
    }

    return bag;
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

              {/* Names Input */}
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
                    source={require("../assets/person.png")}
                    style={{ height: 17, width: 17 }}
                  />
                  <TextInput
                    placeholder="Amazina yanyu"
                    placeholderTextColor="#3D576F8E"
                    style={{
                      fontSize: 14,
                      marginLeft: 10,
                      flex: 1,
                      paddingVertical: 15,
                    }}
                    onChangeText={(text) => setNames(text)}
                  />
                </View>
                {errorBag.names === true && (
                  <Text style={{ color: "red" }}>Uzuzamo amazina yawe.</Text>
                )}
              </View>

              {/* Phone Number Input */}
              <View style={{ marginBottom: 20, width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "#478CCA3D",
                    alignItems: "center",
                    backgroundColor: "white",
                    paddingHorizontal: 15,
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
                  <Text style={{ color: "red" }}>
                    Tangiza 07 kuri nimero. Igomba kuba igizwe n&apos; imibare
                    icumi.
                  </Text>
                )}
              </View>

              {/* PIN Input */}
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
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    source={require("../assets/key-line.png")}
                    style={{ height: 17, width: 18 }}
                  />
                  <TextInput
                    placeholder="PIN uzajya winjiriraho"
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
                  <Text style={{ color: "red" }}>
                    PIN igomba kuba igizwe n&apos; imibare itari munsi y&apos;
                    itanu.
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 20, width: "100%" }}>
                <Combobox
                  options={healthCenters.map((center) => ({
                    title: center,
                  }))}
                  onSelect={(item) => {
                    setHealthCenter(item.title);
                  }}
                  placeholder="Ivuriro ukoreramo"
                />
                {errorBag.setHealthCenter === true && (
                  <Text style={{ color: "red" }}>
                    Hitamo ivuriro ukoreramo.
                  </Text>
                )}
              </View>

              {/* District Selection */}
              <View style={{ marginBottom: 20, width: "100%" }}>
                <Text style={{ marginBottom: 8, color: "#3D576F" }}>
                  Hitamo aho mutuye
                </Text>
                <Combobox
                  options={eligibleDistricts.map((district) => ({
                    title: district,
                  }))}
                  onSelect={(item) => {
                    setDistrict(item.title);
                  }}
                  placeholder="Akarere"
                />
                {errorBag.district === true && (
                  <Text style={{ color: "red" }}>
                    Hitamo akarere ukoreramo.
                  </Text>
                )}
              </View>

              {/* Dependent Location Selectors */}
              <DependentComboboxes
                district={district}
                onLocationChange={handleLocationChange}
                errorBag={{
                  sector: errorBag.sector,
                  cell: errorBag.cell,
                  village: errorBag.village,
                }}
              />

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
              <StatusBar style="dark" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ContentBackground>
  );
}
