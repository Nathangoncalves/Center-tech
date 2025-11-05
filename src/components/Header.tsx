import { MouseEvent, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    Stack,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import type { ThemeMode } from "../types";
import logoDark from "../assets/img/png/logo-dark.png";
import logoLight from "../assets/img/png/logo-white.png";
import { getAuthToken, setAuthToken } from "../services/api";
import { clearStoredRole, getStoredRole } from "@/utils/authStorage";

type Props = { mode: ThemeMode; setMode: (m: ThemeMode) => void };

export default function Header({ mode, setMode }: Props) {
    const navigate = useNavigate();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthToken()));
    const [currentRole, setCurrentRole] = useState(getStoredRole());

    useEffect(() => {
        const syncAuth = () => {
            setIsAuthenticated(Boolean(getAuthToken()));
            setCurrentRole(getStoredRole());
        };
        window.addEventListener("auth:changed", syncAuth);
        window.addEventListener("storage", syncAuth);
        syncAuth();
        return () => {
            window.removeEventListener("auth:changed", syncAuth);
            window.removeEventListener("storage", syncAuth);
        };
    }, []);

    const logoSrc = useMemo(() => (mode === "dark" ? logoLight : logoDark), [mode]);
    const navLinks = useMemo(
        () => [
            { label: "Início", to: "/" },
            { label: "Sorteios", to: "/sorteios" },
            { label: "Como funciona", to: "/como-funciona" },
            { label: "Ganhadores", to: "/ganhadores" },
            { label: "Regulamento", to: "/regulamento" },
        ],
        [],
    );

    const isAdmin = currentRole === "ADMIN";

    const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => setMenuAnchor(event.currentTarget);
    const handleCloseMenu = () => setMenuAnchor(null);

    const handleLogout = () => {
        setAuthToken(null);
        clearStoredRole();
        navigate("/", { replace: true });
    };

    const goToDashboard = () => navigate(isAdmin ? "/gestor" : "/participante");

    const actionButtons = isAuthenticated
        ? [
            { key: "area", label: isAdmin ? "Painel do gestor" : "Área do usuário", variant: "outlined" as const, onClick: goToDashboard },
            { key: "logout", label: "Sair", variant: "contained" as const, onClick: handleLogout },
        ]
        : [
            { key: "login", label: "Entrar", variant: "text" as const, onClick: () => navigate("/login") },
            { key: "signup", label: "Criar conta", variant: "contained" as const, onClick: () => navigate("/cadastro") },
        ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                zIndex: (t) => t.zIndex.appBar,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) => alpha(theme.palette.background.paper, mode === "dark" ? 0.3 : 0.85),
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
            }}
        >
            <Toolbar sx={{ minHeight: 72, gap: 2, flexWrap: "wrap" }}>
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <Box component="img" src={logoSrc} alt="Centertech Sorteios" sx={{ height: 40, width: "auto" }} />
                </Box>

                <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
                    {navLinks.map(({ label, to }) => (
                        <Button
                            key={to}
                            component={RouterLink}
                            to={to}
                            variant="text"
                            sx={{ fontWeight: 600, textTransform: "none" }}
                        >
                            {label}
                        </Button>
                    ))}
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <Tooltip title="Alternar tema">
                        <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>

                    {actionButtons.map(({ key, label, variant, onClick }) => (
                        <Button
                            key={key}
                            variant={variant}
                            size="medium"
                            onClick={onClick}
                            sx={{ fontWeight: 600, textTransform: "none", borderRadius: 999, px: 3 }}
                        >
                            {label}
                        </Button>
                    ))}

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleOpenMenu}
                        sx={{ display: { xs: "inline-flex", md: "none" } }}
                        aria-label="Abrir menu"
                    >
                        <MenuIcon />
                    </IconButton>
                </Stack>

                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    {navLinks.map(({ label, to }) => (
                        <MenuItem
                            key={to}
                            component={RouterLink}
                            to={to}
                            onClick={handleCloseMenu}
                        >
                            {label}
                        </MenuItem>
                    ))}
                    <Divider sx={{ my: 0.5 }} />
                    {actionButtons.map(({ key, label, onClick }) => (
                        <MenuItem
                            key={`mobile-${key}`}
                            onClick={() => {
                                handleCloseMenu();
                                onClick();
                            }}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
