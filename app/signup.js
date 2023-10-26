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
    const [isLoading, setIsLoading] = useState(false);
    const [district, setDistrict] = useState();
    const [names, setNames] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [pin, setPin] = useState();
    const [errorBag, setErrorBag] = useState({});

    const signUp = () => {
        let bag = validate();

        if (
            bag.phoneNumber == true ||
            bag.pin == true ||
            bag.district == true ||
            bag.names == true
        ) {
            setErrorBag(bag);
            return;
        }

        setErrorBag({});

        const data = {
            name: names,
            phone_number: phoneNumber,
            address: district,
            password: pin,
        };

        if (data.phone_number.startsWith("0")) {
            data.phone_number = `25${data.phone_number}`;
        } else if (data.phone_number.startsWith("7")) {
            data.phone_number = `250${data.phone_number}`;
        }

        setIsLoading(true);
        axios
            .post(`${url}/api/v1/auth/signup`, data)
            .then(function (response) {
                console.log(response);
                sendVerificationCode();
            })
            .catch(function (error) {
                const message = error?.response?.data?.message || error?.message;
                Toast.show({
                    type: "error",
                    text1: "Signup Failed",
                    text2: message,
                    position: "bottom",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const sendVerificationCode = () => {
        let phone = phoneNumber;
        if (phone.startsWith("0")) {
            phone = `25${phone}`;
        } else if (phone.startsWith("7")) {
            phone = `250${phone}`;
        }

        const config = {
            method: "post",
            url: `${url}/api/v1/auth/send-code/${phone}`,
            params: {
                field: "phone",
            },
        };

        console.log({ config });
        axios(config)
            .then(function (response) {
                // console.log(response);
                storeData("phone_number", phone).then(() => router.push("/verify"));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const validate = () => {
        const data = {
            name: names,
            phone_number: phoneNumber,
            address: district,
            password: pin,
        };

        let bag = {};

        if (
            data?.phone_number == null ||
            (typeof data.phone_number != "string" &&
                !(
                    data.phone_number.startsWith("0") || data.phone_number.startsWith("7")
                ) &&
                data.phone_number.length != 10)
        ) {
            bag.phoneNumber = true;
        }

        if (
            data?.password == null ||
            typeof data.password != "string" ||
            data.password.length < 5
        ) {
            bag.pin = true;
        }

        if (data?.address == null || typeof data.address != "string") {
            bag.district = true;
        }

        if (
            data?.name == null ||
            typeof data.name != "string" ||
            data.name.length == 0
        ) {
            bag.names = true;
        }

        return bag;
    };

    return (
        <KeyboardAwareScrollView>
            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
                <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Kwiyandikisha</Text>
                <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Duhe amakuru akurikira maze ubashe kwiyandikisha.</Text>
                <View style={{ marginBottom: 20, marginTop: 60, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/person.png')} style={{ height: 17, width: 17 }} />
                        <TextInput
                            placeholder='Amazina yanyu'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            onChangeText={(text) => setNames(text)}
                        />
                    </View>
                    {errorBag.names == true && <Text style={{ color: 'red' }}>Uzuzamo amazina yawe.</Text>}
                </View>
                <View style={{ marginBottom: 20, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/phone.png')} style={{ height: 22, width: 14 }} />
                        <TextInput
                            placeholder='Nimero ya Telefoni (078----)'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                    </View>
                    {errorBag.phoneNumber == true && <Text style={{ color: 'red', textAlign: 'center' }}>Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.</Text>}
                </View>
                <View style={{ marginBottom: 20, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center' }}>
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
                    {errorBag.district == true && <Text style={{ color: 'red' }}>Hitamo akarere ukoreramo.</Text>}
                </View>
                <View style={{ marginBottom: 20, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                        <TextInput
                            placeholder='PIN uzajya winjiriraho'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setPin(text)}
                            secureTextEntry={true}
                        />
                    </View>
                    {errorBag.pin == true && <Text style={{ color: 'red', textAlign: 'center' }}>PIN igomba kuba igizwe n' imibare itari munsi y' itanu</Text>}
                </View>
                <Button onPress={() => signUp()} title="EMEZA" backgroundColor="#478CCA" textColor="white" />
                <View style={{ marginTop: 40 }}></View>
                <Button title="Subira Inyuma" backgroundColor="transparent" textColor="#3D576F" underlineText={true} onPress={() => router.back()} />
                <StatusBar style="light" />
            </View>
        </KeyboardAwareScrollView>
    )
}
