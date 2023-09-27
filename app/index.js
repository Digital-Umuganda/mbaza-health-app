import { Text, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function Index() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
            <Button title="INJIRA" backgroundColor="#478CCA" textColor="white" onPress={() => router.push('/login')} />
            <View style={{ marginTop: 20 }}></View>
            <Button title="IYANDIKISHE" backgroundColor="#478CCA3D" textColor="#3D576F" onPress={() => router.push('/signup')} />
            <StatusBar style="auto" />
        </View>
    )
}
