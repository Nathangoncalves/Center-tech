import { http } from "./http";
import type { Bilhete } from "../types";

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
    list: () => http.get<Bilhete[]>("/bilhete"),
    get: (uuid: string) => http.get<Bilhete>(`/bilhete/${uuid}`),
    create: ({ userUuid, sorteioUuid, ...payload }: CreateTicketInput) =>
        http.post<Bilhete>("/bilhete/criar", {
            ...payload,
            user: { uuid: userUuid },
            sorteio: { uuid: sorteioUuid },
        }),
    update: ({ uuid, userUuid, sorteioUuid, ...payload }: UpdateTicketInput) =>
        http.post<Bilhete>("/bilhete/update", {
            uuid,
            ...payload,
            user: userUuid ? { uuid: userUuid } : undefined,
            sorteio: sorteioUuid ? { uuid: sorteioUuid } : undefined,
        }),
    remove: (uuid: string) => http.post<void>(`/bilhete/delete/${uuid}`),
};
