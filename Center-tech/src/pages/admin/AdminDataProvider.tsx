import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    itemService,
    mediaService,
    sorteioService,
    ticketService,
    transactionService,
    userService,
} from "../../services";
import type { Item, Midia, Sorteio, Ticket, Transacao, User } from "../../types";

interface AdminDataContextValue {
    loading: boolean;
    error?: string;
    users: User[];
    sorteios: Sorteio[];
    tickets: Ticket[];
    transacoes: Transacao[];
    items: Item[];
    midias: Midia[];
    refreshAll: () => Promise<void>;
    setUsers: (users: User[]) => void;
    setSorteios: (sorteios: Sorteio[]) => void;
    setTickets: (tickets: Ticket[]) => void;
    setTransacoes: (transacoes: Transacao[]) => void;
    setItems: (items: Item[]) => void;
    setMidias: (midias: Midia[]) => void;
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
    const [midias, setMidias] = useState<Midia[]>([]);

    const refreshAll = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        try {
            const [
                usersData,
                sorteiosData,
                ticketsData,
                transacoesData,
                itemsData,
                midiasData,
            ] = await Promise.all([
                userService.list(),
                sorteioService.list(),
                ticketService.list(),
                transactionService.list(),
                itemService.list(),
                mediaService.list(),
            ]);
            setUsers(usersData);
            setSorteios(sorteiosData);
            setTickets(ticketsData);
            setTransacoes(transacoesData);
            setItems(itemsData);
            setMidias(midiasData);
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
            midias,
            refreshAll,
            setUsers,
            setSorteios,
            setTickets,
            setTransacoes,
            setItems,
            setMidias,
        }),
        [loading, error, users, sorteios, tickets, transacoes, items, midias, refreshAll],
    );

    return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
