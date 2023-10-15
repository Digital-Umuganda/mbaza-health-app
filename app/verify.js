import { Image, Text, TextInput, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData, storeData, url } from '../utilities';
import axios from 'axios';

export default function Verify() {
    const [otp, setOTP] = useState();

    const verifyOTP = async () => {
        const phoneNumber = await getData('phone_number');
        
        axios({
            method: 'post',
            url: `${url}/api/v1/auth/verify-user/${phoneNumber}/code/${otp}`,
            params: {
                field: 'phone'
            }
        })
            .then(function (response) {
                console.log(response);
                storeData('access_token', response.data.access_token)
                    .then(() => router.push('/home'));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    return (
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
            <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Umubarebanga</Text>
            <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Uzuzamo umubarebanga wohererejwe mu butumwa bugufi.</Text>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20, marginTop: 60 }}>
                <Image source={require('../assets/key-line.png')} style={{ height: 22, width: 20 }} />
                <TextInput
                    placeholder='OTP'
                    placeholderTextColor="#3D576F8E"
                    style={{ fontSize: 14, marginLeft: 10 }}
                    keyboardType='numeric'
                    onChangeText={(text) => setOTP(text)}
                />
            </View>
            <Button title="OHEREZA" backgroundColor="#478CCA" textColor="white" onPress={() => verifyOTP()} />
            <View style={{ marginTop: 100 }}></View>
            <Button title="Subira Inyuma" backgroundColor="transparent" textColor="#3D576F" underlineText={true} onPress={() => router.back()} />
            <StatusBar style="light" />
        </View>
    )
}