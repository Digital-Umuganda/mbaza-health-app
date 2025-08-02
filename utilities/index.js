import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

export const url = "https://backend-api.umuganda.digital";

export const onLogout = async () => {
  await AsyncStorage.clear();
  router.replace("login");
}

const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// intercept requests and add token to the header
instance.interceptors.request.use(async (config) => {
  const accessToken = await getData("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// intercept to logout user if token is expired
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await onLogout();
    }
    return Promise.reject(error);
  }
);


export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error - log removed for production
    }
};

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        // error reading value - log removed for production
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
        // Profile fetch error - log removed for production
    }
}

export const getUserProfile = async () => {
    return getData('profile');
}

export default instance;
