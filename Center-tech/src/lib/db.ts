// src/lib/db.ts
import type { User } from "../types";
const KEY_USERS = "ng-users";

const uuid = () => {
    try { return (crypto as any)?.randomUUID?.() as string; }
  catch { /* no-op */ }
  // fallback
    return "u-" + Math.random().toString(36).slice(2) + Date.now();
};

export function listUsers(): User[] {
    try { return JSON.parse(localStorage.getItem(KEY_USERS) || "[]") as User[]; }
    catch { return []; }
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
    const users = listUsers();
    const saved: User = { id: uuid(), createdAt: new Date().toISOString(), ...user };
    users.push(saved);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    return saved;
}