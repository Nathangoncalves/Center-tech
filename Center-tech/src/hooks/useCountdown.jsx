import { useEffect, useState } from "react";

export default function useCountdown(targetIso) {
    const target = new Date(targetIso).getTime();
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, target - now);
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return { d, h, m, s: ss, finished: diff === 0 };
}