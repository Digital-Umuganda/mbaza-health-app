import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
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
import RecordAudio from "./components/RecordAudio";

export default function Chat() {
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const params = useLocalSearchParams();
  const [chatId, setChatId] = useState(null);
  const [reloadResponse, setReloadResponse] = useState(false);
  const [profile, setProfile] = useState(null);

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
                audio_responses: chat.audio_responses,
                audio_question: chat.audio_question,
              },
              type: "response",
            });
          });
        setMessages(messagesCopy);
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log({ data: response.data });
        // setChats(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  const submit = (message = null, audio_question = null) => {
    const messagesCopy = Array.from(messages);
    messagesCopy.push({
      message: {
        answer: message || lastMessage,
        requested_at: new Date(),
        audio_question,
      },
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
    const lastQuestion = messages[messages.length - 1].message;
    const isAudio = lastQuestion.audio_question != null;
    let data = {
      kinyarwanda_question: lastQuestion.answer,
      requested_at: lastQuestion.requested_at,
      with_audio: true,
    };

    if (isAudio) {
      const uri = lastQuestion.audio_question;
      const filetype = uri.split(".").pop();
      const filename = uri.split("/").pop();
      const formData = new FormData();
      formData.append("audio_file", {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      });
      data = formData;
    } else {
      data = JSON.stringify(data);
    }

    if (chatId != null) {
      data.chat_id = chatId || params.chatId;
    }

    const accessToken = await getData("access_token");

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": isAudio ? "multipart/form-data" : "application/json",
        Accept: "application/json",
      },
      body: data,
      reactNative: { textStreaming: true },
    };

    setTranslating(true);
    try {
      const endpoint = isAudio
        ? `/chatbot-audio?requested_at=${new Date().toISOString()}`
        : "/kiny/chatbot";
      const response = await fetch(`${url}/api/v1${endpoint}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stream = response.body;

      const reader = stream.getReader();

      let responseText = { answer: "" };

      const readChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // setChatId(responseText.chat_id);
          // setLastAnswer(responseText.answer)
          // setLastResponse(responseText);
          reader.releaseLock();
          return;
        }
        // You can do something with 'value' here.
        // For example, if it's text data, you can convert it to a string.
        let text = new TextDecoder().decode(value);
        if (countOccurrences(text, "{") == 1) {
          text = JSON.parse(text);
          responseText.answer += text.answer;
          responseText.created_at = text.created_at;
          responseText.audio_responses = text.audio_responses;
          responseText.audio_question = text.audio_question;
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
              responseText.audio_responses = text.audio_responses;
              responseText.audio_question = text.audio_question;
              runs++;
            }
          });
          setReloadResponse(true);
          setChatId(text.chat_id);
          setLastAnswer(responseText.answer);
          setReloadResponse(true);
        }
        setLastResponse(responseText);

        if (!chatId && responseText.chat_id) {
          setChatId(responseText.chat_id);
        }
        await readChunk();
      };

      await readChunk();
    } catch (error) {
      // console.log(error);
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
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => handleSheetChanges(2)}
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../assets/exceptio_icon.png")}
          />
          <Text style={{ color: "#3D576F", marginHorizontal: 4, fontSize: 16 }}>
            IBIBAZO BYIHARIYE
          </Text>
        </View>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../assets/chevron_right_icon.png")}
        />
      </TouchableOpacity>
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
          <RecordAudio onSubmit={(uri) => submit(null, uri)} />
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
