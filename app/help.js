import { Image, Text, TextInput, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';

export default function Help() {
    return (
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
            <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Ubufasha</Text>
            <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Tubafashe gute?</Text>
            <View style={{ marginTop: 20 }}></View>
            <Button title="Nibagiwe PIN yanjye" backgroundColor="transparent" textColor="#3D576F" borderColor="#478CCA3D" fontSize={16} />
            <View style={{ marginTop: 10 }}></View>
            <Button title="Uko bakoresha iyi App" backgroundColor="transparent" textColor="#3D576F" borderColor="#478CCA3D" fontSize={16} />
            <View style={{ marginTop: 10 }}></View>
            <Button title="Uko binjira muri App" backgroundColor="transparent" textColor="#3D576F" borderColor="#478CCA3D" fontSize={16} />
            <View style={{ marginTop: 10 }}></View>
            <Button title="Uko biyandikisha kuri App" backgroundColor="transparent" textColor="#3D576F" borderColor="#478CCA3D" fontSize={16} />
            <View style={{ marginTop: 10 }}></View>
            <Button title="Ninde ugenewe iyi App" backgroundColor="transparent" textColor="#3D576F" borderColor="#478CCA3D" fontSize={16} />
            <StatusBar style="auto" />
        </View>
    )
}