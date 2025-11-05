import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Container, Stack, Typography, Chip, Box } from "@mui/material";
import { motion } from "framer-motion";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import type { Sorteio } from "@/types";
import api from "@/services/api";
import "./public-pages.scss";

export default function Winners() {
    const { theme, mode, setMode } = useNgTheme();
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);

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
                console.error("Erro ao carregar ganhadores", error);
                setSorteios([]);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const winners = useMemo(
        () => sorteios
            .filter((raffle) => raffle.status === "FINALIZADO" && raffle.vencedor?.nome)
            .sort((a, b) => {
                const dateA = a.dataEncerramento ? new Date(a.dataEncerramento).getTime() : 0;
                const dateB = b.dataEncerramento ? new Date(b.dataEncerramento).getTime() : 0;
                return dateB - dateA;
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
                            <EmojiEventsOutlinedIcon sx={{ fontSize: 48 }} />
                            <Typography variant="h1" fontWeight={800} sx={{ letterSpacing: "-0.03em", fontSize: { xs: "2.6rem", md: "3.4rem" } }}>
                                Últimos ganhadores
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                                Transparência total: acompanhe as últimas campanhas e os vencedores que levaram os grandes prêmios.
                            </Typography>
                        </Stack>
                    </Container>
                </section>

                <section className="public-landing__section">
                    <Container maxWidth="lg">
                        <Stack className="public-landing__table" spacing={1.2}>
                            <Box className="public-landing__table-row" sx={{ fontWeight: 700 }}>
                                <Typography>Prêmio</Typography>
                                <Typography>Ganhador</Typography>
                                <Typography>Data</Typography>
                                <Typography>Status</Typography>
                            </Box>

                            {winners.length ? (
                                winners.map((raffle) => {
                                    const dateLabel = raffle.dataEncerramento
                                        ? new Date(raffle.dataEncerramento).toLocaleDateString("pt-BR")
                                        : "—";
                                    return (
                                        <Box key={raffle.uuid} className="public-landing__table-row">
                                            <Typography fontWeight={700}>{raffle.titulo}</Typography>
                                            <Typography>{raffle.vencedor?.nome}</Typography>
                                            <Typography>{dateLabel}</Typography>
                                            <Chip
                                                icon={<EmojiEventsOutlinedIcon fontSize="small" />}
                                                label="Finalizado"
                                                color="success"
                                                sx={{ backdropFilter: "blur(12px)" }}
                                            />
                                        </Box>
                                    );
                                })
                            ) : (
                                <Box className="public-landing__table-row">
                                    <Typography fontWeight={700}>Nenhum ganhador registrado ainda.</Typography>
                                    <Typography color="text.secondary">
                                        Assim que um sorteio for finalizado, publicamos o resultado por aqui.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
