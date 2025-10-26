<<<<<<< HEAD
import { useEffect, useState } from "react";
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
import Winners from "@/components/Winners";
import Regulation from "../../components/Regulation";
import type { Sorteio } from "../../types";
import api from "../../services/api";
import "./Home.scss";

const metrics = [
    { label: "Clientes atendidos", value: "+12k" },
    { label: "Sorteios concluídos", value: "480" },
    { label: "Prêmios pagos", value: "R$ 5.2Mi" },
];

const features = [
    {
        title: "Transparência total",
        description: "Resultados vinculados à Loteria Federal com auditoria pública e comprovantes em tempo real.",
    },
    {
        title: "Pagamentos seguros",
        description: "Aceitamos Pix, cartão e saldo interno com confirmação automática das cotas.",
    },
    {
        title: "Atendimento dedicado",
        description: "Equipe disponível 7 dias por semana para suporte e acompanhamento pós-sorteio.",
    },
];

const steps = [
    "Escolha o sorteio da vez",
    "Selecione e confirme suas cotas",
    "Receba tudo por WhatsApp e e-mail",
    "Acompanhe o resultado ao vivo",
];

const testimonials = [
    {
        author: "Juliana Santos",
        role: "Brasília/DF",
        message: "Ganhei um MacBook com a Centertech. Processo rápido, sem burocracia e com acompanhamento incrível!",
    },
    {
        author: "Marcelo Andrade",
        role: "Goiânia/GO",
        message: "Reservei minhas cotas pelo celular e recebi o prêmio em 3 dias. Transparência nota 10.",
    },
    {
        author: "Luciana Costa",
        role: "Anápolis/GO",
        message: "O painel do participante é excelente. Dá para acompanhar tudo o que comprei e meus bilhetes.",
    },
];
=======
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Grid, Box, Typography, Skeleton, Alert, Stack, Paper } from "@mui/material";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RaffleCard from "@/components/RaffleCard";
import Winners from "@/components/Winners";
import Regulation from "@/components/Regulation";
import Contact from "@/components/Contact";
import useNgTheme from "@/hooks/useNgTheme";
import type { Sorteio } from "@/types";
import { sorteioService, userService } from "@/services";
import "./Home.scss";
>>>>>>> main

