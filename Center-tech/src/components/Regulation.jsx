import { Box, Button, Container, Typography } from "@mui/material";
import SectionTitle from "./SectionTitle";

export default function Regulation({ mode }) {
    return (
    <Box id="regulamento" sx={{ py: 8, background: mode === "dark" ? "#111111" : "transparent" }}>
        <Container maxWidth="md">
        <SectionTitle title="Regulamento" />
        <Typography color="text.secondary" sx={{ mb: 2 }}>
            Sorteios vinculados à Loteria Federal. Após confirmação do pagamento, seus números ficam disponíveis.
            Em caso de cancelamento, estorno integral. Consulte o regulamento completo no ato da compra.
        </Typography>
        <Button variant="outlined">Ver regulamento completo</Button>
        </Container>
    </Box>
    );
}