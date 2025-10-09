import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function Hero({ highlight, mode, onParticipar }) {
    return (
    <Box
        sx={{
        position: "relative",
        py: { xs: 10, md: 12 },
        overflow: "hidden",
        background: mode === "dark" ? "linear-gradient(180deg, #0b0b0c, #111115)" : "transparent",
        }}
    >
        <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
            <Stack spacing={2.5}>
                <Chip label="Sorteios verificados • Loteria Federal" variant="outlined" icon={<ShieldOutlinedIcon />} sx={{ alignSelf: "flex-start" }} />
                <Typography variant="h1">
                Prêmios que você quer, com <Box component="span" sx={{ color: "primary.main" }}>preço justo</Box>.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                Experiência simples, transparente e bonita — reserve suas cotas em poucos cliques.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} href="https://wa.me/5561999999999" target="_blank">
                    Participar agora
                </Button>
                <Button size="large" variant="outlined" href="#sorteios">Ver sorteios</Button>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Stack><Typography variant="h5" sx={{ fontWeight: 800 }}>10k+</Typography><Typography variant="caption" color="text.secondary">Cotas vendidas</Typography></Stack>
                <Divider orientation="vertical" flexItem />
                <Stack><Typography variant="h5" sx={{ fontWeight: 800 }}>98%</Typography><Typography variant="caption" color="text.secondary">Aprovação</Typography></Stack>
                </Stack>
            </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
            <Card sx={{ p: 1.5 }}>
                <CardMedia component="img" image={highlight.img} alt={highlight.titulo} sx={{ aspectRatio: "4/3", objectFit: "cover", borderRadius: 2 }} />
                <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Próximo destaque</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{highlight.titulo}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .75 }}>
                    <LocalOfferIcon fontSize="small" />
                    <Typography variant="body2">R$ {highlight.price.toFixed(2)} por cota</Typography>
                </Stack>
                <Button fullWidth variant="contained" sx={{ mt: 1.5 }} onClick={() => onParticipar(highlight)}>
                    Participar do destaque
                </Button>
                </CardContent>
            </Card>
            </Grid>
        </Grid>
        </Container>
    </Box>
    );
}