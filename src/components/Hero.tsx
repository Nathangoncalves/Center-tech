import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

export default function Hero() {
    const navigate = useNavigate();
    return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
        <Stack spacing={3}>
            <Chip
                label="Painel do participante • Pagamentos instantâneos"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
            />
            <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, maxWidth: 920 }}>
                Reserve, acompanhe e pague seus bilhetes em um só lugar.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                Centralizamos os sorteios ativos, os seus números e a confirmação de pagamento em uma experiência clara e segura.
            </Typography>
            <Stack direction="row" spacing={2}>
                <Button onClick={() => navigate("/cadastro")} variant="contained" size="large" sx={{ borderRadius: 3 }}>
                    Abrir minha conta
                </Button>
                <Button
                    onClick={() => document.getElementById("sorteios")?.scrollIntoView({ behavior: "smooth" })}
                    variant="outlined"
                    size="large"
                    sx={{ borderRadius: 3 }}
                >
                    Ver sorteios ativos
                </Button>
            </Stack>
        </Stack>
        </Container>
    </Box>
    );
}
