import { http } from "./http";
import type { Identifier, MetodoPagamento, TipoTransacao, Transacao } from "@/types";

export interface TransactionFilter {
    userId?: Identifier;
    sorteioId?: Identifier;
    tipo?: TipoTransacao;
}

export interface CreateTransactionInput {
    userId: Identifier;
    tipo: TipoTransacao;
    valor: number;
    metodoPagamento: MetodoPagamento;
    referencia?: string;
    sorteioId?: Identifier;
    bilheteId?: Identifier;
    data?: string;
}

export const transactionService = {
    list: (filter?: TransactionFilter) => http.get<Transacao[]>("/transacao", { params: filter }),
    get: (id: Identifier) => http.get<Transacao>(`/transacao/${id}`),
    create: ({ userId, sorteioId, bilheteId, ...payload }: CreateTransactionInput) =>
        http.post<Transacao>("/transacao/criar", {
            ...payload,
            user: { id: userId },
            sorteio: sorteioId ? { id: sorteioId } : undefined,
            bilhete: bilheteId ? { id: bilheteId } : undefined,
        }),
    remove: (id: Identifier) => http.post<void>(`/transacao/delete/${id}`),
};
