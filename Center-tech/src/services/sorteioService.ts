import { http } from "./http";
import type { Sorteio, SorteioStatus } from "../types";

export interface CreateSorteioInput {
    titulo: string;
    descricao: string;
    dataAgendada?: string;
    dataEncerramento?: string;
    status: SorteioStatus;
    precoBilhete: number;
    qtdTotalBilhetes: number;
    qtdVendidos?: number;
    itemUuid?: string;
}

export interface UpdateSorteioInput extends Partial<CreateSorteioInput> {
    uuid: string;
    vencedorUuid?: string | null;
}

export const sorteioService = {
    list: () => http.get<Sorteio[]>("/sorteio"),
    get: (uuid: string) => http.get<Sorteio>(`/sorteio/${uuid}`),
    create: ({ itemUuid, ...rest }: CreateSorteioInput) =>
        http.post<Sorteio>("/sorteio/criar", {
            ...rest,
            item: itemUuid ? { uuid: itemUuid } : undefined,
        }),
    update: ({ uuid, itemUuid, vencedorUuid, ...rest }: UpdateSorteioInput) =>
        http.post<Sorteio>("/sorteio/update", {
            uuid,
            ...rest,
            item: itemUuid ? { uuid: itemUuid } : undefined,
            vencedor: vencedorUuid ? { uuid: vencedorUuid } : undefined,
        }),
    remove: (uuid: string) => http.post<void>(`/sorteio/delete/${uuid}`),
};
