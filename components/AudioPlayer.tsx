import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  audioSource: string; // URI path to audio file (http, https, file://)
  onNext?: () => void;
  onDelete?: () => void;
  title?: string;
  artist?: string;
};

export default function AudioPlayer({
  audioSource,
  onNext,
  onDelete,
  title = "Ikiganiro",
  artist,
}: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [waveformWidth, setWaveformWidth] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isPlayingRef = useRef(false);

  // Dynamic waveform bars calculation
  const barWidth = 2;
  const barGap = 1;
  const minBars = 15;
  const maxBars = 60;

  // Load and initialize audio
  const loadAudio = async () => {
    try {
      setIsLoading(true);

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Unload existing sound if any
      if (sound) {
        await sound.unloadAsync();
      }

      // Create new sound from URI
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioSource },
        { shouldPlay: false, isLooping: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
    } catch (error) {
      console.error("Error loading audio:", error);
      Alert.alert("Error", "Failed to load audio");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };

  // Initialize audio on mount
  useEffect(() => {
    loadAudio();
  }, [audioSource]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Calculate number of bars based on available width
  const calculateWaveformBars = (width: number) => {
    if (width <= 0) return minBars;
    const availableWidth = width;
    const barWithGap = barWidth + barGap;
    const calculatedBars = Math.floor(availableWidth / barWithGap);
    return Math.max(minBars, Math.min(maxBars, calculatedBars));
  };

  const waveformBars = calculateWaveformBars(waveformWidth);

  // Waveform animation values - recreate when bars count changes
  const waveformAnimValues = useRef(
    Array.from({ length: maxBars }, () => new Animated.Value(0.1))
  ).current;

  // Update playing ref when state changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize animations
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const startWaveformAnimation = () => {
    const animateWaveform = () => {
      if (!isPlayingRef.current) return;

      // Only animate the visible bars
      const visibleAnimValues = waveformAnimValues.slice(0, waveformBars);

      const animations = visibleAnimValues.map((value, index) => {
        // Create more varied animation patterns
        const randomHeight = 0.2 + Math.random() * 0.8;
        const randomDuration = 200 + Math.random() * 400;

        return Animated.timing(value, {
          toValue: randomHeight,
          duration: randomDuration,
          useNativeDriver: false,
        });
      });

      Animated.stagger(30, animations).start(() => {
        if (isPlayingRef.current) {
          setTimeout(animateWaveform, 100);
        }
      });
    };
    animateWaveform();
  };

  const stopWaveformAnimation = () => {
    // Only stop animation for visible bars
    const visibleAnimValues = waveformAnimValues.slice(0, waveformBars);

    visibleAnimValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: 0.1 + (index % 3) * 0.1, // Slight variation in resting state
        duration: 300 + Math.random() * 200,
        useNativeDriver: false,
      }).start();
    });
  };

  // Handle play state changes
  useEffect(() => {
    if (isPlaying) {
      startWaveformAnimation();
    } else {
      stopWaveformAnimation();
    }
  }, [isPlaying, waveformBars]);

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      setIsLoading(true);
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        // Reset to start if at the end
        if (currentTime >= duration && duration > 0) {
          await sound.setPositionAsync(0);
          setCurrentTime(0);
        }
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error playing/pausing audio:", error);
      Alert.alert("Error", "Failed to play/pause audio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Audio",
      "Are you sure you want to delete this audio track?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (sound) {
              await sound.stopAsync();
              await sound.unloadAsync();
            }
            onDelete?.();
          },
        },
      ]
    );
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleWaveformLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setWaveformWidth(width);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.playerCard}>
        {/* Header */}
        {(onDelete || onNext) && (
          <View style={styles.header}>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {artist}
              </Text>
            </View>

            <View style={styles.headerControls}>
              {onDelete && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
              {onNext && (
                <TouchableOpacity style={styles.actionButton} onPress={onNext}>
                  <Ionicons name="chevron-forward" size={18} color="#10B981" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Player section with waveform */}
        <View style={styles.playerSection}>
          {/* Waveform visualization */}
          <View style={styles.waveformContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={16}
                  color="#ffffff"
                  style={!isPlaying && { marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>

            <View style={styles.waveform} onLayout={handleWaveformLayout}>
              {waveformAnimValues.slice(0, waveformBars).map((value, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.waveformBar,
                    {
                      height: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [4, 28],
                      }),
                      backgroundColor: isPlaying ? "#10B981" : "#E0E0E0",
                      opacity: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                      width: barWidth,
                    },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  playerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
  },
  headerControls: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  playerSection: {
    alignItems: "center",
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    flex: 1,
    justifyContent: "center",
    gap: 1,
  },
  waveformBar: {
    backgroundColor: "#E0E0E0",
    borderRadius: 1,
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    minWidth: 70,
    textAlign: "right",
  },
});
