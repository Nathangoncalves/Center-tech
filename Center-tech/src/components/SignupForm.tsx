import { useState, ChangeEvent, FormEvent } from "react";
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { userService } from "../services";

type FormState = {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    senha: string;
    confirmacao: string;
    concordo: boolean;
};

const INITIAL: FormState = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    confirmacao: "",
    concordo: false,
};

export default function SignupForm() {
    const [values, setValues] = useState<FormState>(INITIAL);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = (): string => {
        if (!values.nome.trim()) return "Informe seu nome.";
        if (!/^\S+@\S+\.\S+$/.test(values.email)) return "E-mail inválido.";
        if (!/^\+?\d[\d\s\-()]{8,}$/.test(values.telefone)) return "Telefone/WhatsApp inválido.";
        if (!values.senha || values.senha.length < 6) return "Escolha uma senha com pelo menos 6 caracteres.";
        if (values.senha !== values.confirmacao) return "A confirmação de senha não confere.";
        if (!values.concordo) return "É necessário aceitar o regulamento.";
        return "";
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setOk("");
        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        setLoading(true);
        try {
            await userService.create({
                nome: values.nome.trim(),
                email: values.email.trim().toLowerCase(),
                senhaHash: values.senha,
            });

            setOk("Cadastro realizado com sucesso! Você já pode acessar sua conta.");
            setValues(INITIAL);
        } catch (err) {
            console.error("Erro ao cadastrar usuário", err);
            setError("Não foi possível concluir o cadastro. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Nome completo"
                        name="nome"
                        value={values.nome}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12} md={6}>
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

                <Grid item xs={12} md={6}>
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

                <Grid item xs={12} md={6}>
                    <TextField
                        label="CPF (opcional)"
                        name="cpf"
                        value={values.cpf}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Senha"
                        name="senha"
                        type="password"
                        value={values.senha}
                        onChange={handleChange}
                        fullWidth
                        required
                        helperText="Use pelo menos 6 caracteres."
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Confirmar senha"
                        name="confirmacao"
                        type="password"
                        value={values.confirmacao}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12}>
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
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}
                {ok && (
                    <Grid item xs={12}>
                        <Alert severity="success" onClose={() => setOk("")}>
                            {ok}
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Button type="submit" size="large" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Enviando..." : "Cadastrar"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
