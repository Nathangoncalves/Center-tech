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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency } from "../../../utils/formatters";
import api from "../../../services/api";

interface ItemFormState {
    nome: string;
    descricao: string;
    imageUrl: string;
    valor: number;
}

const INITIAL_STATE: ItemFormState = {
    nome: "",
    descricao: "",
    imageUrl: "",
    valor: 0,
};

export default function AdminItemsSection() {
    const { items, setItems, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);
    const [form, setForm] = useState<ItemFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();
    const theme = useTheme();
    const isCompactLayout = useMediaQuery(theme.breakpoints.down("md"));

    const sortedItems = useMemo(
        () => [...items].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })),
        [items],
    );

    const openDialog = (item?: Item) => {
        if (item) {
            setEditing(item);
            setForm({
                nome: item.nome,
                descricao: item.descricao,
                imageUrl: item.imageUrl,
                valor: item.valor,
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
            if (editing) {
                const { data: updated } = await api.post<Item>("/item/update", {
                    uuid: editing.uuid,
                    nome: form.nome.trim(),
                    descricao: form.descricao.trim(),
                    imageUrl: form.imageUrl.trim(),
                    valor: Number(form.valor) || 0,
                });
                setItems(items.map((item) => (item.uuid === editing.uuid ? updated : item)));
            } else {
                const { data: created } = await api.post<Item>("/item/criar", {
                    nome: form.nome.trim(),
                    descricao: form.descricao.trim(),
                    imageUrl: form.imageUrl.trim(),
                    valor: Number(form.valor) || 0,
                });
                setItems([...items, created]);
            }
            setOpen(false);
        } catch (err) {
            console.error("Erro ao salvar item", err);
            setActionError("Não foi possível salvar o item. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Deseja remover este item?")) return;
        try {
            await api.post(`/item/delete/${uuid}`);
            setItems(items.filter((item) => item.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao remover item", err);
            setActionError("Não foi possível remover o item.");
        }
    };

    const handleChange = (field: keyof ItemFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
                            Itens / Prêmios
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cadastre os prêmios que serão associados aos sorteios.
                        </Typography>
                    </Stack>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => openDialog()}>
                        Novo item
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ borderRadius: "12px", overflow: { xs: "visible", md: "hidden" } }}>
                {loading ? (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} />
                    </Box>
                ) : isCompactLayout ? (
                    <Box sx={{ p: 2 }}>
                        {sortedItems.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum item cadastrado ainda.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {sortedItems.map((item) => (
                                    <Box
                                        key={item.uuid}
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
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography fontWeight={700}>{item.nome}</Typography>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton onClick={() => openDialog(item)} color="primary" size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(item.uuid)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Valor estimado:
                                            </Typography>
                                            <Typography variant="body2">{formatCurrency(item.valor)}</Typography>
                                        </Stack>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">
                                                Imagem (URL)
                                            </Typography>
                                            <Typography variant="body2">{item.imageUrl || "—"}</Typography>
                                        </Stack>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">
                                                Descrição
                                            </Typography>
                                            <Typography variant="body2">{item.descricao}</Typography>
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
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Valor estimado</TableCell>
                                    <TableCell>Imagem</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhum item cadastrado ainda.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedItems.map((item) => (
                                        <TableRow key={item.uuid}>
                                            <TableCell>
                                                <Typography fontWeight={600}>{item.nome}</Typography>
                                            </TableCell>
                                            <TableCell>{formatCurrency(item.valor)}</TableCell>
                                            <TableCell sx={{ maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {item.imageUrl || "—"}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 260 }}>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.descricao}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => openDialog(item)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(item.uuid)} color="error">
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
                <DialogTitle>{editing ? "Editar item" : "Novo item"}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome"
                                value={form.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Descrição"
                                value={form.descricao}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                                multiline
                                minRows={3}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Imagem (URL)"
                                value={form.imageUrl}
                                onChange={(e) => handleChange("imageUrl", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Valor estimado"
                                type="number"
                                inputProps={{ step: 0.01 }}
                                value={form.valor}
                                onChange={(e) => handleChange("valor", Number(e.target.value))}
                                fullWidth
                                required
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
                    <Button onClick={closeDialog} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : editing ? "Atualizar item" : "Criar item"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
