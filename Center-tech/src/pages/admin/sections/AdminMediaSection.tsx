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
import EditIcon from "@mui/icons-material/Edit";
import type { Midia, Sorteio, TipoMidia } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import api from "../../../services/api";

interface MediaFormState {
    url: string;
    tipo: TipoMidia;
    sorteioUuid?: string;
}

const INITIAL_STATE: MediaFormState = {
    url: "",
    tipo: "BANNER",
    sorteioUuid: undefined,
};

const TIPO_LABEL: Record<TipoMidia, string> = {
    BANNER: "Banner",
    GALERIA: "Galeria",
    VIDEO: "Vídeo",
};

export default function AdminMediaSection() {
    const { midias, setMidias, sorteios, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Midia | null>(null);
    const [form, setForm] = useState<MediaFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();

    const sortedMidias = useMemo(
        () =>
            [...midias].sort(
                (a, b) =>
                    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
            ),
        [midias],
    );

    const openDialog = (media?: Midia) => {
        if (media) {
            setEditing(media);
            setForm({
                url: media.url,
                tipo: media.tipo,
                sorteioUuid: media.sorteio?.uuid,
            });
        } else {
            setEditing(null);
            setForm(INITIAL_STATE);
        }
        setActionError(undefined);
        setOpen(true);
    };

    const closeDialog = () => {
        if (submitting) return;
        setOpen(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const sorteioUuid = form.sorteioUuid?.trim();
            const sorteioPayload = sorteioUuid ? sorteioUuid : null;
            if (editing) {
                const { data: updated } = await api.post<Midia>("/midia/update", {
                    uuid: editing.uuid,
                    url: form.url.trim(),
                    tipo: form.tipo,
                    sorteio: sorteioPayload,
                });
                setMidias(midias.map((m) => (m.uuid === editing.uuid ? updated : m)));
            } else {
                const { data: created } = await api.post<Midia>("/midia/criar", {
                    url: form.url.trim(),
                    tipo: form.tipo,
                    sorteio: sorteioPayload,
                });
                setMidias([created, ...midias]);
            }
            setOpen(false);
        } catch (err) {
            console.error("Erro ao salvar mídia", err);
            setActionError("Não foi possível salvar a mídia. Verifique os dados e tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Deseja remover esta mídia?")) return;
        try {
            await api.post(`/midia/delete/${uuid}`);
            setMidias(midias.filter((m) => m.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao remover mídia", err);
            setActionError("Não foi possível remover a mídia.");
        }
    };

    const handleChange = (field: keyof MediaFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Biblioteca de mídias
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Adicione banners, galerias e vídeos para ilustrar os sorteios.
                        </Typography>
                    </Stack>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => openDialog()}>
                        Nova mídia
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
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Sorteio</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedMidias.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhuma mídia cadastrada ainda.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedMidias.map((media) => (
                                        <TableRow key={media.uuid}>
                                            <TableCell>{TIPO_LABEL[media.tipo]}</TableCell>
                                            <TableCell sx={{ maxWidth: 260 }}>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {media.url}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{media.sorteio?.titulo ?? "—"}</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="primary" onClick={() => openDialog(media)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDelete(media.uuid)}>
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

            <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editing ? "Editar mídia" : "Nova mídia"}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="URL"
                                value={form.url}
                                onChange={(e) => handleChange("url", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Tipo"
                                select
                                value={form.tipo}
                                onChange={(e) => handleChange("tipo", e.target.value)}
                                fullWidth
                                required
                            >
                                {Object.entries(TIPO_LABEL).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Sorteio"
                                select
                                value={form.sorteioUuid ?? ""}
                                onChange={(e) => handleChange("sorteioUuid", e.target.value)}
                                fullWidth
                                helperText="Opcional — vincule a um sorteio específico."
                            >
                                <MenuItem value="">
                                    <em>Sem vínculo</em>
                                </MenuItem>
                                {sorteios.map((sorteio: Sorteio) => (
                                    <MenuItem key={sorteio.uuid} value={sorteio.uuid}>
                                        {sorteio.titulo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {actionError && (
                        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setActionError(undefined)}>
                            {actionError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : editing ? "Atualizar mídia" : "Criar mídia"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
