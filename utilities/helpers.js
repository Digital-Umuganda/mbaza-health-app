import * as FileSystem from 'expo-file-system';

export const downloadAndCacheAudio = async (audioUrl) => {
    try {
        // Create directories if not exist
        const directory = `${FileSystem.cacheDirectory}audio/`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        // Extract filename from URL
        const filename = audioUrl.substring(audioUrl.lastIndexOf('/') + 1);

        // Check if file already exists in cache
        const fileUri = `${directory}${filename}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            // File doesn't exist, download and save
            const downloadResumable = FileSystem.createDownloadResumable(
                audioUrl,
                fileUri
            );
            const { uri } = await downloadResumable.downloadAsync();
            // console.log('Audio file downloaded to:', uri);
        } else {
            // console.log('Audio file already cached:', fileUri);
        }

        return fileUri; // Return the URI of the cached file
    } catch (error) {
        // console.error('Error downloading audio file:', error);
        return null;
    }
};
