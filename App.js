import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TailwindProvider, useTailwind } from 'tailwind-rn';
import utilities from './tailwind.json';
import Button from './Button';

export default function App() {
  const tailwind = useTailwind();
  return (
    <TailwindProvider utilities={utilities}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <Button title="INJIRA" backgroundColor="#478CCA" textColor="white" />
        <View style={{marginTop: 20}}></View>
        <Button title="IYANDIKISHE" backgroundColor="#478CCA3D" textColor="#3D576F" />
        <StatusBar style="auto" />
      </View>
    </TailwindProvider>
  )
}
