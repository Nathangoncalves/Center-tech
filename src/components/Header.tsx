import { useState, MouseEvent, useMemo, useEffect } from "react";
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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import type { ThemeMode } from "../types";
import logoDark from "../assets/img/png/logo-dark.png";
import logoLight from "../assets/img/png/logo-white.png";
import { getAuthToken, setAuthToken } from "../services/api";

type Props = { mode: ThemeMode; setMode: (m: ThemeMode) => void };

export default function Header({ mode, setMode }: Props) {
const [anchor, setAnchor] = useState<null | HTMLElement>(null);
const open = Boolean(anchor);
const onOpen = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
const onClose = () => setAnchor(null);
    const navigate = useNavigate();

    const logoSrc = useMemo(() => (mode === "dark" ? logoLight : logoDark), [mode]);
    const buttonBg = useMemo(() => (mode === "dark" ? "white" : "black"), [mode]);
    const buttonColor = useMemo(() => (mode === "dark" ? "black" : "white"), [mode]);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthToken()));

    useEffect(() => {
        const updateAuthState = () => {
            setIsAuthenticated(Boolean(getAuthToken()));
        };
        updateAuthState();
        window.addEventListener("auth:changed", updateAuthState);
        window.addEventListener("storage", updateAuthState);
        return () => {
            window.removeEventListener("auth:changed", updateAuthState);
            window.removeEventListener("storage", updateAuthState);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && anchor) {
            setAnchor(null);
        }
    }, [isAuthenticated, anchor]);

    const handleLogout = () => {
        setAuthToken(null);
        navigate("/", { replace: true });
    };

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
                    <Box
                        component="img"
                        src={logoSrc}
                        alt="Centertech Sorteios"
                        sx={{ height: 40, width: "auto" }}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Tema">
                        <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>

                    {isAuthenticated ? (
                        <Button
                            onClick={handleLogout}
                            sx={{
                                backgroundColor: buttonBg,
                                color: buttonColor,
                                padding: "6px 32px",
                                "&:hover": {
                                    backgroundColor: mode === "dark" ? "grey.200" : "grey.900",
                                },
                            }}
                        >
                            Sair
                        </Button>
                    ) : (
                        <>
                            <Tooltip title="Login / Cadastro">
                                <Button
                                    onClick={onOpen}
                                    sx={{
                                        backgroundColor: buttonBg,
                                        color: buttonColor,
                                        padding: "6px 75px",
                                        "&:hover": {
                                            backgroundColor: mode === "dark" ? "grey.200" : "grey.900",
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Tooltip>
                            <Menu
                                anchorEl={anchor}
                                open={!isAuthenticated && open}
                                onClose={onClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        onClose();
                                        navigate("/login");
                                    }}
                                >
                                    Fazer Login
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onClose();
                                        navigate("/cadastro");
                                    }}
                                >
                                    Criar Conta
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
