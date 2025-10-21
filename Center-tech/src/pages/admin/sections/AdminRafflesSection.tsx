import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import type { Sorteio, SorteioStatus } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatDate, formatDateTime } from "../../../utils/formatters";
import api from "../../../services/api";

interface SorteioFormState {
    titulo: string;
    descricao: string;
    precoBilhete: number;
    qtdTotalBilhetes: number;
    dataAgendada?: string;
    dataEncerramento?: string;
    itemUuid?: string;
    status: SorteioStatus;
}

const INITIAL_STATE: SorteioFormState = {
    titulo: "",
    descricao: "",
    precoBilhete: 0,
    qtdTotalBilhetes: 0,
    status: "AGENDADO",
};

const STATUS_LABEL: Record<SorteioStatus, string> = {
    AGENDADO: "Agendado",
    ABERTO: "Aberto",
    ENCERRADO: "Encerrado",
    FINALIZADO: "Finalizado",
};

export default function AdminRafflesSection() {
    const { sorteios, setSorteios, items, loading, error, refreshAll } = useAdminData();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<SorteioFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();

    const sortedSorteios = useMemo(
        () =>
            [...sorteios].sort(
                (a, b) =>
                    new Date(b.dataAgendada ?? b.createdAt ?? 0).getTime() -
                    new Date(a.dataAgendada ?? a.createdAt ?? 0).getTime(),
            ),
        [sorteios],
    );

    const handleCreate = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const payload = {
                titulo: form.titulo.trim(),
                descricao: form.descricao.trim(),
                precoBilhete: Number(form.precoBilhete) || 0,
                qtdTotalBilhetes: Number(form.qtdTotalBilhetes) || 0,
                dataAgendada: form.dataAgendada || undefined,
                dataEncerramento: form.dataEncerramento || undefined,
                status: form.status,
                item: form.itemUuid ? { uuid: form.itemUuid } : undefined,
            };
            const { data: created } = await api.post<Sorteio>("/sorteio/criar", payload);
            setSorteios([...sorteios, created]);
            setOpen(false);
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("Erro ao criar sorteio", err);
            setActionError("Não foi possível criar o sorteio. Verifique os dados e tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (uuid: string, status: SorteioStatus) => {
        try {
            const { data: updated } = await api.post<Sorteio>("/sorteio/update", { uuid, status });
            setSorteios(sorteios.map((s) => (s.uuid === uuid ? updated : s)));
        } catch (err) {
            console.error("Erro ao atualizar sorteio", err);
            setActionError("Falha ao atualizar o status do sorteio.");
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Deseja remover este sorteio?")) return;
        try {
            await api.post(`/sorteio/delete/${uuid}`);
            setSorteios(sorteios.filter((s) => s.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao remover sorteio", err);
            setActionError("Não foi possível remover o sorteio.");
        }
    };

    const handleChange = (field: keyof SorteioFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Sorteios
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Controle as campanhas ativas, abra novas vendas e encerre sorteios concluídos.
                        </Typography>
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button startIcon={<RefreshIcon />} variant="outlined" onClick={() => refreshAll()}>
                            Atualizar dados
                        </Button>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
                            Novo sorteio
                        </Button>
                    </Stack>
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
                                    <TableCell>Título</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Bilhetes</TableCell>
                                    <TableCell>Preço</TableCell>
                                    <TableCell>Agendado</TableCell>
                                    <TableCell>Encerramento</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedSorteios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhum sorteio cadastrado até o momento.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedSorteios.map((sorteio) => (
                                        <TableRow key={sorteio.uuid}>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography fontWeight={600}>{sorteio.titulo}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {sorteio.descricao}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={sorteio.status}
                                                    size="small"
                                                    onChange={(event) =>
                                                        handleStatusChange(sorteio.uuid, event.target.value as SorteioStatus)
                                                    }
                                                >
                                                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                                                        <MenuItem key={value} value={value}>
                                                            {label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${sorteio.qtdVendidos}/${sorteio.qtdTotalBilhetes}`}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatCurrency(sorteio.precoBilhete)}</TableCell>
                                            <TableCell>{formatDate(sorteio.dataAgendada)}</TableCell>
                                            <TableCell>{formatDateTime(sorteio.dataEncerramento)}</TableCell>
                                            <TableCell>{sorteio.item?.nome ?? "—"}</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="error" onClick={() => handleDelete(sorteio.uuid)}>
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
                <DialogTitle>Novo sorteio</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Título"
                                value={form.titulo}
                                onChange={(e) => handleChange("titulo", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Preço do bilhete"
                                type="number"
                                value={form.precoBilhete}
                                onChange={(e) => handleChange("precoBilhete", Number(e.target.value))}
                                fullWidth
                                required
                                inputProps={{ step: 0.01 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Descrição"
                                value={form.descricao}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Quantidade total de bilhetes"
                                type="number"
                                value={form.qtdTotalBilhetes}
                                onChange={(e) => handleChange("qtdTotalBilhetes", Number(e.target.value))}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Data agendada"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={form.dataAgendada ?? ""}
                                onChange={(e) => handleChange("dataAgendada", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Encerramento previsto"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={form.dataEncerramento ?? ""}
                                onChange={(e) => handleChange("dataEncerramento", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Item associado"
                                select
                                value={form.itemUuid ?? ""}
                                onChange={(e) => handleChange("itemUuid", e.target.value)}
                                helperText="Selecione o prêmio principal do sorteio."
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Nenhum item</em>
                                </MenuItem>
                                {items.map((item) => (
                                    <MenuItem key={item.uuid} value={item.uuid}>
                                        {item.nome} — {formatCurrency(item.valor)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Status inicial"
                                select
                                value={form.status}
                                onChange={(e) => handleChange("status", e.target.value as SorteioStatus)}
                                fullWidth
                            >
                                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {actionError && (
                        <Alert sx={{ mt: 2 }} severity="error" onClose={() => setActionError(undefined)}>
                            {actionError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCreate} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : "Criar sorteio"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
