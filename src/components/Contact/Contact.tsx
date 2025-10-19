import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "./Contact.scss";

const WHATSAPP_NUMBER = "5561985979700";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Contact() {
    return (
        <Box
            id="contato"
            className="contact"
            sx={{
                py: 8,
                background: (theme) =>
                    theme.palette.mode === "dark"
                        ? "radial-gradient(circle at top right, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at bottom left, rgba(249,115,22,0.28), transparent 60%), #0f1115"
                        : "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(249,115,22,0.12))",
            }}
        >
            <Container maxWidth="md">
                <Paper
                    className="contact__card"
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(17,20,28,0.85)"
                                : theme.palette.background.paper,
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <Stack className="contact__content" spacing={3} alignItems="center" textAlign="center">
                        <Stack className="contact__header" spacing={1}>
                            <Typography variant="overline" color="text.secondary">
                                Atendimento
                            </Typography>
                            <Typography variant="h4" fontWeight={900}>
                                Fale com a Centertech
                            </Typography>
                            <Typography color="text.secondary">
                                Tire dúvidas, confirme pagamentos ou acompanhe seus sorteios pelo WhatsApp oficial.
                            </Typography>
                        </Stack>

                        <Button
                            className="contact__cta"
                            variant="contained"
                            size="large"
                            startIcon={<WhatsAppIcon />}
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Falar no WhatsApp
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
