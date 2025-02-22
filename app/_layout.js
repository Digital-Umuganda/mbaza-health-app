import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='signup' options={{ headerShown: false }} />
            <Stack.Screen name='forgot-pin' options={{ headerShown: false }} />
            <Stack.Screen name='verify-code' options={{ headerShown: false }} />
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
                headerTitle: "RBC | MBAZA"
            }} />
            <Stack.Screen name='help-detail' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18
                },
                headerTitle: "RBC | MBAZA"
            }} />
            <Stack.Screen name='home' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18,
                },
                headerTitle: "RBC | MBAZA",
                headerBackVisible: false
            }} />
            <Stack.Screen name='chat' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18,
                },
                headerTitle: "RBC | MBAZA"
            }} />
            <Stack.Screen name='verify' options={{ headerShown: false }} />
            <Stack.Screen name='settings' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18,
                },
                headerTitle: "Konti yanjye"
            }} />
            <Stack.Screen name='custom-chat' options={{
                headerStyle: {
                    backgroundColor: '#478CCA',
                },
                headerTintColor: '#F7BB3A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18,
                },
                headerTitle: "RBC | MBAZA"
            }} />
        </Stack>
    );
}