import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
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
import type { Ticket } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatDateTime } from "../../../utils/formatters";
import api from "../../../services/api";

interface TicketFormState {
    numero: number;
    userUuid: string;
    sorteioUuid: string;
    dataCompra: string;
    pago: boolean;
}

const INITIAL_STATE: TicketFormState = {
    numero: 0,
    userUuid: "",
    sorteioUuid: "",
    dataCompra: new Date().toISOString().slice(0, 16),
    pago: true,
};

export default function AdminTicketsSection() {
    const { tickets, setTickets, users, sorteios, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<TicketFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();

    const sortedTickets = useMemo(
        () =>
            [...tickets].sort(
                (a, b) => new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime(),
            ),
        [tickets],
    );

    const handleCreate = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const userUuid = form.userUuid?.trim();
            const sorteioUuid = form.sorteioUuid?.trim();
            if (!userUuid || !sorteioUuid) {
                setActionError("Selecione um cliente e um sorteio para emitir o bilhete.");
                setSubmitting(false);
                return;
            }
            const payload = {
                numero: Number(form.numero),
                dataCompra: new Date(form.dataCompra).toISOString(),
                pago: form.pago,
                user: userUuid,
                sorteio: sorteioUuid,
            };
            const { data: created } = await api.post<Ticket>("/bilhete/criar", payload);
            setTickets([created, ...tickets]);
            setOpen(false);
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("Erro ao criar bilhete", err);
            setActionError("Não foi possível registrar o bilhete. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Remover bilhete?")) return;
        try {
            await api.post(`/bilhete/delete/${uuid}`);
            setTickets(tickets.filter((ticket) => ticket.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao remover bilhete", err);
            setActionError("Não foi possível remover o bilhete.");
        }
    };

    const handleTogglePago = async (ticket: Ticket, pago: boolean) => {
        try {
            const { data: updated } = await api.post<Ticket>("/bilhete/update", {
                uuid: ticket.uuid,
                pago,
            });
            setTickets(tickets.map((t) => (t.uuid === ticket.uuid ? updated : t)));
        } catch (err) {
            console.error("Erro ao atualizar bilhete", err);
            setActionError("Não foi possível atualizar o status do bilhete.");
        }
    };

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Bilhetes emitidos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Controle os números vendidos e confirme pagamentos recebidos.
                        </Typography>
                    </Stack>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
                        Emitir bilhete
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
                                    <TableCell>Número</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Sorteio</TableCell>
                                    <TableCell>Data da compra</TableCell>
                                    <TableCell>Pago</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedTickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhum bilhete emitido ainda.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedTickets.map((ticket) => {
                                        const nomeCliente = ticket.nome?.trim() || ticket.user?.nome || "—";
                                        const nomeSorteio = ticket.nomeSorteio?.trim() || ticket.sorteio?.titulo || "—";
                                        return (
                                            <TableRow key={ticket.uuid ?? `${ticket.numero}-${nomeCliente}`}>
                                                <TableCell>#{ticket.numero}</TableCell>
                                                <TableCell>{nomeCliente}</TableCell>
                                                <TableCell>{nomeSorteio}</TableCell>
                                                <TableCell>{formatDateTime(ticket.dataCompra)}</TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={ticket.pago}
                                                        onChange={(e) => handleTogglePago(ticket, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="error" onClick={() => ticket.uuid && handleDelete(ticket.uuid)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={open} onClose={() => (submitting ? null : setOpen(false))} maxWidth="sm" fullWidth>
                <DialogTitle>Emitir novo bilhete</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Número do bilhete"
                                type="number"
                                value={form.numero}
                                onChange={(e) => setForm((prev) => ({ ...prev, numero: Number(e.target.value) }))}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Data da compra"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={form.dataCompra}
                                onChange={(e) => setForm((prev) => ({ ...prev, dataCompra: e.target.value }))}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Cliente"
                                select
                                value={form.userUuid}
                                onChange={(e) => setForm((prev) => ({ ...prev, userUuid: e.target.value }))}
                                fullWidth
                                required
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.uuid} value={user.uuid}>
                                        {user.nome} • {user.email}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Sorteio"
                                select
                                value={form.sorteioUuid}
                                onChange={(e) => setForm((prev) => ({ ...prev, sorteioUuid: e.target.value }))}
                                fullWidth
                                required
                            >
                                {sorteios.map((sorteio) => (
                                    <MenuItem key={sorteio.uuid} value={sorteio.uuid}>
                                        {sorteio.titulo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.pago}
                                        onChange={(e) => setForm((prev) => ({ ...prev, pago: e.target.checked }))}
                                    />
                                }
                                label="Pagamento confirmado"
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
                        {submitting ? "Salvando..." : "Registrar bilhete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
