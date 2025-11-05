export function extractFilenameFromContentDisposition(value?: string | null): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const extendedMatch = trimmed.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
    if (extendedMatch?.[1]) {
        const raw = extendedMatch[1].replace(/(^"|"$)/g, "");
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    }

    const basicMatch = trimmed.match(/filename="?([^";]+)"?/i);
    if (basicMatch?.[1]) {
        const raw = basicMatch[1];
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    }

    return undefined;
}
