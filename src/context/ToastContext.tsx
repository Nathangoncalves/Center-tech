import { Alert, AlertColor, Snackbar } from "@mui/material";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface ToastOptions {
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number;
}

interface ToastContextValue {
    showToast: (options: ToastOptions) => void;
    success: (message: string, options?: Omit<ToastOptions, "message" | "severity">) => void;
    error: (message: string, options?: Omit<ToastOptions, "message" | "severity">) => void;
    info: (message: string, options?: Omit<ToastOptions, "message" | "severity">) => void;
    warning: (message: string, options?: Omit<ToastOptions, "message" | "severity">) => void;
}

interface ToastItem extends Required<ToastOptions> {
    id: number;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [queue, setQueue] = useState<ToastItem[]>([]);
    const [active, setActive] = useState<ToastItem | null>(null);
    const counter = useRef(0);

    const showToast = useCallback((options: ToastOptions) => {
        if (!options?.message) return;
        counter.current += 1;
        const toast: ToastItem = {
            id: counter.current,
            message: options.message,
            severity: options.severity ?? "info",
            autoHideDuration: options.autoHideDuration ?? 4000,
        };
        setQueue((prev) => [...prev, toast]);
    }, []);

    useEffect(() => {
        if (!active && queue.length > 0) {
            setActive(queue[0]);
            setQueue((prev) => prev.slice(1));
        }
    }, [queue, active]);

    const handleClose = useCallback(() => {
        setActive(null);
    }, []);

    const value = useMemo<ToastContextValue>(() => ({
        showToast,
        success: (message, options) => showToast({ message, severity: "success", ...options }),
        error: (message, options) => showToast({ message, severity: "error", ...options }),
        info: (message, options) => showToast({ message, severity: "info", ...options }),
        warning: (message, options) => showToast({ message, severity: "warning", ...options }),
    }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Snackbar
                key={active?.id ?? "toast"}
                open={Boolean(active)}
                autoHideDuration={active?.autoHideDuration}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity={active?.severity ?? "info"} variant="filled" sx={{ width: "100%" }}>
                    {active?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a <ToastProvider>");
    }
    return ctx;
}
