import { useEffect, useState } from "react";
import api from "@/services/api";
import { extractFilenameFromContentDisposition } from "@/utils/contentDisposition";

const DIRECT_URL_PATTERN = /^(?:https?:|data:|blob:)/i;
const STORED_FILENAME_PATTERN = /^[\w.-]+\.[A-Za-z0-9]{2,}$/;
const FILENAME_CACHE_KEY = "secure-image-filename-cache-v1";
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

type StorageEntry = {
    filename: string;
    storedAt: number;
};

type StorageCache = Record<string, StorageEntry>;

const memoryFilenameCache = new Map<string, string>();
let storageCache: StorageCache | null = null;

const loadStorageCache = (): StorageCache => {
    if (storageCache) return storageCache;
    if (typeof window === "undefined") {
        storageCache = {};
        return storageCache;
    }
    try {
        const raw = window.localStorage.getItem(FILENAME_CACHE_KEY);
        storageCache = raw ? (JSON.parse(raw) as StorageCache) : {};
    } catch {
        storageCache = {};
    }
    return storageCache;
};

const persistStorageCache = () => {
    if (typeof window === "undefined" || !storageCache) return;
    try {
        window.localStorage.setItem(FILENAME_CACHE_KEY, JSON.stringify(storageCache));
    } catch {
        // Ignore storage errors (e.g. private mode)
    }
};

const rememberFilename = (source: string, filename: string) => {
    const trimmedSource = source.trim();
    const trimmedFilename = filename.trim();
    if (!trimmedSource || !trimmedFilename) return;
    if (!STORED_FILENAME_PATTERN.test(sanitizeFilename(trimmedFilename))) return;
    memoryFilenameCache.set(trimmedSource, trimmedFilename);
    const store = loadStorageCache();
    store[trimmedSource] = {
        filename: trimmedFilename,
        storedAt: Date.now(),
    };
    persistStorageCache();
};

const getCachedFilename = (source: string): string | undefined => {
    const trimmedSource = source.trim();
    if (!trimmedSource) return undefined;
    if (memoryFilenameCache.has(trimmedSource)) {
        return memoryFilenameCache.get(trimmedSource);
    }
    const store = loadStorageCache();
    const entry = store[trimmedSource];
    if (!entry) return undefined;
    if (Date.now() - entry.storedAt > CACHE_MAX_AGE) {
        delete store[trimmedSource];
        persistStorageCache();
        return undefined;
    }
    memoryFilenameCache.set(trimmedSource, entry.filename);
    return entry.filename;
};

const forgetFilename = (source: string) => {
    const trimmedSource = source.trim();
    if (!trimmedSource) return;
    memoryFilenameCache.delete(trimmedSource);
    const store = loadStorageCache();
    if (store[trimmedSource]) {
        delete store[trimmedSource];
        persistStorageCache();
    }
};

const encodePathSegments = (raw: string): string =>
    raw
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

const sanitizeFilename = (raw: string): string => raw.replace(/^item\/img\//i, "").replace(/^\/+/, "");

const buildDirectImageUrl = (filename: string): string | undefined => {
    const trimmed = filename.trim();
    if (!trimmed) return undefined;
    if (DIRECT_URL_PATTERN.test(trimmed) || trimmed.startsWith("/")) {
        return trimmed;
    }
    const sanitized = sanitizeFilename(trimmed);
    if (!sanitized) return undefined;
    const encodedPath = encodePathSegments(sanitized);
    const baseUrl = api.defaults.baseURL ?? "";
    if (!baseUrl) {
        return `/item/img/${encodedPath}`;
    }
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    try {
        return new URL(`item/img/${encodedPath}`, normalizedBase).toString();
    } catch {
        return `${normalizedBase}item/img/${encodedPath}`;
    }
};

const extractFilenameCandidate = (raw: string): string | undefined => {
    if (!raw) return undefined;
    const trimmed = raw.trim();
    if (!trimmed || DIRECT_URL_PATTERN.test(trimmed) || trimmed.startsWith("/")) return undefined;
    const sanitized = sanitizeFilename(trimmed).replace(/[#?].*$/, "");
    if (!sanitized) return undefined;
    const parts = sanitized.split(/[\\/]/);
    const candidate = (parts.pop() ?? "").trim();
    if (!candidate) return undefined;
    if (STORED_FILENAME_PATTERN.test(candidate)) return candidate;
    return undefined;
};

export function useSecureImage(source?: string | null) {
    const [url, setUrl] = useState<string>();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;
        let objectUrl: string | undefined;

        const cleanup = () => {
            cancelled = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };

        const rawSource = source?.trim();

        if (!rawSource) {
            setUrl(undefined);
            setError(false);
            return cleanup;
        }

        if (DIRECT_URL_PATTERN.test(rawSource) || rawSource.startsWith("/")) {
            setUrl(rawSource);
            setError(false);
            return cleanup;
        }

        const sanitizedDirectCandidate = sanitizeFilename(rawSource);
        const cachedFilename = getCachedFilename(rawSource) ?? extractFilenameCandidate(rawSource);
        const cachedUrl = cachedFilename ? buildDirectImageUrl(cachedFilename) : undefined;
        if (cachedUrl) {
            setUrl(cachedUrl);
            setError(false);
            if (cachedFilename && cachedFilename !== rawSource) {
                rememberFilename(rawSource, cachedFilename);
            }
            return cleanup;
        }

        setError(false);

        const canAttemptFetch = STORED_FILENAME_PATTERN.test(sanitizedDirectCandidate);
        if (!canAttemptFetch) {
            setUrl(undefined);
            setError(true);
            return cleanup;
        }

        const encoded = encodePathSegments(sanitizedDirectCandidate);
        api.get<ArrayBuffer>(`/item/img/${encoded}`, { responseType: "blob" })
            .then(({ data, headers }) => {
                if (cancelled) return;
                const disposition = headers?.["content-disposition"] ?? headers?.["Content-Disposition"];
                const hintedName = extractFilenameFromContentDisposition(disposition);
                if (hintedName) {
                    rememberFilename(rawSource, hintedName);
                    const hintedUrl = buildDirectImageUrl(hintedName);
                    if (hintedUrl) {
                        setUrl(hintedUrl);
                        return;
                    }
                }
                objectUrl = URL.createObjectURL(data);
                setUrl(objectUrl);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Erro ao carregar imagem protegida", err);
                forgetFilename(rawSource);
                setUrl(undefined);
                setError(true);
            });

        return cleanup;
    }, [source]);

    return { url, error };
}
