import { useCallback, useEffect, useState } from "react";

const KEY = "ng-admin-auth";

export default function useAuth() {
    const [authed, setAuthed] = useState<boolean>(() => localStorage.getItem(KEY) === "1");

    const login = useCallback((pass: string) => {
    const expected = import.meta.env.VITE_ADMIN_PASS || "admin123"; // defina no .env
    const ok = pass === expected;
    if (ok) localStorage.setItem(KEY, "1");
    setAuthed(ok);
    return ok;
    }, []);

    const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setAuthed(false);
    }, []);

  useEffect(() => { /* side-effects se quiser */ }, [authed]);

    return { authed, login, logout };
}