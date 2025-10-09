import { Box, Button, Container, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SectionTitle from "./SectionTitle";

export default function Contact() {
    return (
    <Box id="contato" sx={{ py: 8 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <SectionTitle title="Fale conosco" subtitle="Dúvidas sobre regras, pagamento ou prazos? Chame no WhatsApp." />
        <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} href="https://wa.me/5561999999999" target="_blank">
            WhatsApp
        </Button>
        </Container>
    </Box>
    );
}