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
import { getData, url } from "../utilities";
import { fetch } from "../utilities/react-native-fetch-api/fetch";
import RecordAudio from "./components/RecordAudio";
import AudioPlayList from "./components/AudioPlayList";
import { Ionicons } from "@expo/vector-icons";
import instance, { onLogout } from "../utilities";
import SkeletonLoader from "./components/SkeletonLoader";
import appDayjs from "./utils/date";
import ContentBackground from "./components/ContentBackground";

export default function Chat() {
  const scrollViewRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [translating, setTranslating] = useState(false);
  const params = useLocalSearchParams();
  const [chatId, setChatId] = useState(null);
  const [action, setAction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params?.chatId) {
      setChatId(params.chatId);
    }
    fetchMessagesFromChat();
  }, [params]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true })

  }, [messages, translating])

  const fetchMessagesFromChat = async () => {
    if (!params.chatId) {
      if (params?.message) {
        chat(params.message);
      }
      return;
    }
    const config = {
      method: "get",
      url: `${url}/api/v1/chats/${params.chatId}/messages`,
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
                audio_question: chat.audio_question,
              },
              type: "request",
            });
            messagesCopy.push({
              message: {
                answer: chat.kinyarwanda_response,
                created_at: chat.created_at,
                audio_responses: chat.audio_responses,
              },
              type: "response",
            });
          });
        setMessages(messagesCopy);

      },
    };

    setTranslating(true);
    await instance(config)
      .then(function (response) {
        // console.log({ data: response.data });
        // setChats(response.data);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        setTranslating(false);
        if (params?.message) {
          chat(params.message);
        }
      });

  };

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if ((params.hasFeedback === "false") && chatId) {
        e.preventDefault();
        setModalVisible(true);

        setAction(e.data.action);
      }
    });

    return () => {
      navigation.removeListener("beforeRemove");
    };
  }, [navigation, params, chatId]);

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  // callbacks
  const handleSheetChanges = () => {
    params.hasFeedback = "true";
    router.push({
      pathname: "/custom-chat",
      params: { chatId },
    });
  }

  const sendFeedback = async (is_satisfied) => {
    if (!chatId || isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      await instance.post(`${url}/api/v1/feedbacks/${chatId}/feedback`, {
        is_satisfied,
      });
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

  const chat = async (message = null, audio_question = null) => {
    if (!message?.trim() && !audio_question?.trim()) {
      return;
    }
    const isAudio = audio_question != null;

    const currentChatId = chatId || params.chatId;

    let data = {
      kinyarwanda_question: message,
      requested_at: appDayjs().toDate(),
      with_audio: true,
      with_english: true
    };

    if (currentChatId) {
      data.chat_id = currentChatId;
    }

    setMessages((prev) => [
      ...prev,
      {
        message: {
          answer: message,
          requested_at: appDayjs().toDate().toUTCString(),
          audio_question,
        },
        type: "request",
      },
    ]);

    if (isAudio) {
      const uri = audio_question;
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
      let endpoint = isAudio ? `/chatbot-audio` : "/kiny/chatbot";

      if (currentChatId) {
        endpoint += `?chat_id=${currentChatId}`;
      }

      const response = await fetch(`${url}/api/v1${endpoint}`, requestOptions);

      if (response.status === 401) {
        await onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stream = response.body;

      const reader = stream.getReader();

      let responseText = { answer: "" };

      const readChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          if (responseText.chat_id && !chatId) {
            setChatId(responseText.chat_id);
            setTranslating(false);
          }
          if (responseText.answer) {
            setMessages((prev) => {
              // remove last if type was response
              if (prev.length > 0 && prev[prev.length - 1].type == "response") {
                prev.pop();
              }
              return [...prev, { message: responseText, type: "response" }];
            });
          }
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
          responseText.chat_id = text.chat_id;
        } else {
          const splitText = text.split("}");
          let runs = 0;
          splitText.forEach((splitT) => {
            splitT = splitT.trim();
            if (splitT.startsWith("{")) {
              text = JSON.parse(splitT + "}");
              responseText.answer += text.answer;
              responseText.chat_id = text.chat_id;
              responseText.created_at = text.created_at;
              responseText.audio_responses = text.audio_responses;
              runs++;
            }
          });
        }

        setMessages((prev) => {
          // remove last if type was response
          if (prev.length > 0 && prev[prev.length - 1].type == "response") {
            prev.pop();
          }
          return [...prev, { message: responseText, type: "response" }];
        });
        await readChunk();
      };

      await readChunk();
    } catch (error) {
      console.log(error);
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

  const renderMessage = (message, index) => {
    if (message.type == "request") {
      return <ChatRequest key={index} content={message.message} />;
    } else if (message.type == "response") {
      return <ChatResponse key={index} content={message.message}
        isTranslating={translating && !message.message?.audio_responses?.length} />
    }
  };

  const renderMessages = () => {
    return (
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.map((message, index) => renderMessage(message, index))
    );
  };



  return (
    <ContentBackground>
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
              position: 'relative'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                params.hasFeedback = "true";
                router.replace({
                  pathname: '/home',
                  params: {
                    // ...params,
                    showRecentChats: params.showRecentChats,
                  }
                })
              }}
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                paddingHorizontal: 10
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 24, textAlign: "center", color: "#3D576F", marginTop: 8 }}
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
      <TouchableOpacity
        onPress={handleSheetChanges}
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
        style={{
          paddingHorizontal: 20,
          marginBottom: 80,
          paddingTop: 16,
          marginTop: 4,
        }}
      >
        <ChatResponse content={{ answer: "Muraho! Mbafashe nte?" }} />
        {renderMessages()}
        {translating && <SkeletonLoader />}
      </ScrollView>
      <View
        // onPress={() => router.push("/help")}
        style={{
          position: "absolute",
          bottom: 0,
          width: "90%",
          height: 64,
          borderRadius: 8,
          justifyContent: "center",
          marginHorizontal: 16,
          marginBottom: 8,
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
          {recordUrl ? (
            <>
              <AudioPlayList playlist={[recordUrl]} />
              <TouchableOpacity
                onPress={() => setRecordUrl(null)}
                style={{
                  marginRight: 20,
                  padding: 2,
                }}
              >
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <RecordAudio
                onSubmit={(uri) => {
                  setRecordUrl(uri);
                }}
                setIsRecording={setIsRecording}
              />
              <TextInput
                style={{ flex: 1, fontSize: 16, height: 64, paddingLeft: 10 }}
                onChangeText={(text) => {
                  setLastMessage(text);
                }}
                value={lastMessage}
                placeholder="Enter message"
                placeholderTextColor="white"
                multiline
                editable={isRecording || translating ? false : true}
              />
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isRecording) {
                return;
              }
              if (recordUrl) {
                chat(null, recordUrl);
                setRecordUrl(null);
              } else {
                chat(lastMessage);
                setLastMessage("");
              }
            }}
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
    </ContentBackground>
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
