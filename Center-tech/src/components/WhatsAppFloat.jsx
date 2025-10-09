import { IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppFloat() {
    return (
    <IconButton
        href="https://wa.me/5561999999999"
        target="_blank"
        sx={{
        position: "fixed", right: 16, bottom: 16, zIndex: 1300,
        bgcolor: "#25D366", color: "#000", "&:hover": { bgcolor: "#20BD5A" }
        }}
    >
        <WhatsAppIcon />
    </IconButton>
    );
}