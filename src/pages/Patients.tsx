
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "../hooks/useApi";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phone: string;
};

export default function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Patient>>({});
  const [editId, setEditId] = useState<number | null>(null);

  // For Patient role: only allow view/edit of their own info
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  async function fetchPatients() {
    setLoading(true);
    try {
      let data: Patient[] = [];
      if (isPatient) {
        // Assume email uniquely identifies patient
        const res = await apiFetch("/patients/all");
        data = res.filter((p: any) => p.email === user?.email);
      } else {
        data = await apiFetch("/patients/all");
      }
      setPatients(data);
    } catch {
      toast.error("Failed to load patients.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch("/patients/update", {
          method: "PUT",
          body: JSON.stringify({ ...form, id: editId }),
        });
        toast.success("Patient updated!");
      } else {
        await apiFetch("/patients/add", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Patient added!");
      }
      setShowForm(false);
      setForm({});
      setEditId(null);
      fetchPatients();
    } catch (err: any) {
      toast.error(err?.message || "Could not save patient.");
    }
  }

  function handleEdit(p: Patient) {
    setForm(p);
    setEditId(p.id);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await apiFetch(`/patients/${id}`, { method: "DELETE" });
      toast.success("Deleted patient.");
      fetchPatients();
    } catch {
      toast.error("Error deleting.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Patients
            {(isAdmin || isDoctor) && (
              <Button size="sm" className="float-right" onClick={() => { setShowForm(true); setForm({}); setEditId(null); }}>Add Patient</Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form className="mb-4 space-y-2" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <Input name="firstName" placeholder="First Name" value={form.firstName || ""} onChange={handleInput} required />
                <Input name="lastName" placeholder="Last Name" value={form.lastName || ""} onChange={handleInput} required />
              </div>
              <div className="flex gap-2">
                <Input name="age" placeholder="Age" value={form.age || ""} onChange={handleInput} required />
                <Input name="email" placeholder="Email" type="email" value={form.email || ""} onChange={handleInput} required />
                <Input name="phone" placeholder="Phone" value={form.phone || ""} onChange={handleInput} required />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="submit">{editId ? "Update" : "Add"}</Button>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setForm({}); setEditId(null); }}>Cancel</Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  {(isAdmin || isDoctor) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? (<TableRow><TableCell colSpan={10}>Loading...</TableCell></TableRow>)
                  : patients.length === 0
                    ? (<TableRow><TableCell colSpan={10}>No patients found.</TableCell></TableRow>)
                    : patients.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.firstName}</TableCell>
                      <TableCell>{p.lastName}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      {(isAdmin || isDoctor) && (
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
                          <Button size="sm" className="ml-2" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
