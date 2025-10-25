import { http } from "./http";
import type { Bilhete, Identifier } from "@/types";

export interface TicketFilter {
    userId?: Identifier;
    sorteioId?: Identifier;
    pago?: boolean;
}

export interface CreateTicketInput {
    numero: number;
    userId: Identifier;
    sorteioId: Identifier;
    dataCompra: string;
    pago?: boolean;
}

export interface UpdateTicketInput {
    id: Identifier;
    numero?: number;
    userId?: Identifier;
    sorteioId?: Identifier;
    dataCompra?: string;
    pago?: boolean;
}

export const ticketService = {
    list: (filter?: TicketFilter) => http.get<Bilhete[]>("/bilhete", { params: filter }),
    mine: () => http.get<Bilhete[]>("/bilhete/me"),
    get: (id: Identifier) => http.get<Bilhete>(`/bilhete/${id}`),
    create: ({ userId, sorteioId, ...payload }: CreateTicketInput) =>
        http.post<Bilhete>("/bilhete/criar", {
            ...payload,
            user: { id: userId },
            sorteio: { id: sorteioId },
        }),
    update: ({ id, userId, sorteioId, ...payload }: UpdateTicketInput) =>
        http.post<Bilhete>("/bilhete/update", {
            id,
            ...payload,
            user: userId ? { id: userId } : undefined,
            sorteio: sorteioId ? { id: sorteioId } : undefined,
        }),
    remove: (id: Identifier) => http.post<void>(`/bilhete/delete/${id}`),
};
