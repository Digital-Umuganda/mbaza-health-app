import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Button({title, backgroundColor, textColor, onPress, underlineText}) {
    return (
        <TouchableOpacity onPress={onPress} style={{ backgroundColor, width: '100%', height: 60, borderRadius: 8, justifyContent: 'center' }}>
            <Text style={{ color: textColor, textAlign: 'center', fontSize: 22, fontWeight: 'bold', textDecorationLine: underlineText ? 'underline' : 'none' }}>{title}</Text>
        </TouchableOpacity>
    )
}