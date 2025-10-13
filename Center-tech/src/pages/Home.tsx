import { ThemeProvider, CssBaseline, Container, Grid, Box, Typography } from "@mui/material";
import useNgTheme from "../hooks/useNgTheme";
import Header from "../components/Header";
import Hero from "../components/Hero";
import RaffleCard from "../components/RaffleCard";
import { raffles } from "../data/raffles";
import Winners from "@/components/Winners";
import Regulation from "../components/Regulation";

export default function Home() {
    const { theme, mode, setMode } = useNgTheme();

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} setMode={setMode} />
        <Hero />

        <Box id="sorteios" sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Sorteios Ativos</Typography>
            <Grid container spacing={3}>
            {raffles.map((r) => (
                <Grid item xs={12} md={4} key={r.id}>
                <RaffleCard item={r} />
                </Grid>
            ))}
            </Grid>
        </Container>
        </Box>
        <Winners />
        <Regulation />
    </ThemeProvider>
    );
}