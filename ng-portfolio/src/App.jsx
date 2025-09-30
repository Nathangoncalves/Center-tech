import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Home from "./pages/Home.jsx";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ff7a59" },                // coral
    secondary: { main: "#7C4DFF" },
    background: { default: "#0d0e10", paper: "#121316" },
    text: { primary: "#EDEFF3", secondary: "#9AA3AE" }
  },
  shape: { borderRadius: 12 },                   // base; usamos pill nos botões via sx
  typography: { fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}