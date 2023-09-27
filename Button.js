import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Button({title, backgroundColor, textColor, onPress, underlineText, borderColor, fontSize}) {
    return (
        <TouchableOpacity onPress={onPress} style={{ backgroundColor, width: '100%', height: 60, borderRadius: 8, justifyContent: 'center', borderColor, borderWidth: borderColor ? 1 : 0 }}>
            <Text style={{ color: textColor, textAlign: 'center', fontSize: fontSize || 22, fontWeight: 'bold', textDecorationLine: underlineText ? 'underline' : 'none' }}>{title}</Text>
        </TouchableOpacity>
    )
}