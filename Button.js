import { router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Button({ title, backgroundColor, textColor, onPress, underlineText, borderColor, fontSize, loading = false }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ backgroundColor, width: '100%', height: 60, borderRadius: 8, justifyContent: 'center', borderColor, borderWidth: borderColor ? 1 : 0, flexDirection: 'row', paddingHorizontal: 10 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: textColor, textAlign: 'center', fontSize: fontSize || 22, fontWeight: 'bold', textDecorationLine: underlineText ? 'underline' : 'none' }}>{title}</Text>
            </View>
            <ActivityIndicator color={'#FFFFFF'} animating={loading} />
        </TouchableOpacity>
    )
}