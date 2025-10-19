import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { User } from "@/types";
import { userService } from "@/services";
import "./UsersSection.scss";

export default function UsersSection() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await userService.list();
                if (active) setUsers(data);
            } catch (err) {
                console.error("Erro ao carregar usuários", err);
                if (active) setError("Não foi possível carregar os usuários.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <Box className="users-section__loading">
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">Carregando usuários...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!users.length) {
        return <Alert severity="info">Nenhum usuário cadastrado até o momento.</Alert>;
    }

    return (
        <TableContainer component={Paper} className="users-section">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell>Telefone</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Criado em</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.uuid}>
                            <TableCell>{user.nome}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.telefone ?? "-"}</TableCell>
                            <TableCell>{user.cpf ?? "-"}</TableCell>
                            <TableCell>
                                {user.createdAt
                                    ? new Intl.DateTimeFormat("pt-BR", {
                                          dateStyle: "short",
                                          timeStyle: "short",
                                      }).format(new Date(user.createdAt))
                                    : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
