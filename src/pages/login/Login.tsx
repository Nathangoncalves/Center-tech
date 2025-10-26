import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Container, Paper, Stack, Typography, TextField, Button, Alert } from "@mui/material";
import Header from "@/components/Header";
import useNgTheme from "@/hooks/useNgTheme";
import { authService } from "@/services";
import "./Login.scss";

export default function Login() {
    const { theme, mode, setMode } = useNgTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? "/gestor";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        if (!email.trim() || !password) {
            setError("Informe e-mail e senha.");
            return;
        }

        setLoading(true);
        try {
            await authService.login({ email: email.trim().toLowerCase(), password });
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Erro ao autenticar", err);
            setError("Falha ao fazer login. Verifique suas credenciais e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Box className="login" sx={{ py: 8 }}>
                <Container maxWidth="sm">
                    <Paper className="login__card" sx={{ p: 4 }}>
                        <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>Acesso do Gestor</Typography>
                            <Typography color="text.secondary" textAlign="center">
                                Informe suas credenciais para acessar o painel de gestão.
                            </Typography>
                        </Stack>
                        <Box component="form" className="login__form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="E-mail"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    fullWidth
                                    required
                                />
                                {error && <Alert severity="error">{error}</Alert>}
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
