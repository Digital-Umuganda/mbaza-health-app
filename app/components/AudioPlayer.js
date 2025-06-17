/**
 * @flow
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
import Slider from "@react-native-community/slider";

import { Ionicons } from "@expo/vector-icons";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_TRACK_1 = new Icon(
  require("../../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../../assets/images/thumb_2.png"),
  18,
  19
);

const BACKGROUND_COLOR = "transparent";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;

const AudioPlayer = ({ audioUri, noSlider = false }) => {
  
  const playbackInstanceRef = useRef(null);
  const isSeekingRef = useRef(false);
  const shouldPlayAtEndOfSeekRef = useRef(false);

  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(null);
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateScreenForLoading = (isLoadingParam) => {
    if (isLoadingParam) {
      setIsPlaying(false);
      setPlaybackInstanceDuration(null);
      setPlaybackInstancePosition(null);
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackInstancePosition(status.positionMillis);
      setPlaybackInstanceDuration(status.durationMillis);
      setShouldPlay(status.shouldPlay);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        // Stop the audio and reset to beginning without auto-playing
        setIsPlaying(false);
        setShouldPlay(false);
        playbackInstanceRef.current?.pauseAsync();
        playbackInstanceRef.current?.setPositionAsync(0);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const loadAudio = async (playing = false) => {
    try {
      if (playbackInstanceRef.current != null) {
        await playbackInstanceRef.current.unloadAsync();
        playbackInstanceRef.current = null;
      }

      if (!audioUri) {
        console.log('No audio URI provided');
        updateScreenForLoading(false);
        return;
      }

      const source = { uri: audioUri };
      const initialStatus = {
        shouldPlay: playing,
        isLooping: false,
      };

      const { sound } = await Audio.Sound.createAsync(
        source,
        initialStatus,
        onPlaybackStatusUpdate
      );
      playbackInstanceRef.current = sound;

      updateScreenForLoading(false);
    } catch (error) {
      console.log('Error loading audio:', error);
      updateScreenForLoading(false);
    }
  };

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });
        
        // Load the audio track
        if (audioUri) {
          await loadAudio(false);
        }
      } catch (error) {
        console.log('Error initializing audio:', error);
      }
    };

    initializeAudio();

    // Cleanup function
    return () => {
      if (playbackInstanceRef.current) {
        playbackInstanceRef.current.unloadAsync();
      }
    };
  }, [audioUri]);

  const onPlayPausePressed = () => {
    if (playbackInstanceRef.current != null) {
      if (isPlaying) {
        playbackInstanceRef.current.pauseAsync();
      } else {
        playbackInstanceRef.current.playAsync();
      }
    }
  };

  const onSeekSliderValueChange = (value) => {
    if (playbackInstanceRef.current != null && !isSeekingRef.current) {
      isSeekingRef.current = true;
      shouldPlayAtEndOfSeekRef.current = shouldPlay;
      playbackInstanceRef.current.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value) => {
    if (playbackInstanceRef.current != null) {
      isSeekingRef.current = false;
      const seekPosition = value * playbackInstanceDuration;
      if (shouldPlayAtEndOfSeekRef.current) {
        playbackInstanceRef.current.playFromPositionAsync(seekPosition);
      } else {
        playbackInstanceRef.current.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekSliderPosition = () => {
    if (
      playbackInstanceRef.current != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return playbackInstancePosition / playbackInstanceDuration;
    }
    return 0;
  };

  const getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  };

  const getTimestamp = () => {
    if (
      playbackInstanceRef.current != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(playbackInstancePosition)}`;
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.audioPlayerContainer}>
        <View style={styles.buttonsContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#3D576F" />
          ) : (
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.playButton}
              onPress={onPlayPausePressed}
              disabled={isLoading}
            >
              <Ionicons
                name={isPlaying ? (noSlider ? "pause" : "pause-circle") : (noSlider ? "play" : "play-circle")}
                size={noSlider ? 24 : 32}
                color={noSlider ? "#3D576F" : "green"}
              />
            </TouchableHighlight>
          )}
        </View>

        {!noSlider && (
          <>
            <Text style={styles.timestamp}>
              {getTimestamp()}
            </Text>

            <View style={[styles.playbackContainer, { opacity: isLoading ? DISABLED_OPACITY : 1.0 }]}>
              <Slider
                style={styles.playbackSlider}
                trackImage={ICON_TRACK_1.module}
                thumbImage={ICON_THUMB_1.module}
                value={getSeekSliderPosition()}
                onValueChange={onSeekSliderValueChange}
                onSlidingComplete={onSeekSliderSlidingComplete}
                disabled={isLoading}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  audioPlayerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    minWidth: 40,
    maxWidth: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
    marginTop: 10,
  },
  timestamp: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
    textAlign: "right",
    paddingRight: 10,
  },
});
