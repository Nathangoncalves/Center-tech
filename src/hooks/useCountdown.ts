import { useEffect, useState } from "react";

export interface Countdown {
    d: number; h: number; m: number; s: number; finished: boolean;
}

export default function useCountdown(targetIso: string): Countdown {
    const target = new Date(targetIso).getTime();
    const [now, setNow] = useState<number>(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, target - now);
    const secs = Math.floor(diff / 1000);
    return {
    d: Math.floor(secs / 86400),
    h: Math.floor((secs % 86400) / 3600),
    m: Math.floor((secs % 3600) / 60),
    s: secs % 60,
    finished: diff === 0
    };
}