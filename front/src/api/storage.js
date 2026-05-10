import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@conectcar:token";

export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const loadToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);
