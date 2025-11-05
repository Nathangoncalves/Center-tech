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
import LaunchIcon from "@mui/icons-material/Launch";
import type { GatewayPayment, Sorteio } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatNumber } from "../../../utils/formatters";

const metricCards = [
    { key: "faturamento", label: "Faturamento bruto", icon: <TrendingUpIcon /> },
    { key: "usuarios", label: "Usuários ativos", icon: <PeopleAltIcon /> },
    { key: "bilhetes", label: "Bilhetes emitidos", icon: <ConfirmationNumberIcon /> },
    { key: "transacoes", label: "Cobranças registradas", icon: <ReceiptLongIcon /> },
];

const computeProgress = (sorteio: Sorteio) => {
    if (!sorteio.qtdTotalBilhetes) return 0;
    return Math.min(100, Math.round((sorteio.qtdVendidos / sorteio.qtdTotalBilhetes) * 100));
};

const statusMeta: Record<string, { label: string; color: "default" | "success" | "warning" | "error" }> = {
    PAID: { label: "Pago", color: "success" },
    PENDING: { label: "Pendente", color: "warning" },
    CANCELLED: { label: "Cancelado", color: "default" },
    FAILED: { label: "Falhou", color: "error" },
};

const sortPayments = (payments: GatewayPayment[]) =>
    [...payments].sort((a, b) => {
        const amountDiff = b.amount - a.amount;
        if (amountDiff !== 0) return amountDiff;
        return a.id.localeCompare(b.id);
    });

const sortRaffles = (raffles: Sorteio[]) =>
    [...raffles].sort((a, b) => {
        const progressDiff = computeProgress(b) - computeProgress(a);
        if (progressDiff !== 0) return progressDiff;
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    });

export default function AdminOverviewSection() {
    const { loading, error, users, sorteios, tickets, pagamentos } = useAdminData();

    const safePagamentos = Array.isArray(pagamentos) ? pagamentos : [];
    const safeSorteios = Array.isArray(sorteios) ? sorteios : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeTickets = Array.isArray(tickets) ? tickets : [];

    const faturamentoTotal =
        safePagamentos.filter((payment) => payment.status === "PAID").reduce((acc, payment) => acc + payment.amount, 0) /
        100;

    const topPagamentos = sortPayments(safePagamentos).slice(0, 6);
    const topSorteios = sortRaffles(safeSorteios).slice(0, 4);

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
                            : formatNumber(safePagamentos.length);

                    return (
                        <Grid key={key} size={{ xs: 12, md: 3 }}>
                            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px" }}>
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
                    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "12px" }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                            Sorteios em destaque
                        </Typography>
                        {loading ? (
                            <Stack spacing={2}>
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <Skeleton key={idx} variant="rounded" height={60} />
                                ))}
                            </Stack>
                        ) : safeSorteios.length ? (
                            <Stack spacing={2}>
                                {topSorteios.map((sorteio) => {
                                    const progress = computeProgress(sorteio);
                                    return (
                                        <Stack key={sorteio.uuid} spacing={1}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography fontWeight={700}>{sorteio.titulo}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {progress}% vendido
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{ height: 8, borderRadius: 999 }}
                                            />
                                            <Stack direction="row" justifyContent="space-between" color="text.secondary">
                                                <Typography variant="caption">
                                                    Vendidos: {formatNumber(sorteio.qtdVendidos)}
                                                </Typography>
                                                <Typography variant="caption">
                                                    Restantes:{" "}
                                                    {formatNumber(Math.max(sorteio.qtdTotalBilhetes - sorteio.qtdVendidos, 0))}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum sorteio cadastrado ainda.
                            </Typography>
                        )}
                    </Paper>

                    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "12px", mt: 3 }}>
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

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "12px" }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                            Últimas cobranças
                        </Typography>
                        {loading ? (
                            <Stack spacing={1.5}>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <Skeleton key={idx} variant="rounded" height={60} />
                                ))}
                            </Stack>
                        ) : safePagamentos.length ? (
                            <List disablePadding>
                                {topPagamentos.map((payment) => {
                                    const amount = payment.amount / 100;
                                    const customerName = payment.customer?.metadata?.name ?? "Cliente";
                                    const customerEmail = payment.customer?.metadata?.email ?? "";
                                    const statusInfo = statusMeta[payment.status] ?? {
                                        label: payment.status ?? "—",
                                        color: "default",
                                    };

                                    return (
                                        <ListItem key={payment.id} disableGutters sx={{ py: 1.4 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                                    <EmojiEventsIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Stack spacing={0.2}>
                                                            <Typography fontWeight={700}>{customerName}</Typography>
                                                            {customerEmail && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {customerEmail}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                        <Typography fontWeight={700}>{formatCurrency(amount)}</Typography>
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                            {payment.methods?.join(", ") || "—"}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip
                                                                size="small"
                                                                label={statusInfo.label}
                                                                color={statusInfo.color}
                                                                variant={statusInfo.color === "default" ? "outlined" : "filled"}
                                                            />
                                                            {payment.url && (
                                                                <Chip
                                                                    component="a"
                                                                    href={payment.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    size="small"
                                                                    icon={<LaunchIcon fontSize="small" />}
                                                                    label="Abrir"
                                                                    clickable
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Nenhuma cobrança registrada ainda.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}
