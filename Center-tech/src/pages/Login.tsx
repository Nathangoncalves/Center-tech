import { FormEvent, useState } from "react";
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useNgTheme from "../hooks/useNgTheme";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const { theme, mode, setMode } = useNgTheme();
    const { login } = useAuth();
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const loc = useLocation() as any;

    const handle = (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (login(pass)) {
        navigate(loc?.state?.from?.pathname || "/gestor", { replace: true });
    } else {
        setErr("Senha inválida.");
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
                    label="Senha"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                    autoFocus
                />
                {err && <Alert severity="error">{err}</Alert>}
                <Button type="submit" variant="contained" size="large">Entrar</Button>
                </Stack>
            </Box>
            </Paper>
        </Container>
        </Box>
    </ThemeProvider>
    );
}