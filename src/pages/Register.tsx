
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const { register } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role) return setError("Please select a role.");
    try {
      await register(form.name, form.email, form.password, form.role);
      nav("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form className="bg-white rounded shadow p-6 space-y-4 w-full max-w-md" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold">Register</h2>
        {error && <div className="text-red-500">{error}</div>}
        <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300">
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" className="w-full">Register</Button>
        <div className="text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
        </div>
      </form>
    </div>
  );
}
