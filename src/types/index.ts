export type ThemeMode = "light" | "dark";

export type Identifier = string;

export const UserRole = {
    ADMIN: "ADMIN",
    CLIENTE: "CLIENTE",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
<<<<<<< HEAD

=======
export interface Ticket {
    numero: number;
    nome?: string;
    nomeSorteio?: string;
    dataCompra: string;
    pago: boolean;
    user?: User | null;
    sorteio?: Sorteio | null;
}
>>>>>>> main
export const SorteioStatus = {
    AGENDADO: "AGENDADO",
    ABERTO: "ABERTO",
    ENCERRADO: "ENCERRADO",
    FINALIZADO: "FINALIZADO",
} as const;
export type SorteioStatus = typeof SorteioStatus[keyof typeof SorteioStatus];

export const TipoTransacao = {
    ENTRADA: "ENTRADA",
    SAIDA: "SAIDA",
} as const;
export type TipoTransacao = typeof TipoTransacao[keyof typeof TipoTransacao];

export const MetodoPagamento = {
    PIX: "PIX",
    CARTAO: "CARTAO",
    SALDO: "SALDO",
} as const;
export type MetodoPagamento = typeof MetodoPagamento[keyof typeof MetodoPagamento];

export const TipoMidia = {
    BANNER: "BANNER",
    GALERIA: "GALERIA",
    VIDEO: "VIDEO",
} as const;
export type TipoMidia = typeof TipoMidia[keyof typeof TipoMidia];

export interface BaseEntity {
<<<<<<< HEAD
    id: Identifier;
=======
    uuid: Identifier;
>>>>>>> main
    createdAt?: string;
    updatedAt?: string;
}

export interface User extends BaseEntity {
    nome: string;
    email: string;
    senhaHash?: string;
    role: UserRole;
    saldo: number;
    telefone?: string;
    cpf?: string;
}

export interface Item extends BaseEntity {
    nome: string;
    descricao: string;
<<<<<<< HEAD
    imagemUrl: string;
    valorEstimado: number;
=======
    valor: number;
    imageUrl: string;
>>>>>>> main
}

export interface Midia extends BaseEntity {
    url: string;
    tipo: TipoMidia;
<<<<<<< HEAD
}

export interface SorteioSummary extends BaseEntity {
    titulo: string;
    status: SorteioStatus;
    precoBilhete: number;
    qtdTotalBilhetes: number;
    qtdVendidos: number;
=======
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
>>>>>>> main
}

export interface Sorteio extends BaseEntity {
    titulo: string;
    descricao: string;
    dataAgendada?: string;
    dataEncerramento?: string;
    status: SorteioStatus;
    precoBilhete: number;
    qtdTotalBilhetes: number;
    qtdVendidos: number;
    item?: Item | null;
    midias?: Midia[];
<<<<<<< HEAD
    vencedor?: Pick<User, "id" | "nome" | "email"> | null;
=======
    vencedor?: Pick<User, "uuid" | "nome" | "email"> | null;
>>>>>>> main
    bilhetes?: Bilhete[];
}

export interface Bilhete extends BaseEntity {
    numero: number;
    dataCompra: string;
    pago: boolean;
<<<<<<< HEAD
    user?: Pick<User, "id" | "nome" | "email">;
    sorteio?: SorteioSummary;
=======
    nome?: string;
    nomeSorteio?: string;
    user?: Pick<User, "uuid" | "nome" | "email">;
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
>>>>>>> main
}

export interface Transacao extends BaseEntity {
    tipo: TipoTransacao;
    valor: number;
    metodoPagamento: MetodoPagamento;
    referencia?: string;
    data: string;
<<<<<<< HEAD
    user?: Pick<User, "id" | "nome" | "email">;
    sorteio?: Pick<Sorteio, "id" | "titulo">;
    bilhete?: Pick<Bilhete, "id" | "numero">;
=======
    user?: Pick<User, "uuid" | "nome" | "email">;
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
    bilhete?: Pick<Bilhete, "uuid" | "numero">;
>>>>>>> main
}

export interface DashboardResumo {
    totalUsuarios: number;
    totalSorteios: number;
    totalBilhetes: number;
    totalTransacoes: number;
    faturamentoBruto: number;
}
<<<<<<< HEAD
=======

export interface SignupPayload {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    aceitouTermos: boolean;
}
>>>>>>> main
