import ContentBackground from "@/components/ContentBackground";
import ConversationCard from "@/components/ConversationCard";
import FilterChip from "@/components/FilterChip";
import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import { useDebounce } from "@/hooks/use-debounce";
import type { ConversationResponse } from "@/types/conversation";
import instance, { fetchProfile } from "@/utilities";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConversationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [perPage, setPerPage] = useState(
    Number(params?.perPage?.toString() || 10)
  );

  const [isPending, setPending] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>();
  const activeFilter = params?.filter?.toString() || "all";

  async function fetchConversations(additions = 0) {
    const _perPage = perPage + additions;

    setPending(true);
    try {
      if (!profile) {
        setProfile(await fetchProfile());
      }
      let endpoint = `/api/v1/messages?sort_field=created_at&sort_order=desc&limit=${_perPage}`;
      if (activeFilter !== "all") {
        endpoint += `&status=${activeFilter}`;
      }
      if (debouncedSearchQuery) {
        endpoint += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      const { data } = await instance.get<ConversationResponse[]>(endpoint);
      setConversations(data);
      setPerPage(_perPage);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // Handle error appropriately, e.g., show a toast or alert
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchConversations(0);
    } else {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, params?.filter]);

  const handleFollowUp = (conversationId: string) => {
    // Navigate to follow-up screen or show follow-up modal
    router.push(`/consultation/${conversationId}/follow-up/1`);
  };

  const handleViewDetails = (conversationId: string, patientName: string) => {
    // Navigate to conversation details
    router.push(
      `/consultation/${conversationId}/details?patientName=${patientName}`
    );
  };

  const renderConversation = ({ item }: { item: ConversationResponse }) => (
    <ConversationCard
      conversation={item}
      onFollowUp={() => handleFollowUp(item.id)}
      onViewDetails={() =>
        handleViewDetails(item.id, item.patient_info.name || "Umurwayi")
      }
    />
  );

  const filterOptions = [
    {
      key: "all",
      label: "Ibiganiro byatanzwe",
      count: Number(profile?.total_consultations || 0),
      active: true,
    },
    {
      key: "pending_5days",
      label: "Ibikeneye gukurikiraniwa nyuma y'iminsi 5",
      count: Number(profile?.total_consultations_in_progress_5days || 0),
      active: false,
    },
    {
      key: "pending_14days",
      label: "Ibikeneye gukurikiraniwa nyuma y'iminsi 14",
      count: Number(profile?.total_consultations_in_progress_14days || 0),
      active: false,
    },
    {
      key: "followed_up_5days",
      label: "Ibyakurikiranwe nyuma y' iminsi 5",
      count: Number(profile?.total_consultations_followed_5days || 0),
      active: false,
    },
    {
      key: "followed_up_14days",
      label: "Ibyakurikiranwe nyuma y' iminsi 14",
      count: Number(profile?.total_consultations_followed_14days || 0),
      active: false,
    },
  ];

  return (
    <ContentBackground>
      {isPending && !searchQuery && (
        <LoadingOverlayModal visible text="Tegereza..." useBlur />
      )}
      {/* Search Bar */}
      <View style={{ backgroundColor: "white" }}>
        <View style={styles.searchContainer}>
          {isPending && !!searchQuery ? (
            <ActivityIndicator
              size="small"
              color="#999"
              style={styles.searchIcon}
            />
          ) : (
            <Ionicons
              name={"search"}
              size={24}
              color="#999"
              style={styles.searchIcon}
            />
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Izina ry'umurwayi"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filterOptions.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              count={filter.count}
              active={activeFilter === filter.key}
              onPress={() => {
                if (activeFilter !== filter.key) {
                  router.replace(`/conversations?filter=${filter.key}`);
                }
              }}
            />
          ))}
        </ScrollView>
      </View>

      {!conversations.length && !isPending && searchQuery ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 18, color: "#666" }}>
            Nta biganiro byabonetse kuri &quot;{searchQuery}&quot;
          </Text>
        </View>
      ) : null}
      {!conversations.length && !isPending && !searchQuery ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 18, color: "#666" }}>
            Nta biganiro byatanzwe
          </Text>
        </View>
      ) : (
        isPending &&
        searchQuery && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <ActivityIndicator size="large" color="#478CCA" />
          </View>
        )
      )}

      {/* Conversations List */}
      {!isPending && (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.conversationsList}
          contentContainerStyle={styles.conversationsContent}
          showsVerticalScrollIndicator={true}
        />
      )}
      {conversations.length % 10 === 0 && conversations.length ? (
        <TouchableOpacity
          onPress={() => fetchConversations(10)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isPending ? "#B1C6DA" : "#478CCA",
              paddingHorizontal: 32,
              borderRadius: 8,
              paddingVertical: 10,
              marginTop: 32,
              opacity: isPending ? 0.6 : 0.8,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "normal",
                fontSize: 18,
              }}
            >
              Ibindi biganiro{isPending ? "..." : ""}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: '#B1C6DA',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 2,
    marginHorizontal: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filtersContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    paddingBottom: 16,
  },
  filtersContent: {
    paddingRight: 20,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationsContent: {
    paddingBottom: 20,
  },
});
