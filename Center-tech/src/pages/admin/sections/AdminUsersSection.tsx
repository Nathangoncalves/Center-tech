import { useState } from "react";
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
    const [form, setForm] = useState<UserFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string>();

    const safeUsers = Array.isArray(users) ? users : [];

    const handleChange = (field: keyof UserFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = async () => {
        setSubmitting(true);
        setActionError(undefined);
        try {
            const payload = {
                nome: form.nome.trim(),
                email: form.email.trim().toLowerCase(),
                telefone: form.telefone.trim(),
                cpf: form.cpf.trim() || undefined,
                saldo: Number(form.saldo) || 0,
                senhaHash: form.senha,
                role: form.role,
            };
            const { data: created } = await api.post<User>(
                "/user/criar",
                {
                    nome: payload.nome,
                    email: payload.email,
                    telefone: payload.telefone,
                    cpf: payload.cpf,
                    saldo: payload.saldo,
                    senhaHash: payload.senhaHash,
                },
                { params: { role: payload.role.toLowerCase() } },
            );
            setUsers([...safeUsers, created]);
            setOpen(false);
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("Erro ao criar usuário", err);
            setActionError("Não foi possível criar o usuário. Verifique os dados e tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Deseja remover este usuário?")) return;
        try {
            await api.post(`/user/delete/${uuid}`);
            setUsers(safeUsers.filter((user) => user.uuid !== uuid));
        } catch (err) {
            console.error("Erro ao excluir usuário", err);
            setActionError("Não foi possível remover o usuário. Tente novamente.");
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
                            Usuários cadastrados
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gerencie acesso de clientes e administradores da plataforma.
                        </Typography>
                    </Stack>
                    <Button
                        onClick={() => setOpen(true)}
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
                                {safeUsers.length ? (
                                    safeUsers.map((user) => (
                                        <TableRow key={user.uuid ?? user.email}>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography fontWeight={600}>{user.nome}</Typography>
                                                    {user.cpf && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            CPF: {user.cpf}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.telefone || "—"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ROLE_LABEL[user.role] ?? "—"}
                                                    color={user.role === "ADMIN" ? "secondary" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatCurrency(user.saldo ?? 0)}</TableCell>
                                            <TableCell>{user.createdAt ? formatDateTime(user.createdAt) : "—"}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="error"
                                                    disabled={!user.uuid}
                                                    onClick={() => user.uuid && handleDelete(user.uuid)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Nenhum usuário cadastrado ainda.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={open} onClose={() => (submitting ? null : setOpen(false))} maxWidth="sm" fullWidth>
                <DialogTitle>Novo usuário</DialogTitle>
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
                                label="Saldo inicial"
                                type="number"
                                value={form.saldo}
                                onChange={(e) => handleChange("saldo", Number(e.target.value))}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Senha temporária"
                                type="password"
                                value={form.senha}
                                onChange={(e) => handleChange("senha", e.target.value)}
                                helperText="O usuário poderá alterar a senha após o primeiro acesso."
                                fullWidth
                                required
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
                    <Button onClick={() => setOpen(false)} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCreate} variant="contained" disabled={submitting}>
                        {submitting ? "Salvando..." : "Criar usuário"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
