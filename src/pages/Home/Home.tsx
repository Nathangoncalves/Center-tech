import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Grid, Box, Typography, Skeleton } from "@mui/material";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RaffleCard from "@/components/RaffleCard";
import Winners from "@/components/Winners";
import Regulation from "@/components/Regulation";
import Contact from "@/components/Contact";
import useNgTheme from "@/hooks/useNgTheme";
import type { Sorteio } from "@/types";
import { sorteioService } from "@/services";
import "./Home.scss";

export default function Home() {
    const { theme, mode, setMode } = useNgTheme();
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await sorteioService.list();
                if (active) setSorteios(data);
            } catch (error) {
                console.error("Erro ao carregar sorteios", error);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const state = location.state as { scrollTo?: string } | null;
        const targetId = state?.scrollTo ?? (location.hash ? location.hash.slice(1) : undefined);
        if (!targetId) return;

        const timer = window.setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);

        if (state?.scrollTo) {
            navigate(`${location.pathname}${location.hash}`, { replace: true, state: undefined });
        }

        return () => window.clearTimeout(timer);
    }, [location, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Hero />

            <Box id="sorteios" className="home__raffles" sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Sorteios Ativos</Typography>
                    {loading ? (
                        <Grid container spacing={3}>
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <Grid item xs={12} md={4} key={`skeleton-${idx}`}>
                                    <Skeleton variant="rounded" height={320} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={3}>
                            {sorteios.map((sorteio) => (
                                <Grid item xs={12} md={4} key={sorteio.uuid}>
                                    <RaffleCard sorteio={sorteio} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Winners />
            <Regulation />
            <Contact />
        </ThemeProvider>
    );
}
