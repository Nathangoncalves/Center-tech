import { ThemeProvider, CssBaseline, Container, Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import useNgTheme from "@/hooks/useNgTheme";
import Header from "@/components/Header";
import "./public-pages.scss";

const sections = [
    {
        title: "Como funciona",
        paragraphs: [
            "Escolha um sorteio ativo, reserve seus números e confirme o pagamento via PIX em poucos segundos.",
            "Assim que o pagamento é identificado, o sistema registra automaticamente seus bilhetes e envia um comprovante.",
            "No dia do sorteio, publicamos o resultado na página de ganhadores e notificamos todos os participantes.",
        ],
    },
    {
        title: "Regras gerais",
        paragraphs: [
            "Bilhetes reservados e não pagos até o horário limite voltam automaticamente para o estoque.",
            "Cada participante pode comprar quantos bilhetes quiser, respeitando a disponibilidade do sorteio.",
            "Os resultados são auditados e podem utilizar a Loteria Federal ou ferramenta digital equivalente.",
        ],
    },
    {
        title: "Direitos e deveres",
        paragraphs: [
            "Participantes têm direito a consultar números, pagamentos e histórico de sorteios sempre que desejarem.",
            "É responsabilidade do participante manter seus dados atualizados para contato e entrega do prêmio.",
            "A organização pode cancelar reservas suspeitas de fraude, garantindo aviso prévio ao participante envolvido.",
        ],
    },
];

export default function Regulation() {
    const { theme, mode, setMode } = useNgTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="public-landing">
                <Header mode={mode} setMode={setMode} />

                <section className="public-landing__hero">
                    <Container maxWidth="lg">
                        <Stack
                            component={motion.div}
                            className="public-landing__hero-card"
                            spacing={1.1}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ArticleOutlinedIcon sx={{ fontSize: 48 }} />
                            <Typography variant="h1" fontWeight={800} sx={{ letterSpacing: "-0.03em", fontSize: { xs: "2.4rem", md: "3.3rem" } }}>
                                Regulamento oficial
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                                Conheça as regras que orientam a participação, auditoria e entrega de prêmios dos sorteios Center Tech.
                            </Typography>
                        </Stack>
                    </Container>
                </section>

                <section className="public-landing__section">
                    <Container maxWidth="md">
                        <Stack className="public-landing__glass-list">
                            {sections.map((section, index) => (
                                <Stack
                                    key={section.title}
                                    component={motion.div}
                                    className="public-landing__glass-item"
                                    spacing={1}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-0.01em" }}>
                                        {section.title}
                                    </Typography>
                                    <Stack component="ul" spacing={1.5} sx={{ pl: 3, m: 0 }}>
                                        {section.paragraphs.map((paragraph) => (
                                            <Typography key={paragraph} component="li" color="text.secondary">
                                                {paragraph}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>

                        <Stack className="public-landing__cta">
                            <Typography variant="h4" fontWeight={700}>
                                Ficou com dúvidas sobre algum item?
                            </Typography>
                            <Typography color="text.secondary">
                                Consulte nossa equipe ou volte à página de sorteios para escolher o prêmio perfeito.
                            </Typography>
                            <Button variant="outlined" href="/sorteios" sx={{ width: "fit-content", borderRadius: 999, px: 4, py: 1.2 }}>
                                Ver sorteios disponíveis
                            </Button>
                        </Stack>
                    </Container>
                </section>
            </div>
        </ThemeProvider>
    );
}
