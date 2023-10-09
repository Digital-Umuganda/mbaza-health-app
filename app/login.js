import { Image, Text, TextInput, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { storeData, url } from '../utilities';
import axios from 'axios';

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState();
    const [pin, setPin] = useState();

    const logIn = () => {
        const data = {
            username: phoneNumber,
            password: pin,
        }
        
        axios.post(`${url}/api/v1/auth/login`, data)
            .then(function (response) {
                console.log(response);
                storeData('access_token', response.data.access_token)
                    .then(() => storeData('phone_number', phoneNumber)
                        .then(() => router.push('/home')))
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
            <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Aho Kwinjirira</Text>
            <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Uzuzamo nimero yawe ya telefoni na PIN ubundi winjire.</Text>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20, marginTop: 60 }}>
                <Image source={require('../assets/phone.png')} style={{ height: 22, width: 14 }} />
                <TextInput
                    placeholder='Nimero ya Telefoni (078----)'
                    placeholderTextColor="#3D576F8E"
                    style={{ fontSize: 14, marginLeft: 10 }}
                    keyboardType='numeric'
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20 }}>
                <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                <TextInput
                    placeholder='PIN (- - - - -)'
                    placeholderTextColor="#3D576F8E"
                    style={{ fontSize: 14, marginLeft: 10 }}
                    keyboardType='numeric'
                    onChangeText={(text) => setPin(text)}
                />
            </View>
            <Button title="INJIRA" backgroundColor="#478CCA" textColor="white" onPress={() => logIn()} />
            <View style={{ marginTop: 20 }}></View>
            <Button title="UBUFASHA" backgroundColor="transparent" textColor="#3D576F" underlineText={true} onPress={() => router.push('/help')} />
            <View style={{ marginTop: 100 }}></View>
            <Button title="Subira Inyuma" backgroundColor="transparent" textColor="#3D576F" underlineText={true} onPress={() => router.back()} />
            <StatusBar style="auto" />
        </View>
    )
}