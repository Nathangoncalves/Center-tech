export function sanitizeText(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/\s+/g, " ").replace(/^\s+/, "");
}

export function sanitizeMultiline(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
}

export function sanitizeEmail(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/\s/g, "").toLowerCase();
}

export function sanitizePhone(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/[^0-9+()\s-]/g, "");
}

export function sanitizeNumericString(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/[^0-9]/g, "");
}

export function sanitizeCurrencyInput(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/[^0-9.,]/g, "");
}

export function sanitizeCode(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/[^a-z0-9-]/gi, "").toUpperCase();
}

export function sanitizeUrl(value: string): string {
    if (typeof value !== "string") return "";
    return value.replace(/\s/g, "");
}

export function toPositiveNumber(value: string | number, fallback = 0): number {
    if (typeof value === "number") {
        return Number.isFinite(value) && value >= 0 ? value : fallback;
    }
    if (typeof value === "string") {
        const normalized = value.replace(/,/g, ".");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    }
    return fallback;
}
