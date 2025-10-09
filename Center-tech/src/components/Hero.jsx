import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";

export default function Hero() {
    const navigate = useNavigate();
    return (
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ fontWeight: 900, maxWidth: 800 }}>
            Prêmios que você quer, <br /> com preço justo.
        </Typography>
        <Typography color="text.secondary">
            Experiência simples, transparente e bonita — reserve suas cotas em poucos cliques.
        </Typography>
        <Stack direction="row" spacing={2}>
            <Button
            onClick={() => navigate("/cadastro")}
            variant="contained"
            size="large"
            sx={{ borderRadius: 3 }}
            >
            Participar agora
            </Button>
            <Button
            onClick={() => navigate("/#sorteios")}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 3 }}
            >
            Ver sorteios
            </Button>
        </Stack>
        </Stack>
    );
    }