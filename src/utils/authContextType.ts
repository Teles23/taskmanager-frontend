export interface AuthContextType {
  token: string | null;
  userId: number | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
