import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import ReplayIcon from "@mui/icons-material/Replay";
import type { GatewayPayment } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency } from "../../../utils/formatters";

const statusMeta: Record<string, { label: string; color: "default" | "success" | "warning" | "error" }> = {
    PAID: { label: "Pago", color: "success" },
    PENDING: { label: "Pendente", color: "warning" },
    CANCELLED: { label: "Cancelado", color: "default" },
    FAILED: { label: "Falhou", color: "error" },
};

const sortPayments = (payments: GatewayPayment[]) =>
    [...payments].sort((a, b) => {
        if (a.status === b.status) {
            return b.amount - a.amount;
        }
        if (a.status === "PAID") return -1;
        if (b.status === "PAID") return 1;
        return a.status.localeCompare(b.status);
    });

export default function AdminTransactionsSection() {
    const { pagamentos, loading, error, refreshAll } = useAdminData();
    const safePagamentos = Array.isArray(pagamentos) ? pagamentos : [];
    const sortedPagamentos = sortPayments(safePagamentos);

    return (
        <Stack spacing={3}>
            {(error && !loading) && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Cobranças do gateway
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lista consolidada das cobranças retornadas diretamente pelo provedor de pagamentos.
                        </Typography>
                    </Stack>
                    <Button
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={() => {
                            void refreshAll();
                        }}
                        disabled={loading}
                    >
                        Atualizar
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ borderRadius: "12px", overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} />
                    </Box>
                ) : sortedPagamentos.length === 0 ? (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="body2" color="text.secondary">
                            Nenhuma cobrança cadastrada até o momento.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Métodos</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Produtos</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Dev mode</TableCell>
                                    <TableCell>Comprovante</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedPagamentos.map((payment) => {
                                    const amount = payment.amount / 100;
                                    const statusInfo = statusMeta[payment.status] ?? {
                                        label: payment.status ?? "—",
                                        color: "default",
                                    };
                                    const productsLabel = payment.products
                                        ?.map((product) => `${product.name} ×${product.quantity}`)
                                        .join(", ");
                                    const customerName = payment.customer?.metadata?.name ?? "—";
                                    const customerEmail = payment.customer?.metadata?.email ?? "";

                                    return (
                                        <TableRow key={payment.id} hover>
                                            <TableCell sx={{ maxWidth: 160 }}>
                                                <Typography variant="body2" noWrap title={payment.id}>
                                                    {payment.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={statusInfo.label}
                                                    color={statusInfo.color}
                                                    variant={statusInfo.color === "default" ? "outlined" : "filled"}
                                                />
                                            </TableCell>
                                            <TableCell>{payment.methods?.join(", ") || "—"}</TableCell>
                                            <TableCell>{formatCurrency(amount)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" noWrap title={productsLabel}>
                                                    {productsLabel || "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{customerName}</Typography>
                                                {customerEmail && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {customerEmail}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.devMode ? "Teste" : "Produção"}
                                                    size="small"
                                                    color={payment.devMode ? "warning" : "default"}
                                                    variant={payment.devMode ? "filled" : "outlined"}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {payment.url ? (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        endIcon={<LaunchIcon fontSize="small" />}
                                                        href={payment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Abrir
                                                    </Button>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Stack>
    );
}
