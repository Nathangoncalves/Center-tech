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
                                            <RaffleCard sorteio={sorteio} />
                                        </Grid>
                                    ))}
                                </Grid>
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
        </ThemeProvider>
    );
}
