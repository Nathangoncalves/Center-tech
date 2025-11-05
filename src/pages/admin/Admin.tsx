import { useMemo, useState } from "react";
import { Box, CssBaseline, Paper, Stack, ThemeProvider, Typography, IconButton, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

import useNgTheme from "../../hooks/useNgTheme";
import AdminLayout, { AdminSection } from "../../components/admin/AdminLayout";
import { AdminDataProvider } from "./AdminDataProvider";
import AdminOverviewSection from "./sections/AdminOverviewSection";
import AdminUsersSection from "./sections/AdminUsersSection";
import AdminRafflesSection from "./sections/AdminRafflesSection";
import AdminTicketsSection from "./sections/AdminTicketsSection";
import AdminTransactionsSection from "./sections/AdminTransactionsSection";
import AdminItemsSection from "./sections/AdminItemsSection";
import AdminSettingsSection from "./sections/AdminSettingsSection";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../services/api";

type SectionId = "overview" | "users" | "raffles" | "tickets" | "transactions" | "items" | "settings";

const SECTION_MAP: Record<SectionId, AdminSection> = {
    overview: { id: "overview", label: "Visão Geral", icon: <DashboardIcon /> },
    users: { id: "users", label: "Usuários", icon: <PeopleAltIcon /> },
    raffles: { id: "raffles", label: "Sorteios", icon: <EmojiEventsIcon /> },
    tickets: { id: "tickets", label: "Bilhetes", icon: <ConfirmationNumberIcon /> },
    transactions: { id: "transactions", label: "Transações", icon: <ReceiptLongIcon /> },
    items: { id: "items", label: "Itens", icon: <InventoryIcon /> },
    settings: { id: "settings", label: "Configurações", icon: <SettingsIcon /> },
};

const orderedSections: SectionId[] = [
    "overview",
    "users",
    "raffles",
    "tickets",
    "transactions",
    "items",
    "settings",
];

export default function Admin() {
    const { theme, mode, setMode } = useNgTheme();
    const [activeSection, setActiveSection] = useState<SectionId>("overview");
    const navigate = useNavigate();

    const sections = useMemo(() => orderedSections.map((id) => SECTION_MAP[id]), []);

    const renderSection = () => {
        switch (activeSection) {
        case "overview":
            return <AdminOverviewSection />;
        case "users":
            return <AdminUsersSection />;
        case "raffles":
            return <AdminRafflesSection />;
        case "tickets":
            return <AdminTicketsSection />;
        case "transactions":
            return <AdminTransactionsSection />;
        case "items":
            return <AdminItemsSection />;
        case "settings":
            return <AdminSettingsSection />;
        default:
            return (
                <Paper sx={{ p: 5, borderRadius: 3, textAlign: "center" }}>
                    <Stack spacing={1} alignItems="center">
                        <Typography variant="h5" fontWeight={800}>
                            Configurações gerais
                        </Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
                            Ajustes de integrações, webhooks e notificações serão disponibilizados em breve.
                        </Typography>
                    </Stack>
                </Paper>
            );
        }
    };

    const headerActions = (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Alternar tema">
                <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Tooltip>
            <Tooltip title="Voltar ao site">
                <IconButton href="/" color="inherit">
                    <HomeIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Sair">
                <IconButton
                    color="inherit"
                    onClick={() => {
                        clearAuthToken();
                        navigate("/login", { replace: true, state: { from: "/gestor" } });
                    }}
                >
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminDataProvider>
                <AdminLayout
                    title=""
                    subtitle="Painel centralizado para administrar sorteios, finanças e usuários."
                    sections={sections}
                    activeSectionId={activeSection}
                    onSelectSection={(id) => setActiveSection(id as SectionId)}
                    headerActions={headerActions}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>{renderSection()}</Box>
                </AdminLayout>
            </AdminDataProvider>
        </ThemeProvider>
    );
}
