import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import RaffleCard from "@/components/RaffleCard";
import type { Sorteio, User } from "@/types";
import api from "@/services/api";
import { formatCurrency } from "@/utils/formatters";
import "./Participant.scss";

const PAYMENT_PORTAL_URL = "https://pagamentos.centertech.com/bilhetes";

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
    const [balanceValue, setBalanceValue] = useState("");
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [paymentCode, setPaymentCode] = useState("");
    const [paymentValue, setPaymentValue] = useState("");
    const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

    useEffect(() => {
        void fetchProfile();
        void fetchRaffles();
    }, []);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        setSettingsFeedback(null);
        try {
            const { data } = await api.get<User>("/user/me");
            setProfile(data ?? null);
            setProfileForm({
                nome: data?.nome ?? "",
                telefone: data?.telefone ?? "",
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

    const saldo = formatCurrency(profile?.saldo ?? 0);

    const sortedRaffles = useMemo(
        () => [...sorteios].sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0)),
        [sorteios],
    );

    const handleUpdateProfile = async () => {
        setProfileSaving(true);
        setSettingsFeedback(null);
        try {
            await api.put("/user/me", {
                nome: profileForm.nome.trim(),
                telefone: profileForm.telefone.trim(),
                cpf: profileForm.cpf?.trim() || undefined,
            });
            setSettingsFeedback("Dados atualizados com sucesso.");
            await fetchProfile();
        } catch (error) {
            console.error("Erro ao atualizar perfil", error);
            setSettingsFeedback("Não foi possível atualizar seus dados agora.");
        } finally {
            setProfileSaving(false);
        }
    };

    const handleAddBalance = async () => {
        if (!balanceValue) {
            setSettingsFeedback("Informe um valor para adicionar ao saldo.");
            return;
        }
        const valor = Number(balanceValue.replace(/,/g, "."));
        if (Number.isNaN(valor) || valor <= 0) {
            setSettingsFeedback("Valor inválido.");
            return;
        }
        setBalanceLoading(true);
        setSettingsFeedback(null);
        try {
            await api.post("/financeiro/me/saldo", { valor });
            setSettingsFeedback("Solicitação registrada! Atualizaremos seu saldo em instantes.");
            setBalanceValue("");
            await fetchProfile();
        } catch (error) {
            console.error("Erro ao adicionar saldo", error);
            setSettingsFeedback("Não foi possível registrar a solicitação de saldo.");
        } finally {
            setBalanceLoading(false);
        }
    };

    const handlePaymentLink = () => {
        const url = new URL(PAYMENT_PORTAL_URL);
        if (paymentCode.trim()) {
            url.searchParams.set("ticket", paymentCode.trim());
        }
        if (paymentValue.trim()) {
            url.searchParams.set("amount", paymentValue.trim());
        }
        window.open(url.toString(), "_blank", "noopener,noreferrer");
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
                    <Metric label="Saldo disponível" value={saldo} />
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

    const renderPayments = () => (
        <Stack spacing={3}>
            <Paper elevation={0} className="participant-page__panel">
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="overline" color="text.secondary">Pagamentos rápidos</Typography>
                    <Typography variant="h5" fontWeight={800}>Gerar link oficial</Typography>
                    <Typography color="text.secondary">Informe o código do seu bilhete e o valor que deseja quitar. Abriremos o portal oficial em uma nova aba.</Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Código do bilhete"
                            value={paymentCode}
                            onChange={(event) => setPaymentCode(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Valor (opcional)"
                            value={paymentValue}
                            onChange={(event) => setPaymentValue(event.target.value)}
                            fullWidth
                            placeholder="Ex: 25.00"
                        />
                    </Grid>
                </Grid>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                    <Button variant="contained" size="large" onClick={handlePaymentLink}>Abrir link de pagamento</Button>
                    <Button variant="outlined" size="large" onClick={() => window.open(PAYMENT_PORTAL_URL, "_blank", "noopener,noreferrer")}>Ver todos os pagamentos</Button>
                </Stack>
            </Paper>

            <Paper elevation={0} className="participant-page__panel">
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="overline" color="text.secondary">Saldo interno</Typography>
                    <Typography variant="h5" fontWeight={800}>Adicionar saldo manualmente</Typography>
                    <Typography color="text.secondary">Preencha o valor e confirme para enviar uma solicitação à equipe Centertech.</Typography>
                </Stack>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Valor"
                            value={balanceValue}
                            onChange={(event) => setBalanceValue(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button fullWidth size="large" variant="contained" onClick={handleAddBalance} disabled={balanceLoading}>
                            {balanceLoading ? "Enviando..." : "Solicitar crédito"}
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                    Nossa equipe confirma o pagamento e libera o saldo em até 15 minutos (horário comercial).
                </Typography>
            </Paper>
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
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, nome: event.target.value }))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Telefone / WhatsApp"
                        value={profileForm.telefone}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, telefone: event.target.value }))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="CPF"
                        value={profileForm.cpf}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, cpf: event.target.value }))}
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
            {settingsFeedback && <Alert severity="info" sx={{ mt: 2 }}>{settingsFeedback}</Alert>}
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
