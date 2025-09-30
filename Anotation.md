import React from "react";
import { useMemo, useState } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { CssBaseline } from "@mui/material/CssBaseline";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Chip, Container, Divider, Grid, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DownloadIcon from "@mui/icons-material/Download";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


// -------- THEME --------
function useNgTheme() {
    const [mode, setMode] = useState("dark");
    const theme = useMemo(() => 
        responsiveFontSizes(
            createTheme({
                palette: {
                    mode,
                    primary: { main: mode === "dark" ? "#00BFA6" : "#0EAE9A" }, //acento turquesa
                    secondary: { main: "#7C4DFF" }, // roxo sutil para chips/links 
                    background: {
                        default: mode === "dark" ? "#0B0B0C" : "F7F7F8", 
                        paper: mode === "dark" ? "A1A1AA" : "4B5563",
                    },
                },
                shape: { borderRadius: 16 },
                typography: {
                    fontFamily: "Inter Tight, Inter, system-ui, -apple-system, Segeo UI, Roboto, Helvetica, Arial, sans-serif",
                    h1: { fontWeight: 800, letterSpacing: -1.0 },
                    h2: { fontWeight: 800, letterSpacing: -0.5 },
                    h3: { fontWeight: 800 },
                    button: { textTransform: "none", fontWeight: 700 },
                },
                components: { 
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                                },
                            },
                        },
                    },
                })
        ), [mode]
    );
    return { theme, mode, setMode}
}

