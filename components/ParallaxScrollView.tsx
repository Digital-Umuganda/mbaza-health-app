import { Image, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import ContentBackground from "./ContentBackground";
import { LoadingOverlayModal } from "./LoadingOverlayModal";
import { ThemedText } from "./ThemedText";

const HEADER_HEIGHT = 130;

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  profile?: Record<string, string>;
};

export default function ParallaxScrollView({
  children,
  profile,
  isLoading,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  if (isLoading) {
    return <LoadingOverlayModal visible />;
  }

  return (
    <ContentBackground>
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor: "transparent",
          },
        ]}
      >
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ bottom }}
          contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}
        >
          {profile && (
            <Animated.View
              style={[
                styles.header,
                { backgroundColor: "#478CCA" },
                headerAnimatedStyle,
              ]}
            >
              <ThemedText
                style={{
                  color: "#F6BA15",
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  fontSize: 14,
                }}
              >
                Ikaze
              </ThemedText>
              <ThemedText
                type="title"
                style={{
                  color: "white",
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  fontSize: 22,
                }}
              >
                {profile?.name}
              </ThemedText>
              <Image
                source={require("@/assets/umugongo.png")}
                style={styles.umugongo}
              />
            </Animated.View>
          )}
          <ThemedView
            style={[
              styles.content,
              {
                backgroundColor: "transparent",
                alignItems: "center",
              },
            ]}
          >
            {children}
          </ThemedView>
        </Animated.ScrollView>
      </ThemedView>
    </ContentBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    // padding: 20,
    gap: 16,
    overflow: "hidden",
  },
  umugongo: {
    height: 34,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "transparent",
  },
});
