// HomePage.jsx — UI focada (P&B), dark/light prontos, cards premium
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import {
    CssBaseline, AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip,
    Container, Grid, IconButton, Stack, Toolbar, Typography, LinearProgress, Divider, Tooltip
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

// ---------- helpers ----------
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const money = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

// ---------- THEME ----------
function useNgTheme() {
    const getInitialMode = () => {
    const saved = localStorage.getItem("ng-mode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    const [mode, setMode] = useState(getInitialMode);
    useEffect(() => { localStorage.setItem("ng-mode", mode); }, [mode]);

    const theme = useMemo(() => responsiveFontSizes(createTheme({
    palette: {
        mode,
        primary: { main: mode === "dark" ? "#fff" : "#000" },
        background: {
        default: mode === "dark" ? "#000" : "#fff",
        paper: mode === "dark" ? "#101012" : "#F7F7F9",
        },
        text: {
        primary: mode === "dark" ? "#fff" : "#0B0B0C",
        secondary: mode === "dark" ? "#A1A1AA" : "#4B5563",
        },
        divider: mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.12)",
    },
    shape: { borderRadius: 16 },
    typography: {
        fontFamily: "Inter Tight, Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        h1: { fontWeight: 900, letterSpacing: -1.0, lineHeight: 1.05 },
        h2: { fontWeight: 800, letterSpacing: -0.5 },
        h3: { fontWeight: 800 },
        button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
        MuiCssBaseline: {
        styleOverrides: {
            body: {
            transition: "background-color .2s ease, color .2s ease",
            backgroundImage:
                mode === "dark"
                ? "radial-gradient(800px 400px at 80% -50px, rgba(255,255,255,.06), transparent), radial-gradient(1200px 600px at -10% -20%, rgba(255,255,255,.04), transparent)"
                : "radial-gradient(800px 400px at 80% -50px, rgba(0,0,0,.04), transparent)",
            },
        },
    },
    MuiCard: {
        styleOverrides: {
        root: {
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
            backgroundImage: "none",
            boxShadow: mode === "dark" ? "0 12px 32px rgba(0,0,0,.35)" : "0 8px 24px rgba(0,0,0,.08)",
            transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
            "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: mode === "dark" ? "0 18px 40px rgba(0,0,0,.5)" : "0 12px 32px rgba(0,0,0,.12)",
            borderColor: mode === "dark" ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.16)",
            },
        },
        },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 12, paddingInline: 18, height: 44 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 8 }, bar: { borderRadius: 8 } } },
    },
})), [mode]);

return { theme, mode, setMode };
}

// ---------- Countdown (apresentação) ----------
function useCountdown(targetIso) {
    const target = new Date(targetIso).getTime();
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, target - now);
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return { d, h, m, s: ss, finished: diff === 0 };
}

