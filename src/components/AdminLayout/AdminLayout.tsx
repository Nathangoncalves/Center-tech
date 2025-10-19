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
import "./AdminLayout.scss";

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
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDrawer = () => setMobileOpen((prev) => !prev);
    const handleSelect = (id: string) => {
        onSelectSection(id);
        if (!isDesktop) setMobileOpen(false);
    };

    const renderDrawerContent = (
        <Box className="admin-layout__drawer" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar className="admin-layout__drawer-toolbar" sx={{ px: 3 }}>
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
            <List className="admin-layout__drawer-list" sx={{ flex: 1, py: 1 }}>
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
            <Box className="admin-layout__drawer-footer" sx={{ p: 3, typography: "caption", color: "text.secondary" }}>
                &copy; {new Date().getFullYear()} Centertech • Todos os direitos reservados.
            </Box>
        </Box>
    );

    return (
        <Box className="admin-layout" sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar
                className="admin-layout__appbar"
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (t) => t.zIndex.drawer + 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar className="admin-layout__toolbar" sx={{ gap: 2, minHeight: 80 }}>
                    {!isDesktop && (
                        <IconButton color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box className="admin-layout__title-wrapper" sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={800}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {headerActions}
                </Toolbar>
            </AppBar>

            <Box component="nav" className="admin-layout__nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }} aria-label="Admin navigation">
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
                className="admin-layout__content"
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    ml: { lg: `${drawerWidth}px` },
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
