import * as FileSystem from "expo-file-system";

export interface AudioFileInfo {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export const loadAudioFile = async (
  uri: string
): Promise<AudioFileInfo | null> => {
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      console.error("Audio file does not exist:", uri);
      return null;
    }

    // Extract filename from URI
    const filename = uri.split("/").pop() || `recording_${Date.now()}.m4a`;

    // Read file as base64 (alternative approach)
    // const base64 = await FileSystem.readAsStringAsync(uri, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });

    return {
      uri: uri,
      name: filename,
      type: "audio/m4a", // or "audio/mp4"
      size: fileInfo.size,
    };
  } catch (error) {
    console.error("Error loading audio file:", error);
    return null;
  }
};

export const createAudioBlob = async (uri: string): Promise<Blob | null> => {
  try {
    // For React Native, we can use fetch to convert file URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error creating blob from audio file:", error);
    return null;
  }
};
