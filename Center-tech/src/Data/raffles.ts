import type { Raffle } from "../types";

export const raffles: Raffle[] = [
    {
    id: "r1",
    titulo: "iPhone 16 Normal",
    img: "/assets/731403.jpg",
    price: 0.10,
    quotasTotal: 10000,
    quotasSold: 2635,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3.5).toISOString(),
    badge: "Mais desejado",
    },
    {
    id: "r2",
    titulo: "PlayStation 5 Slim",
    img: "/img/ps5.jpg",
    price: 0.10,
    quotasTotal: 8000,
    quotasSold: 5230,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
    badge: "Hot",
    },
    {
    id: "r3",
    titulo: "Honda CG 160 Start",
    img: "/img/moto.jpg",
    price: 0.10,
    quotasTotal: 12000,
    quotasSold: 11110,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    badge: "Quase no fim",
    },
];