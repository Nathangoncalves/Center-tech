import { getAuthToken } from "@/services";

function base64UrlDecode(input: string): string {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = pad ? normalized.padEnd(normalized.length + (4 - pad), "=") : normalized;
    try {
        if (typeof globalThis !== "undefined" && typeof (globalThis as { atob?: (value: string) => string }).atob === "function") {
            return globalThis.atob(padded);
        }
    } catch {
        /* noop */
    }
    return "";
}

export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
    try {
        const [, payload] = token.split(".");
        if (!payload) return null;
        const decoded = base64UrlDecode(payload);
        if (!decoded) return null;
        return JSON.parse(decoded) as T;
    } catch {
        return null;
    }
}

export function extractUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    const payload = decodeJwtPayload<Record<string, unknown>>(token);
    if (!payload) return null;

    const possible = payload.id ?? payload.userId ?? payload.sub;
    if (typeof possible === "number") return String(possible);
    if (typeof possible === "string") {
        return possible;
    }
    return null;
}

export function extractUserNameFromToken(token: string | null): string | null {
    if (!token) return null;
    const payload = decodeJwtPayload<Record<string, unknown>>(token);
    if (!payload) return null;
    const name = payload.name ?? payload.nome ?? payload.preferred_username;
    return typeof name === "string" ? name : null;
}

export function getCurrentUserId(): string | null {
    return extractUserIdFromToken(getAuthToken());
}
