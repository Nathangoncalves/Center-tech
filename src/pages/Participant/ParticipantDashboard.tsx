import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
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
import Header from "@/components/Header";
import RaffleCard from "@/components/RaffleCard";
import useNgTheme from "@/hooks/useNgTheme";
import type { Bilhete, Sorteio, User } from "@/types";
import { getAuthToken, sorteioService, ticketService, userService } from "@/services";
import { extractUserIdFromToken, extractUserNameFromToken } from "@/utils/auth";
import "./ParticipantDashboard.scss";

const WHATSAPP_URL = "https://wa.me/5561985979700";

export default function ParticipantDashboard() {
    const { theme, mode, setMode } = useNgTheme();
    const navigate = useNavigate();
    const token = getAuthToken();
    const userId = useMemo(() => extractUserIdFromToken(token), [token]);
    const tokenName = useMemo(() => extractUserNameFromToken(token), [token]);

    const [user, setUser] = useState<User | null>(null);
    const [raffles, setRaffles] = useState<Sorteio[]>([]);
    const [rafflesLoading, setRafflesLoading] = useState(true);
    const [rafflesError, setRafflesError] = useState("");

    const [tickets, setTickets] = useState<Bilhete[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [ticketsError, setTicketsError] = useState("");

    useEffect(() => {
        let active = true;
        setRafflesLoading(true);
        setRafflesError("");
        (async () => {
            try {
                const data = await sorteioService.listPublic();
                if (!active) return;
                setRaffles(data);
                setRafflesError("");
            } catch (err) {
                console.error("Erro ao carregar sorteios", err);
                if (!active) return;
                setRaffles([]);
                setRafflesError("Não foi possível carregar os sorteios no momento. Tente novamente em instantes.");
            } finally {
                if (active) setRafflesLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            setUser(null);
            setTickets([]);
            setTicketsLoading(false);
            setTicketsError("");
            return;
        }

        let active = true;
        (async () => {
            try {
                const [profile, userTickets] = await Promise.all([
                    userService.me(),
                    ticketService.mine(),
                ]);
                if (!active) return;
                setUser(profile);
                setTickets(userTickets);
                setTicketsError("");
            } catch (err) {
                console.error("Erro ao carregar dados do participante", err);
                if (!active) return;
                setTicketsError("Não foi possível carregar suas cotas. Tente novamente mais tarde.");
            } finally {
                if (active) setTicketsLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [userId]);

    const greetName = user?.nome ?? tokenName ?? "participante";

    const handleParticipar = (raffle: Sorteio) => {
        if (!userId) {
            navigate("/login", { replace: false, state: { from: "/participante" } });
            return;
        }
        window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    };

    const formatDate = (value?: string) => {
        if (!value) return "-";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(value));
        } catch {
            return value;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header mode={mode} setMode={setMode} />
            <Box className="participant" sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Stack spacing={0.5}>
                            <Typography variant="h4" fontWeight={800}>Olá, {greetName}!</Typography>
                            {user ? (
                                <Typography color="text.secondary">
                                    Saldo disponível: {user.saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Typography>
                            ) : (
                                <Typography color="text.secondary">
                                    Faça login para acompanhar seus bilhetes e reservas em tempo real.
                                </Typography>
                            )}
                        </Stack>

                        <Box>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Sorteios disponíveis</Typography>
                            {rafflesError && (
                                <Alert severity="warning" sx={{ mb: 2 }}>{rafflesError}</Alert>
                            )}
                            {rafflesLoading ? (
                                <Grid container spacing={3}>
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <Grid key={`raffle-skeleton-${idx}`} item xs={12} md={4}>
                                            <Skeleton variant="rounded" height={320} className="participant__skeleton" />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : raffles.length ? (
                                <Grid container spacing={3}>
                                    {raffles.map((raffle) => (
                                        <Grid key={raffle.id} item xs={12} md={4}>
                                            <RaffleCard sorteio={raffle} onParticipar={handleParticipar} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
                                    <Typography color="text.secondary" textAlign="center">
                                        Nenhum sorteio disponível no momento. Volte mais tarde!
                                    </Typography>
                                </Paper>
                            )}
                        </Box>

                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h5" fontWeight={800}>Meus bilhetes</Typography>
                                <Button variant="contained" onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}>Falar no WhatsApp</Button>
                            </Stack>

                            {!userId && (
                                <Alert severity="info">
                                    Entre em sua conta para ver os bilhetes comprados. Clique no ícone de perfil acima para fazer login.
                                </Alert>
                            )}

                            {userId && ticketsError && (
                                <Alert severity="error">{ticketsError}</Alert>
                            )}

                            {userId && !ticketsError && (
                                <TableContainer component={Paper} elevation={0} className="participant__tickets">
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
                                            {ticketsLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography color="text.secondary">Carregando bilhetes...</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : tickets.length ? (
                                                tickets.map((ticket) => (
                                                    <TableRow key={ticket.id}>
                                                        <TableCell>{ticket.sorteio?.titulo ?? "-"}</TableCell>
                                                        <TableCell>{ticket.numero}</TableCell>
                                                        <TableCell>{formatDate(ticket.dataCompra)}</TableCell>
                                                        <TableCell>{ticket.pago ? "Pago" : "Pendente"}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography color="text.secondary">Você ainda não possui bilhetes.</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
