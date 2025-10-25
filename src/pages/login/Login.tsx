import { FormEvent, useState } from "react";
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import type { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import api, { setAuthToken } from "../../services/api";

interface LoginResponse {
    token?: string;
    accessToken?: string;
    authorization?: string;
    [key: string]: unknown;
}

const BEARER_PREFIX = /^bearer\s+/i;

function normalizeToken(raw?: string | null): string | null {
    if (!raw) {
        return null;
    }
    const trimmed = raw.trim();
    return BEARER_PREFIX.test(trimmed) ? trimmed.replace(BEARER_PREFIX, "").trim() : trimmed;
}

function extractToken(response: AxiosResponse<LoginResponse>): string | null {
    const bodyToken = normalizeToken(
        response.data?.token ?? response.data?.accessToken ?? response.data?.authorization,
    );
    const headerToken = normalizeToken(response.headers?.authorization);
    return bodyToken ?? headerToken ?? null;
}

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
            const response = await api.post<LoginResponse>("/main/login", {
                email: login.trim().toLowerCase(),
                password: pass,
            });
            const token = extractToken(response);
            setAuthToken(token);
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
                <Typography variant="h4" fontWeight={800}>Login</Typography>
                <Typography color="text.secondary">Seja bem vindo!, acesse com suas credenciais para entrar na nossa área de login.</Typography>
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
