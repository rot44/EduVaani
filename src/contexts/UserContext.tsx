import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getUser,
  login as authLogin,
  logout as authLogout,
  updateStats as authUpdateStats,
  updateUserProfile,
  type User,
  type UserPreferences,
} from '../lib/auth';

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (name: string, email: string, preferences?: UserPreferences) => User;
  logout: () => void;
  updateStats: (minutesAdded: number) => User | null;
  updateUser: (updates: Partial<User>) => User | null;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return getUser();
    } catch (err) {
      console.warn('Failed to load user session:', err);
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = useCallback((name: string, email: string, preferences?: UserPreferences): User => {
    const loggedInUser = authLogin(name, email, preferences);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const updateStats = useCallback((minutesAdded: number): User | null => {
    const currentUser = getUser();
    if (!currentUser) return null;
    const updated = authUpdateStats(currentUser, minutesAdded);
    setUser(updated);
    return updated;
  }, []);

  const updateUser = useCallback((updates: Partial<User>): User | null => {
    const updated = updateUserProfile(updates);
    if (updated) {
      setUser(updated);
    }
    return updated;
  }, []);

  const refreshUser = useCallback(() => {
    const current = getUser();
    setUser(current);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateStats,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
