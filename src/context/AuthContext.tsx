import React, { createContext, useCallback, useContext, useState } from 'react';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: User = {
  id: 'usr_01',
  name: 'John Doe',
  email: 'john.doe@company.io',
  organization: 'Apex Dynamics',
  role: 'Lead Architect',
  avatarInitials: 'JD',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(
    async (email: string, _password: string): Promise<boolean> => {
      setIsLoading(true);
      return new Promise(resolve => {
        setTimeout(() => {
          const initials = email
            .split('@')[0]
            .split('.')
            .map(part => part[0]?.toUpperCase() || '')
            .join('')
            .slice(0, 2) || 'JD';

          const authenticatedUser: User = {
            id: 'usr_' + Date.now().toString(36),
            name: email === DEFAULT_DEMO_USER.email ? DEFAULT_DEMO_USER.name : email.split('@')[0].replace('.', ' '),
            email: email,
            organization: DEFAULT_DEMO_USER.organization,
            role: DEFAULT_DEMO_USER.role,
            avatarInitials: initials,
          };

          setUser(authenticatedUser);
          setIsLoading(false);
          resolve(true);
        }, 450);
      });
    },
    [],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      organization: string,
      _password: string,
    ): Promise<boolean> => {
      setIsLoading(true);
      return new Promise(resolve => {
        setTimeout(() => {
          const initials = name
            .split(' ')
            .map(part => part[0]?.toUpperCase() || '')
            .join('')
            .slice(0, 2) || 'JD';

          const newUser: User = {
            id: 'usr_' + Date.now().toString(36),
            name: name,
            email: email,
            organization: organization || 'My Workspace',
            role: 'Workspace Member',
            avatarInitials: initials,
          };

          setUser(newUser);
          setIsLoading(false);
          resolve(true);
        }, 500);
      });
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
