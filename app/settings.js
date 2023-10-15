import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { fetchProfile, getData, getUserProfile, url } from '../utilities';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';

const checkSession = async () => {
    const accessToken = await getData('access_token');
    if (accessToken === null) {
        router.push('/login')
    }
}

export default function Settings() {
    const [district, setDistrict] = useState();
    const [names, setNames] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [oldPin, setOldPin] = useState();
    const [newPin, setnewPin] = useState();
    const [errorBag, setErrorBag] = useState({});
    const [profile, setProfile] = useState();

    const elligibleDistricts = ['MUSANZE', 'GICUMBI', 'NYANZA'];

    useEffect(() => {
        checkSession();
        setTheProfileUp();
    }, []);

    const setTheProfileUp = async () => {
        let profile = JSON.parse(await getUserProfile());

        if (profile == null) {
            profile = await fetchProfile();
        }

        setProfile(profile);
    }

    const updateUserCredentials = async () => {
        const accessToken = await getData('access_token');

        console.log({ accessToken })

        let profileBag = validateProfile();
        let pinBag = validatePin();

        if (pinBag.oldPin == true || profileBag.district == true || profileBag.names == true || pinBag.newPin == true) {
            setErrorBag({ ...profileBag, ...pinBag });
            console.log({ errorBag, bag: { profileBag, pinBag } })
            return;
        }

        setErrorBag({});

        const config = {
            updateProfile: {
                method: 'put',
                url: `${url}/api/v1/user/update-profile`,
                data: {
                    name: names,
                    address: district,
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            },
        }

        const requests = [axios(config.updateProfile)];

        if (oldPin != null && typeof (oldPin) == 'string' && oldPin.length > 0) {
            config.changePassword = {
                method: 'put',
                url: `${url}/api/v1/user/change-password`,
                data: {
                    oldPassword: oldPin,
                    newPassword: newPin
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }

            requests.push(axios(config.changePassword))
        }

        console.log({ requests })

        Promise.all([axios(config.updateProfile)])
            .then(function (results) {
                const profileResults = results[0];
                const pinResults = results[1];

                console.log({ profileResults, pinResults })
            })
            .catch(error => {
                console.warn({ error })
            })
    }

    const validateProfile = () => {
        const data = {
            name: names,
            address: district,
            oldPassword: oldPin,
            newPassword: newPin
        }

        let bag = {};

        if (data?.address == null || typeof (data.address) != "string") {
            bag.district = true;
        }

        if (data?.name == null || typeof (data.name) != "string" || data.name.length == 0) {
            bag.names = true;
        }

        return bag;
    }

    const validatePin = () => {
        const data = {
            oldPassword: oldPin,
            newPassword: newPin
        }

        let bag = {};

        if (data?.oldPassword != null && (typeof (data.oldPassword) != "string" || data.oldPassword.length < 5)) {
            bag.oldPin = true;
        }

        if (data?.newPassword != null && (typeof (data.newPassword) != "string" || data.newPassword.length < 5 || data.newPassword == data.oldPassword)) {
            bag.newPin = true;
        }

        return bag;
    }

    useEffect(() => {
        profile?.name != null && setNames(profile.name);
        profile?.phone_number != null && setPhoneNumber(profile.phone_number);
        profile?.address != null && setDistrict(profile.address);
    }, [profile])

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ width: 360, height: 118, backgroundColor: '#478CCA', flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 25, alignItems: 'center', gap: 10 }}>
                <View style={{maxWidth: "67%"}}>
                    <Text style={{ fontSize: 24, color: '#FFFFFF' }}>{profile?.name && profile.name}</Text>
                </View>
                <TouchableOpacity
                    style={{ width: 115, height: 42, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-around' }}
                    onPress={() => {
                        AsyncStorage.clear()
                            .then(() => router.replace('/login'))
                    }}
                >
                    <Image style={{ width: 12.36, height: 10.3 }} source={require('../assets/log-out-outline.png')} />
                    <Text style={{ fontSize: 12, color: '#FFFFFF', opacity: 1 }}>Gusohoka</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 30, paddingHorizontal: 25 }}>
                <Text style={{ color: '#3D576F', fontWeight: '600', fontSize: 14 }}>IMYIRONDORO YANJYE</Text>
                <View style={{ marginTop: 20, width: '100%', marginBottom: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/person.png')} style={{ height: 17, width: 17 }} />
                        <TextInput
                            placeholder='Amazina yanyu'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            onChangeText={(text) => setNames(text)}
                            value={names}
                        />
                    </View>
                    {errorBag.names == true && <Text style={{ color: 'red' }}>Uzuzamo amazina yawe.</Text>}
                </View>
                <View style={{ marginBottom: 10, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/phone.png')} style={{ height: 22, width: 14 }} />
                        <TextInput
                            placeholder='Nimero ya Telefoni (078----)'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setPhoneNumber(text)}
                            editable={false}
                            value={`+${phoneNumber}`}
                        />
                    </View>
                    {errorBag.phoneNumber == true && <Text style={{ color: 'red', textAlign: 'center' }}>Tangiza 07 kuri nimero. Igomba kuba igizwe n' imibare icumi.</Text>}
                </View>
                <View style={{ marginBottom: 20, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/location.png')} style={{ height: 20, width: 16 }} />
                        <SelectDropdown
                            data={elligibleDistricts}
                            onSelect={(selectedItem, index) => {
                                console.log({ selectedItem });
                                setDistrict(selectedItem);
                            }}
                            buttonStyle={{ justifyContent: 'center', alignItems: 'center' }}
                            defaultButtonText='Hitamo aho mutuye'
                            buttonTextStyle={{ color: "#3D576F" }}
                            defaultValue={district}
                        />
                    </View>
                    {errorBag.district == true && <Text style={{ color: 'red' }}>Hitamo akarere ukoreramo.</Text>}
                </View>
                <Text style={{ color: '#3D576F', fontWeight: '600', fontSize: 14 }}>GUHINDURA PIN YANJYE</Text>
                <View style={{ marginTop: 20, marginBottom: 10, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                        <TextInput
                            placeholder='PIN nari nsanganywe'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setOldPin(text)}
                            secureTextEntry={true}
                        />
                    </View>
                    {errorBag.oldPin == true && <Text style={{ color: 'red', textAlign: 'center' }}>PIN wari usanganywe igomba kuba igizwe n' imibare itari munsi y' itanu.</Text>}
                </View>
                <View style={{ marginBottom: 20, width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                        <TextInput
                            placeholder='PIN nshya'
                            placeholderTextColor="#3D576F8E"
                            style={{ fontSize: 14, marginLeft: 10 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setnewPin(text)}
                            secureTextEntry={true}
                        />
                    </View>
                    {errorBag.newPin == true && <Text style={{ color: 'red', textAlign: 'center' }}>PIN nshya igomba kuba igizwe n' imibare itari munsi y' itanu kandi idasa na PIN wakoresheje.</Text>}
                </View>
                <Button onPress={() => updateUserCredentials()} title="EMEZA" backgroundColor="#478CCA" textColor="white" />
                <View style={{ marginBottom: 20 }}></View>
            </View>
            <StatusBar style="light" />
        </ScrollView>
    )
}
