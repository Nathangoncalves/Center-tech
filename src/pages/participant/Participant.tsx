import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Container,
    CssBaseline,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    Typography,
} from "@mui/material";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import RaffleCard from "@/components/RaffleCard";
import type { Bilhete, Sorteio, User } from "@/types";
import api from "@/services/api";
import "./Participant.scss";

export default function Participant() {
    const { theme, mode, setMode } = useNgTheme();
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Bilhete[]>([]);
    const [raffles, setRaffles] = useState<Sorteio[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [loadingRaffles, setLoadingRaffles] = useState(true);
    const [errorTickets, setErrorTickets] = useState("");
    const [errorRaffles, setErrorRaffles] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const [{ data: userData }, { data: myTickets }] = await Promise.all([
                    api.get<User>("/user/me"),
                    api.get<Bilhete[]>("/bilhete/me"),
                ]);
                if (!active) return;
                setUser(userData);
                setTickets(myTickets ?? []);
                setErrorTickets("");
            } catch (error) {
                console.error("Erro ao carregar dados do participante", error);
                if (!active) return;
                setErrorTickets("Não foi possível carregar seus dados. Faça login novamente ou tente mais tarde.");
            } finally {
                if (active) setLoadingTickets(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data } = await api.get<Sorteio[]>("/sorteio");
                if (!active) return;
                setRaffles(data ?? []);
                setErrorRaffles("");
            } catch (error) {
                console.error("Erro ao carregar sorteios", error);
                if (!active) return;
                setRaffles([]);
                setErrorRaffles("Não foi possível carregar os sorteios no momento.");
            } finally {
                if (active) setLoadingRaffles(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const participatingRaffles = useMemo(() => {
        const ids = new Set(
            tickets
                .map((ticket) => ticket.sorteio?.uuid)
                .filter((id): id is string => Boolean(id)),
        );
        return raffles.filter((raffle) => ids.has(raffle.uuid));
    }, [tickets, raffles]);

    const saldo = user?.saldo?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00";

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="participant-page">
                <Header mode={mode} setMode={setMode} />
                <Box sx={{ py: 6 }}>
                    <Container maxWidth="lg">
                        <Stack spacing={4}>
                            <Paper elevation={0} className="participant-page__hero">
                                <Stack spacing={1}>
                                    <Typography variant="overline" color="text.secondary">Área do participante</Typography>
                                    <Typography variant="h4" fontWeight={800}>Olá, {user?.nome ?? "participante"}!</Typography>
                                    <Typography color="text.secondary">
                                        Acompanhe aqui os sorteios que você participa e todos os seus bilhetes.
                                    </Typography>
                                </Stack>
                                <div className="participant-page__metrics">
                                    <Metric label="Saldo" value={saldo} />
                                    <Metric label="Bilhetes" value={tickets.length.toString()} />
                                    <Metric label="Sorteios ativos" value={participatingRaffles.length.toString()} />
                                </div>
                            </Paper>

                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2, flexWrap: "wrap" }}>
                                    <Typography variant="h5" fontWeight={800}>Sorteios em que você participa</Typography>
                                </Stack>
                                {errorRaffles && <Alert severity="error" sx={{ mb: 2 }}>{errorRaffles}</Alert>}
                                {loadingRaffles ? (
                                    <Grid container spacing={3}>
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <Grid item xs={12} md={4} key={`raffle-skeleton-${idx}`}>
                                                <Skeleton variant="rounded" className="participant-page__skeleton" />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : participatingRaffles.length ? (
                                    <Grid container spacing={3}>
                                        {participatingRaffles.map((raffle) => (
                                            <Grid item xs={12} md={4} key={raffle.uuid}>
                                                <RaffleCard sorteio={raffle} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Alert severity="info">Você ainda não entrou em nenhum sorteio. Reserve suas cotas na página inicial.</Alert>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Seus bilhetes</Typography>
                                {errorTickets && <Alert severity="error" sx={{ mb: 2 }}>{errorTickets}</Alert>}
                                <TableContainer component={Paper} elevation={0} className="participant-page__tickets">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sorteio</TableCell>
                                                <TableCell>Número</TableCell>
                                                <TableCell>Data da compra</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingTickets ? (
                                                <TableRow>
                                                    <TableCell colSpan={4}>Carregando bilhetes...</TableCell>
                                                </TableRow>
                                            ) : tickets.length ? (
                                                tickets.map((ticket) => (
                                                    <TableRow key={ticket.uuid}>
                                                        <TableCell>{ticket.sorteio?.titulo ?? "-"}</TableCell>
                                                        <TableCell>{ticket.numero}</TableCell>
                                                        <TableCell>
                                                            {ticket.dataCompra
                                                                ? new Date(ticket.dataCompra).toLocaleString("pt-BR")
                                                                : "-"}
                                                        </TableCell>
                                                        <TableCell>{ticket.pago ? "Pago" : "Pendente"}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>Você ainda não possui bilhetes.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Stack>
                    </Container>
                </Box>
            </div>
        </ThemeProvider>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="participant-page__metric">
            <Typography variant="overline" color="text.secondary">{label}</Typography>
            <Typography variant="h5" fontWeight={800}>{value}</Typography>
        </div>
    );
}
