import { Image, Text, TextInput, View } from 'react-native';
import Button from '../Button';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown'

export default function Signup() {
    const [selectedDistrict, setSelectedDistrict] = useState();
    return (
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 40 }}>
            <Text style={{ color: '#478CCA', fontSize: 36, marginTop: 100 }}>Kwiyandikisha</Text>
            <Text style={{ color: '#3D576F', fontSize: 20, marginTop: 10, textAlign: 'center' }}>Duhe amakuru akurikira maze ubashe kwiyandikisha.</Text>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20, marginTop: 60 }}>
                <Image source={require('../assets/person.png')} style={{ height: 17, width: 17 }} />
                <TextInput placeholder='Amazina yanyu' placeholderTextColor="#3D576F8E" style={{ fontSize: 14, marginLeft: 10 }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20 }}>
                <Image source={require('../assets/phone.png')} style={{ height: 22, width: 14 }} />
                <TextInput placeholder='Nimero ya Telefoni (078----)' placeholderTextColor="#3D576F8E" style={{ fontSize: 14, marginLeft: 10 }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', marginBottom: 20 }}>
                <Image source={require('../assets/location.png')} style={{ height: 20, width: 16 }} />
                <SelectDropdown
                    data={['Musanze', 'Gicumbi', 'Nyanza']}
                    onSelect={(selectedItem, index) => {
                        setSelectedDistrict(selectedItem);
                    }}
                    buttonStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    defaultButtonText='Hitamo aho mutuye'
                    buttonTextStyle={{ color: "#3D576F" }}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 1, width: '100%', borderRadius: 8, borderColor: '#478CCA3D', padding: 15, alignItems: 'center', marginBottom: 20 }}>
                <Image source={require('../assets/key-line.png')} style={{ height: 17, width: 18 }} />
                <TextInput placeholder='PIN uzajya winjiriraho' placeholderTextColor="#3D576F8E" style={{ fontSize: 14, marginLeft: 10 }} />
            </View>
            <Button title="EMEZA" backgroundColor="#478CCA" textColor="white" />
            <View style={{ marginTop: 40 }}></View>
            <Button title="Subira Inyuma" backgroundColor="transparent" textColor="#3D576F" underlineText={true} />
            <StatusBar style="auto" />
        </View>
    )
}