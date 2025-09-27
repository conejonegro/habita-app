// Simple in-memory store for ephemeral data across screens
const store = {};
const listeners = new Set();

export function setItem(key, value) {
  store[key] = value;
  listeners.forEach((cb) => {
    try { cb(key, value); } catch {}
  });
}

export function getItem(key) {
  return store[key];
}

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export default { setItem, getItem, subscribe };

