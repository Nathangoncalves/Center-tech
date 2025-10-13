import { useEffect, useState } from "react";
import {
    Box, Button, Container, IconButton, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useNgTheme from "../hooks/useNgTheme";
import Header from "../components/Header";
import { listUsers, deleteUser, clearUsers } from "../lib/db";
import type { User } from "../types";

function exportCsv(rows: User[]) {
    const headers = ["id","nome","email","telefone","cpf","aceitouTermos","createdAt"];
    const body = rows.map(r => [
    r.id, r.nome, r.email, r.telefone, r.cpf ?? "", r.aceitouTermos ? "true" : "false", r.createdAt
    ]);
    const csv = [headers, ...body].map(a => a.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cadastros.csv"; a.click();
    URL.revokeObjectURL(url);
}

export default function Admin() {
    const { theme, mode, setMode } = useNgTheme();
    const [rows, setRows] = useState<User[]>([]);

    const load = () => setRows(listUsers());
    useEffect(() => { load(); }, []);

    const handleDelete = (id: string) => { deleteUser(id); load(); };
    const handleClear = () => { if (confirm("Remover todos os cadastros?")) { clearUsers(); load(); } };

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} setMode={setMode} />
        <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Gestor — Cadastros</Typography>
            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={load}>Atualizar</Button>
                <Button variant="outlined" onClick={() => exportCsv(rows)} disabled={!rows.length}>Exportar CSV</Button>
                <Button color="error" variant="contained" onClick={handleClear}>Limpar Todos</Button>
            </Stack>
            </Stack>

            <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Criado em</TableCell>
                    <TableCell align="right">Ações</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6}>
                        <Typography color="text.secondary">Nenhum cadastro ainda.</Typography>
                    </TableCell>
                    </TableRow>
                ) : rows.map(u => (
                    <TableRow key={u.id}>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.telefone}</TableCell>
                    <TableCell>{u.cpf || "-"}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDelete(u.id)}>
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Container>
        </Box>
    </ThemeProvider>
    );
}