import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect } from "react";
import {
  Alert,
  Animated,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface RecordAudioProps {
  onSubmit?: (uri: string) => void;
  recordingUri?: string;
  disabled?: boolean;
}

const RecordAudio = ({
  onSubmit = () => {},
  disabled = false,
}: RecordAudioProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [timer, setTimer] = React.useState(0);
  const [appState, setAppState] = React.useState(AppState.currentState);

  // Animation values for waveform bars
  const waveformBars = 40;
  const animatedValues = React.useRef(
    Array.from({ length: waveformBars }, () => new Animated.Value(0))
  ).current;

  // Pulse animation for recording button
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Interval for updating waveform
  const waveformInterval = React.useRef<NodeJS.Timeout | null>(null);

  // Add a ref to track recording state for animations
  const isRecordingRef = React.useRef(false);
  const isPausedRef = React.useRef(false);
  const recordingRef = React.useRef<Audio.Recording | null>(null);

  // Update refs when state changes
  React.useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  React.useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  React.useEffect(() => {
    recordingRef.current = recording || null;
  }, [recording]);

 
  const maintainBackgroundRecording = async () => {
    try {
      // Enhanced audio mode settings for background recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });

      console.log("Audio mode set for background recording");
    } catch (error) {
      console.error("Failed to maintain background recording:", error);
    }
  };

  // Start waveform animation with continuous loop
  const startWaveformAnimation = () => {
    const animateBars = () => {
      // Check current recording state from refs
      if (!isRecordingRef.current || isPausedRef.current) {
        return;
      }

      const animations = animatedValues.map((value, index) => {
        return Animated.timing(value, {
          toValue: 0.2 + Math.random() * 0.8, // Random height between 0.2 and 1
          duration: 150 + Math.random() * 200, // Random duration between 150-350ms
          useNativeDriver: false,
        });
      });

      Animated.stagger(30, animations).start(() => {
        // Use a shorter timeout for more continuous animation
        setTimeout(() => {
          if (isRecordingRef.current && !isPausedRef.current) {
            animateBars();
          }
        }, 50);
      });
    };

    animateBars();
  };

  // Stop waveform animation
  const stopWaveformAnimation = () => {
    animatedValues.forEach((value) => {
      Animated.timing(value, {
        toValue: 0.1, // Small base height instead of 0
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  // Enhanced pulse animation with continuous loop
  const startPulseAnimation = () => {
    const pulse = () => {
      if (!isRecordingRef.current || isPausedRef.current) {
        return;
      }

      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Continue pulsing if still recording
        if (isRecordingRef.current && !isPausedRef.current) {
          pulse();
        }
      });
    };
    pulse();
  };

  // Stop pulse animation
  const stopPulseAnimation = () => {
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.debug("Requesting permission..");
        await requestPermission();
      }

      // Enhanced audio mode for background recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });

      console.debug("Starting recording..");

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        // Status update callback to monitor recording
        (status) => {
          if (status.canRecord) {
            console.log("Recording is active:", status.isRecording);
          }
        }
      );

      setRecording(recording);
      console.debug("Recording started");
      setIsRecording(true);

      // Start animations after state is set
      setTimeout(() => {
        startWaveformAnimation();
        startPulseAnimation();
      }, 100);
    } catch (err) {
      console.error("Failed to start recording", err);
      Toast.show({
        text1: "Failed to start recording",
        type: "error",
      });
    }
  }

  async function pauseAudio() {
    try {
      await recording?.pauseAsync();
      setIsPaused(true);
      stopWaveformAnimation();
      stopPulseAnimation();
    } catch (error) {
      console.error("Failed to pause audio", error);
    }
  }

  async function resumeAudio() {
    try {
      await recording?.startAsync();
      setIsPaused(false);

      // Re-establish background recording mode
      await maintainBackgroundRecording();

      // Restart animations after state is updated
      setTimeout(() => {
        startWaveformAnimation();
        startPulseAnimation();
      }, 100);
    } catch (error) {
      console.error("Failed to resume audio", error);
    }
  }

  const setupAudio = async () => {
    try {
      // Request audio recording permissions
      const audioPermission = await Audio.requestPermissionsAsync();
      if (audioPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Audio recording permission is required to use this feature."
        );
        return;
      }

      // Request media library permissions for saving files
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Media library permission is required to save recordings."
        );
        return;
      }

      // Initial audio mode setup
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("Error setting up audio:", error);
      Alert.alert("Setup Error", "Failed to set up audio recording.");
    }
  };

  const generateFileName = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `survey_recording_${timestamp}.m4a`;
  };

  const saveToDocumentsDirectory = async (tempUri: string): Promise<string> => {
    try {
      const fileName = generateFileName();
      const documentsDir = FileSystem.documentDirectory;
      const permanentUri = `${documentsDir}recordings/${fileName}`;

      // Create recordings directory if it doesn't exist
      const recordingsDir = `${documentsDir}recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, {
          intermediates: true,
        });
      }

      // Copy the temporary file to permanent location
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri,
      });

      return permanentUri;
    } catch (error) {
      console.error("Error saving to documents directory:", error);
      throw error;
    }
  };

  const saveToMediaLibrary = async (fileUri: string): Promise<string> => {
    try {
      // Save to device's media library (accessible via Files app on iOS, Gallery on Android)
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      return asset.uri;
    } catch (error) {
      console.error("Error saving to media library:", error);
      throw error;
    }
  };

  async function stopRecording() {
    setRecording(undefined);
    setIsRecording(false);
    setIsSaving(true);

    // Stop animations
    stopWaveformAnimation();
    stopPulseAnimation();

    if (!recording) return;

    try {
      await recording?.stopAndUnloadAsync();

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });

      const tempUri = recording?.getURI();
      if (tempUri) {
        // Save to both documents directory and media library
        const documentsUri = await saveToDocumentsDirectory(tempUri);

        // Also save to media library for easy access
        try {
          await saveToMediaLibrary(documentsUri);
        } catch (mediaError) {
          console.warn(
            "Could not save to media library, but file is saved in app documents:",
            mediaError
          );
        }

        // Use the documents directory URI for the app
        onSubmit(documentsUri);

        Toast.show({
          text1: "Ikiganiro cyafashwe neza.",
        });
      }
    } catch (error) {
      console.error("Failed to stop and save recording", error);
      Alert.alert("Save Error", "Failed to save recording. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording, timer, isPaused]);

  useEffect(() => {
    setupAudio();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (waveformInterval.current) {
        clearInterval(waveformInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {isSaving && (
        <View style={styles.savingContainer}>
          <Text style={styles.savingText}>Saving recording...</Text>
        </View>
      )}

      {/* Background recording indicator */}
      {isRecording && appState.match(/inactive|background/) && (
        <View style={styles.backgroundIndicator}>
          <Text style={styles.backgroundText}>Recording in background...</Text>
        </View>
      )}

      <View style={styles.recordingContainer}>
        {isRecording ? (
          <>
            <View style={styles.waveformContainer}>
              <View
                style={[
                  styles.waveformBackground,
                  isPaused && styles.waveformPaused,
                ]}
              >
                {animatedValues.map((value, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveformBar,
                      isPaused && styles.waveformBarPaused,
                      {
                        height: value.interpolate({
                          inputRange: [0, 1],
                          outputRange: [6, 50],
                        }),
                        opacity: value.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4, 1],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.recordButton, styles.recordingActive]}
                onPress={stopRecording}
                disabled={isSaving}
              >
                <View style={styles.stopIcon} />
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={startRecording}
              disabled={isSaving}
            >
              <Ionicons name="mic" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.instructionText}>Kanda ufate amajwi</Text>
          </>
        )}
      </View>

      {recording && (
        <TouchableOpacity
          onPress={isPaused ? resumeAudio : pauseAudio}
          style={isPaused ? styles.resumeButton : styles.pauseButton}
          disabled={disabled}
        >
          {isPaused ? (
            <Ionicons name="play-circle" size={38} color="white" />
          ) : (
            <Ionicons name="pause-circle" size={38} color="white" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(RecordAudio);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  prompt: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  recordingContainer: {
    alignItems: "center",
  },
  recordButton: {
    backgroundColor: "#ff4d4f",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pauseButton: {
    marginTop: 24,
    backgroundColor: "#ff4d4f",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resumeButton: {
    marginTop: 24,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: "#10B981", // Green color when recording
    shadowColor: "#10B981",
    shadowOpacity: 0.4,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 2,
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  timerActive: {
    color: "#10B981",
    textShadowColor: "#10B981",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  recordingText: {
    fontSize: 14,
    color: "#ff4d4f",
    marginTop: 10,
    fontWeight: "500",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  savingContainer: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  savingText: {
    color: "#4a90e2",
    fontSize: 14,
    fontWeight: "500",
  },
  backgroundIndicator: {
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  backgroundText: {
    color: "#92400e",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  playbackContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waveform: {
    height: 2,
    backgroundColor: "#ddd",
    width: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    backgroundColor: "#4a90e2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  waveformContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: "85%",
    marginBottom: 20,
  },
  waveformBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Light green background
    borderRadius: 20,
    paddingHorizontal: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  waveformPaused: {
    backgroundColor: "rgba(156, 163, 175, 0.1)", // Gray background when paused
    shadowColor: "#9CA3AF",
  },
  waveformBar: {
    width: 4,
    backgroundColor: "#10B981", // Vibrant green
    borderRadius: 2,
    marginHorizontal: 1.5,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  waveformBarPaused: {
    backgroundColor: "#9CA3AF", // Gray when paused
    shadowColor: "#9CA3AF",
  },
});