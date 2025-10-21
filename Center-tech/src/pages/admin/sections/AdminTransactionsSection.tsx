import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MetodoPagamento, TipoTransacao, Transacao } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import api from "../../../services/api";

interface TransactionFormState {
    userUuid: string;
    sorteioUuid?: string;
    bilheteUuid?: string;
    tipo: TipoTransacao;
    valor: number;
    metodoPagamento: MetodoPagamento;
    referencia: string;
    data: string;
}

const INITIAL_STATE: TransactionFormState = {
    userUuid: "",
    sorteioUuid: "",
    bilheteUuid: "",
    tipo: "ENTRADA",
    valor: 0,
    metodoPagamento: "PIX",
    referencia: "",
    data: new Date().toISOString().slice(0, 16),
};

const TIPO_LABEL: Record<TipoTransacao, string> = {
    ENTRADA: "Entrada",
    SAIDA: "Saída",
};

const METODO_LABEL: Record<MetodoPagamento, string> = {
    PIX: "PIX",
    CARTAO: "Cartão",
    SALDO: "Saldo interno",
};

export default function AdminTransactionsSection() {
    const { transacoes, setTransacoes, users, sorteios, tickets, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<TransactionFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();

    const safeTransacoes = Array.isArray(transacoes) ? transacoes : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeSorteios = Array.isArray(sorteios) ? sorteios : [];
    const safeTickets = Array.isArray(tickets) ? tickets : [];

    const sortedTransacoes = useMemo(
        () =>
            [...safeTransacoes].sort(
                (a, b) => new Date(b.data ?? 0).getTime() - new Date(a.data ?? 0).getTime(),
            ),
        [safeTransacoes],
    );

    const handleCreate = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const payload = {
                userUuid: form.userUuid,
                sorteioUuid: form.sorteioUuid || undefined,
                bilheteUuid: form.bilheteUuid || undefined,
                tipo: form.tipo,
                valor: Number(form.valor),
                metodoPagamento: form.metodoPagamento,
                referencia: form.referencia || undefined,
                data: form.data ? new Date(form.data).toISOString() : undefined,
            };
            const { data: created } = await api.post<Transacao>("/transacao/criar", {
                tipo: payload.tipo,
                valor: payload.valor,
                metodoPagamento: payload.metodoPagamento,
                referencia: payload.referencia,
                data: payload.data,
                user: { uuid: payload.userUuid },
                sorteio: payload.sorteioUuid ? { uuid: payload.sorteioUuid } : undefined,
                bilhete: payload.bilheteUuid ? { uuid: payload.bilheteUuid } : undefined,
            });
            setTransacoes([created, ...safeTransacoes]);
            setOpen(false);
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("Erro ao registrar transação", err);
            setActionError("Não foi possível registrar a transação. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Remover transação?")) return;
        try {
            await api.post(`/transacao/delete/${uuid}`);
            setTransacoes(safeTransacoes.filter((t) => t.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao remover transação", err);
            setActionError("Não foi possível remover a transação.");
        }
    };

    return (
        <Stack spacing={3}>
            {(error || actionError) && (
                <Alert severity="error">{actionError ?? error}</Alert>
            )}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Fluxo de transações
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Controle financeiro das entradas e saídas relacionadas aos sorteios.
                        </Typography>
                    </Stack>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
                        Registrar transação
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ p: 3 }}>
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Método</TableCell>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Sorteio</TableCell>
                                    <TableCell>Bilhete</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedTransacoes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhuma transação registrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedTransacoes.map((transacao) => (
                                        <TableRow key={transacao.uuid}>
                                            <TableCell>{transacao.data ? formatDateTime(transacao.data) : "—"}</TableCell>
                                            <TableCell>{transacao.user?.nome ?? "—"}</TableCell>
                                            <TableCell>{TIPO_LABEL[transacao.tipo] ?? "—"}</TableCell>
                                            <TableCell sx={{ color: transacao.tipo === "ENTRADA" ? "success.main" : "error.main" }}>
                                                {transacao.tipo === "ENTRADA" ? "+" : "-"}
                                                {formatCurrency(transacao.valor)}
                                            </TableCell>
                                            <TableCell>{METODO_LABEL[transacao.metodoPagamento] ?? "—"}</TableCell>
                                            <TableCell>{transacao.referencia ?? "—"}</TableCell>
                                            <TableCell>{transacao.sorteio?.titulo ?? "—"}</TableCell>
                                            <TableCell>{transacao.bilhete ? `#${transacao.bilhete.numero}` : "—"}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="error"
                                                    disabled={!transacao.uuid}
                                                    onClick={() => transacao.uuid && handleDelete(transacao.uuid)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={open} onClose={() => (submitting ? null : setOpen(false))} maxWidth="md" fullWidth>
                <DialogTitle>Nova transação</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Cliente"
                                select
                                value={form.userUuid}
                                onChange={(e) => setForm((prev) => ({ ...prev, userUuid: e.target.value }))}
                                fullWidth
                                required
                            >
                                {safeUsers.map((user) => (
                                    <MenuItem key={user.uuid ?? user.email} value={user.uuid}>
                                        {user.nome} • {user.email}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Tipo"
                                select
                                value={form.tipo}
                                onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as TipoTransacao }))}
                                fullWidth
                                required
                            >
                                {Object.entries(TIPO_LABEL).map(([value, label]) => (
                                    <MenuItem value={value} key={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Valor"
                                type="number"
                                value={form.valor}
                                inputProps={{ step: 0.01 }}
                                onChange={(e) => setForm((prev) => ({ ...prev, valor: Number(e.target.value) }))}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Método de pagamento"
                                select
                                value={form.metodoPagamento}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, metodoPagamento: e.target.value as MetodoPagamento }))
                                }
                                fullWidth
                                required
                            >
                                {Object.entries(METODO_LABEL).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Sorteio"
                                select
                                value={form.sorteioUuid ?? ""}
                                onChange={(e) => setForm((prev) => ({ ...prev, sorteioUuid: e.target.value }))}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Não vinculado</em>
                                </MenuItem>
                                {safeSorteios.map((sorteio) => (
                                    <MenuItem key={sorteio.uuid} value={sorteio.uuid}>
                                        {sorteio.titulo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Bilhete"
                                select
                                value={form.bilheteUuid ?? ""}
                                onChange={(e) => setForm((prev) => ({ ...prev, bilheteUuid: e.target.value }))}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Não vinculado</em>
                                </MenuItem>
                                {safeTickets.map((ticket) => (
                                    <MenuItem key={ticket.uuid} value={ticket.uuid}>
                                        #{ticket.numero} • {ticket.user?.nome ?? "—"}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Data"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={form.data}
                                onChange={(e) => setForm((prev) => ({ ...prev, data: e.target.value }))}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Referência"
                                value={form.referencia}
                                onChange={(e) => setForm((prev) => ({ ...prev, referencia: e.target.value }))}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    {actionError && (
                        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setActionError(undefined)}>
                            {actionError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCreate} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : "Registrar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
