import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body">© {new Date().getFullYear()} Nathan Gonçalves. Todos os direitos reservados.</Typography>
        </Box>
    );
}

