import { ReactNode, useState } from "react";
import {
    AppBar,
    Badge,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logoDark from "../../assets/img/png/logo-dark.png";
import logoLight from "../../assets/img/png/logo-white.png";

export interface AdminSection {
    id: string;
    label: string;
    icon: ReactNode;
    badge?: number;
}

interface AdminLayoutProps {
    title: string;
    subtitle?: string;
    sections: AdminSection[];
    activeSectionId: string;
    onSelectSection: (id: string) => void;
    headerActions?: ReactNode;
    children: ReactNode;
}

const drawerWidth = 280;

export default function AdminLayout({
    title,
    subtitle,
    sections,
    activeSectionId,
    onSelectSection,
    headerActions,
    children,
}: AdminLayoutProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const logoSrc = theme.palette.mode === "dark" ? logoLight : logoDark;
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDrawer = () => setMobileOpen((prev) => !prev);
    const handleSelect = (id: string) => {
        onSelectSection(id);
        if (!isDesktop) setMobileOpen(false);
    };

    const renderDrawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ px: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                    Painel Centertech
                </Typography>
                {!isDesktop && (
                    <IconButton onClick={toggleDrawer} sx={{ ml: "auto" }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
            <List sx={{ flex: 1, py: 1 }}>
                {sections.map(({ id, label, icon, badge }) => {
                    const selected = id === activeSectionId;
                    return (
                        <ListItemButton
                            key={id}
                            selected={selected}
                            onClick={() => handleSelect(id)}
                            sx={{
                                mx: 1,
                                borderRadius: 2,
                                "&.Mui-selected": {
                                    bgcolor: (t) => t.palette.primary.main,
                                    color: (t) => t.palette.primary.contrastText,
                                    "& .MuiListItemIcon-root": {
                                        color: (t) => t.palette.primary.contrastText,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "inherit" }}>
                                {badge ? <Badge badgeContent={badge}>{icon}</Badge> : icon}
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    );
                })}
            </List>
            <Box sx={{ p: 3, typography: "caption", color: "text.secondary" }}>
                &copy; {new Date().getFullYear()} Centertech • Todos os direitos reservados.
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (t) => t.zIndex.drawer + 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar
                    sx={{
                        gap: { xs: 1.5, md: 2 },
                        minHeight: 80,
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        alignItems: "center",
                        py: { xs: 1.5, md: 0 },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                        {!isDesktop && (
                            <IconButton color="inherit" onClick={toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box
                            component="img"
                            alt="Centertech"
                            src={logoSrc}
                            sx={{ height: 36, width: "auto" }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                        <Typography variant="h5" fontWeight={800}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: { xs: "flex-end", md: "flex-start" },
                            width: { xs: "100%", md: "auto" },
                        }}
                    >
                        {headerActions}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }} aria-label="Admin navigation">
                {isDesktop ? (
                    <Drawer
                        variant="permanent"
                        open
                        sx={{
                            "& .MuiDrawer-paper": {
                                position: "relative",
                                width: drawerWidth,
                                borderRight: 1,
                                borderColor: "divider",
                                bgcolor: "background.paper",
                            },
                        }}
                    >
                        {renderDrawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={toggleDrawer}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                            },
                        }}
                    >
                        {renderDrawerContent}
                    </Drawer>
                )}
            </Box>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    pt: 10,
                    pb: 6,
                    px: { xs: 2, md: 4 },
                    gap: 3,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
