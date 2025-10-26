import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

type HeroProps = {
    participantsCount?: number;
};

export default function Hero({ participantsCount }: HeroProps) {
    const navigate = useNavigate();
    return (
    <Box component="section" className="hero" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
        <Stack className="hero__content" spacing={3}>
            <Chip
                className="hero__badge"
                label={`Sorteios verificados • ${participantsCount !== undefined ? `${participantsCount} participantes` : "Loteria Federal"}`}
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
            />
            <Typography variant="h2" className="hero__title" sx={{ fontWeight: 900, lineHeight: 1.05, maxWidth: 900 }}>
            Prêmios que você quer, <br /> com preço justo.
            </Typography>
            <Typography className="hero__subtitle" color="text.secondary" sx={{ maxWidth: 720 }}>
            Experiência simples, transparente e bonita — reserve suas cotas em poucos cliques.
            </Typography>
            <Stack className="hero__actions" direction="row" spacing={2}>
            <Button onClick={() => navigate("/cadastro")} variant="contained" size="large" sx={{ borderRadius: 3 }}>
                Participar agora
            </Button>
            <Button onClick={() => document.getElementById("sorteios")?.scrollIntoView({ behavior: "smooth" })}
                    variant="outlined" size="large" sx={{ borderRadius: 3 }}>
                Ver sorteios
            </Button>
            </Stack>
        </Stack>
        </Container>
    </Box>
    );
}
