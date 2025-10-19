import axios from "axios";

const rawBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;

const TOKEN_STORAGE_KEY = "ng-auth-token";

let inMemoryToken: string | null = null;

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

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
    if (persist) {
        try {
            if (token) {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
        } catch {
            /* storage indisponível */
        }
    }
}

export function getAuthToken(): string | null {
    return inMemoryToken ?? getStoredToken();
}

function getStoredToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}
