import {
    Alert,
    Avatar,
    Chip,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { Sorteio, Transacao } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatDateTime, formatNumber } from "../../../utils/formatters";

const metricCards = [
    { key: "faturamento", label: "Faturamento Bruto", icon: <TrendingUpIcon /> },
    { key: "usuarios", label: "Usuários ativos", icon: <PeopleAltIcon /> },
    { key: "bilhetes", label: "Bilhetes emitidos", icon: <ConfirmationNumberIcon /> },
    { key: "transacoes", label: "Transações registradas", icon: <ReceiptLongIcon /> },
];

const computeProgress = (sorteio: Sorteio) => {
    if (!sorteio.qtdTotalBilhetes) return 0;
    return Math.min(100, Math.round((sorteio.qtdVendidos / sorteio.qtdTotalBilhetes) * 100));
};

const sumEntradas = (transacoes: Transacao[]) =>
    transacoes.reduce(
        (acc, transacao) =>
            transacao.tipo === "ENTRADA" ? acc + transacao.valor : acc,
        0,
    );

const sumSaidas = (transacoes: Transacao[]) =>
    transacoes.reduce(
        (acc, transacao) =>
            transacao.tipo === "SAIDA" ? acc + transacao.valor : acc,
        0,
    );

const sortByDate = <T extends { data?: string; createdAt?: string }>(items: T[]) =>
    [...items].sort((a, b) => {
        const dateA = new Date(a.data ?? a.createdAt ?? 0).getTime();
        const dateB = new Date(b.data ?? b.createdAt ?? 0).getTime();
        return dateB - dateA;
    });

export default function AdminOverviewSection() {
    const { loading, error, users, sorteios, tickets, transacoes } = useAdminData();

    const safeTransacoes = Array.isArray(transacoes) ? transacoes : [];
    const safeSorteios = Array.isArray(sorteios) ? sorteios : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeTickets = Array.isArray(tickets) ? tickets : [];

    const faturamentoTotal = sumEntradas(safeTransacoes) - sumSaidas(safeTransacoes);
    const abertos = safeSorteios.filter((s) => s.status === "ABERTO").length;
    const vendaMedia =
        safeSorteios.length > 0
            ? safeSorteios.reduce((acc, sorteio) => acc + computeProgress(sorteio), 0) / safeSorteios.length
            : 0;

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3}>
                {metricCards.map(({ key, label, icon }) => {
                    const value =
                        key === "faturamento"
                            ? formatCurrency(faturamentoTotal)
                            : key === "usuarios"
                            ? formatNumber(safeUsers.length)
                            : key === "bilhetes"
                            ? formatNumber(safeTickets.length)
                            : formatNumber(safeTransacoes.length);

                    return (
                        <Grid key={key} size={{ xs: 12, md: 3 }}>
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {label}
                                        </Typography>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>{icon}</Avatar>
                                    </Stack>
                                    {loading ? (
                                        <Skeleton variant="text" height={34} />
                                    ) : (
                                        <Typography variant="h5" fontWeight={800}>
                                            {value}
                                        </Typography>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight={800}>
                                Sorteios em destaque
                            </Typography>
                            <Chip icon={<EmojiEventsIcon />} label={`${abertos} abertos`} color="primary" variant="outlined" />
                        </Stack>
                        {loading ? (
                            <Stack spacing={1.5}>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <Skeleton key={idx} variant="rounded" height={74} />
                                ))}
                            </Stack>
                        ) : (
                            <List disablePadding>
                                {sortByDate(safeSorteios)
                                    .slice(0, 5)
                                    .map((sorteio) => (
                                        <ListItem key={sorteio.uuid} disableGutters sx={{ py: 1.5 }}>
                                            <ListItemAvatar>
                                                <Avatar variant="rounded">
                                                    <EmojiEventsIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography fontWeight={700}>{sorteio.titulo}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDateTime(sorteio.dataEncerramento)}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack spacing={1}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {sorteio.descricao}
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={computeProgress(sorteio)}
                                                        />
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                {!safeSorteios.length && (
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhum sorteio cadastrado ainda.
                                    </Typography>
                                )}
                            </List>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                            Últimas transações
                        </Typography>
                        {loading ? (
                            <Stack spacing={1.5}>
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Skeleton key={idx} variant="rounded" height={60} />
                                ))}
                            </Stack>
                        ) : (
                            <List disablePadding>
                                {sortByDate(safeTransacoes)
                                    .slice(0, 6)
                                    .map((transacao) => (
                                        <ListItem key={transacao.uuid} disableGutters sx={{ py: 1.2 }}>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography fontWeight={700}>
                                                            {transacao.user?.nome ?? "Usuário"}
                                                        </Typography>
                                                        <Typography
                                                            color={
                                                                transacao.tipo === "ENTRADA" ? "success.main" : "error.main"
                                                            }
                                                            fontWeight={700}
                                                        >
                                                            {transacao.tipo === "ENTRADA" ? "+" : "-"}
                                                            {formatCurrency(transacao.valor)}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" color="text.secondary">
                                                            {transacao.metodoPagamento} • {transacao.referencia ?? "—"}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDateTime(transacao.data)}
                                                        </Typography>
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                {!safeTransacoes.length && (
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhuma transação registrada ainda.
                                    </Typography>
                                )}
                            </List>
                        )}
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                            Taxa média de venda
                        </Typography>
                        {loading ? (
                            <Skeleton variant="text" height={32} />
                        ) : (
                            <Typography variant="h4" fontWeight={900}>
                                {Math.round(vendaMedia)}%
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            Percentual médio de bilhetes vendidos por sorteio.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}
