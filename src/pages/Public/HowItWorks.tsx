import { ThemeProvider, CssBaseline, Container, Stack, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import "./public-pages.scss";

const steps = [
    {
        title: "Escolha seu sorteio",
        description: "Explore os prêmios e selecione a campanha que mais combina com você.",
        icon: (
            <svg viewBox="0 0 64 64" width="48" height="48">
                <rect x="10" y="12" width="44" height="40" rx="8" ry="8" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="24" cy="32" r="6" fill="currentColor" />
                <circle cx="40" cy="32" r="6" fill="currentColor" />
            </svg>
        ),
    },
    {
        title: "Garanta seus bilhetes",
        description: "Informe seus dados, gere o link de pagamento PIX e confirme tudo em segundos.",
        icon: (
            <svg viewBox="0 0 64 64" width="48" height="48">
                <rect x="8" y="14" width="48" height="28" rx="6" ry="6" fill="none" stroke="currentColor" strokeWidth="5" />
                <path d="M16 50h32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M24 58h16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: "Acompanhe o resultado",
        description: "Receba seus números automaticamente e veja o ganhador no painel público.",
        icon: (
            <svg viewBox="0 0 64 64" width="48" height="48">
                <circle cx="32" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="5" />
                <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M26 22l4 4 6-8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    const { theme, mode, setMode } = useNgTheme();

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
                            spacing={1.1}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <PlayCircleOutlineIcon sx={{ fontSize: 48 }} />
                            <Typography variant="h1" fontWeight={800} sx={{ letterSpacing: "-0.03em", fontSize: { xs: "2.5rem", md: "3.4rem" } }}>
                                Como funciona
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                                Descubra como participar dos sorteios Center Tech em três passos simples, com transparência e velocidade.
                            </Typography>
                        </Stack>
                    </Container>
                </section>

                <section className="public-landing__section">
                    <Container maxWidth="lg">
                        <Box className="public-landing__steps">
                            {steps.map((step, index) => (
                                <Stack
                                    key={step.title}
                                    component={motion.div}
                                    className="public-landing__step-card"
                                    spacing={1}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Box sx={{ width: 56, height: 56, display: "grid", placeItems: "center", color: "inherit" }}>
                                        {step.icon}
                                    </Box>
                                    <Typography variant="h5" fontWeight={700}>{index + 1}. {step.title}</Typography>
                                    <Typography color="text.secondary">{step.description}</Typography>
                                </Stack>
                            ))}
                        </Box>

                        <Stack className="public-landing__cta">
                            <Typography variant="h4" fontWeight={800}>
                                Pronto para começar?
                            </Typography>
                            <Typography color="text.secondary">
                                Cadastre-se gratuitamente, garanta seus bilhetes e acompanhe tudo no painel do participante.
                            </Typography>
                            <Button
                                variant="contained"
                                href="/cadastro"
                                size="large"
                                sx={{ width: "fit-content", borderRadius: 999, px: 4, py: 1.2, fontWeight: 700 }}
                            >
                                Participe agora
                            </Button>
                        </Stack>
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
