import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Paper,
    Stack,
    ThemeProvider,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import api, { getAuthToken } from "@/services/api";
import type { Transacao, User } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

interface FallbackTransaction {
    uuid?: string;
    valor?: number;
    metodoPagamento?: string;
    tipo?: string;
    referencia?: string | null;
    url?: string | null;
    data?: string | null;
}

export default function PaymentSuccess() {
    const { theme, mode, setMode } = useNgTheme();
    const [searchParams] = useSearchParams();
    const [transaction, setTransaction] = useState<Transacao | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [needsAuth, setNeedsAuth] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);

    const transactionUuid = searchParams.get("uuid") ?? undefined;

    const fallbackData: FallbackTransaction = useMemo(() => {
        const parsedAmount = Number.parseFloat(searchParams.get("valor") ?? "");
        return {
            uuid: transactionUuid,
            valor: Number.isFinite(parsedAmount) ? parsedAmount : undefined,
            metodoPagamento: searchParams.get("metodo") ?? searchParams.get("method") ?? undefined,
            tipo: searchParams.get("tipo") ?? searchParams.get("status") ?? undefined,
            referencia: searchParams.get("referencia") ?? null,
            url: searchParams.get("url") ?? null,
            data: searchParams.get("data") ?? null,
        };
    }, [searchParams, transactionUuid]);

    useEffect(() => {
        let isMounted = true;
        const token = getAuthToken();
        if (!token) {
            setNeedsAuth(true);
            setLoading(false);
            return () => {
                isMounted = false;
            };
        }

        const loadTransaction = async () => {
            setLoading(true);
            try {
                const { data: user } = await api.get<User>("/user/me");
                if (!isMounted) return;
                setProfile(user ?? null);

                if (!user?.uuid) {
                    setTransaction(null);
                    setError("Não foi possível identificar o participante desta transação.");
                    return;
                }

                const { data } = await api.get<Transacao[]>(`/transacao/listar/${user.uuid}`);
                if (!isMounted) return;
                const list = Array.isArray(data) ? data : [];
                if (transactionUuid) {
                    const matched = list.find((item) => item.uuid === transactionUuid) ?? null;
                    setTransaction(matched);
                } else {
                    setTransaction(list.length ? list[0] : null);
                }
                setError("");
            } catch (rawError) {
                if (!isMounted) return;
                console.error("Erro ao carregar confirmação de pagamento", rawError);
                const axiosError = rawError as AxiosError;
                if (axiosError?.response?.status === 401) {
                    setNeedsAuth(true);
                    setError("");
                    setProfile(null);
                    setTransaction(null);
                } else {
                    setError("Não foi possível carregar os detalhes do pagamento. Tente novamente em instantes.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadTransaction();

        return () => {
            isMounted = false;
        };
    }, [transactionUuid]);

    const resolvedTransaction = transaction ?? fallbackData;
    const hasDetails = Boolean(transaction) || Boolean(fallbackData.uuid);
    const resolvedAmount = resolvedTransaction.valor;
    const resolvedUrl = resolvedTransaction.url ?? undefined;
    const resolvedDate = resolvedTransaction.data ? formatDateTime(resolvedTransaction.data) : "—";
    const amountLabel =
        typeof resolvedAmount === "number" && Number.isFinite(resolvedAmount) ? formatCurrency(resolvedAmount) : "—";
    const referenceLabel = resolvedTransaction.referencia?.trim() || "—";
    const methodLabel = resolvedTransaction.metodoPagamento ?? "—";
    const IconComponent = needsAuth || error ? InfoIcon : CheckCircleIcon;
    const iconColor = needsAuth || error ? "info" : "success";

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Box sx={{ py: 8 }}>
                <Container maxWidth="sm">
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }} elevation={0}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <IconComponent color={iconColor as "success" | "info"} sx={{ fontSize: 64 }} />
                            <Typography variant="h4" fontWeight={800}>Pagamento confirmado!</Typography>
                            <Typography color="text.secondary">
                                Recebemos a confirmação do seu pagamento. Os detalhes ficam disponíveis na sua área do participante.
                            </Typography>
                            {needsAuth && (
                                <Alert severity="info" sx={{ width: "100%", textAlign: "left" }}>
                                    Faça login para visualizar o comprovante completo desta transação.
                                </Alert>
                            )}
                            {error && !needsAuth && (
                                <Alert severity="error" sx={{ width: "100%", textAlign: "left" }}>{error}</Alert>
                            )}
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                hasDetails && (
                                    <Stack spacing={2} sx={{ width: "100%", textAlign: "left" }}>
                                        <Detail label="Código da transação" value={resolvedTransaction.uuid ?? "—"} />
                                        <Detail label="Valor total" value={amountLabel} />
                                        <Detail label="Método de pagamento" value={methodLabel} />
                                        <Detail label="Tipo" value={resolvedTransaction.tipo ?? "—"} />
                                        <Detail label="Referência" value={referenceLabel} />
                                        <Detail label="Data" value={resolvedDate} />
                                        {resolvedUrl && (
                                            <Button
                                                variant="outlined"
                                                href={resolvedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                                            >
                                                Abrir comprovante
                                            </Button>
                                        )}
                                    </Stack>
                                )
                            )}
                            {profile?.nome && (
                                <Typography variant="body2" color="text.secondary">
                                    Participante: {profile.nome}
                                </Typography>
                            )}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                                <Button variant="contained" href="/participante">
                                    Ir para área do participante
                                </Button>
                                <Button variant="outlined" href="/">
                                    Voltar para a home
                                </Button>
                                {needsAuth && (
                                    <Button variant="text" href="/login">
                                        Fazer login
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
            <Typography fontWeight={600}>{value}</Typography>
        </Stack>
    );
}
