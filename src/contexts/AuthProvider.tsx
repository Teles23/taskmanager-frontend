import { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<number | null>(
    token ? jwtDecode<{ sub: number }>(token).sub || null : null
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUserId(jwtDecode<{ sub: number }>(token).sub || null);
    } else {
      localStorage.removeItem("token");
      setUserId(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
