import { http } from "./http";
import type { User, UserRole } from "../types";

export interface CreateUserInput {
    nome: string;
    email: string;
    senhaHash: string;
    role?: UserRole;
    saldo?: number;
    telefone?: string;
    cpf?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
    uuid: string;
}

export const userService = {
    list: () => http.get<User[]>("/user"),
    get: (uuid: string) => http.get<User>(`/user/${uuid}`),
    create: ({ role = "CLIENTE", ...payload }: CreateUserInput) =>
        http.post<User>("/user/criar", payload, { params: { role: role.toLowerCase() } }),
    update: (payload: UpdateUserInput) => http.post<User>("/user/update", payload),
    remove: (uuid: string) => http.post<void>(`/user/delete/${uuid}`),
};
