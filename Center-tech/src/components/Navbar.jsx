import { AppBar, Box, Button, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Navbar({ mode, setMode }) {
    return (
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
    );
}