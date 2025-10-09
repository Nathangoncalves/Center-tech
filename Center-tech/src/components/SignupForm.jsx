import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography, Alert } from "@mui/material";
import { createUser } from "../lib/db";

const INITIAL = { nome:"", email:"", telefone:"", cpf:"", concordo:false };

export default function SignupForm({ onSuccess }) {
    const [values, setValues] = useState(INITIAL);
    const [error, setError]   = useState("");
    const [ok, setOk]         = useState("");

    const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues(v => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = () => {
    if (!values.nome.trim()) return "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return "E-mail inválido.";
    if (!/^\+?\d[\d\s\-()]{8,}$/.test(values.telefone)) return "Telefone/WhatsApp inválido.";
    if (!values.concordo) return "É necessário aceitar o regulamento.";
    return "";
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); setOk("");
    const msg = validate();
    if (msg) { setError(msg); return; }

    const saved = createUser({
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        telefone: values.telefone.trim(),
        cpf: values.cpf.trim(),
        aceitouTermos: values.concordo,
    });

    setOk("Cadastro realizado com sucesso!");
    setValues(INITIAL);
    onSuccess?.(saved);
    };

    return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
        <Grid item xs={12}><TextField label="Nome completo" name="nome" value={values.nome} onChange={handleChange} fullWidth required/></Grid>
        <Grid item xs={12} md={6}><TextField label="E-mail" name="email" value={values.email} onChange={handleChange} fullWidth required type="email"/></Grid>
        <Grid item xs={12} md={6}><TextField label="Telefone / WhatsApp" name="telefone" value={values.telefone} onChange={handleChange} fullWidth placeholder="+55 61 99999-9999" required/></Grid>
        <Grid item xs={12} md={6}><TextField label="CPF (opcional)" name="cpf" value={values.cpf} onChange={handleChange} fullWidth/></Grid>
        <Grid item xs={12}>
            <FormControlLabel
            control={<Checkbox checked={values.concordo} onChange={handleChange} name="concordo" />}
            label={<Typography variant="body2">Li e aceito o <a href="#regulamento">Regulamento</a>.</Typography>}
            />
        </Grid>
        {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}
        {ok && <Grid item xs={12}><Alert severity="success">{ok}</Alert></Grid>}
        <Grid item xs={12}><Button variant="contained" size="large" type="submit" fullWidth>Cadastrar</Button></Grid>
        </Grid>
    </Box>
    );
}