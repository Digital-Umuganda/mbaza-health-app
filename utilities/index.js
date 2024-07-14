import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "./http";

export const url = "https://backend-api.umuganda.digital";
// export const url = "https://bec7-102-22-146-226.ngrok-free.app"

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
        console.warn({ origin: 'AsyncStorage', error: e })
    }
};

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        // error reading value
        console.warn({ origin: 'AsyncStorage', error: e })
    }
};

export const fetchProfile = async () => {
    const accessToken = await getData('access_token');

    try {
        const response = await instance({
            method: 'get',
            url: `${url}/api/v1/user/profile`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        storeData('profile', JSON.stringify(response.data))
        return response.data;
    } catch (error) {
        console.warn({ error })
    }
}

export const getUserProfile = async () => {
    return getData('profile');
}