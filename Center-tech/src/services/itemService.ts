import { http } from "./http";
import type { Item } from "../types";

export interface CreateItemInput {
    nome: string;
    descricao: string;
    valor: number;
    imageUrl: string;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
    uuid: string;
}

export const itemService = {
    list: () => http.get<Item[]>("/item"),
    get: (uuid: string) => http.get<Item>(`/item/${uuid}`),
    create: (payload: CreateItemInput) => http.post<Item>("/item/criar", payload),
    update: ({ uuid, ...payload }: UpdateItemInput) => http.post<Item>("/item/update", { uuid, ...payload }),
    remove: (uuid: string) => http.post<void>(`/item/delete/${uuid}`),
};
