type AnyObj = Record<string, any>;
const g = globalThis as any;

if (!g.__YONI_STORE__) {
  g.__YONI_STORE__ = {
    users: new Map<string, AnyObj>(),
    photos: [],
    reports: [],
    settings: { memorialMode: false, language: "en" },
  };
}

export const store = g.__YONI_STORE__;

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36)}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}