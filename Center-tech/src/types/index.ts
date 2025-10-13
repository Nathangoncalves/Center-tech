export type ThemeMode = "light" | "dark";

export interface Raffle {
    id: string;
    titulo: string;
    img: string;
    price: number;
    quotasTotal: number;
    quotasSold: number;
  endsAt: string;   // ISO
    badge?: string;
}

export interface User {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    aceitouTermos: boolean;
  createdAt: string; // ISO
}