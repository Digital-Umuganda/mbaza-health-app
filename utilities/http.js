import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData, url } from ".";
import { router } from "expo-router";

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
    if (error.response.status === 401) {
      await AsyncStorage.clear();
      router.replace("login");
    }
    return Promise.reject(error);
  }
);

export default instance;
