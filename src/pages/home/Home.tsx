import { useEffect, useMemo, useState } from "react";
import {
    ThemeProvider,
    CssBaseline,
    Container,
    Grid,
    Box,
    Typography,
    Skeleton,
    Paper,
    Stack,
    Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import PublicHero from "@/components/Public/Hero";
import PublicRaffleCard from "@/components/Public/RaffleCard";
import type { Sorteio } from "@/types";
import api from "@/services/api";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import "./Home.scss";

interface Metric {
    label: string;
    value: string;
}

export default function Home() {
    const { theme, mode, setMode } = useNgTheme();
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data } = await api.get<(Sorteio[] | { content?: Sorteio[] } | null)>("/sorteio");
                if (!active) return;
                const normalized = Array.isArray(data)
                    ? data
                    : Array.isArray((data as { content?: Sorteio[] } | null | undefined)?.content)
                        ? ((data as { content?: Sorteio[] }).content ?? [])
                        : [];
                setSorteios(normalized);
            } catch (error) {
                console.error("Erro ao carregar sorteios", error);
                setSorteios([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const metrics = useMemo<Metric[]>(() => {
        const totalRaffles = sorteios.length;
        const ativos = sorteios.filter((raffle) => raffle.status === "ABERTO");
        const totalBilhetesDisponiveis = ativos.reduce(
            (acc, raffle) => acc + Math.max(raffle.qtdTotalBilhetes - raffle.qtdVendidos, 0),
            0,
        );
        const totalPotencial = ativos.reduce(
            (acc, raffle) => acc + raffle.precoBilhete * Math.max(raffle.qtdTotalBilhetes - raffle.qtdVendidos, 0),
            0,
        );
        return [
            { label: "Sorteios ativos", value: formatNumber(ativos.length) },
            { label: "Bilhetes disponíveis", value: formatNumber(totalBilhetesDisponiveis) },
            { label: "Prêmios em disputa", value: formatCurrency(totalPotencial) },
            { label: "Sorteios totais", value: formatNumber(totalRaffles) },
        ];
    }, [sorteios]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="landing">
                <Header mode={mode} setMode={setMode} />
                <PublicHero />

                <section className="landing__metrics">
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            {metrics.map((metric) => (
                                <Grid item xs={12} sm={6} md={3} key={metric.label}>
                                    <Paper
                                        elevation={0}
                                        className="landing__metric-card"
                                        component={motion.div}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <Typography variant="h4" fontWeight={800}>
                                            {metric.value}
                                        </Typography>
                                        <Typography color="text.secondary">{metric.label}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </section>

                <section id="sorteios" className="landing__section">
                <Container maxWidth="lg">
                        <Stack spacing={4}>
                            <Stack
                                component={motion.div}
                                spacing={1.2}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="landing__section-headline"
                            >
                                <Typography variant="overline" sx={{ letterSpacing: "0.28em" }}>
                                    Sorteios oficiais
                                </Typography>
                                <Typography variant="h2" className="landing__section-title">
                                    Sorteios ativos
                                </Typography>
                                <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                                    Prêmios confiáveis, pagamentos instantâneos e transparência total em cada etapa.
                                </Typography>
                            </Stack>
                            {loading ? (
                                <Box className="landing__skeleton-grid">
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <Skeleton key={`skeleton-${idx}`} variant="rounded" className="landing__skeleton" />
                                    ))}
                                </Box>
                            ) : sorteios.length ? (
                                <Grid container spacing={3}>
                                    {sorteios.map((sorteio) => (
                                        <Grid item xs={12} md={4} key={sorteio.uuid}>
                                            <PublicRaffleCard sorteio={sorteio} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper elevation={0} className="landing__empty">
                                    <Typography variant="h5" fontWeight={800}>
                                        Nenhum sorteio disponível agora.
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Assine o nosso WhatsApp para ser avisado sobre os próximos prêmios.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => window.open("https://wa.me/5561999999999", "_blank", "noopener")}
                                        sx={{
                                            px: 4,
                                            py: 1.3,
                                            borderRadius: 999,
                                            fontWeight: 700,
                                            textTransform: "none",
                                        background: alpha(theme.palette.primary.main, 0.8),
                                            boxShadow: "0 20px 40px rgba(14, 116, 144, 0.25)",
                                            backdropFilter: "blur(12px)",
                                        }}
                                    >
                                        Receber avisos
                                    </Button>
                                </Paper>
                            )}
                        </Stack>
                    </Container>
                </section>

                <section className="landing__cta">
                    <Container maxWidth="lg">
                        <Paper elevation={0} className="landing__cta-card">
                            <Stack spacing={1}>
                                <Typography variant="h4" fontWeight={800}>
                                    Centralize seus bilhetes
                                </Typography>
                                <Typography color="text.secondary">
                                    Faça login para acompanhar saldo, pagamentos e confirmações no painel do participante.
                                </Typography>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => window.location.assign("/login")}
                                    sx={{
                                        px: 4,
                                        py: 1.3,
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        boxShadow: "0 18px 32px rgba(79, 70, 229, 0.22)",
                                    }}
                                >
                                    Entrar
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => window.location.assign("/cadastro")}
                                    sx={{
                                        px: 4,
                                        py: 1.3,
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        borderWidth: 2,
                                    }}
                                >
                                    Criar conta
                                </Button>
                            </Stack>
                        </Paper>
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
