
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function RoleNav() {
  const { user, logout } = useAuth();

  if (!user) return null;
  return (
    <nav className="flex space-x-4 bg-gray-200 px-4 py-2 rounded mb-4">
      {user.role === "patient" && (
        <>
          <a href="/appointments" className="hover:underline">Appointments</a>
          <a href="/doctors" className="hover:underline">Doctors</a>
        </>
      )}
      {user.role === "doctor" && (
        <>
          <a href="/my-appointments" className="hover:underline">My Appointments</a>
          <a href="/slots" className="hover:underline">Slots</a>
          <a href="/patients" className="hover:underline">Patients</a>
        </>
      )}
      {user.role === "admin" && (
        <>
          <a href="/patients" className="hover:underline">Patients</a>
          <a href="/doctors" className="hover:underline">Doctors</a>
          <a href="/appointments" className="hover:underline">Appointments</a>
          <a href="/slots" className="hover:underline">Slots</a>
          <a href="/users" className="hover:underline">Users</a>
        </>
      )}
      <Button variant="ghost" onClick={logout}>Logout</Button>
    </nav>
  );
}
