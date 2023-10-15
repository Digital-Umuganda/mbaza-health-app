import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { fetchProfile, getData, url } from "../utilities";
import { useEffect, useState } from "react";

export default function Home() {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const accessToken = await getData('access_token');
        var config = {
            method: 'get',
            url: `${url}/api/v1/chats`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        };

        try {
            const response = await axios(config)

            console.log({ data: response.data });

            let data = response.data;

            if (Array.isArray(data)) {
                data = data.reverse();
            }

            setChats(response.data);
        } catch (error) {
            console.log({ error });
        }
    }

    const setTheAppUp = async () => {
        await fetchChats();
        await fetchProfile();
    }

    useEffect(() => {
        setTheAppUp();
    }, [])

    const Chat = ({ chat }) => {
        return (
            <TouchableOpacity onPress={() => router.push({ pathname: '/chat', params: { chatId: chat.id } })} style={{ backgroundColor: '#478CCA14', paddingHorizontal: 20, paddingVertical: 15 }}>
                <Text selectable={true} style={{ fontSize: 14, color: '#3D576F' }}>{chat.title}</Text>
                <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 }}>
                    <Image style={{ width: 11.7, height: 12 }} source={require('../assets/spinner.png')} />
                    <Text style={{ color: '#3D576F8E', fontSize: 12 }}>{chat.created_at.split('T')[0]}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const rendeChats = () => {
        return Array.isArray(chats) && chats.map((chat, index) => <Chat chat={chat} key={index} />)
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
                <View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.push('/settings')} style={{ backgroundColor: '#3CAF4A19', padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40, borderRadius: 8, width: 144, height: 144 }}>
                        <View style={{ backgroundColor: '#3CAF4A', opacity: .14, alignItems: 'center', justifyContent: 'center', width: 'auto', borderRadius: 50, height: 50, width: 51 }}>
                            <Image style={{ width: 20.43, height: 20.43 }} source={require('../assets/person-green.png')} />
                        </View>
                        <Text style={{ color: '#3D576F', fontSize: 14, marginTop: 10, fontWeight: '600' }}>Konti yanjye</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/help')} style={{ backgroundColor: '#F6BA151A', padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40, borderRadius: 8, width: 144, height: 144 }}>
                        <View style={{ backgroundColor: '#F6BA15', opacity: .14, alignItems: 'center', justifyContent: 'center', width: 'auto', borderRadius: 50, height: 50, width: 51 }}>
                            <Image style={{ width: 9.78, height: 17.39 }} source={require('../assets/question_outline.png')} />
                        </View>
                        <Text style={{ color: '#3D576F', fontSize: 14, marginTop: 10, fontWeight: '600' }}>Ubufasha</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ backgroundColor: '#478CCA3D', borderTopRightRadius: 8, borderTopLeftRadius: 8, height: 67, justifyContent: 'center', }}>
                        <Text style={{ color: '#478CCA', fontWeight: '600', paddingLeft: 20 }}>IBYO MUHERUKA KUBAZA</Text>
                    </View>
                    {rendeChats()}
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => router.push('/chat')} style={{ position: 'absolute', backgroundColor: '#478CCA', bottom: 10, width: '90%', height: 64, borderRadius: 8, justifyContent: 'center', paddingHorizontal: 20, marginHorizontal: 20, left: 0, right: 0, }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ width: 22.22, height: 20.63 }} source={require('../assets/chat.png')} />
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: '#F6BA15', fontSize: 16, fontWeight: 'bold' }}>BAZA</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    )
}