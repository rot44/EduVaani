// Simple local auth system (no external service needed)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  streak: number;
  minutesPracticed: number;
  sessionsCompleted: number;
}

const STORAGE_KEY = 'eduvaani_user';

export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function login(name: string, email: string): User {
  const existing = getUser();
  if (existing && existing.email === email) return existing;
  const user: User = {
    id: crypto.randomUUID(),
    name, email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    streak: 1,
    minutesPracticed: 0,
    sessionsCompleted: 0,
  };
  saveUser(user);
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateStats(user: User, minutesAdded: number): User {
  const updated = {
    ...user,
    minutesPracticed: user.minutesPracticed + minutesAdded,
    sessionsCompleted: user.sessionsCompleted + 1,
  };
  saveUser(updated);
  return updated;
}
