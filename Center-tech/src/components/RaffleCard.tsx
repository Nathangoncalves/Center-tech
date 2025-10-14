import { useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useNavigate } from "react-router-dom";
import type { Sorteio } from "../types";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const money = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

function resolveImage(sorteio: Sorteio): string {
    if (sorteio.midias?.length) return sorteio.midias[0]!.url;
    if (sorteio.item?.imageUrl) return sorteio.item.imageUrl;
    return "/assets/image.png";
}

const statusLabels: Record<Sorteio["status"], string> = {
    AGENDADO: "Agendado",
    ABERTO: "Em andamento",
    ENCERRADO: "Encerrado",
    FINALIZADO: "Finalizado",
};

export default function RaffleCard({ sorteio }: { sorteio: Sorteio }) {
    const navigate = useNavigate();

    const progress = useMemo(() => {
        if (!sorteio.qtdTotalBilhetes) return 0;
        return clamp(Math.round((sorteio.qtdVendidos / sorteio.qtdTotalBilhetes) * 100), 0, 100);
    }, [sorteio.qtdTotalBilhetes, sorteio.qtdVendidos]);

    const encerramento = sorteio.dataEncerramento ? new Date(sorteio.dataEncerramento) : null;
    const encerrado = encerramento ? encerramento.getTime() <= Date.now() : sorteio.status !== "ABERTO";

    return (
        <Card sx={{ overflow: "hidden" }}>
            <CardActionArea onClick={() => navigate("/cadastro")}>
                <Box sx={{ position: "relative" }}>
                    <CardMedia
                        component="img"
                        image={resolveImage(sorteio)}
                        alt={sorteio.titulo}
                        sx={{ aspectRatio: "16 / 9", objectFit: "cover" }}
                    />
                    <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12 }}>
                        <Chip
                            size="small"
                            color={sorteio.status === "ABERTO" ? "success" : "default"}
                            icon={<EventAvailableIcon fontSize="small" />}
                            label={statusLabels[sorteio.status]}
                            sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider" }}
                        />
                        <Chip size="small" icon={<LocalOfferIcon />} label={`${money(sorteio.precoBilhete)}/cota`} />
                    </Stack>
                </Box>
                <CardContent>
                    <Stack spacing={1.2}>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {sorteio.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {sorteio.descricao}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                {encerrado ? "Encerrado" : "Aberto para reserva"}
                            </Typography>
                        </Stack>
                        <Box sx={{ pt: 0.5 }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Progresso
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {sorteio.qtdVendidos}/{sorteio.qtdTotalBilhetes} ({progress}%)
                                </Typography>
                            </Stack>
                        </Box>
                        <Button fullWidth variant="contained" sx={{ mt: 0.5 }} onClick={() => navigate("/cadastro")}>
                            Participar
                        </Button>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
