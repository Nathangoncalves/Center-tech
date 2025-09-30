import { Box, Typography } from "@mui/material";

export default function Contato() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Entre em Contato</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Formulário de contato ou redes sociais.
            </Typography>
        </Box>
    );
}