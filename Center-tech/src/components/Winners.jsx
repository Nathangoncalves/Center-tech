import { Card, CardContent, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SectionTitle from "./SectionTitle";

export default function Winners({ mode }) {
    const winners = [
    { nome: "Lucas M.", premio: "iPhone 15 Pro", cidade: "Brasília/DF", data: "07/2025" },
    { nome: "Ana P.", premio: "PlayStation 5", cidade: "Goiânia/GO", data: "06/2025" },
    { nome: "Rafael S.", premio: "Moto CG 160", cidade: "São Paulo/SP", data: "05/2025" },
    ];

    return (
    <div id="ganhadores" style={{ padding: "64px 0", background: mode === "dark" ? "#0E0E0E" : "#F6F7F8" }}>
        <Container maxWidth="lg">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <EmojiEventsIcon />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Ganhadores recentes</Typography>
        </Stack>
        <Grid container spacing={3}>
            {winners.map((g, i) => (
            <Grid item xs={12} md={4} key={i}>
                <Card>
                <CardContent>
                    <Typography variant="overline" color="text.secondary">Vencedor</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{g.premio}</Typography>
                    <Typography color="text.secondary">{g.nome} • {g.cidade}</Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">Sorteio em {g.data}</Typography>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Container>
    </div>
    );
}