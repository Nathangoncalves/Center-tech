import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";


export default function PublicHero() {
    const theme = useTheme();
    const navigate = useNavigate();

    const backgroundGradient = useMemo(
        () => (theme.palette.mode === "dark"
            ? "radial-gradient(120% 120% at 80% 20%, rgba(200,160,255,0.32) 0%, rgba(0,200,200,0.18) 25%, rgba(10,10,12,0.92) 60%)"
            : "radial-gradient(120% 120% at 80% 20%, rgba(0,200,200,0.35) 0%, rgba(200,160,255,0.25) 35%, rgba(248,250,252,1) 70%)"),
        [theme.palette.mode],
    );

    const glassBackground = alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.18 : 0.55);
    const glassBorder = alpha(theme.palette.common.white, theme.palette.mode === "dark" ? 0.12 : 0.45);
    const primaryBorder = theme.palette.mode === "dark" ? alpha("#0f172a", 0.85) : "#0f172a";
    const secondaryBorder = theme.palette.mode === "dark" ? alpha("#f8fafc", 0.85) : alpha("#f8fafc", 0.9);

    return (
        <Box
            component="section"
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                minHeight: { xs: "60vh", md: "75vh" },
                py: { xs: 10, md: 14 },
                overflow: "hidden",
                background: backgroundGradient,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    "&::before, &::after": {
                        content: "\"\"",
                        position: "absolute",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                        opacity: 0.6,
                    },
                    "&::before": {
                        width: 260,
                        height: 260,
                        top: "12%",
                        left: "6%",
                        background: "rgba(200,160,255,0.45)",
                    },
                    "&::after": {
                        width: 320,
                        height: 320,
                        bottom: "10%",
                        right: "12%",
                        background: "rgba(0,200,200,0.35)",
                    },
                }}
            />
            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Stack
                            component={motion.div}
                            spacing={4}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            sx={{
                                p: { xs: 3.5, md: 5 },
                                borderRadius: 4,
                                backgroundColor: glassBackground,
                                boxShadow: theme.shadows[24],
                                backdropFilter: "blur(18px)",
                                border: `1px solid ${glassBorder}`,
                            }}
                        >
                            <Stack spacing={1}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: "2.7rem", md: "3.6rem" },
                                        fontWeight: 800,
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    Experimente sorteios digitais de forma segura.
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        fontSize: { xs: "1.05rem", md: "1.2rem" },
                                        maxWidth: 560,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Garanta seus bilhetes, confirme pagamentos instantaneamente e acompanhe cada etapa em
                                    uma plataforma segura e intuitiva.
                                </Typography>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button
                                    onClick={() => navigate("/cadastro")}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        px: 5,
                                        py: 1.6,
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        borderWidth: 2,
                                        borderColor: secondaryBorder,
                                        color: secondaryBorder,
                                        transition: "transform 160ms ease, box-shadow 160ms ease",
                                        "&:hover": {
                                            borderColor: secondaryBorder,
                                            backgroundColor: alpha(secondaryBorder, theme.palette.mode === "dark" ? 0.15 : 0.08),
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 16px 30px rgba(15, 23, 42, 0.2)",
                                        },
                                    }}
                                >
                                    Participe agora
                                </Button>
                                <Button
                                    onClick={() => navigate("/sorteios")}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        px: 5,
                                        py: 1.6,
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        borderWidth: 2,
                                        borderColor: secondaryBorder,
                                        color: theme.palette.mode === "dark" ? secondaryBorder : primaryBorder,
                                        backgroundColor: theme.palette.mode === "dark"
                                            ? alpha("#0f172a", 0.35)
                                            : alpha("#ffffff", 0.6),
                                        transition: "transform 160ms ease, box-shadow 160ms ease",
                                        "&:hover": {
                                            borderColor: secondaryBorder,
                                            backgroundColor: theme.palette.mode === "dark"
                                                ? alpha("#0f172a", 0.5)
                                                : alpha("#ffffff", 0.75),
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 16px 30px rgba(15, 23, 42, 0.2)",
                                        },
                                    }}
                                >
                                    Ver sorteios ativos
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
