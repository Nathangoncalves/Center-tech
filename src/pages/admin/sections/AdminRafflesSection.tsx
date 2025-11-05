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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { keyframes } from "@mui/system";
import type { Sorteio, SorteioStatus, Ticket } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatDate, formatDateTime } from "../../../utils/formatters";
import api from "../../../services/api";
import { useToast } from "@/context/ToastContext";
import { sanitizeMultiline, sanitizeText, toPositiveNumber } from "@/utils/input";
import SecureImage from "@/components/SecureImage";

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

const trophyGlow = keyframes`
    0% {
        transform: scale(1);
        filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0.35));
    }
    50% {
        transform: scale(1.12);
        filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8));
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0.35));
    }
`;

export default function AdminRafflesSection() {
    const { sorteios, setSorteios, items, tickets, loading, error, refreshAll } = useAdminData();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<SorteioFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();
    const [finalizingId, setFinalizingId] = useState<string | null>(null);
    const [highlightedWinnerId, setHighlightedWinnerId] = useState<string | null>(null);
    const theme = useTheme();
    const isCompactLayout = useMediaQuery(theme.breakpoints.down("md"));
    const toast = useToast();

    const sortedSorteios = useMemo(
        () =>
            [...sorteios].sort(
                (a, b) =>
                    new Date(b.dataAgendada ?? b.createdAt ?? 0).getTime() -
                    new Date(a.dataAgendada ?? a.createdAt ?? 0).getTime(),
            ),
        [sorteios],
    );

    const selectedItem = useMemo(
        () => items.find((item) => item.uuid === form.itemUuid),
        [items, form.itemUuid],
    );

    const winnerInfo = useMemo(() => {
        if (!highlightedWinnerId) return null;
        const raffle = sorteios.find((s) => s.uuid === highlightedWinnerId);
        if (!raffle || raffle.status !== "FINALIZADO") return null;
        const winnerUuid = raffle.vencedor?.uuid;
        const ticket: Ticket | undefined = tickets.find((bilhete) =>
            bilhete.sorteio?.uuid === raffle.uuid && (!winnerUuid || bilhete.user?.uuid === winnerUuid),
        );
        return { raffle, ticket: ticket ?? null };
    }, [highlightedWinnerId, sorteios, tickets]);

    const handleCreate = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const payload = {
                titulo: form.titulo.trim(),
                descricao: form.descricao.trim(),
                dataAgendada: form.dataAgendada || undefined,
                dataEncerramento: form.dataEncerramento || undefined,
                status: form.status,
                item: form.itemUuid || null,
                precoBilhete: Number(form.precoBilhete) || 0,
                qtdTotalBilhetes: Number(form.qtdTotalBilhetes) || 0,
                qtdVendidos: 0,
            };

            if (!payload.titulo || !payload.descricao) {
                const msg = "Informe título e descrição do sorteio.";
                setActionError(msg);
                toast.error(msg);
                setSubmitting(false);
                return;
            }
            if (payload.precoBilhete <= 0 || payload.qtdTotalBilhetes <= 0) {
                const msg = "Preço e quantidade de bilhetes precisam ser maiores que zero.";
                setActionError(msg);
                toast.error(msg);
                setSubmitting(false);
                return;
            }
            if (payload.dataAgendada && payload.dataEncerramento) {
                const start = new Date(payload.dataAgendada).getTime();
                const end = new Date(payload.dataEncerramento).getTime();
                if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
                    const msg = "A data de encerramento deve ser posterior à data agendada.";
                    setActionError(msg);
                    toast.error(msg);
                    setSubmitting(false);
                    return;
                }
            }
            const { data: created } = await api.post<Sorteio>("/sorteio/criar", payload);
            setSorteios([...sorteios, created]);
            setOpen(false);
            setForm(INITIAL_STATE);
            toast.success("Sorteio criado com sucesso.");
        } catch (err) {
            console.error("Erro ao criar sorteio", err);
            setActionError("Não foi possível criar o sorteio. Verifique os dados e tente novamente.");
            toast.error("Erro ao criar sorteio.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (uuid: string, status: SorteioStatus) => {
        try {
            const { data: updated } = await api.post<Sorteio>("/sorteio/update", { uuid, status });
            setSorteios(sorteios.map((s) => (s.uuid === uuid ? updated : s)));
            toast.info("Status do sorteio atualizado.");
        } catch (err) {
            console.error("Erro ao atualizar sorteio", err);
            setActionError("Falha ao atualizar o status do sorteio.");
            toast.error("Não foi possível atualizar o status.");
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Deseja remover este sorteio?")) return;
        try {
            await api.post(`/sorteio/delete/${uuid}`);
            setSorteios(sorteios.filter((s) => s.uuid !== uuid));
            toast.success("Sorteio removido.");
        } catch (err) {
            console.error("Erro ao remover sorteio", err);
            setActionError("Não foi possível remover o sorteio.");
            toast.error("Erro ao remover sorteio.");
        }
    };

    const handleChange = (field: keyof SorteioFormState, rawValue: string) => {
        setForm((prev) => {
            switch (field) {
            case "titulo":
                return { ...prev, titulo: sanitizeText(rawValue) };
            case "descricao":
                return { ...prev, descricao: sanitizeMultiline(rawValue) };
            case "precoBilhete":
                return { ...prev, precoBilhete: Number(toPositiveNumber(rawValue)) };
            case "qtdTotalBilhetes":
                return { ...prev, qtdTotalBilhetes: Math.floor(toPositiveNumber(rawValue)) };
            case "dataAgendada":
            case "dataEncerramento":
            case "itemUuid":
                return { ...prev, [field]: rawValue || undefined };
            case "status":
                return { ...prev, status: rawValue as SorteioStatus };
            default:
                return prev;
            }
        });
    };

    const handleFinalize = async (sorteio: Sorteio) => {
        if (!confirm("Deseja finalizar este sorteio? Esta ação escolherá um vencedor automaticamente.")) return;
        setFinalizingId(sorteio.uuid);
        setActionError(undefined);
        try {
            await api.put("/sorteio/finalizar", { uuid: sorteio.uuid, status: true });
            toast.success(`Sorteio "${sorteio.titulo}" finalizado!`);
            setHighlightedWinnerId(sorteio.uuid);
            await refreshAll();
        } catch (err) {
            console.error("Erro ao finalizar sorteio", err);
            setActionError("Não foi possível finalizar o sorteio. Tente novamente.");
            toast.error("Falha ao finalizar sorteio.");
        } finally {
            setFinalizingId(null);
        }
    };
    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px" }}>
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

            {winnerInfo && (
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: "16px",
                        bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 215, 0, 0.08)" : "rgba(255, 215, 0, 0.12)",
                        border: (theme) => `1px solid ${theme.palette.warning.light}`,
                    }}
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                        <EmojiEventsIcon
                            sx={{
                                fontSize: 48,
                                color: "warning.main",
                                animation: `${trophyGlow} 2s ease-in-out infinite`,
                            }}
                        />
                        <Stack spacing={0.5} flex={1}>
                            <Typography variant="h6" fontWeight={800}>
                                Sorteio finalizado: {winnerInfo.raffle.titulo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ganhador: {winnerInfo.raffle.vencedor?.nome ?? "Participante"}
                            </Typography>
                            {winnerInfo.ticket && (
                                <Typography variant="body2" color="text.secondary">
                                    Bilhete vencedor nº {winnerInfo.ticket.numero}
                                </Typography>
                            )}
                            <Chip
                                label="Finalizado"
                                color="success"
                                size="small"
                                sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                            />
                        </Stack>
                    </Stack>
                </Paper>
            )}

            <Paper sx={{ borderRadius: "12px", overflow: { xs: "visible", md: "hidden" } }}>
                {loading ? (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} />
                    </Box>
                ) : isCompactLayout ? (
                    <Box sx={{ p: 2 }}>
                        {sortedSorteios.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum sorteio cadastrado até o momento.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {sortedSorteios.map((sorteio) => (
                                    <Box
                                        key={sorteio.uuid}
                                        sx={{
                                            border: 1,
                                            borderColor: "divider",
                                            borderRadius: "10px",
                                            p: 2,
                                            bgcolor: "background.paper",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Stack spacing={0.75}>
                                            <Typography fontWeight={600}>{sorteio.titulo}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {sorteio.descricao}
                                            </Typography>
                                        </Stack>
                                        <Stack spacing={1} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Status
                                            </Typography>
                                            <Select
                                                value={sorteio.status}
                                                size="small"
                                                onChange={(event) =>
                                                    handleStatusChange(sorteio.uuid, event.target.value as SorteioStatus)
                                                }
                                                sx={{ minWidth: { sm: 160 }, maxWidth: { xs: "100%", sm: 220 } }}
                                            >
                                                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                                                    <MenuItem key={value} value={value}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Bilhetes:
                                            </Typography>
                                            <Chip
                                                label={`${sorteio.qtdVendidos}/${sorteio.qtdTotalBilhetes}`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Stack>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Preço:
                                                </Typography>
                                                <Typography variant="body2">{formatCurrency(sorteio.precoBilhete)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Agendado:
                                                </Typography>
                                                <Typography variant="body2">{formatDate(sorteio.dataAgendada)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Encerramento:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {formatDateTime(sorteio.dataEncerramento)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Item:
                                                </Typography>
                                                <Typography variant="body2">{sorteio.item?.nome ?? "—"}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<EmojiEventsIcon fontSize="small" />}
                                                onClick={() => handleFinalize(sorteio)}
                                                disabled={
                                                    sorteio.status === "FINALIZADO" || finalizingId === sorteio.uuid
                                                }
                                            >
                                                {finalizingId === sorteio.uuid ? "Finalizando..." : "Finalizar"}
                                            </Button>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(sorteio.uuid)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        )}
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
                                                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="warning"
                                                        startIcon={<EmojiEventsIcon />}
                                                        onClick={() => handleFinalize(sorteio)}
                                                        disabled={
                                                            sorteio.status === "FINALIZADO" || finalizingId === sorteio.uuid
                                                        }
                                                    >
                                                        {finalizingId === sorteio.uuid ? "Finalizando..." : "Finalizar"}
                                                    </Button>
                                                    <IconButton color="error" onClick={() => handleDelete(sorteio.uuid)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
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
                                onChange={(e) => handleChange("precoBilhete", e.target.value)}
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
                                onChange={(e) => handleChange("qtdTotalBilhetes", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Item associado"
                                select
                                value={form.itemUuid ?? ""}
                                onChange={(e) => handleChange("itemUuid", e.target.value)}
                                helperText="A imagem do sorteio será a mesma do item selecionado."
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
                                label="Status inicial"
                                select
                                value={form.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                fullWidth
                            >
                                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Imagem do item selecionado
                                </Typography>
                                {selectedItem?.imageUrl ? (
                                    <SecureImage
                                        source={selectedItem.imageUrl}
                                        alt={selectedItem.nome}
                                        sx={{
                                            width: "100%",
                                            borderRadius: 2,
                                            border: 1,
                                            borderColor: "divider",
                                            maxHeight: 220,
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        Selecione um item para visualizar a imagem.
                                    </Typography>
                                )}
                            </Stack>
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
