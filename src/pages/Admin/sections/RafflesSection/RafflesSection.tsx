import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { Sorteio } from "@/types";
import { sorteioService } from "@/services";
import "./RafflesSection.scss";

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
}).format(value);

const statusColor: Record<Sorteio["status"], "default" | "success" | "warning" | "error"> = {
    AGENDADO: "warning",
    ABERTO: "success",
    ENCERRADO: "default",
    FINALIZADO: "default",
};

export default function RafflesSection() {
    const [raffles, setRaffles] = useState<Sorteio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await sorteioService.list();
                if (active) setRaffles(data);
            } catch (err) {
                console.error("Erro ao carregar sorteios", err);
                if (active) setError("Não foi possível carregar os sorteios.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const resume = useMemo(() => {
        if (!raffles.length) return { total: 0, vendidos: 0, disponiveis: 0 };
        const total = raffles.reduce((acc, raffle) => acc + raffle.qtdTotalBilhetes, 0);
        const vendidos = raffles.reduce((acc, raffle) => acc + raffle.qtdVendidos, 0);
        return { total, vendidos, disponiveis: total - vendidos };
    }, [raffles]);

    if (loading) {
        return (
            <Box className="raffles-section__loading">
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">Carregando sorteios...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!raffles.length) {
        return <Alert severity="info">Nenhum sorteio cadastrado até o momento.</Alert>;
    }

    return (
        <Stack spacing={3} className="raffles-section">
            <Paper className="raffles-section__resume" elevation={0}>
                <Stack direction="row" spacing={4} flexWrap="wrap">
                    <Stack>
                        <Typography variant="overline" color="text.secondary">Cotas totais</Typography>
                        <Typography variant="h5" fontWeight={800}>{resume.total}</Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="overline" color="text.secondary">Vendidas</Typography>
                        <Typography variant="h5" fontWeight={800}>{resume.vendidos}</Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="overline" color="text.secondary">Disponíveis</Typography>
                        <Typography variant="h5" fontWeight={800}>{resume.disponiveis}</Typography>
                    </Stack>
                </Stack>
            </Paper>

            <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sorteio</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell align="right">Progresso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {raffles.map((raffle) => {
                            const progress = raffle.qtdTotalBilhetes
                                ? Math.round((raffle.qtdVendidos / raffle.qtdTotalBilhetes) * 100)
                                : 0;
                            return (
                                <TableRow key={raffle.id}>
                                    <TableCell>
                                        <Typography fontWeight={600}>{raffle.titulo}</Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>{raffle.descricao}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={raffle.status.toLowerCase()} color={statusColor[raffle.status]} size="small" />
                                    </TableCell>
                                    <TableCell>{formatCurrency(raffle.precoBilhete)}</TableCell>
                                    <TableCell align="right" style={{ minWidth: 160 }}>
                                        <Stack spacing={0.5}>
                                            <LinearProgress variant="determinate" value={progress} />
                                            <Typography variant="caption" color="text.secondary">
                                                {raffle.qtdVendidos}/{raffle.qtdTotalBilhetes} ({progress}%)
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
