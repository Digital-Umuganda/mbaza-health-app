import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import BottomSheet from "@gorhom/bottom-sheet";
import ChatResponse from "../chat-response";
import ChatRequest from "../chat-request";
import { fetchProfile, getData, getUserProfile, url } from "../utilities";
import axios from "axios";
import { fetch } from "../utilities/react-native-fetch-api/fetch";
import Toast from "react-native-toast-message";
import RecordAudio from "./components/RecordAudio";

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const params = useLocalSearchParams();
  const [chatId, setChatId] = useState(null);
  const [reloadResponse, setReloadResponse] = useState(false);
  const [profile, setProfile] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (params.hasFeedback === "false" && messages.length > 0) {
        e.preventDefault();
        setModalVisible(true);

        setAction(e.data.action);
      }
    });

    return () => {
      navigation.removeListener("beforeRemove");
    };
  }, [navigation, params, messages]);

  useEffect(() => {
    setTheChatUp();
  }, []);

  useEffect(() => {
    if (params?.chatId) {
      setChatId(params.chatId);
    }
  }, [params]);

  const setTheChatUp = async () => {
    let profile = JSON.parse(await getUserProfile());

    if (profile == null) {
      profile = await fetchProfile();
    }

    setProfile(profile);

    await fetchMessagesFromChat();
    if (params.message) {
      setLastMessage(params.message);
      submit(params.message);
    }
  };

  const sendFeedback = async (is_satisfied) => {
    if (!chatId || isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const accessToken = await getData("access_token");
      await axios.post(
        `${url}/api/v1/feedbacks/${chatId}/feedback`,
        {
          is_satisfied,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (action) {
        navigation.dispatch(action);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Toast.show({
        type: "error",
        text1: "Feedback Failed",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const fetchMessagesFromChat = async () => {
    if (!params.chatId) {
      return;
    }
    const accessToken = await getData("access_token");
    var config = {
      method: "get",
      url: `${url}/api/v1/chats/${params.chatId}/messages`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      transformResponse: (data) => {
        let dataArray = JSON.parse(data);

        if (Array.isArray(dataArray)) {
          dataArray = dataArray.reverse();
        }

        const messagesCopy = Array.from(messages);
        Array.isArray(dataArray) &&
          dataArray.forEach((chat) => {
            messagesCopy.push({
              message: {
                answer: chat.kinyarwanda_question,
                requested_at: chat.requested_at,
              },
              type: "request",
            });
            messagesCopy.push({
              message: {
                answer: chat.kinyarwanda_response,
                created_at: chat.created_at.split("T").join(" "),
              },
              type: "response",
            });
          });
        setMessages(messagesCopy);
      },
    };

    await axios(config)
      .then(function (response) {
        // setChats(response.data);
      })
      .catch(function (error) {});
  };

  useEffect(() => {
    if (
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages[messages.length - 1].type === "request"
    ) {
      chat();
    }
  }, [messages]);

  const submit = (message = null) => {
    const messagesCopy = Array.from(messages);
    messagesCopy.push({
      message: { answer: message || lastMessage, requested_at: new Date() },
      type: "request",
    });

    setLastMessage("");

    Array.isArray(messages) && setMessages(messagesCopy);
  };

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  // callbacks
  const handleSheetChanges = () =>
    router.replace({
      pathname: "/custom-chat",
      params: { chatId },
    });

  const chat = async () => {
    let data = {
      kinyarwanda_question: messages[messages.length - 1].message.answer,
      requested_at: messages[messages.length - 1].message.requested_at,
    };

    if (chatId != null) {
      data.chat_id = chatId || params.chatId;
    }

    data = JSON.stringify(data);

    const accessToken = await getData("access_token");

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: data,
      reactNative: { textStreaming: true },
    };

    setTranslating(true);
    try {
      const response = await fetch(`${url}/api/v1/chatbot`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stream = response.body;

      const reader = stream.getReader();

      let responseText = { answer: "" };

      const readChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.info("stream done");
          // setChatId(responseText.chat_id);
          // setLastAnswer(responseText.answer)
          // setLastResponse(responseText);
          reader.releaseLock();
          return;
        }
        // You can do something with 'value' here.
        // For example, if it's text data, you can convert it to a string.
        let text = new TextDecoder().decode(value);
        try {
          if (countOccurrences(text, "{") == 1) {
            text = JSON.parse(text);
            responseText.answer += text.answer;
            responseText.created_at = text.created_at;
            setReloadResponse(true);
            setChatId(text.chat_id);
            setLastAnswer(responseText.answer);
            setReloadResponse(true);
          } else {
            const splitText = text.split("}");
            let runs = 0;
            splitText.forEach((splitT) => {
              splitT = splitT.trim();
              if (splitT.startsWith("{")) {
                text = JSON.parse(splitT + "}");
                responseText.answer += text.answer;
                responseText.created_at = text.created_at;
                runs++;
              }
            });
            setReloadResponse(true);
            setChatId(text.chat_id);
            setLastAnswer(responseText.answer);
            setReloadResponse(true);
          }
        } catch (error) {
          if (error.message == "JSON Parse error: Unexpected character: {") {
            console.warn({ error: error.message, text });
          }
        }
        setLastResponse(responseText);

        if (!chatId && responseText.chat_id) {
          setChatId(responseText.chat_id);
        }
        await readChunk();
      };

      await readChunk();
    } catch (error) {
      console.warn({ message: error.message });
    } finally {
      setTranslating(false);
    }
  };

  function countOccurrences(str, char) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === char) {
        count++;
      }
    }
    return count;
  }

  useEffect(() => {
    const messagesCopy = Array.from(messages);

    if (
      messagesCopy.length > 0 &&
      messagesCopy[messagesCopy.length - 1].type == "response"
    ) {
      messagesCopy.pop();
    }

    if (lastResponse) {
      messagesCopy.push({ message: lastResponse, type: "response" });
      setMessages(messagesCopy);
    }
  }, [lastResponse?.answer, lastAnswer, reloadResponse]);

  const renderMessage = (message, index) => {
    if (message.type == "request") {
      return (
        <ChatRequest key={index} content={message.message} profile={profile} />
      );
    } else if (message.type == "response") {
      return <ChatResponse key={index} content={message.message} />;
    }
  };

  const renderMessages = () => {
    return (
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.map((message, index) => renderMessage(message, index))
    );
  };

  const scrollViewRef = useRef();

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              maxWidth: "70%",
            }}
          >
            <Text
              style={{ fontSize: 24, textAlign: "center", color: "#3D576F" }}
            >
              Ese mwanyuzwe nibisubizo mwahawe?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 48,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => sendFeedback(true)}
                style={{
                  backgroundColor: "rgba(60, 175, 74, 0.1)",
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                  borderRadius: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Image
                  style={{ width: 15, height: 15 }}
                  source={require("../assets/thumbs-up.png")}
                />
                <Text
                  style={{
                    color: "rgba(60, 175, 74, 1)",
                    fontSize: 16,
                  }}
                >
                  Yego
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendFeedback(false)}
                style={{
                  backgroundColor: "rgba(246, 66, 21, 0.1)",
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                  borderRadius: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Image
                  style={{ width: 15, height: 15 }}
                  source={require("../assets/thumbs-down.png")}
                />
                <Text
                  style={{
                    color: "rgba(246, 66, 21, 1)",
                    fontSize: 16,
                  }}
                >
                  Oya
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        style={{ paddingHorizontal: 20, marginBottom: 80 }}
      >
        <ChatResponse content={{ answer: "Muraho! Mbafashe nte?" }} />
        {renderMessages()}
      </ScrollView>
      <View
        onPress={() => router.push("/help")}
        style={{
          position: "absolute",
          bottom: 0,
          width: "90%",
          height: 64,
          borderRadius: 8,
          justifyContent: "center",
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            alignItems: "center",
            paddingLeft: 20,
            marginHorizontal: 4,
            borderRadius: 10,
            borderColor: "#478CCA3D",
            backgroundColor: "#FFFFFF",
            paddingVertical: 1,
          }}
        >
          <TouchableOpacity onPress={() => handleSheetChanges(2)}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../assets/levels.png")}
            />
          </TouchableOpacity>
          <RecordAudio />
          <TextInput
            style={{ flex: 1, fontSize: 16, height: 64, paddingLeft: 10 }}
            onChangeText={(text) => {
              setLastMessage(text);
            }}
            value={lastMessage}
            placeholder="Enter message"
            placeholderTextColor="white"
            multiline
          />
          <TouchableOpacity
            onPress={() => submit()}
            style={{
              backgroundColor: "#478CCA",
              borderRadius: 3,
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            {translating ? (
              <Image
                source={require("../assets/Pulse-1s-200px.gif")}
                style={{ width: 7, height: 7, marginRight: 3 }}
              />
            ) : (
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                style={{ width: 15.98, height: 15.96, marginRight: 3 }}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </Svg>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
      <StatusBar style="light" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
