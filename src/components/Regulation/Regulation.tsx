import { Box, Container, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import "./Regulation.scss";

export default function Regulation() {
    return (
    <Box id="regulamento" className="regulation" sx={{ py: 8 }}>
        <Container maxWidth="md">
        <Stack className="regulation__header" spacing={1} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">Regras</Typography>
            <Typography variant="h4" fontWeight={900}>Regulamento</Typography>
            <Typography color="text.secondary">
            Nossos sorteios são vinculados aos resultados da Loteria Federal. Ao comprar, você aceita os termos abaixo.
            </Typography>
        </Stack>

        <List className="regulation__list" dense>
            <ListItem><ListItemText primary="1. A numeração das cotas é gerada automaticamente de forma randômica." /></ListItem>
            <ListItem><ListItemText primary="2. O sorteio é conferido com a Loteria Federal da data indicada no anúncio." /></ListItem>
            <ListItem><ListItemText primary="3. Em caso de cancelamento do sorteio pela Loteria, a data é remarcada." /></ListItem>
            <ListItem><ListItemText primary="4. O vencedor é contatado por WhatsApp/E-mail para entrega do prêmio." /></ListItem>
            <ListItem><ListItemText primary="5. Em caso de impossibilidade de entrega, será ofertada alternativa equivalente." /></ListItem>
            <ListItem><ListItemText primary="6. Ao participar, você concorda com nossa política de privacidade." /></ListItem>
        </List>
        </Container>
    </Box>
    );
}
