import {
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../Button";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Path, Svg } from "react-native-svg";

export default function CustomChat() {
  const [sex, setSex] = useState();
  const [age, setAge] = useState();
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [disease, setDisease] = useState();
  const [question, setQuestion] = useState();
  const [errorBag, setErrorBag] = useState({});
  const params = useLocalSearchParams();

  const isValid = () => {
    const errors = {};
    if (!sex?.length) {
      errors.sex = "Hitamo igitsina";
    }
    if (!age?.length) {
      errors.age = "Andika imyaka y'umurwayi";
    }
    if (!weight?.length) {
      errors.weight = "Andika ibiro by'umurwayi";
    } else if (isNaN(weight)) {
      errors.weight = "Ibiro by'umurwayi birimo amakosa";
    }
    if (!height?.length) {
      errors.height = "Andika uburebure bw'umurwayi";
    } else if (isNaN(height)) {
      errors.height = "Uburebure bw'umurwayi birimo amakosa";
    }
    if (!disease?.length) {
      errors.disease = "Hitamo indwara y'umurwayi";
    }

    if (!question?.length) {
      errors.question = "Andika ikibazo cyawe hano";
    }

    setErrorBag(errors);
    return Object.keys(errors).length === 0
  }

  const askQuestion = async () => {
    if (!isValid()) {
      return;
    }

    let message = `Hakurikijwe ibi bikurikira:\n\n1. Ubwoko bw'indwara: ${disease}\n`;

    if (height != null || weight != null || age != null || sex != null) {
      message += `2. Amakuru y'umurwayi: \n`;

      if (height != null) {
        message += `\t- Uburebure: ${height} cm\n`;
      }

      if (weight != null) {
        message += `\t- ibiro: ${weight} kg\n`;
      }

      if (age != null) {
        message += `\t- Imyaka: ${age}\n`;
      }

      if (sex != null) {
        message += `\t- Igitsina: ${sex}\n`;
      }
    }

    message += `\nUkurikije amakuru yatanzwe, nyabuneka subiza ikibazo cyatanzwe: ${question}`;

    router.replace({
      pathname: "/chat",
      params: { chatId: params.chatId, message },
    });
  };


  return (
    <KeyboardAwareScrollView>
      <View style={{ flex: 1, paddingHorizontal: 30 }}>
        <Text
          style={{
            color: "#3D576F",
            fontSize: 24,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Ibibazo byafasha umurwayi
        </Text>
        <Text
          style={{
            color: "#3CAF4A",
            fontWeight: "700",
            fontSize: 14,
            marginTop: 30,
            marginBottom: 10,
          }}
        >
          Amakuru y'urwaye
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            display: "flex",
            width: "100%",
            gap: 5,
          }}
        >
          <View style={{ width: "50%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingVertical: 4,
                paddingHorizontal: 4,
                alignItems: "center",
              }}
            >
              <SelectDropdown
                data={["Gabo", "Gore"]}
                onSelect={(selectedItem, index) => {
                  setSex(selectedItem);
                }}
                buttonStyle={{ flex: 1 }}
                defaultButtonText="Igitsina"
                buttonTextStyle={{ color: "#3D576F", textAlign: "left" }}
              />
            </View>
            {errorBag.sex && (
              <Text style={{ color: "red" }}>{errorBag.sex}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingHorizontal: 4,
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Imyaka"
                placeholderTextColor="#3D576F8E"
                style={{
                  fontSize: 14,
                  marginLeft: 10,
                  flex: 1,
                  paddingVertical: 15,
                }}
                onChangeText={(text) => setAge(text)}
                keyboardType="numeric"
              />
            </View>
            {errorBag.age && (
              <Text style={{ color: "red" }}>{errorBag.age}</Text>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            display: "flex",
            width: "100%",
            gap: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingHorizontal: 4,
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Ibiro"
                placeholderTextColor="#3D576F8E"
                style={{
                  fontSize: 14,
                  marginLeft: 10,
                  paddingVertical: 15,
                  flex: 1,
                }}
                keyboardType="numeric"
                onChangeText={(text) => setWeight(text)}
              />
            </View>
            {errorBag.weight && (
              <Text style={{ color: "red" }}>{errorBag.weight}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#478CCA3D",
                paddingHorizontal: 4,
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Uburebure(cm)"
                placeholderTextColor="#3D576F8E"
                style={{
                  fontSize: 14,
                  marginLeft: 10,
                  flex: 1,
                  paddingVertical: 15,
                }}
                keyboardType="numeric"
                onChangeText={(text) => setHeight(text)}
              />
            </View>
            {errorBag.height && (
              <Text style={{ color: "red" }}>{errorBag.height}</Text>
            )}
          </View>
        </View>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#478CCA3D",
              paddingVertical: 4,
              paddingHorizontal: 4,
              alignItems: "center",
            }}
          >
            <SelectDropdown
              data={[
                "Imirire mibi no kugwingira",
                "Malariya",
                "Igituntu",
                "Umusonga",
              ]}
              onSelect={(selectedItem, index) => {
                setDisease(selectedItem);
              }}
              buttonStyle={{ width: "100%" }}
              defaultButtonText="Hitamo indwara"
              buttonTextStyle={{ color: "#3D576F", textAlign: "left" }}
            />
          </View>
          {errorBag.disease && (
            <Text style={{ color: "red" }}>{errorBag.disease}</Text>
          )}
        </View>
        <View style={{ marginBottom: 20, width: "100%" }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#478CCA3D",
              paddingHorizontal: 4,
            }}
          >
            <TextInput
              placeholder="Andika ikibazo cyawe hano"
              placeholderTextColor="#3D576F8E"
              style={{ fontSize: 14, marginLeft: 10, flex: 1 }}
              onChangeText={(text) => setQuestion(text)}
              multiline={true}
              numberOfLines={7}
              value={question}
            />
          </View>
          {errorBag.question && (
            <Text style={{ color: "red" }}>{errorBag.question}</Text>
          )}
        </View>
        <Button
          onPress={askQuestion}
          title="OHEREZA"
          backgroundColor="#478CCA"
          textColor="white"
        >
          <Svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            style={{
              width: 23,
              height: 23,
              marginRight: 3,
              alignSelf: "center",
            }}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </Svg>
        </Button>
        <View style={{ marginTop: 40 }}></View>
        <StatusBar style="light" />
      </View>
    </KeyboardAwareScrollView>
  );
}
