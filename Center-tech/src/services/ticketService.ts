import { http } from "./http";
import type { Ticket } from "../types";

export interface CreateTicketInput {
    numero: number;
    userUuid: string;
    sorteioUuid: string;
    dataCompra: string;
    pago?: boolean;
}

export interface UpdateTicketInput {
    uuid: string;
    numero?: number;
    userUuid?: string;
    sorteioUuid?: string;
    dataCompra?: string;
    pago?: boolean;
}

export const ticketService = {
    list: () => http.get<Ticket[]>("/bilhete"),
    get: (uuid: string) => http.get<Ticket>(`/bilhete/${uuid}`),
    create: ({ userUuid, sorteioUuid, ...payload }: CreateTicketInput) =>
        http.post<Ticket>("/bilhete/criar", {
            ...payload,
            user: { uuid: userUuid },
            sorteio: { uuid: sorteioUuid },
        }),
    update: ({ uuid, userUuid, sorteioUuid, ...payload }: UpdateTicketInput) =>
        http.post<Ticket>("/bilhete/update", {
            uuid,
            ...payload,
            user: userUuid ? { uuid: userUuid } : undefined,
            sorteio: sorteioUuid ? { uuid: sorteioUuid } : undefined,
        }),
    remove: (uuid: string) => http.post<void>(`/bilhete/delete/${uuid}`),
};
