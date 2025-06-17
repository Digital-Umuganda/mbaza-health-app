import Button from "@/components/ui/Button";
import instance, { fetchProfile, getData } from "@/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import Combobox from "@/components/Combobox";
import ContentBackground from "@/components/ContentBackground";
import DependentComboboxes from "@/components/DependentComboboxes";
import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import { eligibleDistricts } from "@/constants/districts";
import { healthCenters } from "@/constants/health";

export const checkSession = async () => {
  const accessToken = await getData("access_token");
  if (accessToken === null) {
    router.replace("/login");
  }
};

export default function ProfileScreen() {
  const [isLoadingPin, setLoadingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [district, setDistrict] = useState<string>("");
  const [names, setNames] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [oldPin, setOldPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [errorBag, setErrorBag] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<Record<string, any>>();
  const [healthCenter, setHealthCenter] = useState<string>("");

  // New state for complete address
  const [fullAddress, setFullAddress] = useState({
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  useEffect(() => {
    checkSession();
    setTheProfileUp();
  }, []);

  const setTheProfileUp = async () => {
    setIsLoading(true);
    try {
      const profile = await fetchProfile();
      setProfile(profile);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (location: {
    district: string;
    sector: string;
    cell: string;
    village: string;
  }) => {
    setFullAddress(location);
  };

  const updateUserProfile = async () => {
    try {
      let errors = validateProfile();

      if (
        errors.district === true ||
        errors.names === true ||
        errors.sector === true ||
        errors.cell === true ||
        errors.village === true
      ) {
        setErrorBag(errors);
        return;
      }

      setErrorBag({});
      setIsLoading(true);

      console.log(fullAddress);

      await instance.put("/api/v1/user/update-profile", {
        name: names,
        address: district,
        other_info: {
          full_address: fullAddress,
          health_center: healthCenter,
        },
      });

      Toast.show({
        text1: "Umwirondoro wanjye",
        text2: "Guhindura umwirondoro byagenze neza",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Umwirondoro wanjye",
        text2: "Mwihangane mwongere mugerageze, hari ibitagenze neza.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserCredentials = async () => {
    try {
      const errors = validatePin();
      if (errors.oldPin === true || errors.newPin === true) {
        setErrorBag(errors);
        return;
      }

      setErrorBag({});
      setLoadingPin(true);
      await instance.put("/api/v1/user/change-password", {
        oldPassword: oldPin,
        newPassword: newPin,
      });

      Toast.show({
        text1: "Guhindura PIN",
        text2: "Guhindura PIN byagenze neza",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Guhindura PIN",
        text2: "Mwihangane mwongere mugerageze, hari ibitagenze neza.",
      });
    } finally {
      setLoadingPin(false);
      setNewPin("");
      setOldPin("");
    }
  };

  const validateProfile = () => {
    const data = {
      name: names,
      address: fullAddress,
    };

    let bag: Record<string, boolean> = {};

    if (!data?.address?.district || data.address.district.trim().length === 0) {
      bag.district = true;
    }

    // Optional: Make sector, cell, village required for complete profile
    if (data.address.district && !data?.address?.sector) {
      bag.sector = true;
    }

    if (data.address.sector && !data?.address?.cell) {
      bag.cell = true;
    }

    if (data.address.cell && !data?.address?.village) {
      bag.village = true;
    }

    if (!data.name || typeof data.name != "string" || data.name.length === 0) {
      bag.names = true;
    }

    return bag;
  };

  const validatePin = () => {
    const data = {
      oldPassword: oldPin,
      newPassword: newPin,
    };

    let bag: Record<string, boolean> = {};

    if (typeof data.oldPassword !== "string") {
      bag.oldPin = true;
    } else if (
      typeof data.newPassword !== "string" ||
      data.newPassword.length < 5 ||
      data.newPassword === data.oldPassword
    ) {
      bag.newPin = true;
    }

    return bag;
  };

  useEffect(() => {
    profile?.name != null && setNames(profile.name);
    profile?.phone_number != null && setPhoneNumber(profile.phone_number);
    setDistrict(profile?.address);
  }, [profile]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Emeza gusohoka",
      "Uzi neza ko ushaka gusohoka?",
      [
        {
          text: "Oya",
          style: "cancel",
        },
        {
          text: "Yego",
          onPress: () => {
            AsyncStorage.clear().then(() => {
              router.replace("/login");
            });
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  }, []);

  if (isLoading && !profile) {
    return <LoadingOverlayModal text="Tegeraza..." visible={isLoading} />;
  }

  return (
    <ContentBackground>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={{
            width: "100%",
            height: 118,
            backgroundColor: "#478CCA",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 20,
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ maxWidth: "67%" }}>
            <Text style={{ fontSize: 24, color: "#FFFFFF" }}>
              {profile?.name && profile.name}
            </Text>
          </View>
          <TouchableOpacity
            disabled={isLoading}
            style={{
              width: 115,
              height: 42,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "space-around",
            }}
            onPress={handleLogout}
          >
            <Image
              style={{ width: 12.36, height: 10.3 }}
              source={require("../../assets/log-out-outline.png")}
            />
            <Text style={{ fontSize: 12, color: "#FFFFFF", opacity: 1 }}>
              Gusohoka
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginTop: 30, paddingHorizontal: 25 }}>
            <Text style={{ color: "#3D576F", fontWeight: "600", fontSize: 14 }}>
              IMYIRONDORO YANJYE
            </Text>

            {/* Names Input */}
            <View style={{ marginTop: 20, width: "100%", marginBottom: 10 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#478CCA3D",
                  paddingHorizontal: 15,
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  source={require("../../assets/person.png")}
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
                  value={names}
                />
              </View>
              {errorBag.names === true && (
                <Text style={{ color: "red" }}>Uzuzamo amazina yawe.</Text>
              )}
            </View>

            {/* Phone Number Input (Read-only) */}
            <View style={{ marginBottom: 10, width: "100%" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#478CCA3D",
                  paddingHorizontal: 15,
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  source={require("../../assets/phone.png")}
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
                  editable={false}
                  value={`+${phoneNumber}`}
                />
              </View>
              {errorBag.phoneNumber === true && (
                <Text style={{ color: "red", textAlign: "center" }}>
                  Tangiza 07 kuri nimero. Igomba kuba igizwe n&apos; imibare
                  icumi.
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
                defaultValue={{ title: profile?.meta?.health_center || "" }}
              />
              {errorBag.setHealthCenter === true && (
                <Text style={{ color: "red" }}>Hitamo ivuriro ukoreramo.</Text>
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
                placeholder="Hitamo aho mutuye"
                defaultValue={{ title: district }}
              />
              {errorBag.district === true && (
                <Text style={{ color: "red" }}>Hitamo akarere ukoreramo.</Text>
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
              // Pass initial values if available
              initialValues={profile?.meta?.full_address}
            />

            <Button
              loading={isLoading}
              onPress={updateUserProfile}
              title="EMEZA"
              backgroundColor="#478CCA"
              textColor="white"
            />

            <View style={{ marginBottom: 32 }}></View>

            <Text style={{ color: "#3D576F", fontWeight: "600", fontSize: 14 }}>
              GUHINDURA PIN YANJYE
            </Text>

            {/* Old PIN Input */}
            <View style={{ marginTop: 20, marginBottom: 10, width: "100%" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#478CCA3D",
                  paddingHorizontal: 15,
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  source={require("../../assets/key-line.png")}
                  style={{ height: 17, width: 18 }}
                />
                <TextInput
                  placeholder="PIN nari nsanganywe"
                  placeholderTextColor="#3D576F8E"
                  style={{
                    fontSize: 14,
                    marginLeft: 10,
                    paddingVertical: 15,
                    flex: 1,
                  }}
                  keyboardType="numeric"
                  value={oldPin || ""}
                  onChangeText={(text) => setOldPin(text)}
                  secureTextEntry={true}
                />
              </View>
              {errorBag.oldPin === true && (
                <Text style={{ color: "red", textAlign: "left", marginTop: 2 }}>
                  PIN wari usanganywe igomba kuba igizwe n&apos; imibare itari
                  munsi y&apos; itanu.
                </Text>
              )}
            </View>

            {/* New PIN Input */}
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
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  source={require("../../assets/key-line.png")}
                  style={{ height: 17, width: 18 }}
                />
                <TextInput
                  placeholder="PIN nshya"
                  placeholderTextColor="#3D576F8E"
                  style={{
                    fontSize: 14,
                    marginLeft: 10,
                    paddingVertical: 15,
                    flex: 1,
                  }}
                  keyboardType="numeric"
                  value={newPin || ""}
                  onChangeText={(text) => setNewPin(text)}
                  secureTextEntry={true}
                />
              </View>
              {errorBag.newPin === true && (
                <Text style={{ color: "red", textAlign: "left", marginTop: 2 }}>
                  PIN nshya igomba kuba igizwe n&apos; imibare itari munsi
                  y&apos; itanu kandi idasa na PIN wakoresheje.
                </Text>
              )}
            </View>

            <Button
              loading={!!newPin && !!oldPin && isLoadingPin}
              onPress={updateUserCredentials}
              title="EMEZA"
              backgroundColor="#478CCA"
              textColor="white"
            />
            <View style={{ marginBottom: 20 }}></View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
