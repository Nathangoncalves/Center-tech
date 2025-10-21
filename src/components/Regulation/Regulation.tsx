import { Box, Container, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

export default function Regulation() {
    return (
    <Box
        id="regulamento"
        sx={{
            position: "relative",
            overflow: "hidden",
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            pt: { xs: 7, md: 9 },
            pb: { xs: 8, md: 10 },
            mt: { xs: 3, md: 4 },
            scrollMarginTop: "96px",
            background: (theme) =>
                theme.palette.mode === "dark"
                    ? "radial-gradient(circle at top right, rgba(56,189,248,0.24), transparent 60%), radial-gradient(circle at bottom left, rgba(249,115,22,0.2), transparent 65%), #0f1115"
                    : "linear-gradient(180deg, rgba(56,189,248,0.15) 0%, rgba(249,115,22,0.15) 100%)",
            "&::before": {
                content: "''",
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at top, rgba(255,255,255,0.04), transparent 55%)",
                pointerEvents: "none",
            },
        }}
    >
        <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 3, position: "relative" }}>
            <Typography variant="overline" color="text.secondary">Regras</Typography>
            <Typography variant="h4" fontWeight={900}>Regulamento</Typography>
            <Typography color="text.secondary">
            Nossos sorteios são vinculados aos resultados da Loteria Federal. Ao comprar, você aceita os termos abaixo.
            </Typography>
        </Stack>

        <List dense sx={{ position: "relative" }}>
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