// ---------- Card de sorteio (UI) ----------
function RaffleCard({ item, onParticipar }) {
    const { d, h, m, s, finished } = useCountdown(item.endsAt);
  const pct = clamp(Math.round((item.quotasSold / item.quotasTotal) * 100), 0, 100);

    return (
        <Card sx={{ overflow: "hidden" }}>
        <CardActionArea onClick={() => onParticipar(item)}>
        {/* Imagem com aspecto 16:9 + badge */}
        <Box sx={{ position: "relative" }}>
        <CardMedia component="img" image={item.img} alt={item.titulo} sx={{ aspectRatio: "16/9", objectFit: "cover" }} />
        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12 }}>
            {item.badge && <Chip size="small" label={item.badge} sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider" }} />}
            <Chip size="small" icon={<LocalOfferIcon />} label={`${money(item.price)}/cota`} />
        </Stack>
        </Box>

        {/* Conteúdo */}
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

// ---------- Página ----------
export default function HomePage() {
    const { theme, mode, setMode } = useNgTheme();

  // Imagens: use public/… ou importe de src/assets (como preferir)
    const raffles = [
    {
        id: "r1",
        titulo: "iPhone 16 Normal",
        img: "/assets/731403.jpg",
        price: 0.10,
        quotasTotal: 10000,
        quotasSold: 2635,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3.5).toISOString(),
        badge: "Mais desejado",
    },
    {
        id: "r2",
        titulo: "PlayStation 5 Slim",
        img: "/img/ps5.jpg",
        price: 0.10,
        quotasTotal: 8000,
        quotasSold: 5230,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
        badge: "Hot",
    },
    {
        id: "r3",
        titulo: "Honda CG 160 Start",
        img: "/img/moto.jpg",
        price: 0.10,
        quotasTotal: 12000,
        quotasSold: 11110,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
        badge: "Quase no fim",
    },
];

    const handleParticipar = useCallback((item) => {
    // Só apresentação por enquanto — CTA primário
    window.open("https://wa.me/5561999999999", "_blank", "noopener,noreferrer");
    }, []);

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />

      {/* Announcement bar */}
        <Box sx={{ py: 1, textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
            <strong>Confiança primeiro:</strong> vinculados aos resultados da Loteria Federal.
        </Typography>
        </Box>

      {/* Navbar */}
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ minHeight: 72 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: .2 }}>
            Centertech <Box component="span" sx={{ color: "primary.main" }}>Sorteios</Box>
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={2} alignItems="center">
            <Button href="#sorteios" variant="text">Sorteios</Button>
            <Button href="#ganhadores" variant="text">Ganhadores</Button>
            <Button href="#regulamento" variant="text">Regulamento</Button>
            <Button href="#contato" variant="text">Contato</Button>
            <Tooltip title="Alternar tema">
                <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Tooltip>
            </Stack>
        </Toolbar>
        </AppBar>

      {/* Hero */}
        <Box
        sx={{
            position: "relative",
            py: { xs: 10, md: 12 },
            overflow: "hidden",
            background:
            mode === "dark"
                ? "linear-gradient(180deg, #0b0b0c, #111115)"
                : theme.palette.background.default,
        }}
        >
        {/* ruído suave */}
        <Box
            sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage:
                "radial-gradient(1200px 500px at 0% -10%, rgba(255,255,255,.05), transparent), radial-gradient(900px 450px at 100% -20%, rgba(255,255,255,.04), transparent)"
            }}
        />
        <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
                <Stack spacing={2.5}>
                <Chip
                    label="Sorteios verificados • Loteria Federal"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                    icon={<ShieldOutlinedIcon />}
                />
                <Typography variant="h1">
                    Prêmios que você quer, com{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>preço justo</Box>.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                    Experiência simples, transparente e bonita — reserve suas cotas em poucos cliques.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} href="https://wa.me/5561999999999" target="_blank">
                    Participar agora
                    </Button>
                    <Button size="large" variant="outlined" href="#sorteios">
                    Ver sorteios
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                    <Stack>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>10k+</Typography>
                    <Typography variant="caption" color="text.secondary">Cotas vendidas</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>98%</Typography>
                    <Typography variant="caption" color="text.secondary">Aprovação</Typography>
                    </Stack>
                </Stack>
                </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
                <Card sx={{ p: 1.5 }}>
                <CardMedia
                    component="img"
                    image={raffles[0].img}
                    alt={raffles[0].titulo}
                    sx={{ aspectRatio: "4/3", objectFit: "cover", borderRadius: 2 }}
                />
                <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Próximo destaque</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{raffles[0].titulo}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .75 }}>
                    <LocalOfferIcon fontSize="small" />
                    <Typography variant="body2">{money(raffles[0].price)} por cota</Typography>
                    </Stack>
                    <Button fullWidth variant="contained" sx={{ mt: 1.5 }} onClick={() => handleParticipar(raffles[0])}>
                    Participar do destaque
                    </Button>
                </CardContent>
                </Card>
            </Grid>
            </Grid>
        </Container>
        </Box>

      {/* Sorteios */}
        <Box id="sorteios" sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Sorteios ativos</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>Escolha o prêmio e garanta suas cotas.</Typography>
            <Grid container spacing={3}>
            {raffles.map((item) => (
                <Grid item xs={12} md={4} key={item.id}>
                <RaffleCard item={item} onParticipar={handleParticipar} />
                </Grid>
            ))}
            </Grid>
        </Container>
        </Box>

      {/* Ganhadores (apresentação) */}
        <Box id="ganhadores" sx={{ py: 8, background: mode === "dark" ? "#0E0E0E" : "#F6F7F8" }}>
        <Container maxWidth="lg">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <EmojiEventsIcon />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Ganhadores recentes</Typography>
            </Stack>
            <Grid container spacing={3}>
            {[
                { nome: "Lucas M.", premio: "iPhone 15 Pro", cidade: "Brasília/DF", data: "07/2025" },
                { nome: "Ana P.", premio: "PlayStation 5", cidade: "Goiânia/GO", data: "06/2025" },
                { nome: "Rafael S.", premio: "Moto CG 160", cidade: "São Paulo/SP", data: "05/2025" },
            ].map((g, i) => (
                <Grid item xs={12} md={4} key={i}>
                <Card>
                    <CardContent>
                    <Typography variant="overline" color="text.secondary">Vencedor</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{g.premio}</Typography>
                    <Typography color="text.secondary">{g.nome} • {g.cidade}</Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">Sorteio em {g.data}</Typography>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Container>
        </Box>

      {/* Regulamento (resumo) */}
        <Box id="regulamento" sx={{ py: 8 }}>
        <Container maxWidth="md">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Regulamento</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
            Sorteios vinculados à Loteria Federal. Após a confirmação do pagamento, seus números ficam disponíveis.
            Em caso de cancelamento, estorno integral. Consulte o regulamento completo no ato da compra.
            </Typography>
            <Button variant="outlined">Ver regulamento completo</Button>
        </Container>
        </Box>

      {/* Contato */}
        <Box id="contato" sx={{ py: 8 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Fale conosco</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
            Dúvidas sobre regras, pagamento ou prazos? Chame no WhatsApp.
            </Typography>
            <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} href="https://wa.me/5561999999999" target="_blank">
            WhatsApp
            </Button>
        </Container>
        </Box>

      {/* WhatsApp flutuante */}
        <IconButton
        href="https://wa.me/5561999999999"
        target="_blank"
        sx={{
            position: "fixed", right: 16, bottom: 16, zIndex: 1300,
            bgcolor: "#25D366", color: "#000", "&:hover": { bgcolor: "#20BD5A" }
        }}
        >
        <WhatsAppIcon />
        </IconButton>

      {/* Footer */}
        <Box component="footer" sx={{ py: 5, borderTop: 1, borderColor: "divider" }}>
        <Container sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Centertech Sorteios — apresentação impecável, transparência real.
            </Typography>
        </Container>
        </Box>
    </ThemeProvider>
    );
}