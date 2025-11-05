import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import api, { getAuthToken } from "../../services/api";
import type { GatewayPayment, Item, Sorteio, Ticket, Transacao, User } from "../../types";

const ensureArray = <T,>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

interface AdminDataContextValue {
    loading: boolean;
    error?: string;
    users: User[];
    sorteios: Sorteio[];
    tickets: Ticket[];
    transacoes: Transacao[];
    items: Item[];
    pagamentos: GatewayPayment[];
    refreshAll: () => Promise<void>;
    setUsers: (users: User[]) => void;
    setSorteios: (sorteios: Sorteio[]) => void;
    setTickets: (tickets: Ticket[]) => void;
    setTransacoes: (transacoes: Transacao[]) => void;
    setItems: (items: Item[]) => void;
    setPagamentos: (pagamentos: GatewayPayment[]) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined);

export function useAdminData(): AdminDataContextValue {
    const ctx = useContext(AdminDataContext);
    if (!ctx) {
        throw new Error("useAdminData must be used inside <AdminDataProvider />");
    }
    return ctx;
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const [users, setUsers] = useState<User[]>([]);
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [pagamentos, setPagamentos] = useState<GatewayPayment[]>([]);

    const refreshAll = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        try {
            const token = getAuthToken();
            const authConfig = token
                ? {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                : undefined;
            const [
                usersData,
                sorteiosData,
                ticketsData,
                transacoesData,
                itemsData,
                pagamentosData,
            ] = await Promise.all([
                api.get<User[]>("/user", authConfig).then((res) => res.data),
                api.get<Sorteio[]>("/sorteio", authConfig).then((res) => res.data),
                api.get<Ticket[]>("/bilhete", authConfig).then((res) => res.data),
                api.get<Transacao[]>("/transacao", authConfig).then((res) => res.data),
                api.get<Item[]>("/item", authConfig).then((res) => res.data),
                api.get<GatewayPayment[]>("/pagamentos/listar", authConfig).then((res) => res.data),
            ]);
            setUsers(ensureArray(usersData));
            setSorteios(ensureArray(sorteiosData));
            setTickets(ensureArray(ticketsData));
            setTransacoes(ensureArray(transacoesData));
            setItems(ensureArray(itemsData));
            setPagamentos(ensureArray(pagamentosData));
        } catch (err) {
            console.error("Erro ao carregar dados administrativos", err);
            setError("Não foi possível carregar os dados. Tente novamente em instantes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshAll();
    }, [refreshAll]);

    const value = useMemo<AdminDataContextValue>(
        () => ({
            loading,
            error,
            users,
            sorteios,
            tickets,
            transacoes,
            items,
            pagamentos,
            refreshAll,
            setUsers,
            setSorteios,
            setTickets,
            setTransacoes,
            setItems,
            setPagamentos,
        }),
        [loading, error, users, sorteios, tickets, transacoes, items, pagamentos, refreshAll],
    );

    return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
