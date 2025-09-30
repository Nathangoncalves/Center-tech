import { Box, Typography } from "@mui/material";

export default function Portfolio() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Meus Projetos</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Lista ou cards de projeto que você desenvolveu.
            </Typography>
        </Box>
    );
}

