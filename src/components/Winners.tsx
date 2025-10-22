import { Box, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { winners } from "../data/winners";

const format = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export default function Winners() {
    return (
    <Box id="ganhadores" sx={{ py: 8, bgcolor: "background.paper", borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary">Transparência</Typography>
            <Typography variant="h4" fontWeight={900}>Ganhadores recentes</Typography>
        </Stack>

        <Grid container spacing={3}>
            {winners.map(w => (
            <Grid item xs={12} md={4} key={w.id}>
                <Card>
                <CardContent>
                    <Stack spacing={1.2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
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