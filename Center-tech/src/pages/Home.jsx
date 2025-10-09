import { Box, Container, Grid, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RaffleCard from "../components/RaffleCard";
import SectionTitle from "../components/SectionTitle";
import Winners from "../components/Winners";
import Regulation from "../components/Regulation";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { raffles } from "../data/raffles";
import useNgTheme from "../hooks/useNgTheme";
import { ThemeProvider, CssBaseline } from "@mui/material";

export default function Home() {
    const { theme, mode, setMode } = useNgTheme();

    const onParticipar = (item) => {
    window.open("https://wa.me/5561999999999", "_blank", "noopener,noreferrer");
    };

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
      {/* Announcement */}
        <Box sx={{ py: 1, textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
            <strong>Confiança primeiro:</strong> vinculados aos resultados da Loteria Federal.
        </Typography>
        </Box>

        <Navbar mode={mode} setMode={setMode} />
        <Hero highlight={raffles[0]} mode={mode} onParticipar={onParticipar} />

        <Box id="sorteios" sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <SectionTitle title="Sorteios ativos" subtitle="Escolha o prêmio e garanta suas cotas." />
            <Grid container spacing={3}>
            {raffles.map((item) => (
                <Grid item xs={12} md={4} key={item.id}>
                <RaffleCard item={item} onParticipar={onParticipar} />
            </Grid>
            ))}
            </Grid>
        </Container>
        </Box>

        <Winners mode={mode} />
        <Regulation mode={mode} />
        <FAQ />
        <Contact />
        <WhatsAppFloat />
    </ThemeProvider>
    );
}