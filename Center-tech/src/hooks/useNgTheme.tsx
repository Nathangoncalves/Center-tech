// src/hooks/useNgTheme.tsx
import { useEffect, useMemo, useState } from "react";
import buildTheme from "../theme/theme";
import type { ThemeMode } from "../types";

export default function useNgTheme() {
    const getInitialMode = (): ThemeMode => {
    const saved = localStorage.getItem("ng-mode") as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
    return "light";
    };

    const [mode, setMode] = useState<ThemeMode>(getInitialMode);
    useEffect(() => { localStorage.setItem("ng-mode", mode); }, [mode]);

    const theme = useMemo(() => buildTheme(mode), [mode]);
    return { theme, mode, setMode };
}