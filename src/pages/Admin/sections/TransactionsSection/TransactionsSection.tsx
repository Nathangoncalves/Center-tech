import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { Transacao } from "@/types";
import { transactionService } from "@/services";
import "./TransactionsSection.scss";

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
}).format(value);

const tipoLabel: Record<Transacao["tipo"], string> = {
    ENTRADA: "Entrada",
    SAIDA: "Saída",
};

export default function TransactionsSection() {
    const [transactions, setTransactions] = useState<Transacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await transactionService.list();
                if (active) setTransactions(data);
            } catch (err) {
                console.error("Erro ao carregar transações", err);
                if (active) setError("Não foi possível carregar as transações.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <Box className="transactions-section__loading">
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">Carregando transações...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!transactions.length) {
        return <Alert severity="info">Nenhuma transação registrada até o momento.</Alert>;
    }

    return (
        <TableContainer component={Paper} className="transactions-section" elevation={0}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Método</TableCell>
                        <TableCell>Usuário</TableCell>
                        <TableCell>Referência</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <Chip
                                    label={tipoLabel[transaction.tipo]}
                                    color={transaction.tipo === "ENTRADA" ? "success" : "error"}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{formatCurrency(transaction.valor)}</TableCell>
                            <TableCell>{transaction.metodoPagamento.toLowerCase()}</TableCell>
                            <TableCell>{transaction.user?.nome ?? "-"}</TableCell>
                            <TableCell>{transaction.referencia ?? "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
