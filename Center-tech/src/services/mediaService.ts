import { http } from "./http";
import type { Midia, TipoMidia } from "../types";

export interface CreateMediaInput {
    url: string;
    tipo: TipoMidia;
    sorteioUuid?: string;
}

export interface UpdateMediaInput extends Partial<CreateMediaInput> {
    uuid: string;
}

export const mediaService = {
    list: () => http.get<Midia[]>("/midia"),
    get: (uuid: string) => http.get<Midia>(`/midia/${uuid}`),
    create: ({ sorteioUuid, ...payload }: CreateMediaInput) =>
        http.post<Midia>("/midia/criar", {
            ...payload,
            sorteio: sorteioUuid ? { uuid: sorteioUuid } : undefined,
        }),
    update: ({ uuid, sorteioUuid, ...payload }: UpdateMediaInput) =>
        http.post<Midia>("/midia/update", {
            uuid,
            ...payload,
            sorteio: sorteioUuid ? { uuid: sorteioUuid } : undefined,
        }),
    remove: (uuid: string) => http.post<void>(`/midia/delete/${uuid}`),
};
