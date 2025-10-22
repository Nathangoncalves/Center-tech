import axios from "axios";

const rawBaseUrl = ("http://localhost:8081");
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;

const TOKEN_STORAGE_KEY = "ng-auth-token";

let inMemoryToken: string | null = null;

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

function applyAuthHeader(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

api.interceptors.request.use((config) => {
    const token = inMemoryToken ?? getStoredToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            setAuthToken(null);
        }
        return Promise.reject(error);
    },
);

export function setAuthToken(token: string | null, persist = true) {
    inMemoryToken = token;
    applyAuthHeader(token);
    if (persist) {
        try {
            if (token) {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
        } catch {
            // Ignore storage errors (e.g., private mode)
        }
    }
    try {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("auth:changed", {
                    detail: { token },
                }),
            );
        }
    } catch {
        // Ignore dispatch errors (e.g., during SSR)
    }
}

export function getAuthToken(): string | null {
    return inMemoryToken ?? getStoredToken();
}

export function clearAuthToken() {
    setAuthToken(null);
}

function getStoredToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}

const storedToken = getStoredToken();
if (storedToken) {
    inMemoryToken = storedToken;
    applyAuthHeader(storedToken);
}

export default api;
