import { Image, Text, View } from "react-native";

export default function ChatResponse({ content }) {
    // console.log({content});
    return (
        <View style={{ justifyContent: 'flex-end', backgroundColor: '#FFFFFF', borderRadius: 16, borderTopLeftRadius: 0, maxWidth: '80%', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0EBF6', padding: 10 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ fontSize: 12, color: '#478CCA', fontWeight: '700' }}>R</Text>
                    <Text style={{ fontSize: 12, color: '#F6BA15', fontWeight: '700' }}>B</Text>
                    <Text style={{ fontSize: 12, color: '#478CCA', fontWeight: '700' }}>C</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#3D576F8E' }}>{content != null && content?.created_at !== undefined && content?.created_at.includes(':') && content.created_at.split(':', 2).join(':')}</Text>
                </View>
            </View>
            <Text selectable={true} style={{ color: '#3D576F', padding: 15, fontWeight: '500', lineHeight: 24 }} >{content?.answer && content.answer}</Text>
        </View>
    );
}
