import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  userId: number | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// ✅ Apenas define o contexto, sem lógica de estado
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
