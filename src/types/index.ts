export type ThemeMode = "light" | "dark";

export type Identifier = string;

export const UserRole = {
    ADMIN: "ADMIN",
    CLIENTE: "CLIENTE",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
export interface Ticket {
    numero: number;
    nome?: string;
    nomeSorteio?: string;
    dataCompra: string;
    pago: boolean;
    user?: User | null;
    sorteio?: Sorteio | null;
}
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
    uuid: Identifier;
    createdAt?: string;
    updatedAt?: string;
}

export interface User extends BaseEntity {
    nome: string;
    email: string;
    senhaHash?: string;
    role: UserRole;
    telefone?: string;
    cpf?: string;
    saldo?: number;
}

export interface Item extends BaseEntity {
    nome: string;
    descricao: string;
    valor: number;
    imageUrl: string;
}

export interface Midia extends BaseEntity {
    url?: string | null;
    caminho?: string | null;
    imagem?: string | null;
    tipo: TipoMidia;
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
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
    imageUrl: string;
    item?: Item | null;
    midias?: Midia[];
    vencedor?: Pick<User, "uuid" | "nome" | "email"> | null;
    bilhetes?: Bilhete[];
}

export interface Bilhete extends BaseEntity {
    numero: number;
    dataCompra: string;
    pago: boolean;
    nome?: string;
    nomeSorteio?: string;
    user?: Pick<User, "uuid" | "nome" | "email">;
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
}

export interface Transacao extends BaseEntity {
    tipo: TipoTransacao;
    valor: number;
    metodoPagamento: MetodoPagamento;
    referencia?: string;
    data: string;
    user?: Pick<User, "uuid" | "nome" | "email">;
    sorteio?: Pick<Sorteio, "uuid" | "titulo">;
    bilhete?: Pick<Bilhete, "uuid" | "numero">;
}

export interface DashboardResumo {
    totalUsuarios: number;
    totalSorteios: number;
    totalBilhetes: number;
    totalTransacoes: number;
    faturamentoBruto: number;
}

export interface SignupPayload {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    aceitouTermos: boolean;
}

export interface PaymentMetadata {
    name: string;
    cellphone: string;
    email: string;
    taxId: string;
    zipCode?: string;
}

export interface PaymentBill {
    uuid: string;
    url: string;
    tipo: string;
    valor: number;
    metodoPagamento: string;
    referencia: string | null;
    data: string;
}

export interface GatewayPaymentProduct {
    id: string;
    externalId: string;
    price: number;
    name: string;
    quantity: number;
}

export interface GatewayCustomerMetadata {
    name?: string;
    cellphone?: string;
    email?: string;
    taxId?: string;
    zipCode?: string;
    [key: string]: unknown;
}

export interface GatewayPaymentCustomer {
    id: string;
    metadata: GatewayCustomerMetadata;
}

export interface GatewayPayment {
    id: string;
    url: string;
    amount: number;
    status: string;
    devMode: boolean;
    methods: string[];
    products: GatewayPaymentProduct[];
    frequency: string | null;
    nextBilling: string | null;
    customer: GatewayPaymentCustomer | null;
    allowCoupons: boolean;
    coupons: string[];
}
