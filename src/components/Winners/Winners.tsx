import { Box, Card, CardContent, Container, Grid, Stack, Typography, useTheme, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CelebrationIcon from "@mui/icons-material/Celebration";
import "./Winners.scss";
import { winners } from "@/Data/winners";

const format = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export default function Winners() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
    <Box
        id="ganhadores"
        className="winners"
        sx={{
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            pt: { xs: 6, md: 8 },
            pb: { xs: 9, md: 10 },
            mt: { xs: 3, md: 4 },
            position: "relative",
            overflow: "hidden",
            bgcolor: isDark ? "transparent" : "background.paper",
            background: isDark
                ? "radial-gradient(circle at top left, rgba(56,189,248,0.28), transparent 60%), radial-gradient(circle at bottom right, rgba(249,115,22,0.24), transparent 60%), #101012"
                : undefined,
        }}
    >
        <Container maxWidth="lg">
        <Stack className="winners__header" spacing={2} sx={{ mb: 5 }}>
            <Chip
                icon={<CelebrationIcon fontSize="small" />}
                label="Transparência garantida"
                variant="outlined"
                className="winners__badge"
            />
            <Stack spacing={1}>
                <Typography variant="h4" fontWeight={900}>Ganhadores recentes</Typography>
                <Typography color="text.secondary" maxWidth={520}>
                    Conheça quem já levou os prêmios da Centertech. Toda semana um novo vencedor é celebrado.
                </Typography>
            </Stack>
        </Stack>

        <Grid className="winners__grid" container spacing={3}>
            {winners.map(w => (
            <Grid item xs={12} md={4} key={w.id}>
                <Card className="winners__card">
                <CardContent>
                    <Stack className="winners__card-content" spacing={1.2}>
                    <Stack className="winners__card-header" direction="row" alignItems="center" spacing={1}>
                        <EmojiEventsIcon fontSize="small" />
                        <Typography variant="subtitle1" fontWeight={800}>{w.premio}</Typography>
                    </Stack>
                    <Typography color="text.secondary">{w.nome}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {w.cidade ? `${w.cidade}/${w.uf} • ` : ""}{format(w.data)}
                    </Typography>
                    </Stack>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Container>
    </Box>
    );
}
