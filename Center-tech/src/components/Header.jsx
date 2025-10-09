import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <AppBar
        position="sticky"
        elevation={0}
        color="transparente"
        sx={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            py: 1,
        }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/*  Nome ou logotipo */}
                <Typography variant="h6" component="div" sx={{
                    fontWeight: "bold" }}>
                        Nathan Gonçalves
                        </Typography>

                {/* Links de navegação */}
                <Box sx={{ display: "flex", gap: 3, alignItems: 
                    "center" }}>
                        <Button color="inherit" component={Link} to="/" sx={{
                            textTransform: "none" }}>
                            Início
                        </Button>
                        <Button color="inherit" component={Link} to="/sobre" sx={{
                            textTransform: "none" }}>
                                Sobre 
                        </Button>
                        <Button color="inherit" component={Link} to="/contato" sx={{
                            textTransform: "none" }}>
                                Contato 
                        </Button>

                        {/* Botão de currículo */}
                        <Button 
                        variant="contained"
                        href="/curriculo.pdf"
                        target="_blank"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            "&:hover": {
                                bgcolor: "#e53e3e",
                            },
                        }}>
                            Currículo
                        </Button>
                    </Box>
                </Toolbar>
        </AppBar>
    );
}