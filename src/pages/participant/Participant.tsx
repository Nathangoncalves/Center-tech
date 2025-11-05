import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from "@mui/material";
import useNgTheme from "@/hooks/useNgTheme";
import AddIcon from "@mui/icons-material/Add";
import Header from "@/components/Header";
import RaffleCard from "@/components/RaffleCard";
import type { Bilhete, PaymentBill, PaymentMetadata, Sorteio, Transacao, User } from "@/types";
import api from "@/services/api";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import "./Participant.scss";
import { useToast } from "@/context/ToastContext";
import { sanitizeCode, sanitizeEmail, sanitizePhone, sanitizeText } from "@/utils/input";
import LaunchIcon from "@mui/icons-material/Launch";

const toValidUrl = (candidate: string | undefined, fallback: string): string => {
    if (typeof candidate === "string") {
        const trimmed = candidate.trim();
        if (trimmed) {
            try {
                return new URL(trimmed).toString();
            } catch {
                // ignore invalid values and fall back
            }
        }
    }
    return fallback;
};

const resolveAppOrigin = (): string => {
    const fallbackOrigin = toValidUrl(import.meta.env.VITE_APP_BASE_URL, "https://center.tech");
    if (typeof window !== "undefined") {
        try {
            return new URL(window.location.href).origin;
        } catch {
            // ignore and fall back to env/default origin
        }
    }
    return fallbackOrigin;
};

const APP_ORIGIN = resolveAppOrigin().replace(/\/+$/, "");
const PAYMENT_RETURN_URL = toValidUrl(
    import.meta.env.VITE_PAYMENT_RETURN_URL,
    `${APP_ORIGIN}/pagamento/retorno`,
);
const PAYMENT_SUCCESS_URL = toValidUrl(
    import.meta.env.VITE_PAYMENT_COMPLETION_URL ?? import.meta.env.VITE_PAYMENT_SUCCESS_URL,
    `${APP_ORIGIN}/pagamento/sucesso`,
);

interface PaymentRequestPayload {
    metodos: string[];
    produtos: Array<{
        externalId: string;
        name: string;
        description: string;
        quantity: number;
        price: number;
    }>;
    returnUrl: string;
    successUrl: string;
    completionUrl: string;
    retornoUrl: string;
    sucessoUrl: string;
    cliente: PaymentMetadata;
}

