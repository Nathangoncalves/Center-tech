import { http } from "./http";
import type { Identifier, Sorteio, SorteioStatus } from "@/types";

export interface CreateSorteioInput {
    titulo: string;
    descricao: string;
    dataAgendada?: string;
    dataEncerramento?: string;
    status: SorteioStatus;
    precoBilhete: number;
    qtdTotalBilhetes: number;
    qtdVendidos?: number;
    itemId?: Identifier;
}

export interface UpdateSorteioInput extends Partial<CreateSorteioInput> {
    id: Identifier;
    vencedorId?: Identifier | null;
}

export const sorteioService = {
    listPublic: () => http.get<Sorteio[]>("/sorteio/public"),
    list: () => http.get<Sorteio[]>("/sorteio"),
    get: (id: Identifier) => http.get<Sorteio>(`/sorteio/${id}`),
    create: ({ itemId, ...rest }: CreateSorteioInput) =>
        http.post<Sorteio>("/sorteio/criar", {
            ...rest,
            item: itemId ? { id: itemId } : undefined,
        }),
    update: ({ id, itemId, vencedorId, ...rest }: UpdateSorteioInput) =>
        http.post<Sorteio>("/sorteio/update", {
            id,
            ...rest,
            item: itemId ? { id: itemId } : undefined,
            vencedor: vencedorId ? { id: vencedorId } : undefined,
        }),
    remove: (id: Identifier) => http.post<void>(`/sorteio/delete/${id}`),
};
