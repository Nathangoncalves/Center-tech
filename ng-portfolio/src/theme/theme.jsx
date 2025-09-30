import { createTheme } from "@mui/material";

const theme = createTheme ({
    palette: {
        primary: {
            main: "#FF6F61", // coral 
        },
        background: {
            default: "#00000", // preto
            paper: "#2C2C2E", // cinza fosco
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#FF6F61", // coral
        },
    },
    typography: {
        fontFamily: "Gotham",
    },
});

export default theme;