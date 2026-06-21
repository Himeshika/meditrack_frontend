import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus,
    type IAppointment,
    type AppointmentStatus,
} from "../services/appointmentService";
import { getAllPatients, type IPatient } from "../services/patientService";
import { type IUser } from "../services/authService";
import { getAllUsers as fetchAllUsers } from "../services/userService";

const AppointmentsPage = () => {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [doctors, setDoctors] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [patientId, setPatientId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [notes, setNotes] = useState("");
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getAllAppointments();
            setAppointments(res.data);
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("FETCH APPOINTMENTS ERROR:", e.message);
            setError("Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();

        if (user?.role === "RECEPTIONIST" || user?.role === "ADMIN") {
            const loadFormData = async () => {
                try {
                    const [pRes, uRes] = await Promise.all([getAllPatients(), fetchAllUsers()]);
                    setPatients(pRes.data);
                    setDoctors((uRes.data as IUser[]).filter((u) => u.role === "DOCTOR"));
                } catch (err: unknown) {
                    const e = err as { message: string };
                    console.log("FORM DATA ERROR:", e.message);
                }
            };
            loadFormData();
        }
    }, [user]);

    const handleCreate = async () => {
        setFormError("");
        if (!patientId || !doctorId || !appointmentDate) {
            setFormError("Patient, doctor, and date are required.");
            return;
        }
        try {
            setFormLoading(true);
            const res = await createAppointment({ patientId, doctorId, appointmentDate, notes });
            setAppointments((prev) => [res.data, ...prev]);
            setShowForm(false);
            setPatientId("");
            setDoctorId("");
            setAppointmentDate("");
            setNotes("");
        } catch (err: unknown) {
            const e = err as { message: string; response?: { data?: { message?: string } } };
            console.log("CREATE APPOINTMENT ERROR:", e.message);
            setFormError(e.response?.data?.message || "Failed to create appointment.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleStatusChange = async (apptId: string, status: AppointmentStatus) => {
        try {
            await updateAppointmentStatus(apptId, status);
            setAppointments((prev) =>
                prev.map((a) => (a._id === apptId ? { ...a, status } : a))
            );
        } catch (err: unknown) {
            const e = err as { message: string };
            console.log("STATUS UPDATE ERROR:", e.message);
            alert("Failed to update status.");
        }
    };

    const getPatientName = (patient: IAppointment["patient"]) => {
        if (typeof patient === "string") return patient;
        return `${patient.firstName} ${patient.lastName}`;
    };

    const getDoctorName = (doctor: IAppointment["doctor"]) => {
        if (typeof doctor === "string") return doctor;
        return doctor.name;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Appointments</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        All scheduled, completed, and cancelled appointments
                    </p>
                </div>
                {(user?.role === "RECEPTIONIST" || user?.role === "ADMIN") && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        {showForm ? "Cancel" : "+ New Appointment"}
                    </button>
                )}
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 max-w-2xl">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Schedule New Appointment</h3>
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                            {formError}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Patient *</label>
                            <select
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select patient...</option>
                                {patients.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.firstName} {p.lastName} — {p.nic}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor *</label>
                            <select
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select doctor...</option>
                                {doctors.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time *</label>
                            <input
                                type="datetime-local"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Follow-up for hypertension"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={formLoading}
                        className="mt-4 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {formLoading ? "Scheduling..." : "Schedule Appointment"}
                    </button>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading...</td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No appointments found.</td>
                            </tr>
                        ) : (
                            appointments.map((a) => (
                                <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-800">{getPatientName(a.patient)}</td>
                                    <td className="px-4 py-3 text-slate-600">{getDoctorName(a.doctor)}</td>
                                    <td className="px-4 py-3 text-slate-600 text-xs">{new Date(a.appointmentDate).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{a.notes || "—"}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={a.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <select
                                            value={a.status}
                                            onChange={(e) => handleStatusChange(a._id, e.target.value as AppointmentStatus)}
                                            className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        SCHEDULED: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };
    return (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[status] || "bg-slate-100 text-slate-600"}`}>
            {status}
        </span>
    );
};

export default AppointmentsPage;
