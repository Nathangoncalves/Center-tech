import { useEffect, useMemo, useState } from "react";
import buildTheme from "../theme/theme";

export default function useNgTheme() {
    const getInitialMode = () => {
    const saved = localStorage.getItem("ng-mode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    const [mode, setMode] = useState(getInitialMode);
    useEffect(() => { localStorage.setItem("ng-mode", mode); }, [mode]);
    const theme = useMemo(() => buildTheme(mode), [mode]);
    return { theme, mode, setMode };
}