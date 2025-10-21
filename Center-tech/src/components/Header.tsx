import { useState, MouseEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Box, Stack, Button,
    IconButton, Menu, MenuItem, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import type { ThemeMode } from "../types";

type Props = { mode: ThemeMode; setMode: (m: ThemeMode) => void };

export default function Header({ mode, setMode }: Props) {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(anchor);
    const onOpen = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const onClose = () => setAnchor(null);
    const navigate = useNavigate();

    return (
    <AppBar
        position="sticky"
        elevation={0}
        sx={{
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: (theme) => alpha(theme.palette.background.paper, mode === "dark" ? 0.2 : 0.7),
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        }}
    >
        <Toolbar sx={{ minHeight: 72 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="" alt="Centertech Sorteios" style={{ height: 40 }} />
        </Box>

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

            <Tooltip title="Login / Cadastro">
            <IconButton onClick={onOpen}><AccountCircleIcon /></IconButton>
            </Tooltip>
            <Menu
            anchorEl={anchor}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
            <MenuItem onClick={() => { onClose(); navigate("/cadastro"); }}>
                Criar Conta
            </MenuItem>
            <MenuItem onClick={() => { onClose(); navigate("/login"); }}>
                Fazer Login
            </MenuItem>
            </Menu>
        </Stack>
        </Toolbar>
    </AppBar>
    );
}