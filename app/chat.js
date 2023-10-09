import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import BottomSheet from '@gorhom/bottom-sheet';
import ChatResponse from "../chat-response";
import ChatRequest from "../chat-request";
import { getData, url } from "../utilities";
import axios from "axios";
import { fetch } from "react-native-fetch-api";

export default function Chat() {
    const [lastMessage, setLastMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [translating, setTranslating] = useState(false);
    const [lastResponse, setLastResponse] = useState();
    const [lastAnswer, setLastAnswer] = useState();

    useEffect(() => {
        console.log({ messages });

        if (Array.isArray(messages) && messages.length > 0 && messages[messages.length - 1].type === "request") {
            chat();
        }

    }, [messages])

    const submit = () => {
        const messagesCopy = Array.from(messages);
        messagesCopy.push({ message: { answer: lastMessage, created_at: new Date() }, type: 'request' });

        setLastMessage('');

        Array.isArray(messages) && setMessages(messagesCopy);
    }

    // ref
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    // callbacks
    const handleSheetChanges = () => bottomSheetRef.current.expand();

    const chat = async () => {
        const data = JSON.stringify({
            "kinyarwanda_question": messages[messages.length - 1].message.answer
        });

        const accessToken = await getData('access_token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: data,
            reactNative: { textStreaming: true },
        };

        console.log({ requestOptions });

        try {
            const response = await fetch(`${url}/api/v1/chatbot`, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const stream = response.body;

            const reader = stream.getReader();

            let responseText = { answer: '' };

            const readChunk = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    console.info("stream done")
                    reader.releaseLock();
                    return;
                }
                // You can do something with 'value' here.
                // For example, if it's text data, you can convert it to a string.
                let text = new TextDecoder().decode(value);
                try {
                    if (countOccurrences(text, '{') == 1) {
                        text = JSON.parse(text);
                        responseText.answer += text.answer;
                        responseText.created_at = text.created_at;
                        setLastAnswer(responseText.answer)
                    } else {
                        const splitText = text.split("}");
                        splitText.forEach(splitT => {
                            if (splitT.startsWith("{")) {
                                console.log({ splitT });
                                text = JSON.parse(splitT + "}");
                                responseText.answer += text.answer;
                                responseText.created_at = text.created_at;
                                setLastAnswer(responseText.answer)
                            }
                        })
                    }
                } catch (error) {
                    if (error.message == "JSON Parse error: Unexpected character: {") {
                        console.warn({ error: error.message, text });
                    }
                }
                // console.log({ responseText, text })
                setLastResponse(responseText);
                readChunk();
            };



            readChunk();
        } catch (error) {
            console.warn({ message: error.message });
        }
    }

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
        console.log({ lastResponse })
        const messagesCopy = Array.from(messages);

        if (messagesCopy.length > 0 && messagesCopy[messagesCopy.length - 1].type == 'response') {
            messagesCopy.pop();
        }

        if (lastResponse) {
            messagesCopy.push({ message: lastResponse, type: 'response' });
            setMessages(messagesCopy);
        }
    }, [lastResponse?.answer, lastAnswer])

    const renderMessage = (message, index) => {
        if (message.type == "request") {
            return <ChatRequest key={index} content={message.message} />
        } else if (message.type == "response") {
            return <ChatResponse key={index} content={message.message} />
        }
    }

    const renderMessages = () => {
        return Array.isArray(messages) && messages.length > 0 && messages.map((message, index) => renderMessage(message, index))
    }

    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
                <ChatResponse content={{ answer: "Muraho! Mbafashe nte?" }} />
                {renderMessages()}
            </ScrollView>
            <View onPress={() => router.push('/help')} style={{ position: 'absolute', bottom: 0, width: '90%', height: 64, borderRadius: 8, justifyContent: 'center', marginHorizontal: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: "row", borderWidth: 1, alignItems: 'center', paddingLeft: 20, marginHorizontal: 4, borderRadius: 10, borderColor: '#478CCA3D', backgroundColor: '#FFFFFF', paddingVertical: 1 }}>
                    <TouchableOpacity onPress={() => handleSheetChanges(2)}>
                        <Image style={{ width: 20, height: 20 }} source={require('../assets/levels.png')} />
                    </TouchableOpacity>
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
                        style={{ backgroundColor: '#478CCA', borderRadius: 3, width: 48, height: 48, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                    >
                        {translating ? <Image source={require('../assets/Pulse-1s-200px.gif')} style={{ width: 7, height: 7, marginRight: 3 }} /> : (
                            <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" style={{ width: 15.98, height: 15.96, marginRight: 3 }}>
                                <Path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});