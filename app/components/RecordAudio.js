import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Audio } from "expo-av";
import { getData, url } from "../../utilities";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from "expo-av/build/Audio";

const RecordAudio = () => {
  const [recording, setRecording] = React.useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    const info = await FileSystem.getInfoAsync(uri || "");
    await uploadAudioFile(info);
  }

  async function uploadAudioFile(info) {
    try {
      const uri = info.uri;
      const filetype = uri.split(".").pop();
      const filename = uri.split("/").pop();
      const formData = new FormData();
      formData.append("audio_file", {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      });

      const accessToken = await getData("access_token");

      const response = await axios.post(
        `${url}/api/v1/chatbot-audio?requested_at=${new Date().toISOString()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Audio file uploaded successfully");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Failed to upload audio file", error?.response?.data);
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          marginLeft: 16,
          borderRightWidth: 2,
          borderColor: "#CADEF0",
          paddingRight: 10,
        }}
      >
        <Image
          style={{ width: 20, height: 20 }}
          source={
            recording
              ? require(`../../assets/record_stop.png`)
              : require(`../../assets/mic_icon.png`)
          }
        />
      </TouchableOpacity>
    </>
  );
};

export default RecordAudio;
