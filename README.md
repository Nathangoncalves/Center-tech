# Centertech Sorteios – Frontend

Interface em React + Vite para a plataforma de sorteios da Centertech. O app consome a API REST (`center_tech_api_REST`) para autenticação, listagem de sorteios, participantes, bilhetes e transações.

## Requisitos

- Node.js 18+
- npm 9+
- API rodando localmente (padrão `http://localhost:8080/api`)

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Ajuste a URL da API, se necessário, criando um `.env.local`:

   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```

3. Executar em desenvolvimento:

   ```bash
   npm run dev
   ```

4. Construir para produção:

   ```bash
   npm run build
   ```

5. Pré-visualizar o build:

   ```bash
   npm run preview
   ```

## Autenticação

- Tokens JWT retornados por `POST /api/main/login` são armazenados em `localStorage` (`ng-auth-token`).
- O evento `ng-auth-token-changed` é emitido sempre que o token muda, permitindo que a navbar altere o estado logado/deslogado.
- Use o menu do usuário (navbar) para sair (`authService.logout()` limpa o token e redireciona para a home).

## Estrutura principal

- `src/components/Header` – Navbar com variações para visitantes e usuários autenticados, incluindo a nova logo oficial.
- `src/pages/Home` – Landing page que consome `/sorteio/public` e contabiliza participantes (`/user`).
- `src/pages/Participant` – Painel do participante (bilhetes, sorteios disponíveis, contato rápido).
- `src/pages/Admin` – Painel administrativo protegido (`/gestor`).
- `src/services` – Clientes axios para a API (`authService`, `sorteioService`, `ticketService`, `transactionService`, `userService`).
- `src/utils/auth` – Helpers para decodificar payload do JWT.

## Integração com a API

| Endpoint | Uso |
| --- | --- |
| `POST /api/main/login` | Login gestor/participante (gera token) |
| `GET /api/sorteio/public` | Lista sorteios ativos na landing e no painel |
| `GET /api/user` | Estatísticas de participantes e CRUD no painel admin |
| `GET /api/bilhete/me` | Bilhetes do participante autenticado |
| `GET /api/transacao` | Transações no painel administrativo |

> ⚠️ Exceto `/api/main/login` e `/api/sorteio/public`, todos os endpoints exigem token válido.

## Scripts úteis

- `npm run dev` – modo desenvolvimento com Vite.
- `npm run build` – build de produção.
- `npm run preview` – pré-visualização do bundle.
- `npm run lint` – executa ESLint.

## Contribuição

1. Crie uma branch a partir de `main`.
2. Garanta que `npm run lint` e `npm run build` rodem sem erros.
3. Abra um Pull Request descrevendo as mudanças.

## Licença

Uso interno Centertech. Consulte o time responsável antes de distribuir ou reutilizar.
