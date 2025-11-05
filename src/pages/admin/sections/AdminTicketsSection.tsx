import { useMemo } from "react";
import {
    Alert,
    Box,
    Checkbox,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useAdminData } from "../AdminDataProvider";
import { formatDateTime } from "../../../utils/formatters";

export default function AdminTicketsSection() {
    const { tickets, loading, error } = useAdminData();
    const theme = useTheme();
    const isCompactLayout = useMediaQuery(theme.breakpoints.down("md"));

    const sortedTickets = useMemo(
        () =>
            [...tickets].sort(
                (a, b) => new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime(),
            ),
        [tickets],
    );

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Bilhetes emitidos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Controle os números vendidos e confirme pagamentos recebidos.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper sx={{ borderRadius: "12px", overflow: { xs: "visible", md: "hidden" } }}>
                {loading ? (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={52} />
                    </Box>
                ) : isCompactLayout ? (
                    <Box sx={{ p: 2 }}>
                        {sortedTickets.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum bilhete registrado até o momento.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {sortedTickets.map((ticket) => {
                                    const nomeCliente = ticket.nome?.trim() || ticket.user?.nome || "—";
                                    const nomeSorteio = ticket.nomeSorteio?.trim() || ticket.sorteio?.titulo || "—";
                                    return (
                                        <Box
                                            key={ticket.user?.uuid ?? `${ticket.numero}-${nomeCliente}`}
                                            sx={{
                                                border: 1,
                                                borderColor: "divider",
                                                borderRadius: "10px",
                                                p: 2,
                                                bgcolor: "background.paper",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography fontWeight={700}>#{ticket.numero}</Typography>
                                            </Stack>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Cliente
                                                </Typography>
                                                <Typography variant="body2">{nomeCliente}</Typography>
                                            </Stack>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Sorteio
                                                </Typography>
                                                <Typography variant="body2">{nomeSorteio}</Typography>
                                            </Stack>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Data da compra
                                                </Typography>
                                                <Typography variant="body2">{formatDateTime(ticket.dataCompra)}</Typography>
                                            </Stack>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Sorteio</TableCell>
                                    <TableCell>Data da compra</TableCell>
                                    <TableCell>Pago</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedTickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhum bilhete emitido ainda.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedTickets.map((ticket) => {
                                        const nomeCliente = ticket.nome?.trim() || ticket.user?.nome || "—";
                                        const nomeSorteio = ticket.nomeSorteio?.trim() || ticket.sorteio?.titulo || "—";
                                        return (
                                            <TableRow key={ticket.user?.uuid ?? `${ticket.numero}-${nomeCliente}`}>
                                                <TableCell>#{ticket.numero}</TableCell>
                                                <TableCell>{nomeCliente}</TableCell>
                                                <TableCell>{nomeSorteio}</TableCell>
                                                <TableCell>{formatDateTime(ticket.dataCompra)}</TableCell>
                                                <TableCell>
                                                    <Checkbox checked={ticket.pago} />
                                                </TableCell>
                                                <TableCell align="right">—</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Stack>
    );
}
