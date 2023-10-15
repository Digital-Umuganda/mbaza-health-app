import { Text, View } from "react-native";

export default function ChatRequest({ content, profile }) {
    return (
        <View style={{ alignSelf: 'flex-end', backgroundColor: '#DAECE8', borderRadius: 16, borderTopRightRadius: 0, width: '80%', marginBottom: 20, flex: 1 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#C7DEE5', padding: 10, width: 'auto' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 12, color: '#3CAF4A', fontWeight: '700' }}>{profile && profile?.name != null && profile.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#3D576F8E' }}>{new Date().toLocaleDateString()}</Text>
                </View>
            </View>
            <Text selectable={true} style={{ color: '#3D576F', padding: 15, fontWeight: '500', lineHeight: 24 }}>{content?.answer && content.answer}</Text>
        </View>
    );
}