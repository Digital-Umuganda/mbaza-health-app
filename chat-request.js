import { Text, View } from "react-native";

export default function ChatRequest({ content, profile }) {
    let date;
    let time;
    if (content.requested_at != null && typeof(content.requested_at) == "string" && content.requested_at.includes("T")) {
        date = content.requested_at.split("T")[0];
        time = content.requested_at.split("T")[1].split(".")[0];
    } else {
        date = new Date();
        time = date.toLocaleTimeString();
        time = time.split(" ")[0];
        date = date.toLocaleDateString();
    }
    return (
        <View style={{ alignSelf: 'flex-end', backgroundColor: '#DAECE8', borderRadius: 16, borderTopRightRadius: 0, width: '80%', marginBottom: 20, flex: 1 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#C7DEE5', padding: 10, width: 'auto' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 12, color: '#3CAF4A', fontWeight: '700' }}>{profile && profile?.name != null && profile.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#3D576F8E' }}>{date} {time}</Text>
                </View>
            </View>
            <View style={{ padding: 15, }}>
                {content?.answer && content.answer.split('\n').map((item, i) => <Text selectable={true} style={{ color: '#3D576F', fontWeight: '500', lineHeight: 24, marginBottom: 1 }} key={i}>{item}</Text>)}
            </View>
        </View>
    );
}