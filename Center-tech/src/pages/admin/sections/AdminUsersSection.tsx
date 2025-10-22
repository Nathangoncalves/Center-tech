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
    FormControl,
    Grid,
    IconButton,
    InputLabel,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import type { User, UserRole } from "../../../types";
import { useAdminData } from "../AdminDataProvider";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import api from "../../../services/api";

const ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: "Administrador",
    CLIENTE: "Cliente",
};

interface UserFormState {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha: string;
    role: UserRole;
    saldo: number;
}

const INITIAL_STATE: UserFormState = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    role: "CLIENTE",
    saldo: 0,
};

export default function AdminUsersSection() {
    const { users, setUsers, loading, error } = useAdminData();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [form, setForm] = useState<UserFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();
    const [listError, setListError] = useState<string>();

    const safeUsers = useMemo(
        () => (Array.isArray(users) ? users : []),
        [users],
    );

    const sortedUsers = useMemo(
        () =>
            [...safeUsers].sort((a, b) =>
                (a.nome ?? "").localeCompare(b.nome ?? "", "pt-BR", { sensitivity: "base" }),
            ),
        [safeUsers],
    );

    const openDialog = (user?: User) => {
        if (user) {
            setEditing(user);
            setForm({
                nome: user.nome ?? "",
                email: user.email ?? "",
                telefone: user.telefone ?? "",
                cpf: user.cpf ?? "",
                senha: "",
                role: (user.role ?? "CLIENTE") as UserRole,
                saldo: typeof user.saldo === "number" && Number.isFinite(user.saldo) ? user.saldo : 0,
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
        setEditing(null);
    };

    const handleChange = (field: keyof UserFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setActionError(undefined);
        setListError(undefined);

        const saldoValue = Number.isFinite(form.saldo) ? form.saldo : 0;

        const basePayload = {
            nome: form.nome.trim(),
            email: form.email.trim().toLowerCase(),
            telefone: form.telefone.trim() || undefined,
            cpf: form.cpf.trim() || undefined,
            role: form.role,
            saldo: saldoValue,
        };

        try {
            if (editing) {
                const { data: updated } = await api.post<User>("/user/update", {
                    uuid: editing.uuid,
                    ...basePayload,
                    senha: form.senha ? form.senha : undefined,
                });
                setUsers(safeUsers.map((user) => (user.uuid === updated.uuid ? updated : user)));
            } else {
                if (!form.senha.trim()) {
                    setActionError("Informe uma senha temporária para o novo usuário.");
                    setSubmitting(false);
                    return;
                }
                const { data: created } = await api.post<User>("/user/criar", {
                    ...basePayload,
                    senha: form.senha,
                });
                setUsers([...safeUsers, created]);
            }

            setOpen(false);
            setEditing(null);
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("Erro ao salvar usuário", err);
            setActionError("Não foi possível salvar o usuário. Verifique os dados e tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid?: string) => {
        if (!uuid) {
            setListError("Não foi possível identificar o usuário para exclusão.");
            return;
        }
        if (!confirm("Deseja remover este usuário?")) return;
        try {
            setListError(undefined);
            await api.post(`/user/delete/${uuid}`);
            setUsers(safeUsers.filter((user) => user.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao excluir usuário", err);
            setListError("Não foi possível remover o usuário. Tente novamente.");
        }
    };

    return (
        <Stack spacing={3}>
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            {listError && (
                <Alert severity="error" onClose={() => setListError(undefined)}>
                    {listError}
                </Alert>
            )}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Usuários cadastrados
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gerencie acesso de clientes e administradores da plataforma.
                        </Typography>
                    </Stack>
                    <Button
                        onClick={() => openDialog()}
                        startIcon={<AddIcon />}
                        variant="contained"
                        size="large"
                    >
                        Novo usuário
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ p: 3 }}>
                        <Skeleton variant="rounded" height={48} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={48} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={48} />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefone</TableCell>
                                    <TableCell>Perfil</TableCell>
                                    <TableCell>Saldo</TableCell>
                                    <TableCell>Criado em</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhum usuário cadastrado até o momento.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedUsers.map((user) => {
                                        const roleLabel = ROLE_LABEL[(user.role ?? "CLIENTE") as UserRole] ?? "—";
                                        return (
                                            <TableRow key={user.uuid}>
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        <Typography fontWeight={600}>{user.nome ?? "—"}</Typography>
                                                        {user.cpf && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                CPF: {user.cpf}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{user.email ?? "—"}</TableCell>
                                                <TableCell>{user.telefone || "—"}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={roleLabel}
                                                        color={user.role === "ADMIN" ? "secondary" : "default"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{formatCurrency(user.saldo ?? 0)}</TableCell>
                                                <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" onClick={() => openDialog(user)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => handleDelete(user.uuid)}>
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
                <DialogTitle>{editing ? "Editar usuário" : "Novo usuário"}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome completo"
                                value={form.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Telefone"
                                value={form.telefone}
                                onChange={(e) => handleChange("telefone", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="CPF"
                                value={form.cpf}
                                onChange={(e) => handleChange("cpf", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="role-label">Perfil</InputLabel>
                                <Select
                                    labelId="role-label"
                                    label="Perfil"
                                    value={form.role}
                                    onChange={(e) => handleChange("role", e.target.value as UserRole)}
                                >
                                    <MenuItem value="CLIENTE">Cliente</MenuItem>
                                    <MenuItem value="ADMIN">Administrador</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Saldo"
                                type="number"
                                inputProps={{ step: 0.01 }}
                                value={form.saldo}
                                onChange={(e) => {
                                    const parsed = Number(e.target.value);
                                    handleChange("saldo", Number.isNaN(parsed) ? 0 : parsed);
                                }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={editing ? "Nova senha (opcional)" : "Senha temporária"}
                                type="password"
                                value={form.senha}
                                onChange={(e) => handleChange("senha", e.target.value)}
                                helperText={
                                    editing
                                        ? "Preencha para redefinir a senha do usuário."
                                        : "O usuário poderá alterar a senha após o primeiro acesso."
                                }
                                fullWidth
                                required={!editing}
                            />
                        </Grid>
                    </Grid>

                    {actionError && (
                        <Alert sx={{ mt: 2 }} severity="error" onClose={() => setActionError(undefined)}>
                            {actionError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : editing ? "Atualizar usuário" : "Criar usuário"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
