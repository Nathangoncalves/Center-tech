import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LaunchIcon from "@mui/icons-material/Launch";
import type { Sorteio } from "@/types";
import { getAuthToken } from "@/services/api";
import SecureImage from "@/components/SecureImage";

const MIDIA_DATA_CONTENT_TYPE = "image/jpeg";

const normalizeMidiaContent = (raw?: string | null): string | undefined => {
    const trimmed = raw?.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith("data:")) return trimmed;
    return `data:${MIDIA_DATA_CONTENT_TYPE};base64,${trimmed}`;
};

const resolveMidiaImage = (sorteio: Sorteio): string | undefined => {
    if (!sorteio.midias?.length) return undefined;
    const preferred = sorteio.midias.find((midia) => midia.tipo === "BANNER") ?? sorteio.midias[0];
    if (!preferred) return undefined;
    const url = preferred.url?.trim();
    if (url) return url;
    const caminho = preferred.caminho?.trim();
    if (caminho) return caminho;
    return normalizeMidiaContent(preferred.imagem);
};

const resolveImageRef = (sorteio: Sorteio): string | undefined => {
    const itemUrl = sorteio.item?.imageUrl?.trim();
    if (itemUrl) return itemUrl;
    const explicit = sorteio.imageUrl?.trim();
    if (explicit) return explicit;
    return resolveMidiaImage(sorteio);
};

const statusLabels: Record<Sorteio["status"], string> = {
    ABERTO: "Aberto",
    AGENDADO: "Agendado",
    ENCERRADO: "Encerrado",
    FINALIZADO: "Finalizado",
};

export default function PublicRaffleCard({ sorteio }: { sorteio: Sorteio }) {
    const theme = useTheme();
    const hasToken = Boolean(getAuthToken());
    const imageRef = resolveImageRef(sorteio);

    const encerramentoLabel = useMemo(() => {
        if (!sorteio.dataEncerramento) return "Data a confirmar";
        return new Date(sorteio.dataEncerramento).toLocaleDateString("pt-BR");
    }, [sorteio.dataEncerramento]);

    const ticketsLeft = Math.max(sorteio.qtdTotalBilhetes - sorteio.qtdVendidos, 0);
    const isClosed = sorteio.status !== "ABERTO" || ticketsLeft === 0;
    const ctaTarget = hasToken ? "/participante" : "/cadastro";
    const ctaLabel = isClosed ? "Encerrado" : hasToken ? "Reservar agora" : "Participe agora";

    const glassBackground = alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.18 : 0.52);
    const glassBorder = alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.18 : 0.45);
    const chipColor = theme.palette.mode === "dark" ? "rgba(0,200,200,0.4)" : "rgba(0,200,200,0.55)";

    return (
        <Paper
            component={motion.article}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            elevation={0}
            sx={{
                p: 3,
                display: "grid",
                gap: 3,
                height: "100%",
                borderRadius: 4,
                background: glassBackground,
                backdropFilter: "blur(20px)",
                border: `1px solid ${glassBorder}`,
                boxShadow: "0 32px 56px rgba(15, 23, 42, 0.18)",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    minHeight: 140,
                    maxHeight: 500,
                    backgroundColor: alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.04 : 0.35),
                }}
            >
                <SecureImage
                    source={imageRef}
                    fallbackSrc="/assets/img/png/image.png"
                    alt={sorteio.titulo}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.01)",
                    }}
                />
                <Chip
                    label={statusLabels[sorteio.status] ?? "Atualização"}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        bgcolor: chipColor,
                        color: theme.palette.getContrastText(chipColor),
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                    }}
                />
            </Box>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                    <Typography variant="h5" fontWeight={800}>
                        {sorteio.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
                        {sorteio.descricao}
                    </Typography>
                </Stack>
                <Stack spacing={1.2}>
                    <InfoLine icon={<CalendarMonthIcon fontSize="small" />} label="Encerramento" value={encerramentoLabel} />
                    <InfoLine
                        icon={<ConfirmationNumberIcon fontSize="small" />}
                        label="Bilhetes restantes"
                        value={ticketsLeft.toLocaleString("pt-BR")}
                    />
                </Stack>
                <Button
                    href={isClosed ? undefined : ctaTarget}
                    variant="contained"
                    size="large"
                    disabled={isClosed}
                    endIcon={<LaunchIcon />}
                    sx={{
                        mt: "auto",
                        borderRadius: 999,
                        fontWeight: 700,
                        textTransform: "none",
                        py: 1.2,
                        background: theme.palette.mode === "dark"
                            ? "linear-gradient(135deg, rgba(0,200,200,0.45), rgba(200,160,255,0.45))"
                            : "linear-gradient(135deg, rgba(0,200,200,0.7), rgba(200,160,255,0.6))",
                        boxShadow: "0 18px 30px rgba(79, 70, 229, 0.25)",
                        backdropFilter: "blur(12px)",
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 26px 36px rgba(79, 70, 229, 0.35)",
                        },
                        transition: "transform 160ms ease, box-shadow 160ms ease",
                    }}
                >
                    {ctaLabel}
                </Button>
            </Stack>
        </Paper>
    );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.18)",
                    color: "inherit",
                    backdropFilter: "blur(12px)",
                }}
            >
                {icon}
            </Box>
            <Stack spacing={0.2}>
                <Typography variant="caption" sx={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                    {value}
                </Typography>
            </Stack>
        </Stack>
    );
}
