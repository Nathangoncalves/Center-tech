import { FormEvent, useState } from "react";
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import { authService } from "../../services";

export default function Login() {
    const { theme, mode, setMode } = useNgTheme();
    const [login, setLogin] = useState("admin@gmail.com");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: { from?: string } };
    const redirectTo = state?.from ?? "/gestor";

    const handle = async (e: FormEvent) => {
        e.preventDefault();
        setErr("");
        if (!login || !pass) {
            setErr("Informe e-mail e senha.");
            return;
        }
        setLoading(true);
        try {
            await authService.login({ email: login.trim().toLowerCase(), password: pass });
            navigate(redirectTo, { replace: true });
        } catch (error) {
            console.error("Falha no login", error);
            setErr("Credenciais inválidas ou servidor indisponível.");
        } finally {
            setLoading(false);
        }
    };
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} setMode={setMode} />
        <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
            <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight={800}>Login do Gestor</Typography>
                <Typography color="text.secondary">Acesse o painel de cadastros.</Typography>
            </Stack>
            <Box component="form" onSubmit={handle}>
                <Stack spacing={2}>
                <TextField
                    label="Email"
                    type="email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    label="Senha"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                    autoFocus
                />
                {err && <Alert severity="error">{err}</Alert>}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
                </Stack>
            </Box>
            </Paper>
        </Container>
        </Box>
    </ThemeProvider>
    );
}
