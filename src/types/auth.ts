export interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role?: string;
  avatarInitials?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    organization: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
}
