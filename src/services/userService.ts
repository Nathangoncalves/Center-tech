import { http } from "./http";
import type { Identifier, User, UserRole } from "@/types";

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
    id: Identifier;
}

export const userService = {
    list: () => http.get<User[]>("/user"),
    me: () => http.get<User>("/user/me"),
    get: (id: Identifier) => http.get<User>(`/user/${id}`),
    create: ({ role = "CLIENTE", ...payload }: CreateUserInput) =>
        http.post<User>("/user/criar", payload, { params: { role: role.toLowerCase() } }),
    update: ({ id, ...payload }: UpdateUserInput) =>
        http.post<User>("/user/update", { id, ...payload }),
    remove: (id: Identifier) => http.post<void>(`/user/delete/${id}`),
};
