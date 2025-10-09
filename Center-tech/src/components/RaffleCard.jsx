// src/components/RaffleCard.jsx
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useCountdown from "../hooks/useCountdown";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const money = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function RaffleCard({ item, onParticipar }) {
    const { d, h, m, s, finished } = useCountdown(item.endsAt);
    const pct = clamp(Math.round((item.quotasSold / item.quotasTotal) * 100), 0, 100);

    return (
    <Card sx={{ overflow: "hidden" }}>
        <CardActionArea onClick={() => onParticipar(item)}>
        <Box sx={{ position: "relative" }}>
            <CardMedia component="img" image={item.img} alt={item.titulo} sx={{ aspectRatio: "16/9", objectFit: "cover" }} />
            <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12 }}>
            {item.badge && <Chip size="small" label={item.badge} sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider" }} />}
            <Chip size="small" icon={<LocalOfferIcon />} label={`${money(item.price)}/cota`} />
            </Stack>
        </Box>
        <CardContent>
            <Stack spacing={1.2}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{item.titulo}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                {finished ? "Encerrado" : `Fecha em ${d}d ${h}h ${m}m ${s}s`}
                </Typography>
            </Stack>
            <Box sx={{ pt: .5 }}>
                <LinearProgress variant="determinate" value={pct} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: .5 }}>
                <Typography variant="caption" color="text.secondary">Progresso</Typography>
                <Typography variant="caption" color="text.secondary">
                    {item.quotasSold}/{item.quotasTotal} ({pct}%)
                </Typography>
                </Stack>
            </Box>
            <Button fullWidth variant="contained" sx={{ mt: .5 }}>Participar</Button>
            </Stack>
        </CardContent>
        </CardActionArea>
    </Card>
    );
}