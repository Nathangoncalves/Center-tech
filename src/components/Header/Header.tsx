import { useEffect, useState, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Box, Stack, Button,
    IconButton, Menu, MenuItem, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Header.scss";
import type { ThemeMode } from "@/types";
import { authService } from "@/services";
import { AUTH_TOKEN_CHANGED_EVENT, getAuthToken } from "@/services/api";
import { extractUserNameFromToken } from "@/utils/auth";

type Props = { mode: ThemeMode; setMode: (m: ThemeMode) => void };

export default function Header({ mode, setMode }: Props) {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAuthToken()));
    const [userName, setUserName] = useState<string | null>(extractUserNameFromToken(getAuthToken()));
    const open = Boolean(anchor);
    const onOpen = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const onClose = () => setAnchor(null);
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        const url = new URL(window.location.href);
        url.hash = sectionId;
        window.history.replaceState({}, "", url);
    };

    const handleSectionClick = (sectionId: string) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: sectionId } });
            return;
        }
        scrollToSection(sectionId);
    };

    const navItems = [
        { label: "Sorteios", id: "sorteios" },
        { label: "Ganhadores", id: "ganhadores" },
        { label: "Regulamento", id: "regulamento" },
        { label: "Contato", id: "contato" },
    ] as const;

    const accountItems = isAuthenticated
        ? [
            { label: "Meu painel", action: () => navigate("/participante") },
            { label: "Sair", action: () => { authService.logout(); setIsAuthenticated(false); navigate("/"); } },
        ]
        : [
            { label: "Criar conta (Participante)", action: () => navigate("/cadastro") },
            { label: "Fazer login (Gestor)", action: () => navigate("/login") },
        ];

    useEffect(() => {
        const syncAuth = () => {
            const token = getAuthToken();
            setIsAuthenticated(Boolean(token));
            setUserName(extractUserNameFromToken(token));
        };
        const handleCustom = () => syncAuth();
        const handleStorage = () => syncAuth();
        window.addEventListener("storage", handleStorage);
        window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, handleCustom);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, handleCustom);
        };
    }, []);

    return (
    <AppBar
        className="header"
        position="sticky"
        elevation={0}
        sx={{
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderBottom: 1,
        borderColor: "divider",
        // ✅ usa função inline — evita undefined em theme
        bgcolor: (theme) => alpha(theme.palette.background.paper, mode === "dark" ? 0.2 : 0.7),
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        }}
    >
        <Toolbar className="header__toolbar" sx={{ minHeight: 72 }}>
        <Box
            component="img"
            src="/assets/logo-centertech.svg"
            alt="Centertech"
            className="header__logo"
        />

        <Box sx={{ flexGrow: 1 }} />

        <Stack className="header__nav" direction="row" spacing={1} alignItems="center">
            {navItems.map((item) => (
                <Button key={item.id} variant="text" onClick={() => handleSectionClick(item.id)}>
                    {item.label}
                </Button>
            ))}
            {isAuthenticated && (
                <Button variant="outlined" onClick={() => navigate("/gestor")}>
                    Painel gestor
                </Button>
            )}

            <Tooltip title="Tema">
            <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            </Tooltip>

            {isAuthenticated && userName && (
                <Typography variant="body2" color="text.secondary">
                    Olá, {userName.split(" ")[0]}
                </Typography>
            )}

            <Tooltip title={isAuthenticated && userName ? `Conta de ${userName}` : "Login / Cadastro"}>
            <IconButton onClick={onOpen}><AccountCircleIcon /></IconButton>
            </Tooltip>
            <Menu
            anchorEl={anchor}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
            {accountItems.map((item) => (
                <MenuItem
                    key={item.label}
                    onClick={() => {
                        onClose();
                        item.action();
                    }}
                >
                    {item.label}
                </MenuItem>
            ))}
            </Menu>
        </Stack>
        </Toolbar>
    </AppBar>
    );
}
