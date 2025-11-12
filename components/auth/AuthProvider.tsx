'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import type { AuthUser } from '@/types/auth';

export type AuthContextValue = {
  user: AuthUser | null;
  setUser: (next: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  user?: AuthUser | null;
  children: React.ReactNode;
};

export const AuthProvider = ({ user: initialUser, children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null);

  const value = useMemo<AuthContextValue>(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
