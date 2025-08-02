import React from "react";
import { TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const RecordAudio = ({ onSubmit = () => {}, setIsRecording = () => {} }) => {
  const [recording, setRecording] = React.useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        // Requesting microphone permission
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Starting audio recording

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      // Recording started successfully
      setIsRecording(true);
    } catch (err) {
      // Failed to start recording - error removed for production
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    setIsRecording(false);
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
        // No audio file to upload - warning removed for production
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
      // Failed to upload audio file - error removed for production
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          borderRightWidth: 2,
          borderColor: "#CADEF0",
          paddingRight: 4,
        }}
      >
        {recording ? (
          <Ionicons name="stop-circle" size={38} color="red" />
        ) : (
          <Ionicons name="mic-circle" size={38} color="green" />
        )}
      </TouchableOpacity>
    </>
  );
};

export default RecordAudio;
