
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form className="bg-white rounded shadow p-6 space-y-4 w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold">Sign In</h2>
        {error && <div className="text-red-500">{error}</div>}
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full">Login</Button>
        <div className="text-center text-sm">
          Don't have an account? <a href="/register" className="text-blue-600 underline">Register</a>
        </div>
      </form>
    </div>
  );
}
