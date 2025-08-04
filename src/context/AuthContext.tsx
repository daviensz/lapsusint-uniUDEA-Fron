import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<User | null>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => null,
  logout: () => {},
  refreshUser: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Llama al backend para obtener los datos del usuario actual
  const fetchUser = async (jwt?: string): Promise<User | null> => {
    try {
      console.log("Fetching user with token:", jwt || token);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/profile`,
        {
          headers: {
            Authorization: `Bearer ${jwt || token}`,
          },
        }
      );
      console.log("Profile response status:", res.status);
      if (!res.ok) {
        console.log("Profile response not ok:", res.status, res.statusText);
        throw new Error("No autenticado");
      }
      const data = await res.json();
      console.log("Profile data:", data);
      setUser(data);
      return data;
    } catch (error) {
      console.log("Error fetching user:", error);
      setUser(null);
      return null;
    }
  };

  // Llama esto después de login para cargar el usuario
  const login = async (newToken: string): Promise<User | null> => {
    console.log("Login called with token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    // Intentar obtener el usuario inmediatamente
    try {
      const user = await fetchUser(newToken);
      console.log("User fetched:", user);
      return user;
    } catch (error) {
      console.log("Error in login:", error);
      // Si falla, al menos guardamos el token
      return null;
    }
  };

  // Cierra sesión
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Refresca el usuario (por ejemplo, después de editar perfil)
  const refreshUser = async (): Promise<User | null> => {
    if (token) {
      return await fetchUser();
    }
    return null;
  };

  // Al cargar la app, si hay token, intenta cargar el usuario
  useEffect(() => {
    if (token) {
      console.log("Token found on startup, fetching user...");
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};