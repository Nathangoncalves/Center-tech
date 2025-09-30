import { Box, Typography } from "@mui/material";

export default function Sobre() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Sobre mim</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Aqui você pode colocar seu objetivo, jornada, habilidades, etc.
            </Typography>
        </Box>
    );
}