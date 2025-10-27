const ROLE_STORAGE_KEY = "ng-auth-role";

export type StoredRole = "ADMIN" | "CLIENTE" | null;

export function setStoredRole(role: StoredRole) {
    try {
        if (!role) {
            localStorage.removeItem(ROLE_STORAGE_KEY);
            return;
        }
        localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
        // ignore storage issues
    }
}

export function getStoredRole(): StoredRole {
    try {
        const value = localStorage.getItem(ROLE_STORAGE_KEY);
        return value === "ADMIN" || value === "CLIENTE" ? value : null;
    } catch {
        return null;
    }
}

export function clearStoredRole() {
    setStoredRole(null);
}
