import { useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import type { Sorteio } from "../types";
import { getAuthToken } from "@/services/api";
import SecureImage from "@/components/SecureImage";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const money = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const MIDIA_DATA_CONTENT_TYPE = "image/jpeg";

const normalizeMidiaContent = (raw?: string | null): string | undefined => {
    const trimmed = raw?.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith("data:")) return trimmed;
    return `data:${MIDIA_DATA_CONTENT_TYPE};base64,${trimmed}`;
};

const resolveMidiaImage = (sorteio: Sorteio): string | undefined => {
    if (!sorteio.midias || sorteio.midias.length === 0) return undefined;
    const preferred = sorteio.midias.find((midia) => midia.tipo === "BANNER") ?? sorteio.midias[0];
    if (!preferred) return undefined;
    const url = preferred.url?.trim();
    if (url) return url;
    const caminho = preferred.caminho?.trim();
    if (caminho) return caminho;
    return normalizeMidiaContent(preferred.imagem);
};

function resolveImageRef(sorteio: Sorteio): string | undefined {
    const itemUrl = sorteio.item?.imageUrl?.trim();
    if (itemUrl) return itemUrl;
    const explicit = sorteio.imageUrl?.trim();
    if (explicit) return explicit;
    const midiaImage = resolveMidiaImage(sorteio);
    if (midiaImage) return midiaImage;
    return undefined;
}

const statusLabels: Record<Sorteio["status"], string> = {
    AGENDADO: "Agendado",
    ABERTO: "Em andamento",
    ENCERRADO: "Encerrado",
    FINALIZADO: "Finalizado",
};

const trophyGlow = keyframes`
    0% {
        transform: scale(1);
        filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0.35));
    }
    50% {
        transform: scale(1.12);
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0.35));
    }
`;

export default function RaffleCard({ sorteio }: { sorteio: Sorteio }) {
    const navigate = useNavigate();
    const hasToken = Boolean(getAuthToken());
    const imageRef = resolveImageRef(sorteio);
    const winnerName = sorteio.vencedor?.nome?.trim();

    const progress = useMemo(() => {
        if (!sorteio.qtdTotalBilhetes) return 0;
        return clamp(Math.round((sorteio.qtdVendidos / sorteio.qtdTotalBilhetes) * 100), 0, 100);
    }, [sorteio.qtdTotalBilhetes, sorteio.qtdVendidos]);

    const ticketsLeft = Math.max(sorteio.qtdTotalBilhetes - sorteio.qtdVendidos, 0);
    const encerramento = sorteio.dataEncerramento ? new Date(sorteio.dataEncerramento) : null;
    const isClosed = sorteio.status !== "ABERTO" && sorteio.status !== "AGENDADO" || ticketsLeft === 0 || (encerramento ? encerramento.getTime() <= Date.now() : false);
    const ctaTarget = hasToken ? "/participante" : "/cadastro";
    const ctaLabel = isClosed ? "Encerrado" : hasToken ? "Reservar agora" : "Quero participar";
    const isWinner = sorteio.status === "FINALIZADO" && Boolean(winnerName);

    const statusColor = sorteio.status === "ABERTO" && !isClosed ? "success" : "default";

    return (
        <Card sx={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
            <CardActionArea onClick={() => (isClosed ? undefined : navigate(ctaTarget))} disabled={isClosed} sx={{ flexGrow: 1 }}>
                <Box sx={{ position: "relative", bgcolor: "background.default" }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            pt: "56.25%",
                            overflow: "hidden",
                        }}
                    >
                        <SecureImage
                            source={imageRef}
                            fallbackSrc="/assets/img/png/image.png"
                            alt={sorteio.titulo}
                            sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                                bgcolor: "background.paper",
                            }}
                        />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12 }}>
                        <Chip
                            size="small"
                            color={statusColor}
                            icon={<EventAvailableIcon fontSize="small" />}
                            label={statusLabels[sorteio.status]}
                            sx={{
                                bgcolor:
                                    statusColor === "success" ? "success.main" : "rgba(0,0,0,0.6)",
                                color: statusColor === "success" ? "common.white" : "common.white",
                                backdropFilter: statusColor === "success" ? undefined : "blur(6px)",
                                fontWeight: 600,
                            }}
                        />
                        <Chip
                            size="small"
                            icon={<LocalOfferIcon />}
                            label={`${money(sorteio.precoBilhete)}/cota`}
                            sx={{
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "common.white",
                                backdropFilter: "blur(6px)",
                                fontWeight: 600,
                            }}
                        />
                    </Stack>
                    {isClosed && (
                        <Chip
                            label="Esgotado"
                            color="default"
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                fontWeight: 600,
                                bgcolor: "rgba(0,0,0,0.7)",
                                color: "common.white",
                                backdropFilter: "blur(6px)",
                            }}
                        />
                    )}
                    {isWinner && winnerName && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 12,
                                left: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                                px: 1.2,
                                py: 0.6,
                                borderRadius: 999,
                                bgcolor: "rgba(0,0,0,0.65)",
                                color: "common.white",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            <EmojiEventsIcon
                                fontSize="small"
                                sx={{ color: "warning.main", animation: `${trophyGlow} 2s ease-in-out infinite` }}
                            />
                            <Typography variant="caption" fontWeight={700} noWrap>
                                {winnerName}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <CardContent>
                    <Stack spacing={1.2}>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {sorteio.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap title={sorteio.descricao}>
                            {sorteio.descricao}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                {isClosed ? "Encerrado" : "Aberto para reserva"}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ConfirmationNumberIcon fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                {ticketsLeft} bilhetes restantes
                            </Typography>
                        </Stack>
                        {isWinner && winnerName && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <EmojiEventsIcon
                                    fontSize="small"
                                    sx={{ color: "warning.main", animation: `${trophyGlow} 2s ease-in-out infinite` }}
                                />
                                <Typography variant="body2" color="warning.main" fontWeight={700} noWrap>
                                    Ganhador: {winnerName}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
            <Box sx={{ px: 2, pb: 2 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 999, height: 6 }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        Vendidos
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {sorteio.qtdVendidos}/{sorteio.qtdTotalBilhetes} ({progress}%)
                    </Typography>
                </Stack>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1.5 }}
                    onClick={() => navigate(ctaTarget)}
                    disabled={isClosed}
                >
                    {ctaLabel}
                </Button>
            </Box>
        </Card>
    );
}
