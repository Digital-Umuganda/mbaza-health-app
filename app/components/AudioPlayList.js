/**
 * @flow
 */

import React from "react";
import {
  Dimensions,
  Image,
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
  ResizeMode,
  Video,
} from "expo-av";
import Slider from "@react-native-community/slider";

import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

class PlaylistItem {
  constructor(name, uri, isVideo) {
    this.name = name;
    this.uri = uri;
    this.isVideo = isVideo;
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

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "transparent";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

export default class AudioPlayList extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.PLAYLIST = props.playlist?.map(
      (item) => new PlaylistItem("Audio", item, false)
    );
    this.noSlider = props.noSlider;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: true,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      videoWidth: DEVICE_WIDTH,
      videoHeight: 0,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: this.PLAYLIST[this.index].uri };
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
      isMuted: this.state.muted,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;

    this._updateScreenForLoading(false);
  }

  _mountVideo = (component) => {
    this._video = component;
    this._loadNewPlaybackInstance(false);
  };

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: this.PLAYLIST[this.index].name,
        showVideo: this.PLAYLIST[this.index].isVideo,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && this.index === this.PLAYLIST.length - 1) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(false);
      } else if (status.didJustFinish && this.index < this.PLAYLIST.length - 1) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  _onLoad = (status) => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  _onError = (error) => {
    console.log(`ON ERROR : ${error}`);
  };

  _onReadyForDisplay = (event) => {
    const widestHeight =
      (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      this.setState({
        videoWidth:
          (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
          event.naturalSize.height,
        videoHeight: 0,
      });
    } else {
      this.setState({
        videoWidth: DEVICE_WIDTH,
        videoHeight: 0,
      });
    }
  };

  _advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : this.PLAYLIST.length - 1)) %
      this.PLAYLIST.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);

    this.setState({
      videoWidth: DEVICE_WIDTH,
      videoHeight: 0,
    });

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onSeekSliderValueChange = (value) => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
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
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.playbackInstancePosition)}`;
    }
    return "";
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          ref={this._mountVideo}
          style={[
            styles.video,
            {
              opacity: this.state.showVideo ? 1.0 : 0.0,
              width: this.state.videoWidth,
              height: this.state.videoHeight,
            },
          ]}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
          onLoadStart={this._onLoadStart}
          onLoad={this._onLoad}
          onError={this._onError}
          onReadyForDisplay={this._onReadyForDisplay}
          useNativeControls={this.state.useNativeControls}
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={[
              styles.buttonsContainerBase,
              styles.buttonsContainerTopRow,
              {
                opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
              },
            ]}
          >
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onPlayPausePressed}
              disabled={this.state.isLoading}
            >
              {this.state.isPlaying ? (
                <Ionicons
                  name={!this.noSlider ? "pause-circle" : "pause"}
                  size={this.noSlider ? 24 : 32}
                  color={this.noSlider ? "#3D576F" : "green"}
                />
              ) : (
                <Ionicons
                  name={!this.noSlider ? "play-circle" : "play"}
                  size={this.noSlider ? 24 : 32}
                  color={this.noSlider ? "#3D576F" : "green"}
                />
              )}
            </TouchableHighlight>
          </View>

          {!this.noSlider ? (
            <>
              <Text
                style={[
                  styles.text,
                  styles.timestamp,
                ]}
              >
                {this._getTimestamp()}
              </Text>

              <View
                style={[
                  styles.playbackContainer,
                  {
                    opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                  },
                ]}
              >
                <Slider
                  style={styles.playbackSlider}
                  trackImage={ICON_TRACK_1.module}
                  thumbImage={ICON_THUMB_1.module}
                  value={this._getSeekSliderPosition()}
                  onValueChange={this._onSeekSliderValueChange}
                  onSlidingComplete={this._onSeekSliderSlidingComplete}
                  disabled={this.state.isLoading}
                />
              </View>
            </>
          ) : null}
        </View>

        <View />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
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
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  timestamp: {
    textAlign: "right",
    paddingRight: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonsContainerTopRow: {
    // maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: 40,
    maxWidth: 40,
  },
});
