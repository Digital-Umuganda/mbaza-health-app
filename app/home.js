import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { fetchProfile } from "../utilities";
import { useEffect, useState } from "react";
import instance from "../utilities/http";
import SkeletonLoader from "./components/SkeletonLoader";
import { Ionicons } from "@expo/vector-icons";
import appDayjs, { dateTimeWithSpaceFormat } from './utils/date'
import ContentBackground from "./components/ContentBackground";

const arr5 = Array.from({ length: 5 }, (_, i) => i);

export default function Home() {
  const params = useLocalSearchParams();
  const [perPage, setPerPage] = useState(params?.perPage || 5);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);


  const fetchChats = async (additions = 0) => {
    const _perPage = perPage + additions;

    try {
      setIsLoading(true);
      const response = await instance.get(
        `/api/v1/chats?sort_field=created_at&sort_order=desc&limit=${_perPage}`
      );

      setChats(response.data);

      setPerPage(_perPage);
    } catch (error) { }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile()
    if (params?.showRecentChats === "true") {
      setShowRecentChats(true);
      fetchChats();
    }
  }, [])


  const Chat = ({ chat }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: {
              chatId: chat.id, hasFeedback: !!chat.feedback,
              showRecentChats
            },
          })
        }
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 15,
          // border
          borderBottomWidth: 1,
          borderBottomColor: "#CADEF0",
        }}
      >
        {/* flex items center */}
        <View style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
          <Text selectable={true} style={{ fontSize: 14, color: "#3D576F" }}>
            {chat.title}
          </Text>
          <View>
            <Ionicons name="chevron-up" size={24} color="#478CCA" style={{
              transform: [{ rotate: "90deg" }]
            }} />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          {!chat.feedback ? (
            <Image
              style={{ width: 11.7, height: 12 }}
              source={require("../assets/spinner.png")}
            />
          ) : chat.feedback.is_satisfied ? (
            <Image
              style={{ width: 15, height: 15 }}
              source={require("../assets/thumbs-up.png")}
            />
          ) : (
            <Image
              style={{ width: 15, height: 15 }}
              source={require("../assets/thumbs-down.png")}
            />
          )}
          <Text style={{ color: "#3D576F8E", fontSize: 12 }}>
            {appDayjs(chat.created_at).format(dateTimeWithSpaceFormat)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChats = () => {
    return (
      Array.isArray(chats) &&
      chats.map((chat, index) => <Chat chat={chat} key={index} />)
    );
  };
  return (
    <ContentBackground>
      <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={{
              backgroundColor: "#3CAF4A19",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              borderRadius: 8,
              width: "45%",
              height: 144,
            }}
          >
            <View
              style={{
                backgroundColor: "#3CAF4A",
                opacity: 0.14,
                alignItems: "center",
                justifyContent: "center",
                width: "auto",
                borderRadius: 50,
                height: 50,
                width: 51,
              }}
            >
              <Image
                style={{ width: 20.43, height: 20.43 }}
                source={require("../assets/person-green.png")}
              />
            </View>
            <Text
              style={{
                color: "#3D576F",
                fontSize: 14,
                marginTop: 10,
                fontWeight: "600",
              }}
            >
              Konti yanjye
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/help")}
            style={{
              backgroundColor: "#F6BA151A",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              borderRadius: 8,
              width: "45%",
              height: 144,
            }}
          >
            <View
              style={{
                backgroundColor: "#F6BA15",
                opacity: 0.14,
                alignItems: "center",
                justifyContent: "center",
                width: "auto",
                borderRadius: 50,
                height: 50,
                width: 51,
              }}
            >
              <Image
                style={{ width: 9.78, height: 17.39 }}
                source={require("../assets/question_outline.png")}
              />
            </View>
            <Text
              style={{
                color: "#3D576F",
                fontSize: 14,
                marginTop: 10,
                fontWeight: "600",
              }}
            >
              Ubufasha
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={
            () => {
              if (!showRecentChats) {
                fetchChats()
              }
              setShowRecentChats(!showRecentChats)
            }
          }
          >
            <View
              style={{
                backgroundColor: "#478CCA3D",
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                height: 67,
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                ...(showRecentChats ? {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                } : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }),
              }}
            >

              <Text
                style={{ color: "#478CCA", fontWeight: "600", paddingHorizontal: 20 }}
              >
                IBYO MUHERUKA KUBAZA
              </Text>

              {/* Show chevron depending on showRecents */}
              {
                showRecentChats ? <Ionicons name="chevron-down" size={24} color="#478CCA" style={{
                  marginRight: 20,
                }} /> : <Ionicons name="chevron-up" size={24} color="#478CCA" style={{
                  marginRight: 20,
                  transform: [{ rotate: "90deg" }]
                }} />
              }

            </View>
          </TouchableOpacity>

          <View style={{
            display: showRecentChats ? "flex" : "none",
          }}>
            {isLoading && (!chats.length) ? arr5.map((i) => <SkeletonLoader key={i} marginBottom={8} />) : chats.length ? renderChats() : <Text style={{ marginTop: 20, color: "#3D576F", paddingHorizontal: 20 }}>Nta biganiro byabonetse</Text>}

            {/* Load more if chat length divisible  5 as size per page */}
            {chats.length % 5 === 0 && chats.length ? <TouchableOpacity
              onPress={() => fetchChats(5)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <View style={{
                backgroundColor: isLoading ? "#B1C6DA" : '#478CCA',
                paddingHorizontal: 32,
                borderRadius: 8,
                paddingVertical: 10,
                marginTop: 32,
                opacity: isLoading ? 0.6 : 0.8
              }}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "normal",
                    fontSize: 18,
                  }}
                >
                  Ibindi biganiro{isLoading ? "..." : ""}
                </Text></View>
            </TouchableOpacity> : null}
          </View>

        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/chat",
            params: {
              hasFeedback: false,
              showRecentChats
            },
          });
        }}
        style={{
          position: "absolute",
          backgroundColor: "#478CCA",
          bottom: 10,
          width: "90%",
          height: 64,
          borderRadius: 8,
          justifyContent: "center",
          paddingHorizontal: 20,
          marginHorizontal: 20,
          left: 0,
          right: 0,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 22.22, height: 20.63 }}
            source={require("../assets/chat.png")}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{ color: "#F6BA15", fontSize: 16, fontWeight: "bold" }}
            >
              BAZA
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <StatusBar style="light" />
    </ContentBackground>
  );
}
