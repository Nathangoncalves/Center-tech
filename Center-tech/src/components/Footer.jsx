import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
    return (
    <Box component="footer" sx={{ py: 5, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
        <Container>
        <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Centertech Sorteios — transparência e apresentação de respeito.
        </Typography>
        </Container>
    </Box>
    );
}

