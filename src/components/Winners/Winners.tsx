import { Box, Card, CardContent, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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
            py: 8,
            borderTop: 1,
            borderColor: "divider",
            position: "relative",
            overflow: "hidden",
            bgcolor: isDark ? "transparent" : "background.paper",
            background: isDark
                ? "radial-gradient(circle at top left, rgba(56,189,248,0.28), transparent 60%), radial-gradient(circle at bottom right, rgba(249,115,22,0.24), transparent 60%), #101012"
                : undefined,
        }}
    >
        <Container maxWidth="lg">
        <Stack className="winners__header" spacing={1} sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary">Transparência</Typography>
            <Typography variant="h4" fontWeight={900}>Ganhadores recentes</Typography>
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
