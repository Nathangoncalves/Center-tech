const KEY_USERS = "ng-users";

export function listUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS) || "[]"); }
    catch { return []; }
}

export function createUser(user) {
    const users = listUsers();
    const id = crypto.randomUUID?.() || String(Date.now());
    const now = new Date().toISOString();
    const toSave = { id, createdAt: now, ...user };
    users.push(toSave);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    return toSave;
}

export function deleteUser(id) {
    const users = listUsers().filter(u => u.id !== id);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

export function clearUsers() {
    localStorage.removeItem(KEY_USERS);
}