// src/pages/SignupForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { createUser } from "../lib/db";
import type { User } from "../types";

type FormState = {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    concordo: boolean;
};

const INITIAL: FormState = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    concordo: false,
};

export default function SignupForm({ onSuccess }: { onSuccess?: (u: User) => void }) {
    const [values, setValues] = useState<FormState>(INITIAL);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = (): string => {
    if (!values.nome.trim()) return "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return "E-mail inválido.";
    if (!/^\+?\d[\d\s\-()]{8,}$/.test(values.telefone)) return "Telefone/WhatsApp inválido.";
    if (!values.concordo) return "É necessário aceitar o regulamento.";
    return "";
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setOk("");
    const msg = validate();
    if (msg) { setError(msg); return; }

    const saved = createUser({
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        telefone: values.telefone.trim(),
        cpf: values.cpf?.trim(),
        aceitouTermos: values.concordo,
    });

    setOk("Cadastro realizado com sucesso! ✅");
    setValues(INITIAL);
    onSuccess?.(saved);
    };

    return (
    <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid xs={12}>
            <TextField
            label="Nome completo"
            name="nome"
            value={values.nome}
            onChange={handleChange}
            fullWidth
            required
            />
        </Grid>

        <Grid xs={12} md={6}>
            <TextField
            label="E-mail"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            fullWidth
            required
            />
        </Grid>

        <Grid xs={12} md={6}>
            <TextField
            label="Telefone / WhatsApp"
            name="telefone"
            placeholder="+55 61 99999-9999"
            value={values.telefone}
            onChange={handleChange}
            fullWidth
            required
            />
        </Grid>

        <Grid xs={12} md={6}>
            <TextField
            label="CPF (opcional)"
            name="cpf"
            value={values.cpf}
            onChange={handleChange}
            fullWidth
            />
        </Grid>

        <Grid xs={12}>
            <FormControlLabel
            control={
                <Checkbox
                name="concordo"
                checked={values.concordo}
                onChange={handleChange}
                />
            }
            label="Li e aceito o Regulamento"
            />
        </Grid>

        {error && (
            <Grid xs={12}>
            <Alert severity="error">{error}</Alert>
            </Grid>
        )}
        {ok && (
            <Grid xs={12}>
            <Alert severity="success" onClose={() => setOk("")}>
                {ok}
            </Alert>
            </Grid>
        )}

        <Grid xs={12}>
            <Button type="submit" size="large" variant="contained" fullWidth>
            Cadastrar
            </Button>
        </Grid>
        </Grid>
    </Box>
    );
}