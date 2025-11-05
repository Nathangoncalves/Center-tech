import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Container, Grid, Stack, Typography, Skeleton, Box } from "@mui/material";
import { motion } from "framer-motion";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import PublicRaffleCard from "@/components/Public/RaffleCard";
import type { Sorteio } from "@/types";
import api from "@/services/api";
import "./public-pages.scss";

export default function Sorteios() {
    const { theme, mode, setMode } = useNgTheme();
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const { data } = await api.get<(Sorteio[] | { content?: Sorteio[] } | null)>("/sorteio");
                if (!isMounted) return;
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
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const sortedRaffles = useMemo(
        () => [...sorteios].sort((a, b) => {
            const order = (status: Sorteio["status"]) => {
                switch (status) {
                case "ABERTO":
                    return 0;
                case "AGENDADO":
                    return 1;
                case "ENCERRADO":
                    return 2;
                default:
                    return 3;
                }
            };
            const diff = order(a.status) - order(b.status);
            return diff !== 0 ? diff : a.titulo.localeCompare(b.titulo);
        }),
        [sorteios],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="public-landing">
                <Header mode={mode} setMode={setMode} />
                <section className="public-landing__hero">
                    <Container maxWidth="lg">
                        <Stack
                            component={motion.div}
                            className="public-landing__hero-card"
                            spacing={1.2}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography variant="overline" sx={{ letterSpacing: "0.24em" }}>
                                Plataforma Center Tech
                            </Typography>
                            <Typography variant="h1" fontWeight={800} sx={{ letterSpacing: "-0.03em", fontSize: { xs: "2.6rem", md: "3.6rem" } }}>
                                Sorteios ativos
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                                Veja todos os sorteios disponíveis, confirme seus bilhetes via PIX e acompanhe o status em tempo real.
                            </Typography>
                        </Stack>
                    </Container>
                </section>

                <section className="public-landing__section">
                    <Container maxWidth="lg">
                        {loading ? (
                            <Box className="public-landing__grid">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant="rounded"
                                        height={360}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.35)",
                                            borderRadius: 4,
                                            backdropFilter: "blur(18px)",
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : sortedRaffles.length ? (
                            <Grid container spacing={3}>
                                {sortedRaffles.map((sorteio) => (
                                    <Grid key={sorteio.uuid} item xs={12} md={4}>
                                        <PublicRaffleCard sorteio={sorteio} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Stack className="public-landing__glass-item" spacing={1}>
                                <Typography variant="h5" fontWeight={800}>
                                    Nenhum sorteio disponível no momento
                                </Typography>
                                <Typography color="text.secondary">
                                    Assim que novas campanhas forem lançadas, você verá tudo aqui com detalhes atualizados.
                                </Typography>
                            </Stack>
                        )}
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
