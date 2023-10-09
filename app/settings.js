import { Text, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { getData } from '../utilities';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkSession = async () => {
    const accessToken = await getData('access_token');
    if (accessToken === null) {
        router.push('/login')
    }
}

export default function Settings() {
    useEffect(() => {
        checkSession();
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
            <Button title="SOHOKA" backgroundColor="#478CCA" textColor="white" onPress={() => {
                AsyncStorage.clear()
                    .then(() => router.push('/login'))
            }} />
            <StatusBar style="auto" />
        </View>
    )
}
