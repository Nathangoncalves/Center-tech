import { Box, Container, Paper, Stack, Typography, Link } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useNgTheme from "../hooks/useNgTheme";
import Navbar from "../components/Header.jsx";
import SignupForm from "../components/SignupForm.jsx";

export default function Signup() {
    const { theme, mode, setMode } = useNgTheme();

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar mode={mode} setMode={setMode} />
        <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
            <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Cadastro de Participante</Typography>
                <Typography color="text.secondary" textAlign="center">
                Cadastre-se para participar dos sorteios e receber seus números pelo WhatsApp/E-mail.
                </Typography>
            </Stack>

            <SignupForm onSuccess={() => { /* depois: redirecionar ou mostrar CTA */ }} />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
                Já possui cadastro? Fale conosco no <Link href="https://wa.me/5561999999999" target="_blank">WhatsApp</Link>.
                </Typography>
            </Paper>
        </Container>
        </Box>
    </ThemeProvider>
    );
}