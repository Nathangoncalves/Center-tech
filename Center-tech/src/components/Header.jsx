import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Box, Stack, Button, IconButton, Menu, MenuItem, Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Header({ mode, setMode }) {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ minHeight: 72 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Centertech <Box component="span" sx={{ color: "primary.main" }}>Sorteios</Box>
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/#sorteios" variant="text">Sorteios</Button>
            <Button component={RouterLink} to="/#ganhadores" variant="text">Ganhadores</Button>
            <Button component={RouterLink} to="/#regulamento" variant="text">Regulamento</Button>
            <Button component={RouterLink} to="/#contato" variant="text">Contato</Button>

            <Tooltip title="Tema">
            <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            </Tooltip>

          {/* Conta */}
            <Tooltip title="Login / Cadastro">
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                <AccountCircleIcon />
            </IconButton>
            </Tooltip>
            <Menu
            anchorEl={anchor}
            open={open}
            onClose={() => setAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
            <MenuItem component={RouterLink} to="/cadastro" onClick={() => setAnchor(null)}>
                Criar Conta (Participante)
            </MenuItem>
            <MenuItem component={RouterLink} to="/gestor" onClick={() => setAnchor(null)}>
                Fazer Login (Gestor)
            </MenuItem>
            </Menu>
        </Stack>
        </Toolbar>
    </AppBar>
    );
}