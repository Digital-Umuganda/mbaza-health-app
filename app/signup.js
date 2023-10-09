import { Image, KeyboardAvoidingView, SafeAreaView, Text, TextInput, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { storeData, url } from '../utilities';

export default function Signup() {
    const [district, setDistrict] = useState();
    const [names, setNames] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [pin, setPin] = useState();

    const signUp = () => {
        const data = {
            name: names,
            phone_number: phoneNumber,
            address: district,
            password: pin,
            email: "elvisrugero@gmail.com"
        }
        console.log({ data });
        axios.post(`${url}/api/v1/auth/signup`, data)
            .then(function (response) {
                console.log(response);
                sendVerificationCode()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const sendVerificationCode = () => {
        axios({
            method: 'post',
            url: `${url}/api/v1/auth/send-code/${phoneNumber}`,
            params: {
                field: 'phone'
            }
        })
            .then(function (response) {
                // console.log(response);
                storeData('phone_number', phoneNumber)
                    .then(() => router.push('/verify'))
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <KeyboardAwareScrollView>
            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
                <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Kwiyandikisha</Text>
                <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Duhe amakuru akurikira maze ubashe kwiyandikisha.</Text>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20, marginTop: 60 }}>
                    <Image source={require('../assets/person.png')} style={{ height: 17, width: 17 }} />
                    <TextInput
                        placeholder='Amazina yanyu'
                        placeholderTextColor="#3D576F8E"
                        style={{ fontSize: 14, marginLeft: 10 }}
                        onChangeText={(text) => setNames(text)}
                    />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20 }}>
                    <Image source={require('../assets/phone.png')} style={{ height: 22, width: 14 }} />
                    <TextInput
                        placeholder='Nimero ya Telefoni (078----)'
                        placeholderTextColor="#3D576F8E"
                        style={{ fontSize: 14, marginLeft: 10 }}
                        keyboardType='numeric'
                        onChangeText={(text) => setPhoneNumber(text)}
                    />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', marginBottom: 20 }}>
                    <Image source={require('../assets/location.png')} style={{ height: 20, width: 16 }} />
                    <SelectDropdown
                        data={['MUSANZE', 'GICUMBI', 'NYANZA']}
                        onSelect={(selectedItem, index) => {
                            console.log({ selectedItem });
                            setDistrict(selectedItem);
                        }}
                        buttonStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        defaultButtonText='Hitamo aho mutuye'
                        buttonTextStyle={{ color: "#3D576F" }}
                    />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20 }}>
                    <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                    <TextInput
                        placeholder='PIN uzajya winjiriraho'
                        placeholderTextColor="#3D576F8E"
                        style={{ fontSize: 14, marginLeft: 10 }}
                        keyboardType='numeric'
                        onChangeText={(text) => setPin(text)}
                    />
                </View>
                <Button onPress={() => signUp()} title="EMEZA" backgroundColor="#478CCA" textColor="white" />
                <View style={{ marginTop: 40 }}></View>
                <Button title="Subira Inyuma" backgroundColor="transparent" textColor="#3D576F" underlineText={true} onPress={() => router.back()} />
                <StatusBar style="auto" />
            </View>
        </KeyboardAwareScrollView>
    )
}