export default function Participant() {
    const { theme, mode, setMode } = useNgTheme();
    const [profile, setProfile] = useState<User | null>(null);
    const [profileForm, setProfileForm] = useState({ nome: "", telefone: "", cpf: "" });
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingRaffles, setLoadingRaffles] = useState(true);
    const [errorProfile, setErrorProfile] = useState("");
    const [errorRaffles, setErrorRaffles] = useState("");
    const [activeTab, setActiveTab] = useState<"dashboard" | "payments" | "settings">("dashboard");
    const [profileSaving, setProfileSaving] = useState(false);
    const [cartItems, setCartItems] = useState<Array<{ raffleUuid: string; quantity: number }>>([
        { raffleUuid: "", quantity: 1 },
    ]);
    const [couponInput, setCouponInput] = useState("");
    const [paymentMetadata, setPaymentMetadata] = useState<PaymentMetadata>({
        name: "",
        cellphone: "",
        email: "",
        taxId: "",
    });
    const [metadataDirty, setMetadataDirty] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [lastBill, setLastBill] = useState<PaymentBill | null>(null);
    const [transactions, setTransactions] = useState<Transacao[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [errorTransactions, setErrorTransactions] = useState("");
    const [tickets, setTickets] = useState<Bilhete[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [errorTickets, setErrorTickets] = useState("");
    const toast = useToast();

    useEffect(() => {
        void fetchProfile();
        void fetchRaffles();
    }, []);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const { data } = await api.get<User>("/user/me");
            setProfile(data ?? null);
            setProfileForm({
                nome: sanitizeText(data?.nome ?? ""),
                telefone: sanitizePhone(data?.telefone ?? ""),
                cpf: data?.cpf ?? "",
            });
            setErrorProfile("");
        } catch (error) {
            console.error("Erro ao carregar perfil do participante", error);
            setProfile(null);
            setErrorProfile("Não foi possível carregar seu cadastro agora.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchRaffles = async () => {
        setLoadingRaffles(true);
        try {
            const { data } = await api.get<Sorteio[]>("/sorteio");
            setSorteios(Array.isArray(data) ? data : []);
            setErrorRaffles("");
        } catch (error) {
            console.error("Erro ao carregar sorteios", error);
            setSorteios([]);
            setErrorRaffles("Não foi possível carregar os sorteios no momento.");
        } finally {
            setLoadingRaffles(false);
        }
    };

    const fetchTransactions = useCallback(async (userUuid: string) => {
        setLoadingTransactions(true);
        try {
            const { data } = await api.get<Transacao[]>(`/transacao/listar/${userUuid}`);
            setTransactions(Array.isArray(data) ? data : []);
            setErrorTransactions("");
        } catch (error) {
            console.error("Erro ao carregar transações do participante", error);
            setTransactions([]);
            setErrorTransactions("Não foi possível carregar o histórico de transações.");
        } finally {
            setLoadingTransactions(false);
        }
    }, []);

    const fetchTickets = useCallback(
        async (userUuid: string, fallbackName?: string) => {
            setLoadingTickets(true);
            try {
                const { data } = await api.get<Bilhete[]>("/bilhete");
                const list = Array.isArray(data) ? data : [];
                const normalizedName = fallbackName?.trim()?.toLowerCase();
                const filtered = list.filter((ticket) => {
                    const ticketUser = ticket.user?.uuid;
                    if (ticketUser && ticketUser === userUuid) return true;
                    if (!ticketUser && normalizedName && ticket.nome?.trim()?.toLowerCase() === normalizedName) return true;
                    return false;
                });
                setTickets(filtered);
                setErrorTickets("");
            } catch (error) {
                console.error("Erro ao carregar bilhetes do participante", error);
                setTickets([]);
                setErrorTickets("Não foi possível carregar seus bilhetes agora.");
            } finally {
                setLoadingTickets(false);
            }
        },
        [],
    );

    const sortedRaffles = useMemo(
        () => [...sorteios].sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0)),
        [sorteios],
    );

    useEffect(() => {
        if (!profile) {
            setPaymentMetadata({
                name: "",
                cellphone: "",
                email: "",
                taxId: "",
            });
            setMetadataDirty(false);
            return;
        }
        if (metadataDirty) return;
        setPaymentMetadata({
            name: sanitizeText(profile.nome ?? ""),
            cellphone: sanitizePhone(profile.telefone ?? ""),
            email: sanitizeEmail(profile.email ?? ""),
            taxId: profile.cpf ?? "",
        });
    }, [profile, metadataDirty]);

    useEffect(() => {
        if (!sortedRaffles.length) return;
        setCartItems((prev) => {
            if (!prev.length) {
                return [{ raffleUuid: sortedRaffles[0].uuid, quantity: 1 }];
            }
            let changed = false;
            const updated = prev.map((item) => {
                if (!item.raffleUuid) {
                    changed = true;
                    return { ...item, raffleUuid: sortedRaffles[0].uuid };
                }
                return item;
            });
            return changed ? updated : prev;
        });
    }, [sortedRaffles]);

    useEffect(() => {
        if (!profile?.uuid) {
            setTransactions([]);
            setErrorTransactions("");
            return;
        }
        void fetchTransactions(profile.uuid);
    }, [profile?.uuid, fetchTransactions]);

    useEffect(() => {
        if (!profile?.uuid) {
            setTickets([]);
            setErrorTickets("");
            return;
        }
        void fetchTickets(profile.uuid, profile.nome);
    }, [profile?.uuid, profile?.nome, fetchTickets]);

    const resetPaymentFeedback = () => {
        setLastBill(null);
    };

    const handleRefreshTransactions = () => {
        if (profile?.uuid) {
            void fetchTransactions(profile.uuid);
        }
    };

    const handleRefreshTickets = () => {
        if (profile?.uuid) {
            void fetchTickets(profile.uuid, profile.nome);
        }
    };

    const handleMetadataChange = (field: keyof PaymentMetadata, rawValue: string) => {
        setMetadataDirty(true);
        resetPaymentFeedback();
        setPaymentMetadata((prev) => {
            switch (field) {
            case "name":
                return { ...prev, name: sanitizeText(rawValue) };
            case "cellphone":
                return { ...prev, cellphone: sanitizePhone(rawValue) };
            case "email":
                return { ...prev, email: sanitizeEmail(rawValue) };
            case "taxId":
                return { ...prev, taxId: rawValue.replace(/[^0-9]/g, "") };
            default:
                return prev;
            }
        });
    };

    const handleCartItemChange = (index: number, field: "raffleUuid" | "quantity", rawValue: string) => {
        resetPaymentFeedback();
        setCartItems((prev) =>
            prev.map((item, idx) => {
                if (idx !== index) return item;
                if (field === "raffleUuid") {
                    return { ...item, raffleUuid: rawValue };
                }
                const parsed = Math.max(1, Number.parseInt(rawValue, 10) || 1);
                return { ...item, quantity: parsed };
            }),
        );
    };

    const handleAddCartItem = () => {
        resetPaymentFeedback();
        const defaultRaffle =
            sortedRaffles.find((raffle) => !cartItems.some((item) => item.raffleUuid === raffle.uuid))?.uuid ??
            sortedRaffles[0]?.uuid ??
            "";
        setCartItems((prev) => [...prev, { raffleUuid: defaultRaffle, quantity: 1 }]);
    };

    const handleRemoveCartItem = (index: number) => {
        resetPaymentFeedback();
        setCartItems((prev) => {
            if (prev.length === 1) {
                return [{ raffleUuid: "", quantity: 1 }];
            }
            return prev.filter((_, idx) => idx !== index);
        });
    };

    const handleCouponChange = (value: string) => {
        resetPaymentFeedback();
        setCouponInput(sanitizeCode(value));
    };

    const cartDetails = useMemo(() => {
        return cartItems.map((item) => {
            const raffle = sortedRaffles.find((r) => r.uuid === item.raffleUuid) ?? null;
            const price = raffle ? raffle.precoBilhete : 0;
            const subtotal = price * item.quantity;
            return { ...item, raffle, price, subtotal };
        });
    }, [cartItems, sortedRaffles]);

    const cartTotal = useMemo(
        () => cartDetails.reduce((acc, current) => acc + current.subtotal, 0),
        [cartDetails],
    );

    const sortedTransactions = useMemo(() => {
        if (!transactions.length) return [];
        return [...transactions].sort((a, b) => {
            if (a.data && b.data) {
                return b.data.localeCompare(a.data);
            }
            if (a.data) return -1;
            if (b.data) return 1;
            return 0;
        });
    }, [transactions]);

    const handleProfileInput = (field: "nome" | "telefone" | "cpf", value: string) => {
        setProfileForm((prev) => {
            let next = value;
            if (field === "nome") {
                next = sanitizeText(value);
            } else if (field === "telefone") {
                next = sanitizePhone(value);
            } else if (field === "cpf") {
                next = value.replace(/[^0-9.-]/g, "");
            }
            return { ...prev, [field]: next };
        });
    };

    const handleUpdateProfile = async () => {
        setProfileSaving(true);
        try {
            await api.put("/user/me", {
                nome: profileForm.nome.trim(),
                telefone: profileForm.telefone.trim(),
                cpf: profileForm.cpf?.trim() || undefined,
            });
            toast.success("Dados atualizados.");
            await fetchProfile();
        } catch (error) {
            console.error("Erro ao atualizar perfil", error);
            toast.error("Não foi possível atualizar seus dados agora.");
        } finally {
            setProfileSaving(false);
        }
    };

    const handleGeneratePayment = async () => {
        if (!profile) {
            toast.error("Carregando perfil do participante. Tente novamente em instantes.");
            return;
        }

        const trimmedMetadata: PaymentMetadata = {
            name: paymentMetadata.name.trim(),
            cellphone: paymentMetadata.cellphone.trim(),
            email: paymentMetadata.email.trim(),
            taxId: paymentMetadata.taxId.trim(),
        };

        if (!trimmedMetadata.name || !trimmedMetadata.email) {
            toast.warning("Preencha nome e e-mail para gerar o link de pagamento.");
            return;
        }

        const products = cartDetails
            .filter((item) => item.raffle)
            .map((item) => {
                const raffle = item.raffle!;
                const externalId = raffle.item?.uuid ?? raffle.uuid;
                const name = raffle.item?.nome?.trim() || raffle.titulo?.trim() || "Bilhete";
                const description = raffle.item?.descricao?.trim() || raffle.descricao?.trim() || name;
                const price = Math.round(raffle.precoBilhete * 100); // envio em centavos
                return {
                    externalId,
                    name,
                    description,
                    quantity: item.quantity,
                    price,
                };
            });

        if (!products.length) {
            toast.warning("Adicione pelo menos um sorteio ao carrinho.");
            return;
        }

        if (!PAYMENT_RETURN_URL || !PAYMENT_SUCCESS_URL) {
            console.error("Configuração de URLs de pagamento ausente.", {
                returnUrl: PAYMENT_RETURN_URL,
                successUrl: PAYMENT_SUCCESS_URL,
            });
            toast.error("Configuração de retorno de pagamento ausente. Entre em contato com o suporte.");
            return;
        }

        const payload: PaymentRequestPayload = {
            metodos: ["PIX"],
            produtos: products,
            returnUrl: PAYMENT_RETURN_URL,
            successUrl: PAYMENT_SUCCESS_URL,
            completionUrl: PAYMENT_SUCCESS_URL,
            retornoUrl: PAYMENT_RETURN_URL,
            sucessoUrl: PAYMENT_SUCCESS_URL,
            cliente: trimmedMetadata,
        };

        setPaymentLoading(true);
        resetPaymentFeedback();
        try {
            const { data } = await api.post<PaymentBill>("/pagamentos/gerar", payload);
            setLastBill(data);
            void fetchTransactions(profile.uuid);
            void fetchTickets(profile.uuid, profile.nome);
            const paymentUrl = data?.url;
            if (paymentUrl) {
                toast.success("Link de pagamento gerado. Vamos abrir em uma nova aba.");
                window.open(paymentUrl, "_blank", "noopener,noreferrer");
            } else {
                toast.success("Link de pagamento gerado.");
            }
        } catch (error) {
            console.error("Erro ao gerar pagamento", error);
            toast.error("Não foi possível gerar o link de pagamento.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleCopyPaymentLink = async () => {
        if (!lastBill?.url) return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(lastBill.url);
                toast.success("Link copiado para a área de transferência.");
            } else {
                throw new Error("Clipboard API indisponível");
            }
        } catch (error) {
            console.error("Erro ao copiar link de pagamento", error);
            toast.error("Não foi possível copiar o link automaticamente.");
        }
    };

    const renderPayments = () => {
        const nameError = !paymentMetadata.name.trim();
        const emailError = !paymentMetadata.email.trim();
        const missingPhone = !paymentMetadata.cellphone.trim();
        const missingTaxId = !paymentMetadata.taxId.trim();
        const hasRaffles = sortedRaffles.length > 0;
        const cartHasRaffle = cartDetails.some((item) => Boolean(item.raffle));
        const disableGenerate =
            paymentLoading || nameError || emailError || !cartHasRaffle;

        return (
            <Stack spacing={3}>
                <Paper elevation={0} className="participant-page__panel">
                    <Stack spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="overline" color="text.secondary">Pagamentos</Typography>
                        <Typography variant="h5" fontWeight={800}>Gerar link de cobrança</Typography>
                        <Typography color="text.secondary">
                            Monte o carrinho com os sorteios desejados e confirme seus dados para gerar o link via AbacatePay.
                        </Typography>
                    </Stack>

                    <Stack spacing={2}>
                        <Typography variant="subtitle2">Dados do comprador</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Nome completo"
                                    value={paymentMetadata.name}
                                    onChange={(event) => handleMetadataChange("name", event.target.value)}
                                    required
                                    error={nameError}
                                    helperText={nameError ? "Informe o nome para seguir com o pagamento." : undefined}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="E-mail"
                                    value={paymentMetadata.email}
                                    onChange={(event) => handleMetadataChange("email", event.target.value)}
                                    required
                                    error={emailError}
                                    helperText={emailError ? "Informe um e-mail válido." : "Utilizaremos este e-mail no comprovante."}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Telefone / WhatsApp"
                                    value={paymentMetadata.cellphone}
                                    onChange={(event) => handleMetadataChange("cellphone", event.target.value)}
                                    helperText={missingPhone ? "Preencha para agilizar a confirmação do pagamento." : undefined}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="CPF/CNPJ"
                                    value={paymentMetadata.taxId}
                                    onChange={(event) => handleMetadataChange("taxId", event.target.value)}
                                    helperText={missingTaxId ? "Informe o documento fiscal para notas e recibos." : undefined}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack spacing={2} sx={{ mt: 3 }}>
                        <Typography variant="subtitle2">Carrinho</Typography>
                        {!hasRaffles && (
                            <Alert severity="info">Nenhum sorteio disponível no momento.</Alert>
                        )}
                        {cartItems.map((item, index) => {
                            const detail = cartDetails[index];
                            return (
                                <Grid container spacing={2} alignItems="flex-end" key={`cart-item-${index}`}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            label="Sorteio"
                                            value={item.raffleUuid}
                                            onChange={(event) => handleCartItemChange(index, "raffleUuid", event.target.value)}
                                            fullWidth
                                            disabled={!hasRaffles}
                                            helperText={
                                                !hasRaffles ? "Cadastre sorteios para montar o carrinho." : undefined
                                            }
                                        >
                                            {!hasRaffles ? (
                                                <MenuItem value="">
                                                    <em>Nenhum sorteio disponível</em>
                                                </MenuItem>
                                            ) : (
                                                sortedRaffles.map((raffle) => (
                                                    <MenuItem key={raffle.uuid} value={raffle.uuid}>
                                                        {raffle.titulo}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2}>
                                        <TextField
                                            label="Quantidade"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            value={item.quantity}
                                            onChange={(event) => handleCartItemChange(index, "quantity", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={3}>
                                        <TextField
                                            label="Subtotal"
                                            value={detail.raffle ? formatCurrency(detail.subtotal) : "-"}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={1}>
                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() => handleRemoveCartItem(index)}
                                            disabled={cartItems.length === 1}
                                            fullWidth
                                        >
                                            Remover
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        })}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddCartItem}
                            disabled={!hasRaffles}
                            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                        >
                            Adicionar sorteio
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                            Valor estimado: {formatCurrency(cartTotal)}
                        </Typography>
                    </Stack>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Cupom (opcional)"
                                value={couponInput}
                                onChange={(event) => handleCouponChange(event.target.value)}
                                helperText="Caso possua um cupom promocional, informe o código aqui."
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    {lastBill?.url && (
                        <Alert severity="success" sx={{ mt: 3 }}>
                            <Stack spacing={1}>
                                <Typography fontWeight={700}>Link de pagamento gerado!</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tipo: {lastBill.tipo ?? "—"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Método: {lastBill.metodoPagamento ?? "—"}
                                </Typography>
                                {Number.isFinite(lastBill.valor) && (
                                    <Typography variant="body2" color="text.secondary">
                                        Valor total: {formatCurrency(lastBill.valor)}
                                    </Typography>
                                )}
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                    <TextField value={lastBill.url} fullWidth InputProps={{ readOnly: true }} />
                                    <Button variant="outlined" onClick={handleCopyPaymentLink}>
                                        Copiar link
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => window.open(lastBill.url, "_blank", "noopener,noreferrer")}
                                    >
                                        Abrir link
                                    </Button>
                                </Stack>
                            </Stack>
                        </Alert>
                    )}

                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={1}
                        >
                            <Typography variant="subtitle2">Meus bilhetes</Typography>
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleRefreshTickets}
                                disabled={loadingTickets || !profile?.uuid}
                            >
                                {loadingTickets ? "Atualizando..." : "Recarregar"}
                            </Button>
                        </Stack>
                        {errorTickets && <Alert severity="error">{errorTickets}</Alert>}
                        {loadingTickets ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <Grid item xs={12} md={4} key={`ticket-skeleton-${idx}`}>
                                        <Skeleton variant="rounded" height={120} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : tickets.length ? (
                            <Grid container spacing={2}>
                                {tickets.map((ticket) => {
                                    const sorteioLabel = ticket.nomeSorteio ?? ticket.sorteio?.titulo ?? "Sorteio";
                                    const purchaseLabel = ticket.dataCompra ? formatDateTime(ticket.dataCompra) : "—";
                                    const statusInfo = ticket.pago
                                        ? { label: "Pago", color: "success" as const }
                                        : { label: "Pendente", color: "warning" as const };
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={ticket.uuid}>
                                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                                                <Stack spacing={1.5}>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="subtitle1" fontWeight={700} noWrap title={sorteioLabel}>
                                                            {sorteioLabel}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Bilhete nº {ticket.numero}
                                                        </Typography>
                                                    </Stack>
                                                    <Chip
                                                        size="small"
                                                        label={statusInfo.label}
                                                        color={statusInfo.color}
                                                        sx={{ alignSelf: "flex-start" }}
                                                    />
                                                    <Stack spacing={0.25}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Comprado em
                                                        </Typography>
                                                        <Typography variant="body2">{purchaseLabel}</Typography>
                                                    </Stack>
                                                    {ticket.nome && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Reservado para {ticket.nome}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <Alert severity="info">Você ainda não possui bilhetes registrados.</Alert>
                        )}
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Stack spacing={2}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={1}
                        >
                            <Typography variant="subtitle2">Histórico de transações</Typography>
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleRefreshTransactions}
                                disabled={loadingTransactions || !profile?.uuid}
                            >
                                {loadingTransactions ? "Atualizando..." : "Recarregar"}
                            </Button>
                        </Stack>
                        {errorTransactions && <Alert severity="error">{errorTransactions}</Alert>}
                        {loadingTransactions ? (
                            <Skeleton variant="rounded" height={160} />
                        ) : sortedTransactions.length ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Método</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Referência</TableCell>
                                            <TableCell>Comprovante</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedTransactions.map((txn) => {
                                            const amount = Number(txn.valor);
                                            const hasValidAmount = Number.isFinite(amount);
                                            return (
                                                <TableRow key={txn.uuid}>
                                                    <TableCell>{formatDateTime(txn.data)}</TableCell>
                                                    <TableCell>{txn.tipo}</TableCell>
                                                    <TableCell>{txn.metodoPagamento}</TableCell>
                                                    <TableCell>{hasValidAmount ? formatCurrency(amount) : "—"}</TableCell>
                                                    <TableCell>{txn.referencia ?? "—"}</TableCell>
                                                    <TableCell>
                                                        {txn.url ? (
                                                            <Button
                                                                size="small"
                                                                endIcon={<LaunchIcon fontSize="small" />}
                                                                href={txn.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Abrir
                                                            </Button>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info">Nenhuma transação encontrada para este participante.</Alert>
                        )}
                    </Stack>

                    <Stack spacing={1.5} sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGeneratePayment}
                            disabled={disableGenerate}
                        >
                            {paymentLoading ? "Gerando..." : "Pagar"}
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        );
    };

    const renderDashboard = () => (
        <Stack spacing={4}>
            <Paper elevation={0} className="participant-page__hero">
                <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">Área do participante</Typography>
                    <Typography variant="h4" fontWeight={800}>Olá, {profile?.nome ?? "participante"}!</Typography>
                    <Typography color="text.secondary">
                        Acompanhe seus sorteios favoritos e utilize as ações rápidas para garantir seus bilhetes.
                    </Typography>
                </Stack>
                <div className="participant-page__metrics">
                    <Metric label="Bilhetes ativos" value={tickets.length ? String(tickets.length) : "0"} />
                    <Metric label="Status do cadastro" value={profile ? "Ativo" : "Pendente"} />
                    <Metric label="Última atualização" value={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString("pt-BR") : "-"} />
                </div>
            </Paper>

            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2, flexWrap: "wrap" }}>
                    <Typography variant="h5" fontWeight={800}>Sorteios em destaque</Typography>
                </Stack>
                {errorRaffles && <Alert severity="error" sx={{ mb: 2 }}>{errorRaffles}</Alert>}
                {loadingRaffles ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <Grid item xs={12} md={4} key={`raffle-skeleton-${idx}`}>
                                <Skeleton variant="rounded" className="participant-page__skeleton" />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {sortedRaffles.map((raffle) => (
                            <Grid item xs={12} md={4} key={raffle.uuid}>
                                <RaffleCard sorteio={raffle} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
    const renderSettings = () => (
        <Paper elevation={0} className="participant-page__panel">
            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="overline" color="text.secondary">Configurações</Typography>
                <Typography variant="h5" fontWeight={800}>Dados do participante</Typography>
                <Typography color="text.secondary">Atualize seus dados básicos para manter a conta em dia.</Typography>
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Nome completo"
                        value={profileForm.nome}
                        onChange={(event) => handleProfileInput("nome", event.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Telefone / WhatsApp"
                        value={profileForm.telefone}
                        onChange={(event) => handleProfileInput("telefone", event.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="CPF"
                        value={profileForm.cpf}
                        onChange={(event) => handleProfileInput("cpf", event.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="E-mail"
                        value={profile?.email ?? ""}
                        disabled
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={handleUpdateProfile} disabled={profileSaving}>
                    {profileSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
                <Button variant="outlined" size="large" onClick={fetchProfile}>
                    Recarregar dados
                </Button>
            </Stack>
        </Paper>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="participant-page">
                <Header mode={mode} setMode={setMode} />
                <Box sx={{ py: 6 }}>
                    <Container maxWidth="lg">
                        {errorProfile && <Alert severity="error" sx={{ mb: 3 }}>{errorProfile}</Alert>}
                        <Paper elevation={0} className="participant-page__nav">
                            <Tabs
                                value={activeTab}
                                onChange={(_, value: "dashboard" | "payments" | "settings") => setActiveTab(value)}
                                variant="scrollable"
                                allowScrollButtonsMobile
                            >
                                <Tab value="dashboard" label="Painel" />
                                <Tab value="payments" label="Pagamentos" />
                                <Tab value="settings" label="Configurações" />
                            </Tabs>
                        </Paper>

                        <Box sx={{ mt: 4 }}>
                            {loadingProfile ? (
                                <Skeleton variant="rounded" height={280} className="participant-page__skeleton" />
                            ) : (
                                <>
                                    {activeTab === "dashboard" && renderDashboard()}
                                    {activeTab === "payments" && renderPayments()}
                                    {activeTab === "settings" && renderSettings()}
                                </>
                            )}
                        </Box>
                    </Container>
                </Box>
            </div>
        </ThemeProvider>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="participant-page__metric">
            <Typography variant="overline" color="text.secondary">{label}</Typography>
            <Typography variant="h5" fontWeight={800}>{value}</Typography>
        </div>
    );
}
