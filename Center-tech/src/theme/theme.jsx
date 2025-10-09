import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export default function buildTheme(mode = "dark") {
    let theme = createTheme({
    palette: {
        mode,
      primary: { main: mode === "dark" ? "#fff" : "#000" }, // P&B
        background: {
        default: mode === "dark" ? "#000" : "#fff",
        paper: mode === "dark" ? "#101012" : "#F7F7F9",
        },
        text: {
        primary: mode === "dark" ? "#fff" : "#0B0B0C",
        secondary: mode === "dark" ? "#A1A1AA" : "#4B5563",
        },
        divider: mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.12)",
    },
    shape: { borderRadius: 16 },
    typography: {
        fontFamily: "Inter Tight, Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        h1: { fontWeight: 900, letterSpacing: -1.0, lineHeight: 1.05 },
        h2: { fontWeight: 800, letterSpacing: -0.5 },
        h3: { fontWeight: 800 },
        button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
        MuiCssBaseline: {
        styleOverrides: (t) => ({
            body: {
            transition: "background-color .2s ease, color .2s ease",
            backgroundImage:
                t.palette.mode === "dark"
                ? "radial-gradient(800px 400px at 80% -50px, rgba(255,255,255,.06), transparent), radial-gradient(1200px 600px at -10% -20%, rgba(255,255,255,.04), transparent)"
                : "radial-gradient(800px 400px at 80% -50px, rgba(0,0,0,.04), transparent)",
            },
        }),
        },
        MuiCard: {
        styleOverrides: {
            root: ({ theme: t }) => ({
            border: `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
            backgroundImage: "none",
            boxShadow: t.palette.mode === "dark" ? "0 12px 32px rgba(0,0,0,.35)" : "0 8px 24px rgba(0,0,0,.08)",
            transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: t.palette.mode === "dark" ? "0 18px 40px rgba(0,0,0,.5)" : "0 12px 32px rgba(0,0,0,.12)",
            },
            }),
        },
        },
        MuiButton: { styleOverrides: { root: { borderRadius: 12, paddingInline: 18, height: 44 } } },
        MuiLinearProgress: { styleOverrides: { root: { borderRadius: 8 }, bar: { borderRadius: 8 } } },
    },
    });

    return responsiveFontSizes(theme);
}