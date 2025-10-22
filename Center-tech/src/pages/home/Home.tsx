import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Container, Grid, Box, Typography, Skeleton } from "@mui/material";
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import RaffleCard from "../../components/RaffleCard";
import Winners from "@/components/Winners";
import Regulation from "../../components/Regulation";
import type { Sorteio } from "../../types";
import api from "../../services/api";

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
                const normalized =
                    Array.isArray(data)
                        ? data
                        : Array.isArray((data as { content?: Sorteio[] } | null | undefined)?.content)
                            ? ((data as { content?: Sorteio[] }).content ?? [])
                            : [];
                setSorteios(normalized);
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

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} setMode={setMode} />
        <Hero />

        <Box id="sorteios" sx={{ py: 8 }}>
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
    </ThemeProvider>
    );
}
