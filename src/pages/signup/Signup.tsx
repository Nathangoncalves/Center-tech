import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import useNgTheme from "../../hooks/useNgTheme";
import Header from "../../components/Header";
import SignupForm from "../../components/SignupForm";

export default function Signup() {
    const { theme, mode, setMode } = useNgTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    minHeight: "calc(100vh - 72px)",
                    background: theme.palette.mode === "dark"
                        ? "radial-gradient(120% 120% at 80% 20%, rgba(200,160,255,0.28) 0%, rgba(0,200,200,0.18) 30%, rgba(12,16,24,0.95) 65%)"
                        : "radial-gradient(120% 120% at 80% 20%, rgba(0,200,200,0.28) 0%, rgba(200,160,255,0.18) 35%, rgba(248,249,252,1) 65%)",
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            maxWidth: 640,
                            mx: "auto",
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.25 : 0.65),
                            border: `1px solid ${alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.12 : 0.42)}`,
                            boxShadow: "0 40px 80px rgba(15, 23, 42, 0.2)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        <Stack
                            spacing={2.4}
                            alignItems={{ xs: "center", md: "flex-start" }}
                            sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}
                        >
                            <Chip
                                label="Cadastro rápido"
                                sx={{
                                    backdropFilter: "blur(10px)",
                                    background: alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.08 : 0.45),
                                    borderRadius: 999,
                                    fontWeight: 700,
                                }}
                            />
                            <Typography variant="h4" fontWeight={800} textAlign="center">
                                Crie sua conta
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
                                Cadastre-se para participar dos sorteios, receber notificações e acompanhar seus bilhetes em tempo real.
                            </Typography>
                        </Stack>
                        <SignupForm />
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent={{ xs: "center", md: "flex-start" }}
                            alignItems={{ xs: "center", md: "flex-start" }}
                            sx={{ mt: 3 }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: "center", md: "left" } }}>
                                Já tem uma conta?
                            </Typography>
                            <Button
                                href="/login"
                                variant="text"
                                sx={{ textTransform: "none", alignSelf: { xs: "auto", md: "flex-start" } }}
                            >
                                Fazer login
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
