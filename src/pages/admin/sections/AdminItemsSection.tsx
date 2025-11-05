import { ChangeEvent, useMemo, useState } from "react";
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
import SecureImage from "@/components/SecureImage";
import { useSecureImage } from "@/hooks/useSecureImage";
import { extractFilenameFromContentDisposition } from "@/utils/contentDisposition";
import axios from "axios";

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

const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
    });

export default function AdminItemsSection() {
    const { items, setItems, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);
    const [form, setForm] = useState<ItemFormState>(INITIAL_STATE);
    const [localPreview, setLocalPreview] = useState<string>("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();
    const theme = useTheme();
    const isCompactLayout = useMediaQuery(theme.breakpoints.down("md"));

    const sortedItems = useMemo(
        () => [...items].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })),
        [items],
    );

    const { url: secureImageUrl } = useSecureImage(form.imageUrl);
    const previewSource = localPreview || secureImageUrl;

    const openDialog = (item?: Item) => {
        if (item) {
            setEditing(item);
            setForm({
                nome: item.nome,
                descricao: item.descricao,
                imageUrl: item.imageUrl,
                valor: item.valor,
            });
            setLocalPreview("");
        } else {
            setEditing(null);
            setForm(INITIAL_STATE);
            setLocalPreview("");
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
        if (uploadingImage) {
            setActionError("Aguarde o envio da imagem antes de salvar.");
            setSubmitting(false);
            return;
        }
        if (!form.imageUrl?.trim()) {
            setActionError("Anexe uma imagem para o item.");
            setSubmitting(false);
            return;
        }
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
            setLocalPreview("");
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

    const getHeaderValue = (headers: unknown, headerName: string): string | undefined => {
        if (!headers || typeof headers !== "object") return undefined;

        const maybeGet = (headers as { get?: (name: string) => string | null | undefined }).get;
        if (typeof maybeGet === "function") {
            const value = maybeGet.call(headers, headerName);
            if (typeof value === "string" && value.trim()) return value;
            const lowerValue = maybeGet.call(headers, headerName.toLowerCase());
            if (typeof lowerValue === "string" && lowerValue.trim()) return lowerValue;
        }

        const target = headerName.toLowerCase();
        try {
            const entries = Object.entries(headers as Record<string, unknown>);
            for (const [key, value] of entries) {
                if (key.toLowerCase() !== target) continue;
                if (typeof value === "string" && value.trim()) return value;
                if (Array.isArray(value)) {
                    const first = value.find((entry) => typeof entry === "string" && entry.trim());
                    if (typeof first === "string" && first.trim()) return first;
                }
            }
        } catch {
        }
        return undefined;
    };

    const isLikelyFilename = (raw: string): boolean => /\.[a-z0-9]{2,}$/i.test(raw.trim());

    const ensureCandidate = (raw?: string | null): string | undefined => {
        if (!raw) return undefined;
        const trimmed = raw.trim().replace(/^['"]|['"]$/g, "");
        if (!trimmed) return undefined;
        const sanitized = trimmed.replace(/[?#].*$/, "").replace(/\\/g, "/");

        const parts = [
            sanitized,
            ...sanitized.split(/[;,]/).map((part) => part.trim()),
            ...sanitized.split(/[:=]/).map((part) => part.trim()),
        ];

        for (const part of parts) {
            if (part && isLikelyFilename(part)) {
                return part;
            }
        }

        const matches = sanitized.match(/[\w./-]+\.[A-Za-z0-9]{2,}/g);
        if (matches) {
            for (let idx = matches.length - 1; idx >= 0; idx -= 1) {
                const candidate = matches[idx];
                if (candidate && isLikelyFilename(candidate)) {
                    return candidate;
                }
            }
        }
        return undefined;
    };

    const RESPONSE_CANDIDATE_KEYS = [
        "fileName",
        "filename",
        "path",
        "url",
        "imageUrl",
        "imageURL",
        "imagem",
        "imagemUrl",
        "caminho",
        "img",
        "location",
        "storedPath",
        "storedFilename",
    ];

    const RESPONSE_NESTED_KEYS = [
        "data",
        "payload",
        "result",
        "response",
        "body",
        "content",
        "file",
        "image",
        "imagem",
        "img",
        "meta",
        "metadata",
        "details",
    ];

    const extractCandidateFromUnknown = (value: unknown, depth = 0): string | undefined => {
        if (value == null || depth > 5) return undefined;

        if (typeof value === "string") {
            const fromString = ensureCandidate(value);
            if (fromString) return fromString;
            const trimmed = value.trim();
            if (depth < 4 && trimmed) {
                const isJsonLike =
                    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
                    (trimmed.startsWith("[") && trimmed.endsWith("]"));
                if (isJsonLike) {
                    try {
                        const parsed = JSON.parse(trimmed) as unknown;
                        return extractCandidateFromUnknown(parsed, depth + 1);
                    } catch {
                        // Ignore parse errors
                    }
                }
            }
            return undefined;
        }

        if (Array.isArray(value)) {
            for (const entry of value) {
                const fromEntry = extractCandidateFromUnknown(entry, depth + 1);
                if (fromEntry) return fromEntry;
            }
            return undefined;
        }

        if (typeof value === "object") {
            const record = value as Record<string, unknown>;
            for (const key of RESPONSE_CANDIDATE_KEYS) {
                const candidate = record[key];
                if (typeof candidate === "string") {
                    const ensured = ensureCandidate(candidate);
                    if (ensured) return ensured;
                }
            }

            for (const key of RESPONSE_NESTED_KEYS) {
                const nested = extractCandidateFromUnknown(record[key], depth + 1);
                if (nested) return nested;
            }

            if (depth < 2) {
                for (const nestedValue of Object.values(record)) {
                    const nestedCandidate = extractCandidateFromUnknown(nestedValue, depth + 1);
                    if (nestedCandidate) return nestedCandidate;
                }
            }
        }

        return undefined;
    };

    const extractUploadedPath = (payload: unknown, headers?: unknown): string | undefined => {
        const disposition = getHeaderValue(headers, "content-disposition");
        const dispositionFilename = extractFilenameFromContentDisposition(disposition);
        const fromDisposition = ensureCandidate(dispositionFilename ?? disposition);
        if (fromDisposition) return fromDisposition;

        const headerFallbacks = ["x-file-name", "x-filename", "content-location", "location"];
        for (const header of headerFallbacks) {
            const ensured = ensureCandidate(getHeaderValue(headers, header));
            if (ensured) return ensured;
        }

        return extractCandidateFromUnknown(payload);
    };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        setActionError(undefined);
        try {
            const dataUrl = await readFileAsDataUrl(file);
            setLocalPreview(dataUrl);

            const data = new FormData();
            data.append("img", file);
            const response = await api.post("/item/upload/img", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const uploadedPath = extractUploadedPath(response.data, response.headers);
            if (!uploadedPath) {
                console.warn("Upload de imagem não retornou filename.", {
                    headers: response.headers,
                    data: response.data,
                });
                setActionError("O servidor não retornou o identificador da imagem. Verifique o header Content-Disposition.");
                setLocalPreview("");
                return;
            }
            setForm((prev) => ({ ...prev, imageUrl: uploadedPath }));
        } catch (err) {
            console.error("Erro ao enviar imagem do item", err);
            if (axios.isAxiosError(err) && err.response?.status === 413) {
                setActionError("Imagem muito grande. Envie um arquivo com até 2 MB.");
            } else {
                setActionError("Falha ao enviar a imagem. Tente novamente.");
            }
            setLocalPreview("");
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, imageUrl: "" }));
        setLocalPreview("");
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
                                {sortedItems.map((item) => {
                                    const hasImage = Boolean(item.imageUrl?.trim());
                                    return (
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
                                            <Stack spacing={0.75}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Imagem
                                                </Typography>
                                                {hasImage ? (
                                                    <SecureImage
                                                        source={item.imageUrl}
                                                        fallbackSrc="/assets/img/png/image.png"
                                                        alt={item.nome}
                                                        sx={{
                                                            width: "100%",
                                                            maxHeight: 180,
                                                            objectFit: "cover",
                                                            borderRadius: 1.5,
                                                            border: 1,
                                                            borderColor: "divider",
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="body2">—</Typography>
                                                )}
                                            </Stack>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Descrição
                                                </Typography>
                                                <Typography variant="body2">{item.descricao}</Typography>
                                            </Stack>
                                        </Box>
                                    );
                                })}
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
                                    sortedItems.map((item) => {
                                        const hasImage = Boolean(item.imageUrl?.trim());
                                        return (
                                            <TableRow key={item.uuid}>
                                                <TableCell>
                                                    <Typography fontWeight={600}>{item.nome}</Typography>
                                                </TableCell>
                                                <TableCell>{formatCurrency(item.valor)}</TableCell>
                                                <TableCell sx={{ width: 140 }}>
                                                    {hasImage ? (
                                                        <SecureImage
                                                            source={item.imageUrl}
                                                            fallbackSrc="/assets/img/png/image.png"
                                                            alt={item.nome}
                                                            sx={{
                                                                width: 120,
                                                                height: 80,
                                                                objectFit: "cover",
                                                                borderRadius: 1,
                                                                border: 1,
                                                                borderColor: "divider",
                                                            }}
                                                        />
                                                    ) : (
                                                        "—"
                                                    )}
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
                                        );
                                    })
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
                            <Stack spacing={1}>
                                <Button variant="outlined" component="label" disabled={uploadingImage}>
                                    {uploadingImage ? "Enviando imagem..." : "Anexar imagem"}
                                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                </Button>
                                {previewSource ? (
                                    <Box
                                        component="img"
                                        src={previewSource}
                                        alt={form.nome || "Pré-visualização do item"}
                                        sx={{
                                            width: "100%",
                                            maxHeight: 200,
                                            objectFit: "cover",
                                            borderRadius: 1.5,
                                            border: 1,
                                            borderColor: "divider",
                                        }}
                                    />
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        Nenhuma imagem selecionada.
                                    </Typography>
                                )}
                                {previewSource && !uploadingImage && (
                                    <Button variant="text" color="error" size="small" onClick={handleRemoveImage} sx={{ alignSelf: "flex-start" }}>
                                        Remover imagem
                                    </Button>
                                )}
                            </Stack>
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
