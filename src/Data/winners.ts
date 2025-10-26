export interface Winner {
    id: string;
    nome: string;
    premio: string;
    sorteioId: string;
    data: string;     
    cidade?: string;
    uf?: string;
    foto?: string;     
    }
    
    export const winners: Winner[] = [
    { id: "w1", nome: "Ana P.", premio: "iPhone 15", sorteioId: "r1", data: "2025-09-04T17:00:00Z", cidade: "Brasília", uf: "DF" },
    { id: "w2", nome: "Carlos M.", premio: "PS5 Slim", sorteioId: "r2", data: "2025-09-01T17:00:00Z", cidade: "Goiânia", uf: "GO" },
    { id: "w3", nome: "Juliana S.", premio: "Pix R$ 2.000", sorteioId: "rX", data: "2025-08-25T17:00:00Z", cidade: "Anápolis", uf: "GO" },
    ];
