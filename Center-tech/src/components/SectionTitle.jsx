import { Stack, Typography } from "@mui/material";

export default function SectionTitle({ title, subtitle }) {
    return (
    <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>{title}</Typography>
        {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
    </Stack>
    );
}