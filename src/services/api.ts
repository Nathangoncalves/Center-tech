import axios from "axios";

<<<<<<< HEAD
const rawBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";
=======
const rawBaseUrl = ("http://localhost:8081");
>>>>>>> main
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;

const TOKEN_STORAGE_KEY = "ng-auth-token";
<<<<<<< HEAD
export const AUTH_TOKEN_CHANGED_EVENT = "ng-auth-token-changed";

let inMemoryToken: string | null = null;

export const api = axios.create({
=======

let inMemoryToken: string | null = null;

const api = axios.create({
>>>>>>> main
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
<<<<<<< HEAD
});

=======
    withCredentials: true,
});

function applyAuthHeader(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

>>>>>>> main
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
<<<<<<< HEAD
=======
    applyAuthHeader(token);
>>>>>>> main
    if (persist) {
        try {
            if (token) {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
        } catch {
<<<<<<< HEAD
            /* storage indisponível */
        }
    }
    try {
        window.dispatchEvent(new CustomEvent(AUTH_TOKEN_CHANGED_EVENT, { detail: { token } }));
    } catch {
        /* ambiente sem window */
=======
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
>>>>>>> main
    }
}

export function getAuthToken(): string | null {
    return inMemoryToken ?? getStoredToken();
}

<<<<<<< HEAD
=======
export function clearAuthToken() {
    setAuthToken(null);
}

>>>>>>> main
function getStoredToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}
<<<<<<< HEAD
=======

const storedToken = getStoredToken();
if (storedToken) {
    inMemoryToken = storedToken;
    applyAuthHeader(storedToken);
}

export default api;
>>>>>>> main
