
import { useState } from "react";
import { apiFetch } from "./useApi";

export function useAuth() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);

  const login = async (email: string, password: string) => {
    const res = await apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    localStorage.setItem("authToken", res.token || "");
    localStorage.setItem("email", res.email);
    localStorage.setItem("name", res.name);
    localStorage.setItem("role", res.role);
    
    setUser({ email: res.email, name: res.name, role: res.role });
    return res;
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await apiFetch("/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    return res;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, setUser, login, register, logout };
}
