import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useNgTheme from "../hooks/useNgTheme";
import Header from "../components/Header";
import SignupForm from "../components/SignupForm";

export default function Signup() {
    const { theme, mode, setMode } = useNgTheme();

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} setMode={setMode} />
        <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
            <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Cadastro de Participante</Typography>
                <Typography color="text.secondary" textAlign="center">
                Cadastre-se para participar dos sorteios e receber seus números por WhatsApp/E-mail.
                </Typography>
            </Stack>
            <SignupForm />
            </Paper>
        </Container>
        </Box>
    </ThemeProvider>
    );
}