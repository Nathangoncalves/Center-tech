import { http } from "./http";
import type { Transacao, TipoTransacao, MetodoPagamento } from "../types";

export interface TransactionFilter {
    userUuid?: string;
    sorteioUuid?: string;
    tipo?: TipoTransacao;
}

export interface CreateTransactionInput {
    userUuid: string;
    tipo: TipoTransacao;
    valor: number;
    metodoPagamento: MetodoPagamento;
    referencia?: string;
    sorteioUuid?: string;
    bilheteUuid?: string;
    data?: string;
}

export const transactionService = {
    list: (filter?: TransactionFilter) => http.get<Transacao[]>("/transacao", { params: filter }),
    get: (uuid: string) => http.get<Transacao>(`/transacao/${uuid}`),
    create: ({ userUuid, sorteioUuid, bilheteUuid, ...payload }: CreateTransactionInput) =>
        http.post<Transacao>("/transacao/criar", {
            ...payload,
            user: { uuid: userUuid },
            sorteio: sorteioUuid ? { uuid: sorteioUuid } : undefined,
            bilhete: bilheteUuid ? { uuid: bilheteUuid } : undefined,
        }),
    remove: (uuid: string) => http.post<void>(`/transacao/delete/${uuid}`),
};
