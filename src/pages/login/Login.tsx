import { FormEvent, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import type { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import api, { setAuthToken } from "../../services/api";
import { UserRole } from "@/types";
import { useToast } from "@/context/ToastContext";
import { sanitizeEmail } from "@/utils/input";
import { setStoredRole } from "@/utils/authStorage";

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
    const [forgotOpen, setForgotOpen] = useState(false);
    const [recoverEmail, setRecoverEmail] = useState("");
    const [recoverFeedback, setRecoverFeedback] = useState<string>();
    const [recoverLoading, setRecoverLoading] = useState(false);
    const toast = useToast();

    const fetchUserRole = async (): Promise<UserRole | undefined> => {
        const endpoints: Array<{ path: string; failureLogLevel: "info" | "warn" }> = [
            { path: "/user/me", failureLogLevel: "info" },
            { path: "/me", failureLogLevel: "warn" },
        ];
        let lastError: unknown;
        for (const { path, failureLogLevel } of endpoints) {
            try {
                const { data } = await api.get<{ role?: UserRole }>(path);
                return data?.role ?? undefined;
            } catch (error) {
                lastError = error;
                const logger = failureLogLevel === "info" ? console.info : console.warn;
                logger(`Endpoint ${path} indisponível, tentando próximo`, error);
            }
        }
        if (lastError) {
            console.error("Não foi possível consultar o perfil do usuário autenticado.", lastError);
        }
        return undefined;
    };

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
            if (!token) {
                setErr("Não recebemos o token de acesso. Tente novamente.");
                setLoading(false);
                return;
            }
            setAuthToken(token);
            const role = await fetchUserRole();
            setStoredRole(role ?? null);
            const destination = (() => {
                const from = state?.from;
                if (from) {
                    if (from.startsWith("/gestor") && role !== UserRole.ADMIN) {
                        return "/participante";
                    }
                    return from;
                }
                return role === UserRole.ADMIN ? "/gestor" : "/participante";
            })();
            toast.success("Login realizado com sucesso!");
            navigate(destination, { replace: true });
        } catch (error) {
            console.error("Falha no login", error);
            setErr("Credenciais inválidas ou servidor indisponível.");
            toast.error("Não foi possível entrar. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!recoverEmail.trim()) {
            setRecoverFeedback("Informe o e-mail cadastrado.");
            return;
        }
        setRecoverLoading(true);
        setRecoverFeedback(undefined);
        try {
            await api.post("/main/esqueci-senha", { email: recoverEmail.trim().toLowerCase() });
            setRecoverFeedback("Enviamos um link de redefinição para o seu e-mail.");
            toast.info("Link de redefinição enviado.");
        } catch (error) {
            console.error("Erro ao solicitar redefinição", error);
            setRecoverFeedback("Não foi possível enviar o link agora. Tente novamente.");
            toast.error("Erro ao enviar link. Tente novamente.");
        } finally {
            setRecoverLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    minHeight: "calc(100vh - 72px)",
                    background: theme.palette.mode === "dark"
                        ? "radial-gradient(120% 120% at 80% 20%, rgba(200,160,255,0.25) 0%, rgba(0,200,200,0.18) 35%, rgba(12,16,24,0.95) 70%)"
                        : "radial-gradient(120% 120% at 80% 20%, rgba(0,200,200,0.25) 0%, rgba(200,160,255,0.18) 30%, rgba(248,249,252,1) 65%)",
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.25 : 0.65),
                            border: `1px solid ${alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.12 : 0.4)}`,
                            boxShadow: "0 40px 80px rgba(15, 23, 42, 0.2)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        <Stack spacing={2.5} alignItems="center" sx={{ mb: 2 }}>
                            <Chip
                                label="Acesso seguro"
                                sx={{
                                    backdropFilter: "blur(10px)",
                                    background: alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.08 : 0.45),
                                    borderRadius: 999,
                                    fontWeight: 700,
                                }}
                            />
                            <Typography variant="h4" fontWeight={800} textAlign="center">
                                Entre na sua conta
                            </Typography>
                            <Typography color="text.secondary" textAlign="center">
                                Faça login para acompanhar sorteios, pagamentos e histórico no painel do participante ou gestor.
                            </Typography>
                        </Stack>

                        <Box component="form" onSubmit={handle}>
                            <Stack spacing={2.2}>
                                <TextField
                                    label="E-mail"
                                    type="email"
                                    value={login}
                                    onChange={(e) => setLogin(sanitizeEmail(e.target.value))}
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            borderRadius: 2,
                                            backdropFilter: "blur(8px)",
                                        },
                                    }}
                                />
                                <TextField
                                    label="Senha"
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    autoFocus
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            borderRadius: 2,
                                            backdropFilter: "blur(8px)",
                                        },
                                    }}
                                />
                                {err && <Alert severity="error">{err}</Alert>}
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{ borderRadius: 999, px: 4, fontWeight: 700, textTransform: "none" }}
                                    >
                                        {loading ? "Entrando..." : "Entrar"}
                                    </Button>
                                    <Button variant="text" onClick={() => setForgotOpen(true)} sx={{ textTransform: "none" }}>
                                        Esqueci minha senha
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </Container>
            </Box>

        <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="E-mail cadastrado"
                        type="email"
                        value={recoverEmail}
                        onChange={(event) => setRecoverEmail(event.target.value)}
                        fullWidth
                    />
                    {recoverFeedback && <Alert severity="info">{recoverFeedback}</Alert>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setForgotOpen(false)}>Cancelar</Button>
                <Button onClick={handleForgotPassword} disabled={recoverLoading}>
                    {recoverLoading ? "Enviando..." : "Enviar link"}
                </Button>
            </DialogActions>
        </Dialog>
    </ThemeProvider>
    );
}