export default function Home() {
    const { theme, mode, setMode } = useNgTheme();
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [participantsCount, setParticipantsCount] = useState<number | undefined>();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await sorteioService.listPublic();
                if (!active) return;
                setSorteios(data);
                setError("");
            } catch (error) {
                console.error("Erro ao carregar sorteios", error);
                if (!active) return;
                setError("Não foi possível carregar os sorteios no momento. Tente novamente em instantes.");
                setSorteios([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

<<<<<<< HEAD
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
                                <Grid item xs={12} md={4} key={metric.label}>
                                    <Paper className="landing__metric-card" elevation={0}>
                                        <Typography variant="h3" fontWeight={700}>{metric.value}</Typography>
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
                                <Typography variant="overline" color="text.secondary">Sorteios ativos</Typography>
                                <Typography variant="h4" fontWeight={900}>Escolha o prêmio do momento</Typography>
                            </Box>
                            {loading ? (
                                <Grid container spacing={3}>
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <Grid item xs={12} md={4} key={`skeleton-${idx}`}>
                                            <Skeleton variant="rounded" className="landing__skeleton" />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid container spacing={3}>
                                    {sorteios.map((sorteio) => (
                                        <Grid item xs={12} md={4} key={sorteio.uuid}>
=======
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const users = await userService.list();
                if (!active) return;
                setParticipantsCount(users.length);
            } catch (err) {
                console.error("Erro ao carregar usuários", err);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const scrollHandledRef = useRef(false);

    useEffect(() => {
        const state = location.state as { scrollTo?: string } | null;
        const hashTarget = location.hash ? location.hash.slice(1) : undefined;
        const targetId = state?.scrollTo ?? hashTarget;

        if (!targetId) {
            if (hashTarget) {
                navigate(location.pathname, { replace: true });
            }
            if (!scrollHandledRef.current) {
                window.scrollTo({ top: 0, behavior: "auto" });
            }
            scrollHandledRef.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 80);

        scrollHandledRef.current = true;
        navigate(location.pathname, { replace: true });

        return () => window.clearTimeout(timer);
    }, [location.pathname, location.hash, location.state, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Hero participantsCount={participantsCount} />

            <Box
                id="sorteios"
                className="home__raffles"
                component="section"
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={{ xs: 3, md: 4 }}>
                        <Typography variant="h4" fontWeight={900}>Sorteios Ativos</Typography>
                        {!loading && error && (
                            <Alert severity="warning" sx={{ maxWidth: 560, mx: "auto" }}>
                                {error}
                            </Alert>
                        )}
                        {loading ? (
                            <Grid container spacing={3}>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <Grid item xs={12} md={4} key={`skeleton-${idx}`}>
                                        <Skeleton className="home__skeleton-card" variant="rounded" height={320} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : !error ? (
                            sorteios.length ? (
                                <Grid container spacing={3}>
                                    {sorteios.map((sorteio) => (
                                        <Grid item xs={12} md={4} key={sorteio.id}>
>>>>>>> main
                                            <RaffleCard sorteio={sorteio} />
                                        </Grid>
                                    ))}
                                </Grid>
<<<<<<< HEAD
                            )}
                        </Stack>
                    </Container>
                </section>

                <section className="landing__section landing__features">
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            {features.map((feature) => (
                                <Grid item xs={12} md={4} key={feature.title}>
                                    <Paper elevation={0} className="landing__feature-card">
                                        <Typography variant="h6" fontWeight={700}>{feature.title}</Typography>
                                        <Typography color="text.secondary">{feature.description}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </section>

                <section className="landing__section landing__steps">
                    <Container maxWidth="lg">
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Como funciona</Typography>
                                <Typography variant="h4" fontWeight={900}>Participe em poucos passos</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {steps.map((step, index) => (
                                    <Grid item xs={12} md={3} key={step}>
                                        <Paper elevation={0} className="landing__step-card">
                                            <Typography variant="h3" fontWeight={700}>{index + 1}</Typography>
                                            <Typography>{step}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Container>
                </section>

                <section className="landing__section landing__testimonials">
                    <Container maxWidth="lg">
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="text.secondary">Histórias reais</Typography>
                                <Typography variant="h4" fontWeight={900}>Gente que já levou</Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {testimonials.map((testimonial) => (
                                    <Grid item xs={12} md={4} key={testimonial.author}>
                                        <Paper elevation={0} className="landing__testimonial-card">
                                            <Typography color="text.secondary">“{testimonial.message}”</Typography>
                                            <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2 }}>{testimonial.author}</Typography>
                                            <Typography variant="caption" color="text.secondary">{testimonial.role}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Container>
                </section>

                <section id="contato" className="landing__section landing__cta">
                    <Container maxWidth="lg">
                        <Paper elevation={0} className="landing__cta-card">
                            <Stack spacing={1}>
                                <Typography variant="h4" fontWeight={900}>Pronto para participar?</Typography>
                                <Typography color="text.secondary">
                                    Cadastre-se agora mesmo e comece a acompanhar seus bilhetes pelo painel exclusivo.
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" size="large" onClick={() => window.location.assign("/cadastro")}>Abrir conta</Button>
                                <Button variant="outlined" size="large" onClick={() => window.location.assign("/login")}>
                                    Já participo
                                </Button>
                            </Stack>
                        </Paper>
                    </Container>
                </section>

                <Winners />
                <Regulation />
            </div>
=======
                            ) : (
                                <Paper elevation={0} className="home__empty-card">
                                    <Typography color="text.secondary" textAlign="center">
                                        Ainda não há sorteios disponíveis. Volte em breve!
                                    </Typography>
                                </Paper>
                            )
                        ) : null}
                    </Stack>
                </Container>
            </Box>
            <Winners />
            <Regulation />
            <Contact />
>>>>>>> main
        </ThemeProvider>
    );
}