// -------- PAGE --------
export default function HomePage() {
    const { theme, mode, setMode } = useNgTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* NAVBAR */} 
            <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)", borderBottom: 1, borderColor: "divider" }}>
                <Toolbar sx={{ py: 1, gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                        NG<span style={{ color: theme.palette.primary.main }}>.</span>
                    </Typography>
                    <Box sx={{ flexGrow: 1}} />
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button href="#projetos" variant="text">Projetos</Button>
                        <Button href="#sobre" variant="text">Sobre</Button>
                        <Button href="#contato" variant="text">Contato</Button>
                        <Divider orientation="verttical" flexItem sx={{ mx: 1 }} />
                        <IconButton aria-label="GitHub" size="small" color="inherit" href="https://github.com/Nathangoncalves" target="_blank" real="noreferrer"> 
                            <GitHubIcon />
                        </IconButton>
                        <IconButton aria-label="LinkedIn" size="small" color="inherit" href="www.linkedin.com/in/nathan-o-goncalves" target="_blank" real="noreferrer"> 
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton aria-label="Email" size="small" color="inherit" href="#contato">
                            <EmailIcon />
                        </IconButton>
                        <IconButton arial-label="Alternar tema" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* HERO */}
            <Box component="section" sx={{
                position: "relative",
                overflow: "hidden",
                py: {xs: 8, sm: 12, md: 16 },
                background: `radial-gradient(1200px 600px at 0% 0%, ${theme.palette.primary.main}22 0%, transparent 60%), radial-gradiente(1000px 500px at 100% -10%, #7C4DFF22 0%, transparent 60%)`,
            }}> 
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Stack spacing={2}>
                                <Chip label="Desenvolvedor Full-Stack" color="primary" variant="outlined" sx={{ alignSelf: "flex-start" }} />
                                <Typography variant="h2" component="h1" sx={{ lineHeight: 1.1 }}>
                                    Construindo produtos <Box component="span" sx={{ color: "primary.main" }}>performáticos</Box> e experiências limpas.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    React • TypeScript • Kotlin • Spring Boot • FastApi • MUI. Apaixonado por arquitetura limpa, DX e automações que reduzem custos.
                                </Typography>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt:1 }}>
                                    <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} href="#projetos">
                                    Ver Projetos
                                    </Button>
                                    <Button size="large" variant="outlined" startIcon={<DownloadIcon />} href="/cv_nathan_goncalves.pdf" target="_blank">
                                    Baixar CV
                                    </Button>
                                </Stack>
                                <Stack direction="row" spacing={1}  sx={{ pt: 2 }}>
                                    <Chip label="Kotlin • Compose" />
                                    <Chip label="Spring • NestJS" />
                                    <Chip label="SQL • NoSQL"/>
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Destaques/Mock visual á direita */}
                        <Grid item xs={12} md={5}>
                            <Stack spacing={2}>
                                <Card>
                                    <CardActionArea href="#projetos">
                                        <CardContent>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Stack>
                                                    <Typography variant="overline" color="text.secondary">Projeto em destaque</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Cadastro de Hamburgueria</Typography>
                                                    <Typography variant="body2" color="text.secondary">Checklist diário, SQLCipher, Koin, Voyager, build ios/Android.</Typography>
                                                </Stack>
                                                <WorkOutlineIcon />
                                            </ Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <Typography variant="overline" color="textSecondary">Stack atual</Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {[
                                                "React",
                                                "TypeScript",
                                                "MUI", 
                                                "Spring Boot",
                                                "NestJS",
                                                "FastAPI",
                                                "PostgreSQL",
                                                "Docker",
                                            ].map((s) => (
                                                <Chip key={s} label={s} variant="outlined" />
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

                {/* PROJETOS */}
                <Box id="projetos" component="section" sx={{ py: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Typography variant="overline" color="text.secondary">Portfólio</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900 }}>Projetos recentes</Typography>
                            <Typography color="text.secondary">Alguns trabalhos que mostram foco em performance, UX e organização de código.</Typography>
                        </Stack>
                    <Grid container spacing={3}>
                        {[1,2,3].map((i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card>
                                    <CardActionArea href={`#projeto-${i}`}>
                                        <CardContent>
                                            <Stack spacing={1}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Projeto {i}</Typography>
                                                <Typography variant="body2" color="text.secondary">Descrição breve do projeto {i} com tecnologias e resultado alcançado.</Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip size="small" label="React" />
                                                    <Chip size="small" label="Kotlin" />
                                                    <Chip size="small" label="PostgreSQL" />
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* SOBRE */}
            <Box id="sobre" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper", borderTop: 1, borderColor: "divider" }}>
                <Container maxWidth="md">
                    <Stack spacing={2}>
                        <Typography variant="overline" color="textSecondary">Quem sou</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>Nathan Gonçalves</Typography>
                        <Typography color="text.secondary">
                            Dev full-stack com foco em produtos que resolvem problemas reais. Eu gosto de código limpo, testes, design system e documentar as decisões. No tempo livre, estudo arquitetura, desempenho e automações.
                        </Typography>
                    </Stack>
                </Container>
            </Box>
            
            {/* CONTATO */}
            <Box id="contato" component="section" sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="sm">
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="overline" color="texto.secondary">Vamos conversar</Typography> 
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>Tem um projeto em mente?</Typography>
                        <Typography color="text.secondary">Me mande um ou e vamos discutir escopo, prazos e impacto.</Typography>
                        <Stack direction={{ xs: "column", sm: "row"}} spacing={2} justifyContent="center">
                            <Button variant="contained" size="large" href="malito:nathanogoncalves.ti@gmail.com" startIcon={<EmailIcon />}>Enviar e-mail</Button>
                            <Button variant="outlined" size="large" href="https://wa.me/5561999840804" target="_blank" rel="noreferrer" startIcon={<WhatsAppIcon />}>WhatsApp</Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box id="contato" component="footer" sx={{ py: 6, borderTop: 1, borderColor: "divider" }}>
                <Container>
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} NG. Feito com React + MUI.</Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton aria-label="GitHub" color="inherit" href="https://github.com/Nathangoncalves" target="_blank" rel="noreferrer"><GitHubIcon /></IconButton>
                            <IconButton aria-label="LinkedIn" color="inherit" href="www.linkedin.com/in/nathan-o-goncalves" target="_blank" rel="noreferrer"><LinkedInIcon /></IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
