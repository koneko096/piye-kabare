import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Enhanced AsyncStorage wrapper with JSON parsing and error handling.
 */
const storage = {
    get: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error(`Storage Error (get ${key}):`, e);
            return null;
        }
    },
    set: async (key, value) => {
        try {
            const stringValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, stringValue);
            return true;
        } catch (e) {
            console.error(`Storage Error (set ${key}):`, e);
            return false;
        }
    },
    remove: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`Storage Error (remove ${key}):`, e);
            return false;
        }
    },
};

export default storage;
