// src/theme/theme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import type { ThemeMode } from "../types";

export default function buildTheme(mode: ThemeMode): Theme {
    let theme = createTheme({
    palette: {
        mode,
        primary: { main: mode === "dark" ? "#fff" : "#000" },
        background: { default: mode === "dark" ? "#0B0B0C" : "#FFFFFF", paper: mode === "dark" ? "#101012" : "#F7F7F9" },
        text: { primary: mode === "dark" ? "#FFFFFF" : "#0B0B0C", secondary: mode === "dark" ? "#A1A1AA" : "#4B5563" },
        divider: mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.12)"
    },
    shape: { borderRadius: 16 },
    typography: {
        fontFamily: "Inter Tight, Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        h1: { fontWeight: 900, letterSpacing: -1, lineHeight: 1.05 },
        h2: { fontWeight: 800, letterSpacing: -0.5 },
        h3: { fontWeight: 800 },
        button: { textTransform: "none", fontWeight: 700 }
    }
    });
    return responsiveFontSizes(theme);
}