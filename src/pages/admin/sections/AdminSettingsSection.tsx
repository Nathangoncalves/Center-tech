import { useState } from "react";
import { Alert, Grid, Paper, Stack, TextField, Typography, Button, Switch, FormControlLabel } from "@mui/material";
import api from "@/services/api";

interface ConfigForm {
    linkPagamento: string;
    whatsappSuporte: string;
    chavePix: string;
    confirmaAutomatica: boolean;
}

const INITIAL_FORM: ConfigForm = {
    linkPagamento: "https://pagamentos.centertech.com/bilhetes",
    whatsappSuporte: "55 61 99999-9999",
    chavePix: "contato@centertech.com.br",
    confirmaAutomatica: true,
};

export default function AdminSettingsSection() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true);
        setFeedback(null);
        try {
            await api.post("/configuracoes/gestor", form);
            setFeedback("Configurações atualizadas com sucesso.");
        } catch (error) {
            console.error("Erro ao salvar configurações", error);
            setFeedback("Não foi possível salvar agora. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Configurações gerais</Typography>
                <Typography color="text.secondary">Ajuste os principais canais de pagamento e suporte utilizados pelos participantes.</Typography>
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Link oficial de pagamento"
                        value={form.linkPagamento}
                        onChange={(event) => setForm((prev) => ({ ...prev, linkPagamento: event.target.value }))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="WhatsApp de suporte"
                        value={form.whatsappSuporte}
                        onChange={(event) => setForm((prev) => ({ ...prev, whatsappSuporte: event.target.value }))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Chave PIX"
                        value={form.chavePix}
                        onChange={(event) => setForm((prev) => ({ ...prev, chavePix: event.target.value }))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={form.confirmaAutomatica}
                                onChange={(event) => setForm((prev) => ({ ...prev, confirmaAutomatica: event.target.checked }))}
                            />
                        )}
                        label="Confirmar pagamentos automaticamente"
                    />
                </Grid>
            </Grid>
            {feedback && <Alert severity="info" sx={{ mt: 2 }}>{feedback}</Alert>}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={handleSave} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar"}
                </Button>
                <Button variant="outlined" onClick={() => setForm(INITIAL_FORM)}>
                    Restaurar padrão
                </Button>
            </Stack>
        </Paper>
    );
}
