import api, { setAuthToken } from "./api";

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const authService = {
    async login({ email, password }: LoginInput) {
        const { data } = await api.post<LoginResponse>("/main/login", {
            email,
            password,
        });
        setAuthToken(data.token ?? null);
        return data;
    },
    logout() {
        setAuthToken(null);
    },
};
