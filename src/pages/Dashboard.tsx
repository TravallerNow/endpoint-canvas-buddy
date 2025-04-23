
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

function PatientDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium mb-4">Patient Dashboard</h3>
      <p className="text-gray-600 mb-6">
        Welcome! You can book/view appointments, view doctors, and edit your info here.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/patients" className="text-primary underline font-semibold">My Profile</Link>
        <Button asChild className="bg-primary">
          <Link to="/appointments">
            <Calendar className="mr-2" />
            Book Appointment
          </Link>
        </Button>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium mb-4">Doctor Dashboard</h3>
      <p className="text-gray-600 mb-6">
        Welcome! You can view/manage your appointments, slots, and patients.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/patients" className="text-primary underline font-semibold">Manage Patients</Link>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium mb-4">Admin Dashboard</h3>
      <p className="text-gray-600 mb-6">
        Welcome Admin! You can manage doctors, patients, slots, appointments, and users.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/patients" className="text-primary underline font-semibold">Patients</Link>
      </div>
    </div>
  );
}

const roleViews: Record<string, JSX.Element> = {
  patient: <PatientDashboard />,
  doctor: <DoctorDashboard />,
  admin: <AdminDashboard />
};

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount: decode user from JWT or load profile if needed
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    if (email && role && name) {
      setUser({ email, role, name });
    }
    setLoading(false);
  }, [setUser]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between bg-primary text-primary-foreground p-4 shadow">
        <span className="font-bold text-lg">Health Management System ({user.role})</span>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </header>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Hello {user.name}!</h2>
        {roleViews[user.role] || <div>Unknown role</div>}
      </main>
    </div>
  );
}
