import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Audio } from "expo-av";
import { getData, url } from "../../utilities";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Ionicons } from '@expo/vector-icons';

const RecordAudio = ({ onSubmit = () => {} }) => {
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
    await uploadAudioFile(uri);
  }

  async function uploadAudioFile(uri) {
    try {
      if (!uri) {
        console.warn("No audio file to upload");
        return;
      }
      const filetype = uri.split(".").pop();
      const filename = uri.split("/").pop();
      const formData = new FormData();
      formData.append("audio_file", {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      });

      onSubmit(uri);

      // const accessToken = await getData("access_token");

      // const response = await axios.post(
      //   `${url}/api/v1/chatbot-audio?requested_at=${new Date().toISOString()}`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Accept: "application/json",
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );
    } catch (error) {
      console.error("Failed to upload audio file", error);
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          borderRightWidth: 2,
          borderColor: "#CADEF0",
          paddingRight: 10,
        }}
      >
        {recording ? (
          <Ionicons name="stop-circle" size={42} color="red" />
        ) : (
          <Ionicons name="mic-circle" size={42} color="green" />
        )}
      </TouchableOpacity>
    </>
  );
};

export default RecordAudio;
