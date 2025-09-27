// Cross-platform lightweight storage wrapper
// Priority: AsyncStorage (if available) -> web localStorage -> in-memory

let AsyncStorage = null;
try {
  // Lazy require; will fail gracefully if not installed
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const memory = {};

export async function getItem(key) {
  try {
    if (AsyncStorage) {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    }
  } catch (e) {
    // ignore
  }
  return key in memory ? memory[key] : null;
}

export async function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, serialized);
      return;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
      return;
    }
  } catch (e) {
    // ignore
  }
  memory[key] = value;
}

export default { getItem, setItem };

