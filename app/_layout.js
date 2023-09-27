import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='signup' options={{ headerShown: false }} />
            <Stack.Screen name='help' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18
                },
                headerTitle: "RBC | BAZA"
            }} />
        </Stack>
    );
}