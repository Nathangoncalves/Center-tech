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
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import RaffleCard from "../../components/RaffleCard";
import type { Sorteio } from "../../types";
import api from "../../services/api";
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
                <Hero />

                <section className="landing__metrics">
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            {metrics.map((metric) => (
                                <Grid item xs={12} sm={6} md={3} key={metric.label}>
                                    <Paper className="landing__metric-card" elevation={0}>
                                        <Typography variant="h4" fontWeight={900}>{metric.value}</Typography>
                                        <Typography color="text.secondary">{metric.label}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </section>

                <section id="sorteios" className="landing__section">
                    <Container maxWidth="lg">
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Sorteios oficiais</Typography>
                                <Typography variant="h4" fontWeight={900}>Escolha o prêmio e confirme sua participação</Typography>
                            </Box>
                            {loading ? (
                                <Grid container spacing={3}>
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <Grid item xs={12} md={4} key={`skeleton-${idx}`}>
                                            <Skeleton variant="rounded" className="landing__skeleton" />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : sorteios.length ? (
                                <Grid container spacing={3}>
                                    {sorteios.map((sorteio) => (
                                        <Grid item xs={12} md={4} key={sorteio.uuid}>
                                            <RaffleCard sorteio={sorteio} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper elevation={0} className="landing__empty">
                                    <Typography fontWeight={700}>Nenhum sorteio disponível agora.</Typography>
                                    <Typography color="text.secondary">Assine o nosso WhatsApp para ser avisado sobre os próximos prêmios.</Typography>
                                    <Button variant="contained" size="large" onClick={() => window.open("https://wa.me/5561999999999", "_blank", "noopener")}>Receber avisos</Button>
                                </Paper>
                            )}
                        </Stack>
                    </Container>
                </section>

                <section className="landing__cta">
                    <Container maxWidth="lg">
                        <Paper elevation={0} className="landing__cta-card">
                            <Stack spacing={1}>
                                <Typography variant="h4" fontWeight={900}>Centralize seus bilhetes</Typography>
                                <Typography color="text.secondary">
                                    Faça login para acompanhar saldo, pagamentos e confirmações no painel do participante.
                                </Typography>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button variant="contained" size="large" onClick={() => window.location.assign("/login")}>Entrar</Button>
                                <Button variant="outlined" size="large" onClick={() => window.location.assign("/cadastro")}>Criar conta</Button>
                            </Stack>
                        </Paper>
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
