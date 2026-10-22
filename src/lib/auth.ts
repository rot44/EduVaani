export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  streak: number;
  minutesPracticed: number;
  sessionsCompleted: number;
  lastPracticeDate?: string; // YYYY-MM-DD
  // Onboarding & Learner Preferences
  motherTongue?: string;
  englishLevel?: EnglishLevel;
  usesSignLanguage?: boolean;
  onboardingCompleted?: boolean;
  onboardingTourSeen?: boolean;
}

const STORAGE_KEY = 'eduvaani_user';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export interface UserPreferences {
  motherTongue?: string;
  englishLevel?: EnglishLevel;
  usesSignLanguage?: boolean;
  onboardingCompleted?: boolean;
}

export function login(name: string, email: string, preferences?: UserPreferences): User {
  const existing = getUser();
  if (existing && existing.email === email) {
    if (preferences) {
      const merged: User = {
        ...existing,
        name: name || existing.name,
        ...preferences,
      };
      saveUser(merged);
      return merged;
    }
    return existing;
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    streak: 1,
    minutesPracticed: 0,
    sessionsCompleted: 0,
    lastPracticeDate: getLocalDateString(),
    motherTongue: preferences?.motherTongue || 'hi',
    englishLevel: preferences?.englishLevel || 'beginner',
    usesSignLanguage: preferences?.usesSignLanguage ?? false,
    onboardingCompleted: preferences?.onboardingCompleted ?? true,
    onboardingTourSeen: false,
  };
  saveUser(user);
  return user;
}

export function updateUserProfile(updates: Partial<User>): User | null {
  const current = getUser();
  if (!current) return null;
  const updated: User = {
    ...current,
    ...updates,
  };
  saveUser(updated);
  return updated;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateStats(user: User, minutesAdded: number): User {
  const now = new Date();
  const todayStr = getLocalDateString(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let newStreak = user.streak || 1;

  if (!user.lastPracticeDate) {
    newStreak = 1;
  } else if (user.lastPracticeDate === todayStr) {
    // Already practiced today, keep current streak
    newStreak = user.streak || 1;
  } else if (user.lastPracticeDate === yesterdayStr) {
    // Practiced yesterday, increment streak
    newStreak = (user.streak || 0) + 1;
  } else {
    // Missed at least one day, reset to 1
    newStreak = 1;
  }

  const updated: User = {
    ...user,
    minutesPracticed: user.minutesPracticed + minutesAdded,
    sessionsCompleted: user.sessionsCompleted + 1,
    streak: newStreak,
    lastPracticeDate: todayStr,
  };
  saveUser(updated);
  return updated;
}
