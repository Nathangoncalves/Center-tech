import { Accordion, AccordionDetails, AccordionSummary, Container, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectionTitle from "./SectionTitle";

export default function FAQ() {
    const items = [
    ["Como recebo meus números?", "Após confirmar a compra, seus números ficam registrados e são enviados por e-mail/WhatsApp."],
    ["Qual a forma de sorteio?", "Usamos os resultados da Loteria Federal para garantir transparência."],
    ["Posso pedir reembolso?", "Antes do sorteio, sim. Após iniciado, não é possível cancelar."],
    ];
    return (
    <Box id="faq" sx={{ py: 8 }}>
        <Container maxWidth="md">
        <SectionTitle title="Perguntas Frequentes" />
        {items.map(([q, a], i) => (
            <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 600 }}>{q}</Typography></AccordionSummary>
            <AccordionDetails><Typography color="text.secondary">{a}</Typography></AccordionDetails>
            </Accordion>
        ))}
        </Container>
    </Box>
    );
}